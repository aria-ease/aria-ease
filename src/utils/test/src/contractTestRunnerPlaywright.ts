/**
 * Contract Test Runner using Playwright
 * This module defines the function to run contract tests for components using Playwright.
 * It reads the contract definition, executes the specified actions, and evaluates assertions while reporting results.
 */

import { Page } from "playwright";
import { readFileSync } from "fs";
import path from "path";
import contract from "../contract/contract.json";
import type { ComponentContract, Contract, ContractTestResult, AriaEaseConfig } from "Types";
import { createTestPage } from "./playwrightTestHarness";
import { ComponentDetector } from "./ComponentDetector";
import { ContractReporter } from "./ContractReporter";
import { ActionExecutor } from "./ActionExecutor";
import { AssertionRunner } from "./AssertionRunner";
import { normalizeLevel, normalizeStrictness, resolveEnforcement } from "./strictness";

export async function runContractTestsPlaywright(
  componentName: string,
  url?: string,
  strictness?: string,
  config?: AriaEaseConfig,
  configBaseDir?: string
): Promise<ContractTestResult> {
  // Determine if a custom contract is being used
  const componentConfig = config?.test?.components?.find(c => c.name === componentName);
  const isCustomContract = !!componentConfig?.path;
  const reporter = new ContractReporter(true, isCustomContract);
  const defaultTimeouts = {
    actionTimeoutMs: 400,
    assertionTimeoutMs: 400,
    navigationTimeoutMs: 30000,
    componentReadyTimeoutMs: 5000,
  };
  const globalDisableTimeouts = config?.test?.disableTimeouts === true;
  const componentDisableTimeouts = componentConfig?.disableTimeouts === true;
  const disableTimeouts = componentDisableTimeouts || globalDisableTimeouts;

  const resolveTimeout = (
    componentValue: number | undefined,
    globalValue: number | undefined,
    fallback: number
  ): number => {
    if (disableTimeouts) return 0;
    const value = componentValue ?? globalValue;
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      return fallback;
    }
    return value;
  };

  const actionTimeoutMs = resolveTimeout(
    componentConfig?.actionTimeoutMs,
    config?.test?.actionTimeoutMs,
    defaultTimeouts.actionTimeoutMs
  );
  const assertionTimeoutMs = resolveTimeout(
    componentConfig?.assertionTimeoutMs,
    config?.test?.assertionTimeoutMs,
    defaultTimeouts.assertionTimeoutMs
  );
  const navigationTimeoutMs = resolveTimeout(
    componentConfig?.navigationTimeoutMs,
    config?.test?.navigationTimeoutMs,
    defaultTimeouts.navigationTimeoutMs
  );
  const componentReadyTimeoutMs = resolveTimeout(
    componentConfig?.componentReadyTimeoutMs,
    config?.test?.componentReadyTimeoutMs,
    defaultTimeouts.componentReadyTimeoutMs
  );
  const strictnessMode = normalizeStrictness(strictness);
  
  // Resolve contract path - use config override or default
  let contractPath = componentConfig?.path;
  if (!contractPath) {
    const contractTyped: Contract = contract;
    contractPath = contractTyped[componentName]?.path;
  }
  
  if (!contractPath) {
    throw new Error(`Contract path not found for component: ${componentName}`);
  }

  const resolvedPath = (() => {
    if (path.isAbsolute(contractPath)) return contractPath;
    if (configBaseDir) {
      const configResolved = path.resolve(configBaseDir, contractPath);
      try {
        readFileSync(configResolved, "utf-8");
        return configResolved;
      } catch {
        // Fall through to other resolution strategies
      }
    }
    const cwdResolved = path.resolve(process.cwd(), contractPath);
    try {
      readFileSync(cwdResolved, "utf-8");
      return cwdResolved;
    } catch {
      return new URL(contractPath, import.meta.url).pathname;
    }
  })();

  const contractData = readFileSync(resolvedPath, "utf-8");
  const componentContract: ComponentContract = JSON.parse(contractData);
  const totalTests =
    (componentContract.relationships?.length || 0) +
    (componentContract.static[0]?.assertions.length || 0) +
    componentContract.dynamic.length;
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
          timeout: navigationTimeoutMs
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

    const strategy = await ComponentDetector.detect(componentName, componentConfig, actionTimeoutMs, assertionTimeoutMs, configBaseDir);
    if (!strategy) {
      throw new Error(`Unsupported component: ${componentName}`);
    }
    
    const mainSelector = strategy.getMainSelector();
    
    if (!mainSelector) {
      throw new Error(`CRITICAL: No selector found in contract for ${componentName}`);
    }
    
    try {
      await page.locator(mainSelector as string).first().waitFor({ state: 'attached', timeout: componentReadyTimeoutMs });
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
      await page.locator(componentContract.selectors.trigger).first().waitFor({ state: 'attached', timeout: componentReadyTimeoutMs })
      .catch(() => {
        // Best-effort readiness check; action/assertion phases provide authoritative failures.
      });
    }

    const hasSubmenuCapability =
      componentName === 'menu' && !!componentContract.selectors.submenuTrigger
        ? (await page.locator(componentContract.selectors.submenuTrigger).count()) > 0
        : false;

    const isSubmenuRelation = (rel: { type: string; from?: string; to?: string; parent?: string; child?: string }) =>
      (rel.type === "aria-reference" &&
        [rel.from, rel.to].some((name) => ["submenu", "submenuTrigger", "submenuItems"].includes(name || ""))) ||
      (rel.type === "contains" &&
        [rel.parent, rel.child].some((name) => ["submenu", "submenuTrigger", "submenuItems"].includes(name || "")));


    let staticPassed = 0;
    let staticFailed = 0;
    let staticWarnings = 0;

    // Run relationship invariants first
    for (const rel of componentContract.relationships || []) {
      const relationshipLevel = normalizeLevel(rel.level);
      if (componentName === 'menu' && !hasSubmenuCapability) {
        const involvesSubmenu = isSubmenuRelation(rel);

        if (involvesSubmenu) {
          const relDescription =
            rel.type === "aria-reference"
              ? `${rel.from}.${rel.attribute} references ${rel.to}`
              : `${rel.parent} contains ${rel.child}`;
          const skipMessage = `Skipping submenu relationship assertion: no submenu capability detected in rendered component.`;
          skipped.push(skipMessage);
          reporter.reportStaticTest(relDescription, 'skip', skipMessage, relationshipLevel);
          continue;
        }
      }

      if (rel.type === "aria-reference") {
        const relDescription = `${rel.from}.${rel.attribute} references ${rel.to}`;
        const fromSelector = componentContract.selectors[rel.from as keyof typeof componentContract.selectors];
        const toSelector = componentContract.selectors[rel.to as keyof typeof componentContract.selectors];

        if (!fromSelector || !toSelector) {
          const outcome = classifyFailure(
            `Relationship selector missing: from="${rel.from}" or to="${rel.to}" not found in selectors.`
          , rel.level);
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }

        const fromTarget = page.locator(fromSelector).first();
        const toTarget = page.locator(toSelector).first();
        const fromExists = (await fromTarget.count()) > 0;
        const toExists = (await toTarget.count()) > 0;

        if (!fromExists || !toExists) {
          if (componentName === 'menu' && isSubmenuRelation(rel)) {
            const skipMessage =
              "Skipping submenu relationship assertion in static phase: submenu elements are not present until submenu is opened.";
            skipped.push(skipMessage);
            reporter.reportStaticTest(relDescription, 'skip', skipMessage, relationshipLevel);
            continue;
          }

          const outcome = classifyFailure(
            `Relationship target not found: ${!fromExists ? rel.from : rel.to}.`
          , rel.level);
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }

        const attrValue = await fromTarget.getAttribute(rel.attribute);
        const toId = await toTarget.getAttribute("id");

        if (!toId) {
          const outcome = classifyFailure(
            `Relationship target "${rel.to}" must have an id for ${rel.attribute} validation.`
          , rel.level);
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }

        const references = (attrValue || "").split(/\s+/).filter(Boolean);
        const matches = references.includes(toId);

        if (!matches) {
          const outcome = classifyFailure(
            `Expected ${rel.from} ${rel.attribute} to reference id "${toId}", found "${attrValue || ""}".`
          , rel.level);
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }

        passes.push(`Relationship valid: ${rel.from}.${rel.attribute} -> ${rel.to} (id=${toId}).`);
        staticPassed += 1;
        reporter.reportStaticTest(relDescription, "pass", undefined, relationshipLevel);
        continue;
      }

      if (rel.type === "contains") {
        const relDescription = `${rel.parent} contains ${rel.child}`;
        const parentSelector = componentContract.selectors[rel.parent as keyof typeof componentContract.selectors];
        const childSelector = componentContract.selectors[rel.child as keyof typeof componentContract.selectors];

        if (!parentSelector || !childSelector) {
          const outcome = classifyFailure(
            `Relationship selector missing: parent="${rel.parent}" or child="${rel.child}" not found in selectors.`
          , rel.level);
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }

        const parent = page.locator(parentSelector).first();
        const parentExists = (await parent.count()) > 0;
        if (!parentExists) {
          if (componentName === 'menu' && isSubmenuRelation(rel)) {
            const skipMessage =
              "Skipping submenu relationship assertion in static phase: submenu container is not present until submenu is opened.";
            skipped.push(skipMessage);
            reporter.reportStaticTest(relDescription, 'skip', skipMessage, relationshipLevel);
            continue;
          }

          const outcome = classifyFailure(`Relationship parent target not found: ${rel.parent}.`, rel.level);
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }

        const descendants = parent.locator(childSelector);
        const descendantCount = await descendants.count();
        if (descendantCount < 1) {
          if (componentName === 'menu' && isSubmenuRelation(rel)) {
            const skipMessage =
              "Skipping submenu relationship assertion in static phase: submenu descendants are not present until submenu is opened.";
            skipped.push(skipMessage);
            reporter.reportStaticTest(relDescription, 'skip', skipMessage, relationshipLevel);
            continue;
          }

          const outcome = classifyFailure(
            `Expected ${rel.parent} to contain descendant matching selector for ${rel.child}.`
          , rel.level);
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }

        passes.push(`Relationship valid: ${rel.parent} contains ${rel.child}.`);
        staticPassed += 1;
        reporter.reportStaticTest(relDescription, "pass", undefined, relationshipLevel);
      }
    }

    // Run static tests using AssertionRunner
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

      // Reset component state before each test using strategy pattern
      try {
        await strategy.resetState(page);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        reporter.error(errorMessage);
        throw error;
      }

      const { setup = [], action, assertions } = dynamicTest;
      const dynamicLevel = normalizeLevel(dynamicTest.level);
      // Create action executor for this test (before setup/actions)
      const actionExecutor = new ActionExecutor(page, componentContract.selectors, actionTimeoutMs);

      // Run setup actions if present
      if (Array.isArray(setup) && setup.length > 0) {
        for (const setupAct of setup) {
          let setupResult;
          if (setupAct.type === "focus") {
            if (setupAct.target === "relative" && setupAct.relativeTarget) {
              setupResult = await actionExecutor.focus("relative", setupAct.relativeTarget);
            } else {
              setupResult = await actionExecutor.focus(setupAct.target);
            }
          } else if (setupAct.type === "type" && setupAct.value) {
            setupResult = await actionExecutor.type(setupAct.target, setupAct.value);
          } else if (setupAct.type === "click") {
            setupResult = await actionExecutor.click(setupAct.target, setupAct.relativeTarget);
          } else if (setupAct.type === "keypress" && setupAct.key) {
            setupResult = await actionExecutor.keypress(setupAct.target, setupAct.key);
          } else if (setupAct.type === "hover") {
            setupResult = await actionExecutor.hover(setupAct.target, setupAct.relativeTarget);
          } else {
            continue; // Unknown setup action type
          }
          if (!setupResult.success) {
            const setupMsg = setupResult.error || "Setup action failed";
            const outcome = classifyFailure(`Setup failed: ${setupMsg}`, dynamicTest.level);
            reporter.reportTest({ description: dynamicTest.description, level: dynamicLevel }, outcome.status, outcome.detail);
            // Abort this test if setup fails
            continue;
          }
        }
      }
      
      const failuresBeforeTest = failures.length;
      const warningsBeforeTest = warnings.length;
      const skippedBeforeTest = skipped.length;

      // Check if test should be skipped using strategy pattern
      const shouldSkipTest = await strategy.shouldSkipTest(dynamicTest, page);
      if (shouldSkipTest) {
        const skipMessage = `Skipping test - component-specific conditions not met`;
        skipped.push(skipMessage);
        reporter.reportTest({ description: dynamicTest.description, level: dynamicLevel }, 'skip', skipMessage);
        continue;
      }

      // Create assertion runner for this test
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
          if (act.target === "relative" && act.relativeTarget) {
            result = await actionExecutor.focus("relative", act.relativeTarget);
          } else {
            result = await actionExecutor.focus(act.target);
          }
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
          `The component selector could not be found within ${componentReadyTimeoutMs}ms.\n` +
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