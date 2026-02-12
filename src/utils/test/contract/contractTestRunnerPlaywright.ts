import { Page } from "playwright";
import { expect } from "@playwright/test";
import { readFileSync } from "fs";
import contract from "./contract.json";
import type { ComponentContract, Contract, ContractTestResult } from "Types";
import { ContractReporter } from "./ContractReporter";
import { createTestPage } from "./playwrightTestHarness";

export async function runContractTestsPlaywright( componentName: string,  url?: string ): Promise<ContractTestResult> {
  const reporter = new ContractReporter(true);
  
  const contractTyped: Contract = contract;
  const contractPath = contractTyped[componentName]?.path;

    if (!contractPath) {
      throw new Error(`Contract path not found for component: ${componentName}`);
    }

    const resolvedPath = new URL(contractPath, import.meta.url).pathname;
    const contractData = readFileSync(resolvedPath, "utf-8");
    const componentContract: ComponentContract = JSON.parse(contractData);

    const totalTests = componentContract.static[0].assertions.length + componentContract.dynamic.length;
    const apgUrl = componentContract.meta?.source?.apg;
    reporter.start(componentName, totalTests, apgUrl);

    const failures: string[] = [];
    const passes: string[] = [];
    const skipped: string[] = [];
    let page: Page | null = null;
    const useNavigation = !!url;

  try {
    page = await createTestPage();

    // Use content injection for isolated testing, or navigation for full app testing
    if (url) {
      await page.goto(url, { 
        waitUntil: "domcontentloaded",
        timeout: 30000 
      });
      
      await page.addStyleTag({ content: `* { transition: none !important; animation: none !important; }` });
    }
    
    // Wait for the main component element (try trigger first, fall back to input or container)
    const mainSelector = componentContract.selectors.trigger || componentContract.selectors.input || componentContract.selectors.container;
    
    if (!mainSelector) {
      throw new Error(`No main selector (trigger, input, or container) found in contract for ${componentName}`);
    }
    
    // Shorter timeout for content injection, longer for navigation
    const elementTimeout = useNavigation ? 30000 : 5000;
    await page.locator(mainSelector).first().waitFor({ state: 'attached', timeout: elementTimeout });

    // Additional wait for component initialization (for menu and combobox)
    if (componentName === 'menu' && componentContract.selectors.trigger) {
      await page.locator(componentContract.selectors.trigger).first().waitFor({ 
        state: 'visible',
        timeout: 5000 
      }).catch(() => {
        console.warn('Menu trigger not visible, continuing with tests...');
      });
    }

    async function resolveRelativeTarget(selector: string, relative: string) {
      if (!page) {
        throw new Error('Page is not initialized');
      }
      const items = await page.locator(selector).all();
      
      switch (relative) {
        case "first":
          return items[0];
        case "second":
          return items[1];
        case "last":
          return items[items.length - 1];
        case "next": {
          const currentIndex = await page.evaluate(([sel]) => {
            const items = Array.from(document.querySelectorAll(sel as string));
            return items.indexOf(document.activeElement as Element);
          }, [selector]);
          const nextIndex = (currentIndex + 1) % items.length;
          return items[nextIndex];
        }
        case "previous": {
          const currentIndex = await page.evaluate(([sel]) => {
            const items = Array.from(document.querySelectorAll(sel as string));
            return items.indexOf(document.activeElement as Element);
          }, [selector]);
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          return items[prevIndex];
        }
        default:
          return null;
      }
    }

    // Run static tests
    for (const test of componentContract.static[0]?.assertions || []) {
      if (test.target === "relative") continue;

      const targetSelector = componentContract.selectors[test.target as keyof typeof componentContract.selectors];
      if (!targetSelector) {
        failures.push(`Selector for target ${test.target} not found.`);
        continue;
      }
      const target = page.locator(targetSelector).first();

      const exists = await target.count() > 0;
      if (!exists) {
        failures.push(`Target ${test.target} not found.`);
        continue;
      }

      if (!test.expectedValue) {
        const attributes = test.attribute.split(" | ");
        let hasAny = false;
        for (const attr of attributes) {
          const value = await target.getAttribute(attr.trim());
          if (value !== null) {
            hasAny = true;
            break;
          }
        }
        if (!hasAny) {
          failures.push(test.failureMessage + ` None of the attributes "${test.attribute}" are present.`);
        } else {
          passes.push(`At least one of the attributes "${test.attribute}" exists on the element.`);
        }
      } else {
        const attributeValue = await target.getAttribute(test.attribute);
        const expectedValues = test.expectedValue.split(" | ");
        if (!attributeValue || !expectedValues.includes(attributeValue)) {
          failures.push(test.failureMessage + ` Attribute value does not match expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
        } else {
          passes.push(`Attribute value matches expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
        }
      }
    }

    // Run dynamic tests
    for (const dynamicTest of componentContract.dynamic || []) {
      const { action, assertions } = dynamicTest;
      
      const failuresBeforeTest = failures.length;

      // Reset component state before each test for proper isolation
      // For components with listbox/popup (menu, combobox, etc), close if open
      if (componentContract.selectors.popup) {
        const popupSelector = componentContract.selectors.popup;
        if (!popupSelector) continue;
        const popupElement = page.locator(popupSelector).first();
        
        // Check if popup is visible - use Playwright's built-in waiting
        const isPopupVisible = await popupElement.isVisible().catch(() => false);
        
        if (isPopupVisible) {
          let menuClosed = false; // Track if we successfully closed the popup
          
          // Strategy 1: Try Escape key
          let closeSelector = componentContract.selectors.input; // For combobox
          if (!closeSelector && componentContract.selectors.focusable) {
            closeSelector = componentContract.selectors.focusable;
          } else if (!closeSelector) {
            closeSelector = componentContract.selectors.trigger;
          }
          
          if (closeSelector) {
            const closeElement = page.locator(closeSelector).first();
            await closeElement.focus();
            await page.keyboard.press('Escape');
            
            // Wait for popup to close - declaratively
            menuClosed = await expect(popupElement).toBeHidden({ timeout: 2000 })
              .then(() => true)
              .catch(() => false);
          }
          
          // Strategy 2: Try clicking trigger to toggle
          if (!menuClosed && componentContract.selectors.trigger) {
            const triggerElement = page.locator(componentContract.selectors.trigger).first();
            await triggerElement.click();
            
            menuClosed = await expect(popupElement).toBeHidden({ timeout: 2000 })
              .then(() => true)
              .catch(() => false);
          }
          
          // Strategy 3: Try clicking outside
          if (!menuClosed) {
            await page.mouse.click(10, 10);
            menuClosed = await expect(popupElement).toBeHidden({ timeout: 2000 })
              .then(() => true)
              .catch(() => false);
          }
          
          if (!menuClosed) {
            // For isolated component testing (componentHTML), just warn - we'll reload anyway
            // For full navigation (url), this is a real problem
            if (useNavigation) {
              throw new Error(
                `❌ FATAL: Cannot close menu between tests. Menu remains visible after trying:\n` +
                `  1. Escape key\n` +
                `  2. Clicking trigger\n` +
                `  3. Clicking outside\n` +
                `This indicates a problem with the menu component's close functionality.`
              );
            }
          }
          
          // Clear any input values after successful close
          if (componentContract.selectors.input) {
            await page.locator(componentContract.selectors.input).first().clear();
          }
          
          // Ensure trigger has focus for menu components
          if (componentName === 'menu' && componentContract.selectors.trigger) {
            const triggerElement = page.locator(componentContract.selectors.trigger).first();
            await triggerElement.focus();
          }
        }
      }

      // Check if test requires submenu elements that don't exist - skip early
      let shouldSkipTest = false;
      for (const act of action) {
        if (act.type === 'keypress' && (act.target === 'submenuTrigger' || act.target === 'submenu')) {
          const submenuSelector = componentContract.selectors[act.target as keyof typeof componentContract.selectors];
          if (submenuSelector) {
            const submenuCount = await page.locator(submenuSelector).count();
            if (submenuCount === 0) {
              reporter.reportTest(dynamicTest, 'skip', `Skipping test - ${act.target} element not found (optional submenu test)`);
              shouldSkipTest = true;
              break;
            }
          }
        }
      }
      
      // Also check assertions for submenu requirements
      if (!shouldSkipTest) {
        for (const assertion of assertions) {
          if (assertion.target === 'submenu' || assertion.target === 'submenuTrigger') {
            const submenuSelector = componentContract.selectors[assertion.target as keyof typeof componentContract.selectors];
            if (submenuSelector) {
              const submenuCount = await page.locator(submenuSelector).count();
              if (submenuCount === 0) {
                reporter.reportTest(dynamicTest, 'skip', `Skipping test - ${assertion.target} element not found (optional submenu test)`);
                shouldSkipTest = true;
                break;
              }
            }
          }
        }
      }
      
      if (shouldSkipTest) {
        continue; // Skip to next test
      }

      for (const act of action) {
        if (act.type === "focus") {
          const focusSelector = componentContract.selectors[act.target as keyof typeof componentContract.selectors];
          if (!focusSelector) {
            failures.push(`Selector for focus target ${act.target} not found.`);
            continue;
          }
          await page.locator(focusSelector).first().focus();
        }

        if (act.type === "type" && act.value) {
          const typeSelector = componentContract.selectors[act.target as keyof typeof componentContract.selectors];
          if (!typeSelector) {
            failures.push(`Selector for type target ${act.target} not found.`);
            continue;
          }
          await page.locator(typeSelector).first().fill(act.value);
        }

        if (act.type === "click") {
          if (act.target === "document") {
            await page.mouse.click(10, 10);
          } else if (act.target === "relative" && act.relativeTarget) {
            const relativeSelector = componentContract.selectors.relative;
            if (!relativeSelector) {
              failures.push(`Relative selector not defined for click action.`);
              continue;
            }

            const relativeElement = await resolveRelativeTarget(relativeSelector, act.relativeTarget);
            if (!relativeElement) {
              failures.push(`Could not resolve relative target ${act.relativeTarget} for click.`);
              continue;
            }
            await relativeElement.click();
          } else {
            const actionSelector = componentContract.selectors[act.target as keyof typeof componentContract.selectors];
            if (!actionSelector) {
              failures.push(`Selector for action target ${act.target} not found.`);
              continue;
            }
            await page.locator(actionSelector).first().click();
          }
        }

        if (act.type === "keypress" && act.key) {
            const keyMap: Record<string, string> = {
              "Space": "Space",
              "Enter": "Enter",
              "Escape": "Escape",
              "Arrow Up": "ArrowUp",
              "Arrow Down": "ArrowDown",
              "Arrow Left": "ArrowLeft",
              "Arrow Right": "ArrowRight",
              "Home": "Home",
              "End": "End",
              "Tab": "Tab"
            };

          let keyValue = keyMap[act.key] || act.key;
          if (keyValue === "Space") {
            keyValue = " ";
          } else if (keyValue.includes(" ")) {
            keyValue = keyValue.replace(/ /g, "");
          }

          if (act.target === "focusable" && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Escape"].includes(keyValue)) {
            await page.keyboard.press(keyValue);
          } else {
            const keypressSelector = componentContract.selectors[act.target as keyof typeof componentContract.selectors];
            if (!keypressSelector) {
              failures.push(`Selector for keypress target ${act.target} not found.`);
              continue;
            }

            const target = page.locator(keypressSelector).first();
            const elementCount = await target.count();
            if (elementCount === 0) {
              reporter.reportTest(dynamicTest, 'skip', `Skipping test - ${act.target} element not found (optional submenu test)`);
              break;
            }
            await target.press(keyValue);
          }
        }

        if (act.type === "hover") {
          if (act.target === "relative" && act.relativeTarget) {
            const relativeSelector = componentContract.selectors.relative;
            if (!relativeSelector) {
              failures.push(`Relative selector not defined for hover action.`);
              continue;
            }

            const relativeElement = await resolveRelativeTarget(relativeSelector, act.relativeTarget);
            if (!relativeElement) {
              failures.push(`Could not resolve relative target ${act.relativeTarget} for hover.`);
              continue;
            }
            await relativeElement.hover();
          } else {
            const hoverSelector = componentContract.selectors[act.target as keyof typeof componentContract.selectors];
            if (!hoverSelector) {
              failures.push(`Selector for hover target ${act.target} not found.`);
              continue;
            }
            await page.locator(hoverSelector).first().hover();
          }
        }
      }

      // Evaluate assertions after action chain completes
      // No arbitrary timeout - assertions have their own timeouts
      for (const assertion of assertions) {
        let target;

        if (assertion.target === "relative") {
          const relativeSelector = componentContract.selectors.relative;
          if (!relativeSelector) {
            failures.push("Relative selector is not defined in the contract.");
            continue;
          }
          const relativeTargetValue = assertion.relativeTarget || assertion.expectedValue;
          if (!relativeTargetValue) {
            failures.push("Relative target or expected value is not defined.");
            continue;
          }
          target = await resolveRelativeTarget(relativeSelector, relativeTargetValue);
        } else {
          const assertionSelector = componentContract.selectors[assertion.target as keyof typeof componentContract.selectors];
          if (!assertionSelector) {
            failures.push(`Selector for assertion target ${assertion.target} not found.`);
            continue;
          }
          target = page.locator(assertionSelector).first();
        }

        if (!target) {
          failures.push(`Target ${assertion.target} not found.`);
          continue;
        }

        // Evaluate assertion with retry logic
        if (assertion.assertion === "toBeVisible") {
          try {
            await expect(target).toBeVisible({ timeout: 2000 });
            passes.push(`${assertion.target} is visible as expected. Test: "${dynamicTest.description}".`);
          } catch {
            const debugState = await page.evaluate((sel) => {
              const el = sel ? document.querySelector(sel) : null;
              if (!el) return 'element not found';
              const styles = window.getComputedStyle(el);
              return `display:${styles.display}, visibility:${styles.visibility}, opacity:${styles.opacity}`;
            }, componentContract.selectors[assertion.target as keyof typeof componentContract.selectors] || '');
            failures.push(`${assertion.failureMessage} (actual: ${debugState})`);
          }
        }

        if (assertion.assertion === "notToBeVisible") {
          try {
            await expect(target).toBeHidden({ timeout: 2000 });
            passes.push(`${assertion.target} is not visible as expected. Test: "${dynamicTest.description}".`);
          } catch{
            const debugState = await page.evaluate((sel) => {
              const el = sel ? document.querySelector(sel) : null;
              if (!el) return 'element not found';
              const styles = window.getComputedStyle(el);
              return `display:${styles.display}, visibility:${styles.visibility}, opacity:${styles.opacity}`;
            }, componentContract.selectors[assertion.target as keyof typeof componentContract.selectors] || '');
            failures.push(assertion.failureMessage + ` ${assertion.target} is still visible (actual: ${debugState}).`);
          }
        }

        if (assertion.assertion === "toHaveAttribute" && assertion.attribute && assertion.expectedValue) {
          try {
            // Handle special case: !empty means attribute should have any non-empty value
            if (assertion.expectedValue === "!empty") {
              // For !empty, check that attribute exists and is not empty
              const attributeValue = await target.getAttribute(assertion.attribute);
              if (attributeValue && attributeValue.trim() !== "") {
                passes.push(`${assertion.target} has non-empty "${assertion.attribute}". Test: "${dynamicTest.description}".`);
              } else {
                failures.push(assertion.failureMessage + ` ${assertion.target} "${assertion.attribute}" should not be empty, found "${attributeValue}".`);
              }
            } else {
              await expect(target).toHaveAttribute(assertion.attribute, assertion.expectedValue, { timeout: 3000 });
              passes.push(`${assertion.target} has expected "${assertion.attribute}". Test: "${dynamicTest.description}".`);
            }
          } catch {
            const attributeValue = await target.getAttribute(assertion.attribute);
            failures.push(assertion.failureMessage + ` ${assertion.target} "${assertion.attribute}" should be "${assertion.expectedValue}", found "${attributeValue}".`);
          }
        }

        if (assertion.assertion === "toHaveValue") {
          const inputValue = await target.inputValue().catch(() => "");
          
          if (assertion.expectedValue === "!empty") {
            if (inputValue && inputValue.trim() !== "") {
              passes.push(`${assertion.target} has non-empty value. Test: "${dynamicTest.description}".`);
            } else {
              failures.push(assertion.failureMessage + ` ${assertion.target} value should not be empty, found "${inputValue}".`);
            }
          } else if (assertion.expectedValue === "") {
            if (inputValue === "") {
              passes.push(`${assertion.target} has empty value. Test: "${dynamicTest.description}".`);
            } else {
              failures.push(assertion.failureMessage + ` ${assertion.target} value should be empty, found "${inputValue}".`);
            }
          } else if (inputValue === assertion.expectedValue) {
            passes.push(`${assertion.target} has expected value. Test: "${dynamicTest.description}".`);
          } else {
            failures.push(assertion.failureMessage + ` ${assertion.target} value should be "${assertion.expectedValue}", found "${inputValue}".`);
          }
        }

        if (assertion.assertion === "toHaveFocus") {
          try {
            await expect(target).toBeFocused({ timeout: 5000 });
            passes.push(`${assertion.target} has focus as expected. Test: "${dynamicTest.description}".`);
          } catch {
            const actualFocus = await page.evaluate(() => {
              const focused = document.activeElement;
              return focused ? `${focused.tagName}#${focused.id || 'no-id'}.${focused.className || 'no-class'}` : 'no element focused';
            });
            failures.push(`${assertion.failureMessage} (actual focus: ${actualFocus})`);
          }
        }

        if (assertion.assertion === "toHaveRole" && assertion.expectedValue) {
          const roleValue = await target.getAttribute("role");
          if (roleValue === assertion.expectedValue) {
            passes.push(`${assertion.target} has role "${assertion.expectedValue}". Test: "${dynamicTest.description}".`);
          } else {
            failures.push(assertion.failureMessage + ` Expected role "${assertion.expectedValue}", found "${roleValue}".`);
          }
        }
      }
      
      // Report test result
      const failuresAfterTest = failures.length;
      const testPassed = failuresAfterTest === failuresBeforeTest;
      const failureMessage = testPassed ? undefined : failures[failures.length - 1];
      
      // Handle optional tests differently - treat failures as suggestions
      if (dynamicTest.isOptional === true && !testPassed) {
        // Remove the failure from the failures array (don't count as hard failure)
        failures.pop();
        // Report as optional failure (suggestion)
        reporter.reportTest(dynamicTest, 'optional-fail', failureMessage);
      } else {
        // Report normal pass/fail
        reporter.reportTest(dynamicTest, testPassed ? 'pass' : 'fail', failureMessage);
      }
    }
    
    // Report static test summary
    const staticPassed = componentContract.static[0].assertions.length;
    const staticFailed = 0;
    reporter.reportStatic(staticPassed, staticFailed);
    
    // Final summary
    reporter.summary(failures);

  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("Executable doesn't exist")) {
        console.error("\n❌ Playwright browsers not found!\n");
        console.log("📦 Run: npx playwright install chromium\n");
        failures.push("Playwright browser not installed. Run: npx playwright install chromium");
      } else if (error.message.includes("net::ERR_CONNECTION_REFUSED")) {
        console.error("\n❌ Cannot connect to dev server!\n");
        console.log(`   Make sure your dev server is running at ${url}\n`);
        failures.push(`Dev server not running at ${url}`);
      } else {
        console.error("❌ Playwright test error:", error.message);
        failures.push(`Test error: ${error.message}`);
      }
    }
  } finally {
    // Close only the page, not the shared browser
    if (page) await page.close();
  }

  return { passes, failures, skipped }
}