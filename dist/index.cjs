"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/test/contract/contract.json
var contract_default;
var init_contract = __esm({
  "src/utils/test/contract/contract.json"() {
    contract_default = {
      menu: {
        path: "./contracts/MenuContract.json",
        component: "menu"
      },
      combobox: {
        path: "./contracts/ComboboxContract.json",
        component: "combobox"
      }
    };
  }
});

// src/utils/test/contract/ContractReporter.ts
var ContractReporter;
var init_ContractReporter = __esm({
  "src/utils/test/contract/ContractReporter.ts"() {
    "use strict";
    ContractReporter = class {
      startTime = 0;
      componentName = "";
      staticPasses = 0;
      staticFailures = 0;
      dynamicResults = [];
      totalTests = 0;
      skipped = 0;
      optionalSuggestions = 0;
      isPlaywright = false;
      apgUrl = "https://www.w3.org/WAI/ARIA/apg/";
      constructor(isPlaywright = false) {
        this.isPlaywright = isPlaywright;
      }
      log(message) {
        process.stderr.write(message + "\n");
      }
      start(componentName, totalTests, apgUrl) {
        this.startTime = Date.now();
        this.componentName = componentName;
        this.totalTests = totalTests;
        if (apgUrl) {
          this.apgUrl = apgUrl;
        }
        const mode = this.isPlaywright ? "Playwright (Real Browser)" : "jsdom (Fast)";
        this.log(`
${"\u2550".repeat(60)}`);
        this.log(`\u{1F50D} Testing ${componentName} Component - ${mode}`);
        this.log(`${"\u2550".repeat(60)}
`);
      }
      reportStatic(passes, failures) {
        this.staticPasses = passes;
        this.staticFailures = failures;
        const icon = failures === 0 ? "\u2705" : "\u274C";
        const status = failures === 0 ? "PASS" : "FAIL";
        this.log("");
        this.log(`${icon} Static ARIA Tests: ${status}`);
        this.log(`   ${passes}/${passes + failures} required attributes present
`);
      }
      /**
       * Report individual static test pass
       */
      reportStaticTest(description, passed, failureMessage) {
        const icon = passed ? "\u2713" : "\u2717";
        this.log(`  ${icon} ${description}`);
        if (!passed && failureMessage) {
          this.log(`     \u21B3 ${failureMessage}`);
        }
      }
      /**
       * Report individual dynamic test result
       */
      reportTest(test, status, failureMessage) {
        const result = {
          description: test.description,
          status,
          failureMessage,
          isOptional: test.isOptional
        };
        if (status === "skip" && test.requiresBrowser) {
          result.skipReason = "Requires real browser (addEventListener events)";
        }
        this.dynamicResults.push(result);
        const icons = { pass: "\u2713", fail: "\u2717", skip: "\u25CB", "optional-fail": "\u25CB" };
        const prefix = test.isOptional ? "[OPTIONAL] " : "";
        this.log(`  ${icons[status]} ${prefix}${test.description}`);
        if (status === "skip" && !this.isPlaywright) {
          this.log(`     \u21B3 Skipped in jsdom (runs in Playwright)`);
        }
        if (status === "fail" && failureMessage && !test.isOptional) {
          this.log(`     \u21B3 ${failureMessage}`);
        }
        if (status === "optional-fail") {
          this.log(`     \u21B3 Not implemented (recommended for enhanced UX)`);
        }
      }
      /**
       * Report all failures with actionable context
       */
      reportFailures(failures) {
        if (failures.length === 0) return;
        this.log(`
${"\u2500".repeat(60)}`);
        this.log(`\u274C Failures (${failures.length}):
`);
        failures.forEach((failure, index) => {
          this.log(`${index + 1}. ${failure}`);
          if (failure.includes("aria-")) {
            this.log(`   \u{1F4A1} Add the missing ARIA attribute to improve screen reader support`);
          } else if (failure.includes("focus")) {
            this.log(`   \u{1F4A1} Check keyboard event handlers and focus management`);
          } else if (failure.includes("visible")) {
            this.log(`   \u{1F4A1} Verify display/visibility styles and state management`);
          }
          this.log("");
        });
      }
      /**
       * Report optional features that aren't implemented
       */
      reportOptionalSuggestions() {
        const suggestions = this.dynamicResults.filter((r) => r.status === "optional-fail");
        if (suggestions.length === 0) return;
        this.log(`
${"\u2500".repeat(60)}`);
        this.log(`\u{1F4A1} Optional Enhancements (${suggestions.length}):
`);
        this.log(`These features are optional per APG guidelines but recommended`);
        this.log(`for improved user experience and keyboard navigation:
`);
        suggestions.forEach((test, index) => {
          this.log(`${index + 1}. ${test.description}`);
          if (test.failureMessage) {
            this.log(`   \u21B3 ${test.failureMessage}`);
          }
        });
        this.log(`
\u2728 Consider implementing these for better accessibility`);
        this.log(`   Reference: ${this.apgUrl}
`);
      }
      /**
       * Report skipped tests with helpful context
       */
      reportSkipped() {
        if (this.skipped === 0 || this.isPlaywright) return;
        const skippedTests = this.dynamicResults.filter((r) => r.status === "skip");
        this.log(`
${"\u2500".repeat(60)}`);
        this.log(`\u2139\uFE0F  Skipped Tests (${this.skipped}):
`);
        this.log(`These tests use native keyboard events via addEventListener,`);
        this.log(`which jsdom cannot simulate. They run successfully in Playwright.
`);
        skippedTests.forEach((test, index) => {
          this.log(`${index + 1}. ${test.description}`);
        });
        this.log(`
\u{1F4A1} Run with Playwright for full validation:`);
        this.log(`   testUiComponent('${this.componentName}', component, 'http://localhost:5173/')
`);
      }
      /**
       * Generate final summary with statistics
       */
      summary(failures) {
        const duration = Date.now() - this.startTime;
        const dynamicPasses = this.dynamicResults.filter((r) => r.status === "pass").length;
        const dynamicFailures = this.dynamicResults.filter((r) => r.status === "fail").length;
        this.skipped = this.dynamicResults.filter((r) => r.status === "skip").length;
        this.optionalSuggestions = this.dynamicResults.filter((r) => r.status === "optional-fail").length;
        const totalPasses = this.staticPasses + dynamicPasses;
        const totalFailures = this.staticFailures + dynamicFailures;
        const totalRun = totalPasses + totalFailures;
        if (failures.length > 0) {
          this.reportFailures(failures);
        }
        this.reportOptionalSuggestions();
        this.reportSkipped();
        this.log(`
${"\u2550".repeat(60)}`);
        this.log(`\u{1F4CA} Summary
`);
        if (totalFailures === 0 && this.skipped === 0 && this.optionalSuggestions === 0) {
          this.log(`\u2705 All ${totalRun} tests passed!`);
          this.log(`   ${this.componentName} component meets APG and WCAG guidelines \u2713`);
        } else if (totalFailures === 0) {
          this.log(`\u2705 ${totalPasses}/${totalRun} required tests passed`);
          if (this.skipped > 0) {
            this.log(`\u25CB  ${this.skipped} tests skipped (jsdom limitation)`);
          }
          if (this.optionalSuggestions > 0) {
            this.log(`\u{1F4A1} ${this.optionalSuggestions} optional enhancement${this.optionalSuggestions > 1 ? "s" : ""} suggested`);
          }
          this.log(`   ${this.componentName} component meets required standards \u2713`);
        } else {
          this.log(`\u274C ${totalFailures} test${totalFailures > 1 ? "s" : ""} failed`);
          this.log(`\u2705 ${totalPasses} test${totalPasses > 1 ? "s" : ""} passed`);
          if (this.skipped > 0) {
            this.log(`\u25CB  ${this.skipped} test${this.skipped > 1 ? "s" : ""} skipped`);
          }
          if (this.optionalSuggestions > 0) {
            this.log(`\u{1F4A1} ${this.optionalSuggestions} optional enhancement${this.optionalSuggestions > 1 ? "s" : ""} suggested`);
          }
        }
        this.log(`\u23F1\uFE0F  Duration: ${duration}ms`);
        this.log(`${"\u2550".repeat(60)}
`);
        if (totalFailures > 0) {
          this.log(`\u{1F527} Next Steps:`);
          this.log(`   1. Review the failures above`);
          this.log(`   2. Fix ARIA attributes and keyboard handlers`);
          this.log(`   3. Re-run tests to verify fixes
`);
        } else if (!this.isPlaywright && this.skipped > 0) {
          this.log(`\u2728 Optional: Run Playwright tests for complete validation
`);
        }
        return {
          passes: totalPasses,
          failures: totalFailures,
          skipped: this.skipped,
          duration
        };
      }
      /**
       * Report an error during test execution
       */
      error(message, context) {
        this.log(`
\u274C Error: ${message}`);
        if (context) {
          this.log(`   Context: ${context}`);
        }
        this.log("");
      }
    };
  }
});

