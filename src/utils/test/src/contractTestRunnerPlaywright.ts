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
import { normalizeLevel, normalizeStrictness, resolveEnforcement } from "./strictness";

export async function runContractTestsPlaywright(
  componentName: string,
  url?: string,
  strictness?: string
): Promise<ContractTestResult> {
  const reporter = new ContractReporter(true);
  const actionTimeoutMs = 400;
  const assertionTimeoutMs = 400;
  const strictnessMode = normalizeStrictness(strictness);
  const contractTyped: Contract = contract;
  const contractPath = contractTyped[componentName]?.path;
  const resolvedPath = new URL(contractPath, import.meta.url).pathname;
  const contractData = readFileSync(resolvedPath, "utf-8");
  const componentContract: ComponentContract = JSON.parse(contractData);
  const totalTests = componentContract.static[0].assertions.length + componentContract.dynamic.length;
  const apgUrl = componentContract.meta?.source?.apg;
  const failures: string[] = [];
  const warnings: string[] = [];
  const passes: string[] = [];
  const skipped: string[] = [];
  let page: Page | null = null;

  const classifyFailure = (message: string, levelRaw?: string): { status: 'fail' | 'warn' | 'skip'; level: string; detail: string } => {
    const level = normalizeLevel(levelRaw);
    const enforcement = resolveEnforcement(level, strictnessMode);

    if (enforcement === 'error') {
      failures.push(message);
      return { status: 'fail', level, detail: message };
    }

    if (enforcement === 'warning') {
      warnings.push(message);
      return { status: 'warn', level, detail: message };
    }

    const ignoredMessage = `${message} (ignored by strictness=${strictnessMode}, level=${level})`;
    skipped.push(ignoredMessage);
    return { status: 'skip', level, detail: ignoredMessage };
  };

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

    const hasSubmenuCapability =
      componentName === 'menu' && !!componentContract.selectors.submenuTrigger
        ? (await page.locator(componentContract.selectors.submenuTrigger).count()) > 0
        : false;

    // Run static tests using AssertionRunner
    let staticPassed = 0;
    let staticFailed = 0;
    let staticWarnings = 0;
    const staticAssertionRunner = new AssertionRunner(page, componentContract.selectors, assertionTimeoutMs);
    
    for (const test of componentContract.static[0]?.assertions || []) {
      if (test.target === "relative") continue;

      const staticDescription = `${test.target}${test.attribute ? ` (${test.attribute})` : ""}`;
      const staticLevel = normalizeLevel(test.level);

      if (componentName === 'menu' && test.target === 'submenuTrigger' && !hasSubmenuCapability) {
        const skipMessage = `Skipping submenu static assertion for ${test.target}: no submenu capability detected in rendered component.`;
        skipped.push(skipMessage);
        reporter.reportStaticTest(staticDescription, 'skip', skipMessage, staticLevel);
        continue;
      }

      const targetSelector = componentContract.selectors[test.target as keyof typeof componentContract.selectors];
      if (!targetSelector) {
        const failure = `Selector for target ${test.target} not found.`;
        const outcome = classifyFailure(failure, test.level);
        if (outcome.status === 'fail') staticFailed += 1;
        if (outcome.status === 'warn') staticWarnings += 1;
        reporter.reportStaticTest(staticDescription, outcome.status, outcome.detail, outcome.level);
        continue;
      }
      const target = page.locator(targetSelector).first();

      const exists = await target.count() > 0;
      if (!exists) {
        const failure = `Target ${test.target} not found.`;
        const outcome = classifyFailure(failure, test.level);
        if (outcome.status === 'fail') staticFailed += 1;
        if (outcome.status === 'warn') staticWarnings += 1;
        reporter.reportStaticTest(staticDescription, outcome.status, outcome.detail, outcome.level);
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
          const outcome = classifyFailure(failure, test.level);
          if (outcome.status === 'fail') staticFailed += 1;
          if (outcome.status === 'warn') staticWarnings += 1;
          reporter.reportStaticTest(staticDescription, outcome.status, outcome.detail, outcome.level);
        } else if (!allRedundant && hasAny) {
          passes.push(`At least one of the attributes "${test.attribute}" exists on the element.`);
          staticPassed += 1;
          reporter.reportStaticTest(staticDescription, 'pass', undefined, staticLevel);
        } else {
          // All checks were redundant (already guaranteed by selector)
          staticPassed += 1;
          reporter.reportStaticTest(staticDescription, 'pass', undefined, staticLevel);
        }
      } else {
        // Handle attribute value check using AssertionRunner
        if (isRedundantCheck(targetSelector, test.attribute, test.expectedValue)) {
          passes.push(`${test.attribute}="${test.expectedValue}" on ${test.target} verified by selector (already present in: ${targetSelector}).`);
          staticPassed += 1;
          reporter.reportStaticTest(staticDescription, 'pass', undefined, staticLevel);
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
            staticPassed += 1;
            reporter.reportStaticTest(staticDescription, 'pass', undefined, staticLevel);
          } else if (!result.success && result.failMessage) {
            const outcome = classifyFailure(result.failMessage, test.level);
            if (outcome.status === 'fail') staticFailed += 1;
            if (outcome.status === 'warn') staticWarnings += 1;
            reporter.reportStaticTest(staticDescription, outcome.status, outcome.detail, outcome.level);
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
      const warningsBeforeTest = warnings.length;
      const skippedBeforeTest = skipped.length;
      const dynamicLevel = normalizeLevel(dynamicTest.level);

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
        const skipMessage = `Skipping test - component-specific conditions not met`;
        skipped.push(skipMessage);
        reporter.reportTest({ description: dynamicTest.description, level: dynamicLevel }, 'skip', skipMessage);
        continue;
      }

      // Create action executor for this test
      const actionExecutor = new ActionExecutor(page, componentContract.selectors, actionTimeoutMs);
      const assertionRunner = new AssertionRunner(page, componentContract.selectors, assertionTimeoutMs);

      let shouldAbortCurrentTest = false;
      let actionOutcome: { status: 'fail' | 'warn' | 'skip'; detail: string } | null = null;

      for (const act of action) {
        if (!page || page.isClosed()) {
          failures.push(`CRITICAL: Browser/page closed during test execution. Remaining actions skipped.`);
          shouldAbortCurrentTest = true;
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
            const outcome = classifyFailure(result.error, dynamicTest.level);
            actionOutcome = { status: outcome.status, detail: outcome.detail };
          }
          shouldAbortCurrentTest = true;
          break;
        }
      }

      if (shouldAbortCurrentTest) {
        reporter.reportTest(
          { description: dynamicTest.description, level: dynamicLevel },
          actionOutcome?.status || 'fail',
          actionOutcome?.detail || failures[failures.length - 1]
        );
        continue;
      }

      // Run assertions for this test
      for (const assertion of assertions) {
        const result = await assertionRunner.validate(assertion, dynamicTest.description);
        
        if (result.success && result.passMessage) {
          passes.push(result.passMessage);
        } else if (!result.success && result.failMessage) {
          const assertionLevel = normalizeLevel(assertion.level || dynamicTest.level);
          const outcome = classifyFailure(result.failMessage, assertionLevel);
          if (outcome.status === 'skip') {
            continue;
          }
        }
      }
      
      // Report test result
      const failuresAfterTest = failures.length;
      const warningsAfterTest = warnings.length;
      const skippedAfterTest = skipped.length;

      if (failuresAfterTest > failuresBeforeTest) {
        reporter.reportTest(
          { description: dynamicTest.description, level: dynamicLevel },
          'fail',
          failures[failures.length - 1]
        );
      } else if (warningsAfterTest > warningsBeforeTest) {
        reporter.reportTest(
          { description: dynamicTest.description, level: dynamicLevel },
          'warn',
          warnings[warnings.length - 1]
        );
      } else if (skippedAfterTest > skippedBeforeTest) {
        reporter.reportTest(
          { description: dynamicTest.description, level: dynamicLevel },
          'skip',
          skipped[skipped.length - 1]
        );
      } else {
        reporter.reportTest({ description: dynamicTest.description, level: dynamicLevel }, 'pass');
      }
    }
    
    // Report static test summary
    reporter.reportStatic(staticPassed, staticFailed, staticWarnings);
    
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

  return { passes, failures, skipped, warnings }
}