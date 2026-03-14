/**
 * Contract Test Runner using Playwright
 * This module defines the function to run contract tests for components using Playwright.
 * It reads the contract definition, executes the specified actions, and evaluates assertions while reporting results.
 */

import { Page } from "playwright";
import { readFileSync } from "fs";
import contract from "../contract/contract.json";
import type { ComponentContract, Contract, ContractTestResult } from "Types";
import { createTestPage } from "./playwrightTestHarness";
import { ComponentDetector } from "./ComponentDetector";
import { ContractReporter } from "./ContractReporter";
import { ActionExecutor } from "./ActionExecutor";
import { AssertionRunner } from "./AssertionRunner";

export async function runContractTestsPlaywright( componentName: string,  url?: string ): Promise<ContractTestResult> {
  const reporter = new ContractReporter(true);
  const actionTimeoutMs = 400;
  const assertionTimeoutMs = 400;
  const contractTyped: Contract = contract;
  const contractPath = contractTyped[componentName]?.path;
  const resolvedPath = new URL(contractPath, import.meta.url).pathname;
  const contractData = readFileSync(resolvedPath, "utf-8");
  const componentContract: ComponentContract = JSON.parse(contractData);
  const totalTests = componentContract.static[0].assertions.length + componentContract.dynamic.length;
  const apgUrl = componentContract.meta?.source?.apg;
  const failures: string[] = [];
  const passes: string[] = [];
  const skipped: string[] = [];
  let page: Page | null = null;

  try {
    page = await createTestPage();
    
    if (url) {
      try {
        await page.goto(url, { 
          waitUntil: "domcontentloaded",
          timeout: 30000 
        });
      } catch (error) {
        throw new Error(
          `Failed to navigate to ${url}. ` +
          `Ensure dev server is running and accessible. ` +
          `Original error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
      
      await page.addStyleTag({ content: `* { transition: none !important; animation: none !important; }` });
    }

    const strategy = ComponentDetector.detect(componentName, actionTimeoutMs, assertionTimeoutMs);
    if (!strategy) {
      throw new Error(`Unsupported component: ${componentName}`);
    }
    
    const mainSelector = strategy.getMainSelector();
    
    if (!mainSelector) {
      throw new Error(`CRITICAL: No selector found in contract for ${componentName}`);
    }
    
    try {
      await page.locator(mainSelector as string).first().waitFor({ state: 'attached', timeout: 30000 });
    } catch (error) {
      throw new Error(
        "\n❌ CRITICAL: Component not found on page!\n" +
        "This usually means:\n" +
        "  - The component didn't render\n" +
        "  - The URL is incorrect\n" +
        `  - The component selector '${mainSelector}' in the contract is wrong\n` +
        `  - Original error: ${error}`
      );
    }

    // Component exists - now we can start the test reporter
    reporter.start(componentName, totalTests, apgUrl);

    // Menu-specific: Wait for trigger to be visible
    if (componentName === 'menu' && componentContract.selectors.trigger) {
      await page.locator(componentContract.selectors.trigger).first().waitFor({ 
        state: 'attached',
        timeout: 5000 
      }).catch(() => {
        // Best-effort readiness check; action/assertion phases provide authoritative failures.
      });
    }

    // Run static tests using AssertionRunner
    const failuresBeforeStatic = failures.length;
    const staticAssertionRunner = new AssertionRunner(page, componentContract.selectors, assertionTimeoutMs);
    
    for (const test of componentContract.static[0]?.assertions || []) {
      if (test.target === "relative") continue;

      const staticDescription = `${test.target}${test.attribute ? ` (${test.attribute})` : ""}`;

      const targetSelector = componentContract.selectors[test.target as keyof typeof componentContract.selectors];
      if (!targetSelector) {
        const failure = `Selector for target ${test.target} not found.`;
        failures.push(failure);
        reporter.reportStaticTest(staticDescription, false, failure);
        continue;
      }
      const target = page.locator(targetSelector).first();

      const exists = await target.count() > 0;
      if (!exists) {
        const failure = `Target ${test.target} not found.`;
        failures.push(failure);
        reporter.reportStaticTest(staticDescription, false, failure);
        continue;
      }

      const isRedundantCheck = (selector: string, attrName: string, expectedVal?: string): boolean => {
        const attrPattern = new RegExp(`\\[${attrName}(?:=["']?([^\\]"']+)["']?)?\\]`);
        const match = selector.match(attrPattern);
        
        if (!match) return false;
        
        if (!expectedVal) return true;
        
        const selectorValue = match[1];
        if (selectorValue) {
          const expectedValues = expectedVal.split(" | ");
          return expectedValues.includes(selectorValue);
        }
        
        return false;
      };

      if (!test.expectedValue) {
        // Handle attribute existence check (no expected value)
        const attributes = test.attribute.split(" | ");
        let hasAny = false;
        let allRedundant = true;
        
        for (const attr of attributes) {
          const attrTrimmed = attr.trim();
          
          if (isRedundantCheck(targetSelector, attrTrimmed)) {
            passes.push(`${attrTrimmed} on ${test.target} verified by selector (already present in: ${targetSelector}).`);
            hasAny = true;
            continue;
          }
          
          allRedundant = false;
          const value = await target.getAttribute(attrTrimmed);
          if (value !== null) {
            hasAny = true;
            break;
          }
        }
        
        if (!hasAny && !allRedundant) {
          const failure = test.failureMessage + ` None of the attributes "${test.attribute}" are present.`;
          failures.push(failure);
          reporter.reportStaticTest(staticDescription, false, failure);
        } else if (!allRedundant && hasAny) {
          passes.push(`At least one of the attributes "${test.attribute}" exists on the element.`);
          reporter.reportStaticTest(staticDescription, true);
        } else {
          // All checks were redundant (already guaranteed by selector)
          reporter.reportStaticTest(staticDescription, true);
        }
      } else {
        // Handle attribute value check using AssertionRunner
        if (isRedundantCheck(targetSelector, test.attribute, test.expectedValue)) {
          passes.push(`${test.attribute}="${test.expectedValue}" on ${test.target} verified by selector (already present in: ${targetSelector}).`);
          reporter.reportStaticTest(staticDescription, true);
        } else {
          const result = await staticAssertionRunner.validateAttribute(
            target, 
            test.target, 
            test.attribute, 
            test.expectedValue, 
            test.failureMessage, 
            'Static ARIA Test'
          );
          
          if (result.success && result.passMessage) {
            passes.push(result.passMessage);
            reporter.reportStaticTest(staticDescription, true);
          } else if (!result.success && result.failMessage) {
            failures.push(result.failMessage);
            reporter.reportStaticTest(staticDescription, false, result.failMessage);
          }
        }
      }
    }

    // Run dynamic tests
    for (const dynamicTest of componentContract.dynamic || []) {
      if (!page || page.isClosed()) {
        console.warn(`\n⚠️  Browser closed - skipping remaining ${componentContract.dynamic.length - componentContract.dynamic.indexOf(dynamicTest)} tests\n`);
        failures.push(`CRITICAL: Browser/page closed before completing all tests. ${componentContract.dynamic.length - componentContract.dynamic.indexOf(dynamicTest)} tests skipped.`);
        break; // Exit dynamic test loop
      }

      const { action, assertions } = dynamicTest;
      
      const failuresBeforeTest = failures.length;

      // Reset component state before each test using strategy pattern
      try {
        await strategy.resetState(page);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        reporter.error(errorMessage);
        throw error;
      }

      // Check if test should be skipped using strategy pattern
      const shouldSkipTest = await strategy.shouldSkipTest(dynamicTest, page);
      if (shouldSkipTest) {
        reporter.reportTest(dynamicTest, 'skip', `Skipping test - component-specific conditions not met`);
        continue;
      }

      // Create action executor for this test
      const actionExecutor = new ActionExecutor(page, componentContract.selectors, actionTimeoutMs);
      const assertionRunner = new AssertionRunner(page, componentContract.selectors, assertionTimeoutMs);

      for (const act of action) {
        if (!page || page.isClosed()) {
          failures.push(`CRITICAL: Browser/page closed during test execution. Remaining actions skipped.`);
          break;
        }

        let result;
        
        if (act.type === "focus") {
          result = await actionExecutor.focus(act.target);
        } else if (act.type === "type" && act.value) {
          result = await actionExecutor.type(act.target, act.value);
        } else if (act.type === "click") {
          result = await actionExecutor.click(act.target, act.relativeTarget);
        } else if (act.type === "keypress" && act.key) {
          result = await actionExecutor.keypress(act.target, act.key);
        } else if (act.type === "hover") {
          result = await actionExecutor.hover(act.target, act.relativeTarget);
        } else {
          continue; // Unknown action type
        }

        if (!result.success) {
          if (result.error) {
            failures.push(result.error);
          }
          if (result.shouldBreak) {
            if (result.error?.includes('optional submenu test')) {
              reporter.reportTest(dynamicTest, 'skip', result.error);
            }
            break;
          }
          continue;
        }
      }

      // Run assertions for this test
      for (const assertion of assertions) {
        const result = await assertionRunner.validate(assertion, dynamicTest.description);
        
        if (result.success && result.passMessage) {
          passes.push(result.passMessage);
        } else if (!result.success && result.failMessage) {
          failures.push(result.failMessage);
        }
      }
      
      // Report test result
      const failuresAfterTest = failures.length;
      const testPassed = failuresAfterTest === failuresBeforeTest;
      const failureMessage = testPassed ? undefined : failures[failures.length - 1];
      
      // Handle optional tests differently - treat failures as suggestions
      if (dynamicTest.isOptional === true && !testPassed) {
        failures.pop();
        reporter.reportTest(dynamicTest, 'optional-fail', failureMessage);
      } else {
        // Report normal pass/fail
        reporter.reportTest(dynamicTest, testPassed ? 'pass' : 'fail', failureMessage);
      }
    }
    
    // Report static test summary
    const staticTotal = componentContract.static[0].assertions.length;
    const staticFailed = failures.length - failuresBeforeStatic;
    const staticPassed = Math.max(0, staticTotal - staticFailed);
    reporter.reportStatic(staticPassed, staticFailed);
    
    // Final summary
    reporter.summary(failures);

  } catch (error: unknown) {
    // For critical errors, just re-throw and let the test framework handle attribution
    if (error instanceof Error) {
      if (error.message.includes("Executable doesn't exist") || error.message.includes("browserType.launch")) {
        throw new Error("\n❌ CRITICAL: Playwright browsers not found!\n📦 Run: npx playwright install chromium");
      } else if (error.message.includes("net::ERR_CONNECTION_REFUSED") || error.message.includes("NS_ERROR_CONNECTION_REFUSED")) {
        throw new Error(`\n❌ CRITICAL: Cannot connect to dev server!\nMake sure your dev server is running at ${url}`);
      } else if (error.message.includes("Timeout") && error.message.includes("waitFor")) {
        throw new Error(
          "\n❌ CRITICAL: Component not found on page!\n" +
          "The component selector could not be found within 30 seconds.\n" +
          "This usually means:\n" +
          "  - The component didn't render\n" +
          "  - The URL is incorrect\n" +
          "  - The component selector was not provided to the component utility, or a wrong selector was used\n"
        );
      } else if (error.message.includes("Target page, context or browser has been closed")) {
        throw new Error(
          "\n❌ CRITICAL: Browser/page was closed unexpectedly!\n" +
          "This usually means:\n" +
          "  - The test timeout was too short\n" +
          "  - The browser crashed\n" +
          "  - An external process killed the browser"
        );
      } else {
        // Re-throw all other errors (including FATAL) for proper test attribution
        throw error;
      }
    }
  } finally {
    // Close only the page, not the shared browser
    if (page) await page.close();
  }

  return { passes, failures, skipped }
}