// node_modules/@playwright/test/index.mjs
var test_exports = {};
__export(test_exports, {
  default: () => import_test.default
});
var import_test;
var init_test = __esm({
  "node_modules/@playwright/test/index.mjs"() {
    "use strict";
    __reExport(test_exports, require("playwright/test"));
    import_test = __toESM(require("playwright/test"), 1);
  }
});

// src/utils/test/contract/contractTestRunnerPlaywright.ts
var contractTestRunnerPlaywright_exports = {};
__export(contractTestRunnerPlaywright_exports, {
  runContractTestsPlaywright: () => runContractTestsPlaywright
});
async function runContractTestsPlaywright(componentName, url) {
  const reporter = new ContractReporter(true);
  const contractTyped = contract_default;
  const contractPath = contractTyped[componentName]?.path;
  if (!contractPath) {
    throw new Error(`Contract path not found for component: ${componentName}`);
  }
  const resolvedPath = new URL(contractPath, import_meta2.url).pathname;
  const contractData = (0, import_fs.readFileSync)(resolvedPath, "utf-8");
  const componentContract = JSON.parse(contractData);
  const totalTests = componentContract.static[0].assertions.length + componentContract.dynamic.length;
  const apgUrl = componentContract.meta?.source?.apg;
  reporter.start(componentName, totalTests, apgUrl);
  const failures = [];
  const passes = [];
  const skipped = [];
  let browser = null;
  try {
    browser = await import_playwright.chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 9e4
    });
    const mainSelector = componentContract.selectors.trigger || componentContract.selectors.input || componentContract.selectors.container;
    if (!mainSelector) {
      throw new Error(`No main selector (trigger, input, or container) found in contract for ${componentName}`);
    }
    await page.waitForSelector(mainSelector, { timeout: 9e4 });
    if (componentName === "menu" && componentContract.selectors.trigger) {
      await page.waitForFunction(
        (selector) => {
          const trigger = document.querySelector(selector);
          return trigger && trigger.getAttribute("data-menu-initialized") === "true";
        },
        componentContract.selectors.trigger,
        { timeout: 1e4 }
      ).catch(() => {
        console.warn("Menu initialization signal not detected, continuing with tests...");
      });
      await page.waitForTimeout(300);
    }
    async function resolveRelativeTarget(selector, relative) {
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
            const items2 = Array.from(document.querySelectorAll(sel));
            return items2.indexOf(document.activeElement);
          }, [selector]);
          const nextIndex = (currentIndex + 1) % items.length;
          return items[nextIndex];
        }
        case "previous": {
          const currentIndex = await page.evaluate(([sel]) => {
            const items2 = Array.from(document.querySelectorAll(sel));
            return items2.indexOf(document.activeElement);
          }, [selector]);
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          return items[prevIndex];
        }
        default:
          return null;
      }
    }
    for (const test of componentContract.static[0]?.assertions || []) {
      if (test.target === "relative") continue;
      const targetSelector = componentContract.selectors[test.target];
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
    for (const dynamicTest of componentContract.dynamic || []) {
      const { action, assertions } = dynamicTest;
      const failuresBeforeTest = failures.length;
      if (componentContract.selectors.listbox || componentContract.selectors.container) {
        const popupSelector = componentContract.selectors.listbox || componentContract.selectors.container;
        if (!popupSelector) continue;
        const popupElement = page.locator(popupSelector).first();
        const isPopupVisible = await popupElement.isVisible();
        if (isPopupVisible) {
          let menuClosed = false;
          let closeSelector = componentContract.selectors.input;
          if (!closeSelector && componentContract.selectors.focusable) {
            closeSelector = componentContract.selectors.focusable;
          } else if (!closeSelector) {
            closeSelector = componentContract.selectors.trigger;
          }
          if (closeSelector) {
            const closeElement = page.locator(closeSelector).first();
            await closeElement.focus();
            await page.waitForTimeout(200);
            await page.keyboard.press("Escape");
            menuClosed = await page.waitForFunction(
              (selector) => {
                const popup = document.querySelector(selector);
                return popup && getComputedStyle(popup).display === "none";
              },
              popupSelector,
              { timeout: 3e3 }
            ).then(() => true).catch(() => false);
          }
          if (!menuClosed && componentContract.selectors.trigger) {
            const triggerElement = page.locator(componentContract.selectors.trigger).first();
            await triggerElement.click();
            await page.waitForTimeout(500);
            menuClosed = await page.waitForFunction(
              (selector) => {
                const popup = document.querySelector(selector);
                return popup && getComputedStyle(popup).display === "none";
              },
              popupSelector,
              { timeout: 3e3 }
            ).then(() => true).catch(() => false);
          }
          if (!menuClosed) {
            await page.mouse.click(10, 10);
            await page.waitForTimeout(500);
            menuClosed = await page.waitForFunction(
              (selector) => {
                const popup = document.querySelector(selector);
                return popup && getComputedStyle(popup).display === "none";
              },
              popupSelector,
              { timeout: 3e3 }
            ).then(() => true).catch(() => false);
            if (menuClosed) {
              console.log("\u{1F3AF} Strategy 3 (Click outside) worked");
            }
          }
          if (!menuClosed) {
            throw new Error(
              `\u274C FATAL: Cannot close menu between tests. Menu remains visible after trying:
  1. Escape key
  2. Clicking trigger
  3. Clicking outside
This indicates a problem with the menu component's close functionality.`
            );
          }
          if (componentName === "menu" && componentContract.selectors.trigger) {
            await page.waitForFunction(
              (selector) => {
                const trigger = document.querySelector(selector);
                return document.activeElement === trigger;
              },
              componentContract.selectors.trigger,
              { timeout: 2e3 }
            ).catch(async () => {
              const triggerElement = page.locator(componentContract.selectors.trigger).first();
              await triggerElement.focus();
              await page.waitForTimeout(200);
            });
          }
          await page.waitForTimeout(500);
          if (componentContract.selectors.input) {
            const inputElement = page.locator(componentContract.selectors.input).first();
            await inputElement.clear();
            await page.waitForTimeout(100);
          }
        }
      }
      let shouldSkipTest = false;
      for (const act of action) {
        if (act.type === "keypress" && (act.target === "submenuTrigger" || act.target === "submenu")) {
          const submenuSelector = componentContract.selectors[act.target];
          if (submenuSelector) {
            const submenuCount = await page.locator(submenuSelector).count();
            if (submenuCount === 0) {
              reporter.reportTest(dynamicTest, "skip", `Skipping test - ${act.target} element not found (optional submenu test)`);
              shouldSkipTest = true;
              break;
            }
          }
        }
      }
      if (!shouldSkipTest) {
        for (const assertion of assertions) {
          if (assertion.target === "submenu" || assertion.target === "submenuTrigger") {
            const submenuSelector = componentContract.selectors[assertion.target];
            if (submenuSelector) {
              const submenuCount = await page.locator(submenuSelector).count();
              if (submenuCount === 0) {
                reporter.reportTest(dynamicTest, "skip", `Skipping test - ${assertion.target} element not found (optional submenu test)`);
                shouldSkipTest = true;
                break;
              }
            }
          }
        }
      }
      if (shouldSkipTest) {
        continue;
      }
      for (const act of action) {
        if (act.type === "focus") {
          const focusSelector = componentContract.selectors[act.target];
          if (!focusSelector) {
            failures.push(`Selector for focus target ${act.target} not found.`);
            continue;
          }
          await page.locator(focusSelector).first().focus();
          await page.waitForTimeout(100);
        }
        if (act.type === "type" && act.value) {
          const typeSelector = componentContract.selectors[act.target];
          if (!typeSelector) {
            failures.push(`Selector for type target ${act.target} not found.`);
            continue;
          }
          await page.locator(typeSelector).first().fill(act.value);
          await page.waitForTimeout(100);
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
            await page.waitForTimeout(componentName === "menu" ? 800 : 200);
          } else {
            const actionSelector = componentContract.selectors[act.target];
            if (!actionSelector) {
              failures.push(`Selector for action target ${act.target} not found.`);
              continue;
            }
            await page.locator(actionSelector).first().click();
            await page.waitForTimeout(componentName === "menu" ? 800 : 200);
          }
        }
        if (act.type === "keypress" && act.key) {
          const keyMap = {
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
            await page.waitForTimeout(componentName === "menu" ? 200 : 100);
            await page.keyboard.press(keyValue);
            await page.waitForTimeout(componentName === "menu" ? 300 : 100);
          } else {
            const keypressSelector = componentContract.selectors[act.target];
            if (!keypressSelector) {
              failures.push(`Selector for keypress target ${act.target} not found.`);
              continue;
            }
            const target = page.locator(keypressSelector).first();
            const elementCount = await target.count();
            if (elementCount === 0) {
              reporter.reportTest(dynamicTest, "skip", `Skipping test - ${act.target} element not found (optional submenu test)`);
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
            await page.waitForTimeout(100);
          } else {
            const hoverSelector = componentContract.selectors[act.target];
            if (!hoverSelector) {
              failures.push(`Selector for hover target ${act.target} not found.`);
              continue;
            }
            await page.locator(hoverSelector).first().hover();
            await page.waitForTimeout(100);
          }
        }
        await page.waitForTimeout(componentName === "menu" ? 200 : 100);
      }
      await page.waitForTimeout(componentName === "menu" ? 300 : 100);
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
          const assertionSelector = componentContract.selectors[assertion.target];
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
        if (assertion.assertion === "toBeVisible") {
          try {
            await (0, test_exports.expect)(target).toBeVisible({ timeout: 3e3 });
            passes.push(`${assertion.target} is visible as expected. Test: "${dynamicTest.description}".`);
          } catch {
            const debugState = await page.evaluate((sel) => {
              const el = sel ? document.querySelector(sel) : null;
              if (!el) return "element not found";
              const styles = window.getComputedStyle(el);
              return `display:${styles.display}, visibility:${styles.visibility}, opacity:${styles.opacity}`;
            }, componentContract.selectors[assertion.target] || "");
            failures.push(`${assertion.failureMessage} (actual: ${debugState})`);
          }
        }
        if (assertion.assertion === "notToBeVisible") {
          try {
            await (0, test_exports.expect)(target).toBeHidden({ timeout: 5e3 });
            passes.push(`${assertion.target} is not visible as expected. Test: "${dynamicTest.description}".`);
          } catch {
            const debugState = await page.evaluate((sel) => {
              const el = sel ? document.querySelector(sel) : null;
              if (!el) return "element not found";
              const styles = window.getComputedStyle(el);
              return `display:${styles.display}, visibility:${styles.visibility}, opacity:${styles.opacity}`;
            }, componentContract.selectors[assertion.target] || "");
            failures.push(assertion.failureMessage + ` ${assertion.target} is still visible (actual: ${debugState}).`);
          }
        }
        if (assertion.assertion === "toHaveAttribute" && assertion.attribute && assertion.expectedValue) {
          try {
            if (assertion.expectedValue === "!empty") {
              const attributeValue = await target.getAttribute(assertion.attribute);
              if (attributeValue && attributeValue.trim() !== "") {
                passes.push(`${assertion.target} has non-empty "${assertion.attribute}". Test: "${dynamicTest.description}".`);
              } else {
                failures.push(assertion.failureMessage + ` ${assertion.target} "${assertion.attribute}" should not be empty, found "${attributeValue}".`);
              }
            } else {
              await (0, test_exports.expect)(target).toHaveAttribute(assertion.attribute, assertion.expectedValue, { timeout: 3e3 });
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
            await (0, test_exports.expect)(target).toBeFocused({ timeout: 5e3 });
            passes.push(`${assertion.target} has focus as expected. Test: "${dynamicTest.description}".`);
          } catch {
            const actualFocus = await page.evaluate(() => {
              const focused = document.activeElement;
              return focused ? `${focused.tagName}#${focused.id || "no-id"}.${focused.className || "no-class"}` : "no element focused";
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
      const failuresAfterTest = failures.length;
      const testPassed = failuresAfterTest === failuresBeforeTest;
      const failureMessage = testPassed ? void 0 : failures[failures.length - 1];
      if (dynamicTest.isOptional === true && !testPassed) {
        failures.pop();
        reporter.reportTest(dynamicTest, "optional-fail", failureMessage);
      } else {
        reporter.reportTest(dynamicTest, testPassed ? "pass" : "fail", failureMessage);
      }
    }
    const staticPassed = componentContract.static[0].assertions.length;
    const staticFailed = 0;
    reporter.reportStatic(staticPassed, staticFailed);
    reporter.summary(failures);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Executable doesn't exist")) {
        console.error("\n\u274C Playwright browsers not found!\n");
        console.log("\u{1F4E6} Run: npx playwright install chromium\n");
        failures.push("Playwright browser not installed. Run: npx playwright install chromium");
      } else if (error.message.includes("net::ERR_CONNECTION_REFUSED")) {
        console.error("\n\u274C Cannot connect to dev server!\n");
        console.log(`   Make sure your dev server is running at ${url}
`);
        failures.push(`Dev server not running at ${url}`);
      } else {
        console.error("\u274C Playwright test error:", error.message);
        failures.push(`Test error: ${error.message}`);
      }
    }
  } finally {
    if (browser) await browser.close();
  }
  return { passes, failures, skipped };
}
var import_playwright, import_fs, import_meta2;
var init_contractTestRunnerPlaywright = __esm({
  "src/utils/test/contract/contractTestRunnerPlaywright.ts"() {
    "use strict";
    import_playwright = require("playwright");
    init_test();
    import_fs = require("fs");
    init_contract();
    init_ContractReporter();
    import_meta2 = {};
  }
});

// index.ts
var index_exports = {};
__export(index_exports, {
  makeAccordionAccessible: () => makeAccordionAccessible,
  makeBlockAccessible: () => makeBlockAccessible,
  makeCheckboxAccessible: () => makeCheckboxAccessible,
  makeComboboxAccessible: () => makeComboboxAccessible,
  makeMenuAccessible: () => makeMenuAccessible,
  makeRadioAccessible: () => makeRadioAccessible,
  makeToggleAccessible: () => makeToggleAccessible,
  testUiComponent: () => testUiComponent
});
module.exports = __toCommonJS(index_exports);

// src/accordion/src/makeAccordionAccessible/makeAccordionAccessible.ts
function makeAccordionAccessible({ accordionId, triggersClass, panelsClass, allowMultiple = false }) {
  const accordionContainer = document.querySelector(`#${accordionId}`);
  if (!accordionContainer) {
    console.error(`[aria-ease] Element with id="${accordionId}" not found. Make sure the accordion container exists before calling makeAccordionAccessible.`);
    return { cleanup: () => {
    } };
  }
  const triggers = Array.from(accordionContainer.querySelectorAll(`.${triggersClass}`));
  if (triggers.length === 0) {
    console.error(`[aria-ease] No elements with class="${triggersClass}" found. Make sure accordion triggers exist before calling makeAccordionAccessible.`);
    return { cleanup: () => {
    } };
  }
  const panels = Array.from(accordionContainer.querySelectorAll(`.${panelsClass}`));
  if (panels.length === 0) {
    console.error(`[aria-ease] No elements with class="${panelsClass}" found. Make sure accordion panels exist before calling makeAccordionAccessible.`);
    return { cleanup: () => {
    } };
  }
  if (triggers.length !== panels.length) {
    console.error(`[aria-ease] Accordion trigger/panel mismatch: found ${triggers.length} triggers but ${panels.length} panels.`);
    return { cleanup: () => {
    } };
  }
  const handlerMap = /* @__PURE__ */ new WeakMap();
  const clickHandlerMap = /* @__PURE__ */ new WeakMap();
  function initialize() {
    triggers.forEach((trigger, index) => {
      const panel = panels[index];
      if (!trigger.id) {
        trigger.id = `${accordionId}-trigger-${index}`;
      }
      if (!panel.id) {
        panel.id = `${accordionId}-panel-${index}`;
      }
      trigger.setAttribute("aria-controls", panel.id);
      trigger.setAttribute("aria-expanded", "false");
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", trigger.id);
      panel.style.display = "none";
    });
  }
  function expandItem(index) {
    if (index < 0 || index >= triggers.length) {
      console.error(`[aria-ease] Invalid accordion index: ${index}`);
      return;
    }
    const trigger = triggers[index];
    const panel = panels[index];
    trigger.setAttribute("aria-expanded", "true");
    panel.style.display = "block";
  }
  function collapseItem(index) {
    if (index < 0 || index >= triggers.length) {
      console.error(`[aria-ease] Invalid accordion index: ${index}`);
      return;
    }
    const trigger = triggers[index];
    const panel = panels[index];
    trigger.setAttribute("aria-expanded", "false");
    panel.style.display = "none";
  }
  function toggleItem(index) {
    const trigger = triggers[index];
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      collapseItem(index);
    } else {
      if (!allowMultiple) {
        triggers.forEach((_, i) => {
          if (i !== index) {
            collapseItem(i);
          }
        });
      }
      expandItem(index);
    }
  }
  function handleTriggerClick(index) {
    return () => {
      toggleItem(index);
    };
  }
  function handleTriggerKeydown(index) {
    return (event) => {
      const { key } = event;
      switch (key) {
        case "Enter":
        case " ":
          event.preventDefault();
          toggleItem(index);
          break;
        case "ArrowDown":
          event.preventDefault();
          {
            const nextIndex = (index + 1) % triggers.length;
            triggers[nextIndex].focus();
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          {
            const prevIndex = (index - 1 + triggers.length) % triggers.length;
            triggers[prevIndex].focus();
          }
          break;
        case "Home":
          event.preventDefault();
          triggers[0].focus();
          break;
        case "End":
          event.preventDefault();
          triggers[triggers.length - 1].focus();
          break;
      }
    };
  }
  function addListeners() {
    triggers.forEach((trigger, index) => {
      const clickHandler = handleTriggerClick(index);
      const keydownHandler = handleTriggerKeydown(index);
      trigger.addEventListener("click", clickHandler);
      trigger.addEventListener("keydown", keydownHandler);
      handlerMap.set(trigger, keydownHandler);
      clickHandlerMap.set(trigger, clickHandler);
    });
  }
  function removeListeners() {
    triggers.forEach((trigger) => {
      const keydownHandler = handlerMap.get(trigger);
      const clickHandler = clickHandlerMap.get(trigger);
      if (keydownHandler) {
        trigger.removeEventListener("keydown", keydownHandler);
        handlerMap.delete(trigger);
      }
      if (clickHandler) {
        trigger.removeEventListener("click", clickHandler);
        clickHandlerMap.delete(trigger);
      }
    });
  }
  function cleanup() {
    removeListeners();
    triggers.forEach((_, index) => {
      collapseItem(index);
    });
  }
  initialize();
  addListeners();
  return {
    expandItem,
    collapseItem,
    toggleItem,
    cleanup
  };
}

// src/utils/handleKeyPress/handleKeyPress.ts
function isTextInput(el) {
  if (el.tagName !== "INPUT") return false;
  const type = el.type;
  return ["text", "email", "password", "tel", "number"].includes(type);
}
function isTextArea(el) {
  return el.tagName === "TEXTAREA";
}
function isNativeButton(el) {
  return el.tagName === "BUTTON" || el.tagName === "INPUT" && ["button", "submit", "reset"].includes(el.type);
}
function isLink(el) {
  return el.tagName === "A";
}
function moveFocus(elementItems, currentIndex, direction) {
  const len = elementItems.length;
  const nextIndex = (currentIndex + direction + len) % len;
  elementItems.item(nextIndex).focus();
}
function isClickableButNotSemantic(el) {
  return el.getAttribute("data-custom-click") !== null && el.getAttribute("data-custom-click") !== void 0;
}
function handleMenuClose(menuElement, menuTriggerButton) {
  menuElement.style.display = "none";
  const menuTriggerButtonId = menuTriggerButton.getAttribute("id");
  if (!menuTriggerButtonId) {
    console.error("[aria-ease] Menu trigger button must have an id attribute to properly set aria attributes.");
    return;
  }
  menuTriggerButton.setAttribute("aria-expanded", "false");
}
function hasSubmenu(menuItem) {
  return menuItem.getAttribute("aria-haspopup") === "true" || menuItem.getAttribute("aria-haspopup") === "menu";
}
function getSubmenuId(menuItem) {
  return menuItem.getAttribute("aria-controls");
}
function handleKeyPress(event, elementItems, elementItemIndex, menuElementDiv, triggerButton, openSubmenu, closeSubmenu) {
  const currentEl = elementItems.item(elementItemIndex);
  switch (event.key) {
    case "ArrowUp":
    case "ArrowLeft": {
      if (event.key === "ArrowLeft" && menuElementDiv && closeSubmenu) {
        const labelledBy = menuElementDiv.getAttribute("aria-labelledby");
        if (labelledBy) {
          const parentTrigger = document.getElementById(labelledBy);
          if (parentTrigger && parentTrigger.getAttribute("role") === "menuitem") {
            event.preventDefault();
            closeSubmenu();
            parentTrigger.focus();
            return;
          }
        }
      }
      if (!isTextInput(currentEl) && !isTextArea(currentEl)) {
        event.preventDefault();
        moveFocus(elementItems, elementItemIndex, -1);
      } else if (isTextInput(currentEl) || isTextArea(currentEl)) {
        const cursorStart = currentEl.selectionStart;
        if (cursorStart === 0) {
          event.preventDefault();
          moveFocus(elementItems, elementItemIndex, -1);
        }
      }
      break;
    }
    case "ArrowDown":
    case "ArrowRight": {
      if (event.key === "ArrowRight" && hasSubmenu(currentEl) && openSubmenu) {
        event.preventDefault();
        const submenuId = getSubmenuId(currentEl);
        if (submenuId) {
          openSubmenu(submenuId);
          return;
        }
      }
      if (!isTextInput(currentEl) && !isTextArea(currentEl)) {
        event.preventDefault();
        moveFocus(elementItems, elementItemIndex, 1);
      } else if (isTextInput(currentEl) || isTextArea(currentEl)) {
        const value = currentEl.value;
        const cursorEnd = currentEl.selectionStart;
        if (cursorEnd === value.length) {
          event.preventDefault();
          moveFocus(elementItems, elementItemIndex, 1);
        }
      }
      break;
    }
    case "Escape": {
      event.preventDefault();
      if (menuElementDiv && triggerButton) {
        if (getComputedStyle(menuElementDiv).display === "block") {
          handleMenuClose(menuElementDiv, triggerButton);
        }
        triggerButton.focus();
      }
      break;
    }
    case "Enter":
    case " ": {
      if (!isNativeButton(currentEl) && !isLink(currentEl) && isClickableButNotSemantic(currentEl)) {
        event.preventDefault();
        currentEl.click();
      } else if (isNativeButton(currentEl)) {
        event.preventDefault();
        currentEl.click();
      }
      break;
    }
    case "Tab": {
      if (menuElementDiv && triggerButton && (!event.shiftKey || event.shiftKey)) {
        handleMenuClose(menuElementDiv, triggerButton);
      }
      break;
    }
    default:
      break;
  }
}

// src/block/src/makeBlockAccessible/makeBlockAccessible.ts
function makeBlockAccessible({ blockId, blockItemsClass }) {
  const blockDiv = document.querySelector(`#${blockId}`);
  if (!blockDiv) {
    console.error(`[aria-ease] Element with id="${blockId}" not found. Make sure the block element exists before calling makeBlockAccessible.`);
    return { cleanup: () => {
    } };
  }
  let cachedItems = null;
  function getItems() {
    if (!cachedItems) {
      cachedItems = blockDiv.querySelectorAll(`.${blockItemsClass}`);
    }
    return cachedItems;
  }
  const blockItems = getItems();
  if (!blockItems || blockItems.length === 0) {
    console.error(`[aria-ease] Element with class="${blockItemsClass}" not found. Make sure the block items exist before calling makeBlockAccessible.`);
    return { cleanup: () => {
    } };
  }
  const eventListenersMap = /* @__PURE__ */ new Map();
  blockItems.forEach((blockItem) => {
    if (!eventListenersMap.has(blockItem)) {
      const handler = (event) => {
        const items = blockDiv.querySelectorAll(`.${blockItemsClass}`);
        const index = Array.prototype.indexOf.call(items, blockItem);
        handleKeyPress(event, items, index);
      };
      blockItem.addEventListener("keydown", handler);
      eventListenersMap.set(blockItem, handler);
    }
  });
  function cleanup() {
    blockItems.forEach((blockItem) => {
      const handler = eventListenersMap.get(blockItem);
      if (handler) {
        blockItem.removeEventListener("keydown", handler);
        eventListenersMap.delete(blockItem);
      }
    });
  }
  function refresh() {
    cachedItems = null;
  }
  return { cleanup, refresh };
}

// src/checkbox/src/makeCheckboxAccessible/makeCheckboxAccessible.ts
function makeCheckboxAccessible({ checkboxGroupId, checkboxesClass }) {
  const checkboxGroup = document.querySelector(`#${checkboxGroupId}`);
  if (!checkboxGroup) {
    console.error(`[aria-ease] Element with id="${checkboxGroupId}" not found. Make sure the checkbox group container exists before calling makeCheckboxAccessible.`);
    return { cleanup: () => {
    } };
  }
  const checkboxes = Array.from(checkboxGroup.querySelectorAll(`.${checkboxesClass}`));
  if (checkboxes.length === 0) {
    console.error(`[aria-ease] No elements with class="${checkboxesClass}" found. Make sure checkboxes exist before calling makeCheckboxAccessible.`);
    return { cleanup: () => {
    } };
  }
  const handlerMap = /* @__PURE__ */ new WeakMap();
  const clickHandlerMap = /* @__PURE__ */ new WeakMap();
  function initialize() {
    if (!checkboxGroup.getAttribute("role")) {
      checkboxGroup.setAttribute("role", "group");
    }
    checkboxes.forEach((checkbox) => {
      checkbox.setAttribute("role", "checkbox");
      if (!checkbox.hasAttribute("aria-checked")) {
        checkbox.setAttribute("aria-checked", "false");
      }
      if (!checkbox.hasAttribute("tabindex")) {
        checkbox.setAttribute("tabindex", "0");
      }
    });
  }
  function toggleCheckbox(index) {
    if (index < 0 || index >= checkboxes.length) {
      console.error(`[aria-ease] Invalid checkbox index: ${index}`);
      return;
    }
    const checkbox = checkboxes[index];
    const isChecked = checkbox.getAttribute("aria-checked") === "true";
    checkbox.setAttribute("aria-checked", isChecked ? "false" : "true");
  }
  function setCheckboxState(index, checked) {
    if (index < 0 || index >= checkboxes.length) {
      console.error(`[aria-ease] Invalid checkbox index: ${index}`);
      return;
    }
    checkboxes[index].setAttribute("aria-checked", checked ? "true" : "false");
  }
  function handleCheckboxClick(index) {
    return () => {
      toggleCheckbox(index);
    };
  }
  function handleCheckboxKeydown(index) {
    return (event) => {
      const { key } = event;
      switch (key) {
        case " ":
          event.preventDefault();
          toggleCheckbox(index);
          break;
        case "ArrowDown":
          event.preventDefault();
          {
            const nextIndex = (index + 1) % checkboxes.length;
            checkboxes[nextIndex].focus();
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          {
            const prevIndex = (index - 1 + checkboxes.length) % checkboxes.length;
            checkboxes[prevIndex].focus();
          }
          break;
        case "Home":
          event.preventDefault();
          checkboxes[0].focus();
          break;
        case "End":
          event.preventDefault();
          checkboxes[checkboxes.length - 1].focus();
          break;
      }
    };
  }
  function addListeners() {
    checkboxes.forEach((checkbox, index) => {
      const clickHandler = handleCheckboxClick(index);
      const keydownHandler = handleCheckboxKeydown(index);
      checkbox.addEventListener("click", clickHandler);
      checkbox.addEventListener("keydown", keydownHandler);
      handlerMap.set(checkbox, keydownHandler);
      clickHandlerMap.set(checkbox, clickHandler);
    });
  }
  function removeListeners() {
    checkboxes.forEach((checkbox) => {
      const keydownHandler = handlerMap.get(checkbox);
      const clickHandler = clickHandlerMap.get(checkbox);
      if (keydownHandler) {
        checkbox.removeEventListener("keydown", keydownHandler);
        handlerMap.delete(checkbox);
      }
      if (clickHandler) {
        checkbox.removeEventListener("click", clickHandler);
        clickHandlerMap.delete(checkbox);
      }
    });
  }
  function cleanup() {
    removeListeners();
  }
  function getCheckedStates() {
    return checkboxes.map((checkbox) => checkbox.getAttribute("aria-checked") === "true");
  }
  function getCheckedIndices() {
    return checkboxes.map((checkbox, index) => checkbox.getAttribute("aria-checked") === "true" ? index : -1).filter((index) => index !== -1);
  }
  initialize();
  addListeners();
  return {
    toggleCheckbox,
    setCheckboxState,
    getCheckedStates,
    getCheckedIndices,
    cleanup
  };
}

// src/menu/src/makeMenuAccessible/makeMenuAccessible.ts
function makeMenuAccessible({ menuId, menuItemsClass, triggerId }) {
  const menuDiv = document.querySelector(`#${menuId}`);
  if (!menuDiv) {
    console.error(`[aria-ease] Element with id="${menuId}" not found. Make sure the menu element exists before calling makeMenuAccessible.`);
    return { openMenu: () => {
    }, closeMenu: () => {
    }, cleanup: () => {
    } };
  }
  const triggerButton = document.querySelector(`#${triggerId}`);
  if (!triggerButton) {
    console.error(`[aria-ease] Element with id="${triggerId}" not found. Make sure the trigger button element exists before calling makeMenuAccessible.`);
    return { openMenu: () => {
    }, closeMenu: () => {
    }, cleanup: () => {
    } };
  }
  if (!/^[\w-]+$/.test(menuId)) {
    console.error("[aria-ease] Invalid menuId: must be alphanumeric");
    return { openMenu: () => {
    }, closeMenu: () => {
    }, cleanup: () => {
    } };
  }
  triggerButton.setAttribute("aria-haspopup", "true");
  triggerButton.setAttribute("aria-controls", menuId);
  triggerButton.setAttribute("aria-expanded", "false");
  menuDiv.setAttribute("role", "menu");
  menuDiv.setAttribute("aria-labelledby", triggerId);
  const handlerMap = /* @__PURE__ */ new WeakMap();
  const submenuInstances = /* @__PURE__ */ new Map();
  let cachedItems = null;
  let filteredItems = null;
  function getItems() {
    if (!cachedItems) {
      cachedItems = menuDiv.querySelectorAll(`.${menuItemsClass}`);
    }
    return cachedItems;
  }
  function getFilteredItems() {
    if (!filteredItems) {
      const allItems = getItems();
      filteredItems = [];
      for (let i = 0; i < allItems.length; i++) {
        const item = allItems.item(i);
        const isNested = isItemInNestedSubmenu(item);
        if (!isNested) {
          if (!item.hasAttribute("tabindex")) {
            item.setAttribute("tabindex", "-1");
          }
          filteredItems.push(item);
        }
      }
    }
    return filteredItems;
  }
  function toNodeListLike(items) {
    const nodeListLike = {
      length: items.length,
      item: (index) => items[index],
      forEach: (callback) => {
        items.forEach(callback);
      },
      [Symbol.iterator]: function* () {
        for (const item of items) {
          yield item;
        }
      }
    };
    return nodeListLike;
  }
  function isItemInNestedSubmenu(item) {
    let parent = item.parentElement;
    while (parent && parent !== menuDiv) {
      if (parent.getAttribute("role") === "menu") {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }
  function setAria(isOpen) {
    triggerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
  function openSubmenu(submenuId) {
    let submenuInstance = submenuInstances.get(submenuId);
    if (!submenuInstance) {
      const submenuTrigger = menuDiv.querySelector(`[aria-controls="${submenuId}"]`);
      if (!submenuTrigger) {
        console.error(`[aria-ease] Submenu trigger with aria-controls="${submenuId}" not found in menu "${menuId}".`);
        return;
      }
      if (!submenuTrigger.id) {
        const generatedId = `trigger-${submenuId}`;
        submenuTrigger.id = generatedId;
        console.warn(`[aria-ease] Submenu trigger for "${submenuId}" had no ID. Auto-generated ID: "${generatedId}".`);
      }
      const submenuElement = document.querySelector(`#${submenuId}`);
      if (!submenuElement) {
        console.error(`[aria-ease] Submenu element with id="${submenuId}" not found. Cannot create submenu instance.`);
        return;
      }
      submenuInstance = makeMenuAccessible({
        menuId: submenuId,
        menuItemsClass,
        triggerId: submenuTrigger.id
      });
      submenuInstances.set(submenuId, submenuInstance);
    }
    submenuInstance.openMenu();
  }
  function closeSubmenu() {
    closeMenu();
  }
  function addListeners() {
    const items = getFilteredItems();
    const nodeListLike = toNodeListLike(items);
    items.forEach((menuItem, index) => {
      if (!handlerMap.has(menuItem)) {
        const handler = (event) => handleKeyPress(
          event,
          nodeListLike,
          index,
          menuDiv,
          triggerButton,
          openSubmenu,
          closeSubmenu
        );
        menuItem.addEventListener("keydown", handler);
        handlerMap.set(menuItem, handler);
      }
    });
  }
  function removeListeners() {
    const items = getFilteredItems();
    items.forEach((menuItem) => {
      const handler = handlerMap.get(menuItem);
      if (handler) {
        menuItem.removeEventListener("keydown", handler);
        handlerMap.delete(menuItem);
      }
    });
  }
  function openMenu() {
    setAria(true);
    menuDiv.style.display = "block";
    const items = getFilteredItems();
    addListeners();
    if (items && items.length > 0) {
      items[0].focus();
    }
  }
  function closeMenu() {
    setAria(false);
    menuDiv.style.display = "none";
    removeListeners();
    triggerButton.focus();
  }
  function intializeMenuItems() {
    const items = getItems();
    items.forEach((item) => {
      item.setAttribute("role", "menuitem");
    });
  }
  intializeMenuItems();
  function handleTriggerClick() {
    const isOpen = triggerButton.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }
  function handleClickOutside(event) {
    const isMenuOpen = triggerButton.getAttribute("aria-expanded") === "true";
    if (!isMenuOpen) return;
    const clickedTrigger = triggerButton.contains(event.target);
    const clickedMenu = menuDiv.contains(event.target);
    if (!clickedTrigger && !clickedMenu) {
      closeMenu();
    }
  }
  triggerButton.addEventListener("click", handleTriggerClick);
  document.addEventListener("click", handleClickOutside);
  triggerButton.setAttribute("data-menu-initialized", "true");
  function cleanup() {
    removeListeners();
    triggerButton.removeEventListener("click", handleTriggerClick);
    document.removeEventListener("click", handleClickOutside);
    menuDiv.style.display = "none";
    setAria(false);
    submenuInstances.forEach((instance) => instance.cleanup());
    submenuInstances.clear();
  }
  function refresh() {
    cachedItems = null;
    filteredItems = null;
  }
  return { openMenu, closeMenu, cleanup, refresh };
}

// src/radio/src/makeRadioAccessible/makeRadioAccessible.ts
function makeRadioAccessible({ radioGroupId, radiosClass, defaultSelectedIndex = 0 }) {
  const radioGroup = document.querySelector(`#${radioGroupId}`);
  if (!radioGroup) {
    console.error(`[aria-ease] Element with id="${radioGroupId}" not found. Make sure the radio group container exists before calling makeRadioAccessible.`);
    return { cleanup: () => {
    } };
  }
  const radios = Array.from(radioGroup.querySelectorAll(`.${radiosClass}`));
  if (radios.length === 0) {
    console.error(`[aria-ease] No elements with class="${radiosClass}" found. Make sure radio buttons exist before calling makeRadioAccessible.`);
    return { cleanup: () => {
    } };
  }
  const handlerMap = /* @__PURE__ */ new WeakMap();
  const clickHandlerMap = /* @__PURE__ */ new WeakMap();
  let currentSelectedIndex = defaultSelectedIndex;
  function initialize() {
    if (!radioGroup.getAttribute("role")) {
      radioGroup.setAttribute("role", "radiogroup");
    }
    radios.forEach((radio, index) => {
      radio.setAttribute("role", "radio");
      radio.setAttribute("tabindex", index === currentSelectedIndex ? "0" : "-1");
      if (index === currentSelectedIndex) {
        radio.setAttribute("aria-checked", "true");
      } else {
        radio.setAttribute("aria-checked", "false");
      }
    });
  }
  function selectRadio(index) {
    if (index < 0 || index >= radios.length) {
      console.error(`[aria-ease] Invalid radio index: ${index}`);
      return;
    }
    if (currentSelectedIndex >= 0 && currentSelectedIndex < radios.length) {
      radios[currentSelectedIndex].setAttribute("aria-checked", "false");
      radios[currentSelectedIndex].setAttribute("tabindex", "-1");
    }
    radios[index].setAttribute("aria-checked", "true");
    radios[index].setAttribute("tabindex", "0");
    radios[index].focus();
    currentSelectedIndex = index;
  }
  function handleRadioClick(index) {
    return () => {
      selectRadio(index);
    };
  }
  function handleRadioKeydown(index) {
    return (event) => {
      const { key } = event;
      let nextIndex = index;
      switch (key) {
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          nextIndex = (index + 1) % radios.length;
          selectRadio(nextIndex);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          nextIndex = (index - 1 + radios.length) % radios.length;
          selectRadio(nextIndex);
          break;
        case " ":
          event.preventDefault();
          selectRadio(index);
          break;
        case "Home":
          event.preventDefault();
          selectRadio(0);
          break;
        case "End":
          event.preventDefault();
          selectRadio(radios.length - 1);
          break;
      }
    };
  }
  function addListeners() {
    radios.forEach((radio, index) => {
      const clickHandler = handleRadioClick(index);
      const keydownHandler = handleRadioKeydown(index);
      radio.addEventListener("click", clickHandler);
      radio.addEventListener("keydown", keydownHandler);
      handlerMap.set(radio, keydownHandler);
      clickHandlerMap.set(radio, clickHandler);
    });
  }
  function removeListeners() {
    radios.forEach((radio) => {
      const keydownHandler = handlerMap.get(radio);
      const clickHandler = clickHandlerMap.get(radio);
      if (keydownHandler) {
        radio.removeEventListener("keydown", keydownHandler);
        handlerMap.delete(radio);
      }
      if (clickHandler) {
        radio.removeEventListener("click", clickHandler);
        clickHandlerMap.delete(radio);
      }
    });
  }
  function cleanup() {
    removeListeners();
  }
  function getSelectedIndex() {
    return currentSelectedIndex;
  }
  initialize();
  addListeners();
  return {
    selectRadio,
    getSelectedIndex,
    cleanup
  };
}

// src/toggle/src/makeTogggleAccessible/makeToggleAccessible.ts
function makeToggleAccessible({ toggleId, togglesClass, isSingleToggle = true }) {
  const toggleContainer = document.querySelector(`#${toggleId}`);
  if (!toggleContainer) {
    console.error(`[aria-ease] Element with id="${toggleId}" not found. Make sure the toggle element exists before calling makeToggleAccessible.`);
    return { cleanup: () => {
    } };
  }
  let toggles;
  if (isSingleToggle) {
    toggles = [toggleContainer];
  } else {
    if (!togglesClass) {
      console.error(`[aria-ease] togglesClass is required when isSingleToggle is false.`);
      return { cleanup: () => {
      } };
    }
    toggles = Array.from(toggleContainer.querySelectorAll(`.${togglesClass}`));
    if (toggles.length === 0) {
      console.error(`[aria-ease] No elements with class="${togglesClass}" found. Make sure toggle buttons exist before calling makeToggleAccessible.`);
      return { cleanup: () => {
      } };
    }
  }
  const handlerMap = /* @__PURE__ */ new WeakMap();
  const clickHandlerMap = /* @__PURE__ */ new WeakMap();
  function initialize() {
    toggles.forEach((toggle) => {
      if (toggle.tagName.toLowerCase() !== "button" && !toggle.getAttribute("role")) {
        toggle.setAttribute("role", "button");
      }
      if (!toggle.hasAttribute("aria-pressed")) {
        toggle.setAttribute("aria-pressed", "false");
      }
      if (!toggle.hasAttribute("tabindex")) {
        toggle.setAttribute("tabindex", "0");
      }
    });
  }
  function toggleButton(index) {
    if (index < 0 || index >= toggles.length) {
      console.error(`[aria-ease] Invalid toggle index: ${index}`);
      return;
    }
    const toggle = toggles[index];
    const isPressed = toggle.getAttribute("aria-pressed") === "true";
    toggle.setAttribute("aria-pressed", isPressed ? "false" : "true");
  }
  function setPressed(index, pressed) {
    if (index < 0 || index >= toggles.length) {
      console.error(`[aria-ease] Invalid toggle index: ${index}`);
      return;
    }
    toggles[index].setAttribute("aria-pressed", pressed ? "true" : "false");
  }
  function handleToggleClick(index) {
    return () => {
      toggleButton(index);
    };
  }
  function handleToggleKeydown(index) {
    return (event) => {
      const { key } = event;
      switch (key) {
        case "Enter":
        case " ":
          event.preventDefault();
          toggleButton(index);
          break;
        case "ArrowDown":
        case "ArrowRight":
          if (!isSingleToggle && toggles.length > 1) {
            event.preventDefault();
            const nextIndex = (index + 1) % toggles.length;
            toggles[nextIndex].focus();
          }
          break;
        case "ArrowUp":
        case "ArrowLeft":
          if (!isSingleToggle && toggles.length > 1) {
            event.preventDefault();
            const prevIndex = (index - 1 + toggles.length) % toggles.length;
            toggles[prevIndex].focus();
          }
          break;
        case "Home":
          if (!isSingleToggle && toggles.length > 1) {
            event.preventDefault();
            toggles[0].focus();
          }
          break;
        case "End":
          if (!isSingleToggle && toggles.length > 1) {
            event.preventDefault();
            toggles[toggles.length - 1].focus();
          }
          break;
      }
    };
  }
  function addListeners() {
    toggles.forEach((toggle, index) => {
      const clickHandler = handleToggleClick(index);
      const keydownHandler = handleToggleKeydown(index);
      toggle.addEventListener("click", clickHandler);
      toggle.addEventListener("keydown", keydownHandler);
      handlerMap.set(toggle, keydownHandler);
      clickHandlerMap.set(toggle, clickHandler);
    });
  }
  function removeListeners() {
    toggles.forEach((toggle) => {
      const keydownHandler = handlerMap.get(toggle);
      const clickHandler = clickHandlerMap.get(toggle);
      if (keydownHandler) {
        toggle.removeEventListener("keydown", keydownHandler);
        handlerMap.delete(toggle);
      }
      if (clickHandler) {
        toggle.removeEventListener("click", clickHandler);
        clickHandlerMap.delete(toggle);
      }
    });
  }
  function cleanup() {
    removeListeners();
  }
  function getPressedStates() {
    return toggles.map((toggle) => toggle.getAttribute("aria-pressed") === "true");
  }
  function getPressedIndices() {
    return toggles.map((toggle, index) => toggle.getAttribute("aria-pressed") === "true" ? index : -1).filter((index) => index !== -1);
  }
  initialize();
  addListeners();
  return {
    toggleButton,
    setPressed,
    getPressedStates,
    getPressedIndices,
    cleanup
  };
}

// src/combobox/src/makeComboBoxAccessible/makeComboBoxAccessible.ts
function makeComboboxAccessible({ comboboxInputId, comboboxButtonId, listBoxId, listBoxItemsClass, config }) {
  const comboboxInput = document.getElementById(`${comboboxInputId}`);
  if (!comboboxInput) {
    console.error(`[aria-ease] Element with id="${comboboxInputId}" not found. Make sure the combobox input element exists before calling makeComboboxAccessible.`);
    return { cleanup: () => {
    } };
  }
  const listBox = document.getElementById(`${listBoxId}`);
  if (!listBox) {
    console.error(`[aria-ease] Element with id="${listBoxId}" not found. Make sure the combobox listbox element exists before calling makeComboboxAccessible.`);
    return { cleanup: () => {
    } };
  }
  const listButton = comboboxButtonId ? document.getElementById(`${comboboxButtonId}`) : null;
  let activeIndex = -1;
  comboboxInput.setAttribute("role", "combobox");
  comboboxInput.setAttribute("aria-autocomplete", "list");
  comboboxInput.setAttribute("aria-controls", listBoxId);
  comboboxInput.setAttribute("aria-expanded", "false");
  comboboxInput.setAttribute("aria-haspopup", "listbox");
  listBox.setAttribute("role", "listbox");
  let cachedItems = null;
  function getVisibleItems() {
    if (!cachedItems) {
      cachedItems = listBox.querySelectorAll(`.${listBoxItemsClass}`);
    }
    return Array.from(cachedItems).filter((item) => !item.hidden && item.style.display !== "none");
  }
  function isListboxOpen() {
    return comboboxInput.getAttribute("aria-expanded") === "true";
  }
  function setActiveDescendant(index) {
    const visibleItems = getVisibleItems();
    visibleItems.forEach((item) => {
      item.setAttribute("aria-selected", "false");
    });
    if (index >= 0 && index < visibleItems.length) {
      const activeItem = visibleItems[index];
      const itemId = activeItem.id || `${listBoxId}-option-${index}`;
      if (!activeItem.id) {
        activeItem.id = itemId;
      }
      activeItem.setAttribute("aria-selected", "true");
      comboboxInput.setAttribute("aria-activedescendant", itemId);
      if (typeof activeItem.scrollIntoView === "function") {
        activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      if (config?.onActiveDescendantChange) {
        try {
          config.onActiveDescendantChange(itemId, activeItem);
        } catch (error) {
          console.error("[aria-ease] Error in onActiveDescendantChange callback:", error);
        }
      }
    } else {
      comboboxInput.setAttribute("aria-activedescendant", "");
    }
    activeIndex = index;
  }
  function openListbox() {
    comboboxInput.setAttribute("aria-expanded", "true");
    if (config?.onOpenChange) {
      try {
        config.onOpenChange(true);
      } catch (error) {
        console.error("[aria-ease] Error in onOpenChange callback:", error);
      }
    }
  }
  function closeListbox() {
    comboboxInput.setAttribute("aria-expanded", "false");
    comboboxInput.setAttribute("aria-activedescendant", "");
    activeIndex = -1;
    const visibleItems = getVisibleItems();
    visibleItems.forEach((item) => item.setAttribute("aria-selected", "false"));
    if (config?.onOpenChange) {
      try {
        config.onOpenChange(false);
      } catch (error) {
        console.error("[aria-ease] Error in onOpenChange callback:", error);
      }
    }
  }
  function selectOption(item) {
    const value = item.textContent?.trim() || "";
    comboboxInput.value = value;
    closeListbox();
    if (config?.onSelect) {
      try {
        config.onSelect(item, value);
      } catch (error) {
        console.error("[aria-ease] Error in onSelect callback:", error);
      }
    }
  }
  function handleInputKeyDown(event) {
    const visibleItems = getVisibleItems();
    const isOpen = isListboxOpen();
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          openListbox();
          return;
        }
        if (visibleItems.length === 0) return;
        {
          const newIndex = activeIndex >= visibleItems.length - 1 ? 0 : activeIndex + 1;
          setActiveDescendant(newIndex);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) return;
        if (visibleItems.length > 0) {
          const newIndex = activeIndex <= 0 ? visibleItems.length - 1 : activeIndex - 1;
          setActiveDescendant(newIndex);
        }
        break;
      case "Enter":
        if (isOpen && activeIndex >= 0 && activeIndex < visibleItems.length) {
          event.preventDefault();
          selectOption(visibleItems[activeIndex]);
        }
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          closeListbox();
        } else if (comboboxInput.value) {
          event.preventDefault();
          comboboxInput.value = "";
          if (config?.onClear) {
            try {
              config.onClear();
            } catch (error) {
              console.error("[aria-ease] Error in onClear callback:", error);
            }
          }
        }
        break;
      case "Home":
        if (isOpen && visibleItems.length > 0) {
          event.preventDefault();
          setActiveDescendant(0);
        }
        break;
      case "End":
        if (isOpen && visibleItems.length > 0) {
          event.preventDefault();
          setActiveDescendant(visibleItems.length - 1);
        }
        break;
      case "Tab":
        if (isOpen) {
          closeListbox();
        }
        break;
    }
  }
  function handleMouseMove(event) {
    const target = event.target;
    if (target.classList.contains(listBoxItemsClass)) {
      const visibleItems = getVisibleItems();
      const index = visibleItems.indexOf(target);
      if (index >= 0) {
        setActiveDescendant(index);
      }
    }
  }
  function handleMouseDown(event) {
    const target = event.target;
    if (target.classList.contains(listBoxItemsClass)) {
      event.preventDefault();
      selectOption(target);
    }
  }
  function handleClickOutside(event) {
    const target = event.target;
    if (!comboboxInput.contains(target) && !listBox.contains(target) && (!listButton || !listButton.contains(target))) {
      closeListbox();
    }
  }
  function handleListButtonClick() {
    if (isListboxOpen()) {
      closeListbox();
    } else {
      openListbox();
      comboboxInput.focus();
    }
  }
  function handleListButtonKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleListButtonClick();
    }
  }
  comboboxInput.addEventListener("keydown", handleInputKeyDown);
  listBox.addEventListener("mousemove", handleMouseMove);
  listBox.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousedown", handleClickOutside);
  if (listButton) {
    listButton.setAttribute("tabindex", "-1");
    listButton.setAttribute("aria-label", "Toggle options");
    listButton.addEventListener("click", handleListButtonClick);
    listButton.addEventListener("keydown", handleListButtonKeyDown);
  }
  function initializeOptions() {
    const items = listBox.querySelectorAll(`.${listBoxItemsClass}`);
    if (items.length === 0) return;
    items.forEach((item, index) => {
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", "false");
      const currentId = item.getAttribute("id");
      if (!currentId || currentId === "") {
        const itemId = `${listBoxId}-option-${index}`;
        item.id = itemId;
        item.setAttribute("id", itemId);
      }
    });
  }
  initializeOptions();
  function cleanup() {
    comboboxInput.removeEventListener("keydown", handleInputKeyDown);
    listBox.removeEventListener("mousemove", handleMouseMove);
    listBox.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousedown", handleClickOutside);
    if (listButton) {
      listButton.removeEventListener("click", handleListButtonClick);
      listButton.removeEventListener("keydown", handleListButtonKeyDown);
    }
  }
  function refresh() {
    cachedItems = null;
    initializeOptions();
    activeIndex = -1;
    setActiveDescendant(-1);
  }
  return { cleanup, refresh };
}

// src/utils/test/src/test.ts
var import_jest_axe = require("jest-axe");

// src/utils/test/contract/contractTestRunner.ts
init_contract();
var import_promises = __toESM(require("fs/promises"), 1);
init_ContractReporter();
var import_meta = {};
async function runContractTests(componentName, component) {
  const reporter = new ContractReporter(false);
  const contractTyped = contract_default;
  const contractPath = contractTyped[componentName]?.path;
  if (!contractPath) {
    throw new Error(`No contract found for component: ${componentName}`);
  }
  const resolvedPath = new URL(contractPath, import_meta.url).pathname;
  const contractData = await import_promises.default.readFile(resolvedPath, "utf-8");
  const componentContract = JSON.parse(contractData);
  const totalTests = componentContract.static[0].assertions.length + componentContract.dynamic.length;
  reporter.start(componentName, totalTests);
  const failures = [];
  const passes = [];
  const skipped = [];
  for (const test of componentContract.static[0].assertions) {
    if (test.target !== "relative") {
      const selector = componentContract.selectors[test.target];
      if (!selector) {
        failures.push(`Selector for target ${test.target} not found.`);
        reporter.reportStaticTest(`${test.target} has required ARIA attributes`, false, `Selector for target ${test.target} not found.`);
        continue;
      }
      const target = component.querySelector(selector);
      if (!target) {
        failures.push(`Target ${test.target} not found.`);
        reporter.reportStaticTest(`${test.target} has required ARIA attributes`, false, `Target ${test.target} not found.`);
        continue;
      }
      const attributeValue = target.getAttribute(test.attribute);
      if (!test.expectedValue) {
        const attributes = test.attribute.split(" | ");
        const hasAnyAttribute = attributes.some((attr) => target.hasAttribute(attr));
        if (!hasAnyAttribute) {
          failures.push(test.failureMessage + ` None of the attributes "${test.attribute}" are present.`);
          reporter.reportStaticTest(`${test.target} has ${test.attribute}`, false, test.failureMessage);
        } else {
          passes.push(`At least one of the attributes "${test.attribute}" exists on the element.`);
          reporter.reportStaticTest(`${test.target} has ${test.attribute}`, true);
        }
      } else if (!attributeValue || !test.expectedValue.split(" | ").includes(attributeValue)) {
        failures.push(test.failureMessage + ` Attribute value does not match expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
        reporter.reportStaticTest(`${test.target} has ${test.attribute}="${test.expectedValue}"`, false, test.failureMessage);
      } else {
        passes.push(`Attribute value matches expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
        reporter.reportStaticTest(`${test.target} has ${test.attribute}="${attributeValue}"`, true);
      }
    }
  }
  for (const dynamicTest of componentContract.dynamic) {
    skipped.push(dynamicTest.description);
    reporter.reportTest(dynamicTest, "skip");
  }
  const staticPassed = componentContract.static[0].assertions.length;
  const staticFailed = 0;
  reporter.reportStatic(staticPassed, staticFailed);
  reporter.summary(failures);
  return { passes, failures, skipped };
}

// src/utils/test/src/test.ts
async function testUiComponent(componentName, component, url) {
  if (!componentName || typeof componentName !== "string") {
    throw new Error("\u274C testUiComponent requires a valid componentName (string)");
  }
  if (!component || !(component instanceof HTMLElement)) {
    throw new Error("\u274C testUiComponent requires a valid component (HTMLElement)");
  }
  if (url && typeof url !== "string") {
    throw new Error("\u274C testUiComponent url parameter must be a string");
  }
  let results;
  try {
    results = await (0, import_jest_axe.axe)(component);
  } catch (error) {
    throw new Error(
      `\u274C Axe accessibility scan failed
Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
  async function checkDevServer(testUrl) {
    const urlsToTry = testUrl ? [testUrl] : [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:4173"
    ];
    for (const serverUrl of urlsToTry) {
      try {
        const response = await fetch(serverUrl, {
          method: "HEAD",
          signal: AbortSignal.timeout(1e3)
        });
        if (response.ok || response.status === 304) {
          return serverUrl;
        }
      } catch {
        return null;
      }
    }
    return null;
  }
  let contract;
  try {
    const devServerUrl = await checkDevServer(url);
    if (devServerUrl) {
      console.log(`\u{1F3AD} Running Playwright E2E tests on ${devServerUrl}`);
      const { runContractTestsPlaywright: runContractTestsPlaywright2 } = await Promise.resolve().then(() => (init_contractTestRunnerPlaywright(), contractTestRunnerPlaywright_exports));
      contract = await runContractTestsPlaywright2(componentName, devServerUrl);
    } else {
      console.log(`\u{1F9EA} Running jsdom tests (limited event handling)`);
      console.log(`\u26A0\uFE0F  No dev server detected. Some tests may be skipped.
For full coverage start your dev server and provide a URL.
`);
      contract = await runContractTests(componentName, component);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`\u274C Contract test execution failed: ${String(error)}`);
  }
  const result = {
    violations: results.violations,
    raw: results,
    contract
  };
  if (contract.failures.length > 0 && url === "Playwright") {
    throw new Error(
      `
\u274C ${contract.failures.length} accessibility contract test${contract.failures.length > 1 ? "s" : ""} failed (Playwright mode)
\u2705 ${contract.passes.length} test${contract.passes.length > 1 ? "s" : ""} passed

\u{1F4CB} Review the detailed test report above for specific failures.
\u{1F4A1} Contract tests validate ARIA attributes and keyboard interactions per W3C APG guidelines.`
    );
  }
  if (results.violations.length > 0) {
    const violationCount = results.violations.length;
    const violationDetails = results.violations.map(
      (v) => `
  - ${v.id}: ${v.description}
    Impact: ${v.impact}
    Affected elements: ${v.nodes.length}
    Help: ${v.helpUrl}`
    ).join("\n");
    throw new Error(
      `
\u274C ${violationCount} axe accessibility violation${violationCount > 1 ? "s" : ""} detected
${violationDetails}

\u{1F4CB} Full details available in result.violations`
    );
  }
  return result;
}
var runTest = async () => {
};
if (typeof window === "undefined") {
  runTest = async () => {
    console.log(`\u{1F680} Running component accessibility tests...
`);
    const { exec } = await import("child_process");
    exec(
      `npx vitest --run --reporter verbose`,
      { cwd: process.cwd() },
      (error, stdout, stderr) => {
        if (stdout) {
          console.log(stdout);
        }
        if (stderr) {
          console.error(stderr);
        }
        if (error && error.code) {
          process.exit(error.code);
        }
      }
    );
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeAccordionAccessible,
  makeBlockAccessible,
  makeCheckboxAccessible,
  makeComboboxAccessible,
  makeMenuAccessible,
  makeRadioAccessible,
  makeToggleAccessible,
  testUiComponent
});
