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

// src/utils/test/src/ContractReporter.ts
var ContractReporter;
var init_ContractReporter = __esm({
  "src/utils/test/src/ContractReporter.ts"() {
    "use strict";
    ContractReporter = class {
      startTime = 0;
      componentName = "";
      staticPasses = 0;
      staticFailures = 0;
      staticWarnings = 0;
      dynamicResults = [];
      totalTests = 0;
      skipped = 0;
      warnings = 0;
      isPlaywright = false;
      isCustomContract = false;
      apgUrl = "https://www.w3.org/WAI/ARIA/apg/";
      hasPrintedStaticSection = false;
      hasPrintedDynamicSection = false;
      constructor(isPlaywright = false, isCustomContract = false) {
        this.isPlaywright = isPlaywright;
        this.isCustomContract = isCustomContract;
      }
      log(message) {
        process.stderr.write(message + "\n");
      }
      start(componentName, totalTests, apgUrl) {
        this.startTime = Date.now();
        this.componentName = componentName;
        this.totalTests = totalTests;
        this.hasPrintedStaticSection = false;
        this.hasPrintedDynamicSection = false;
        if (apgUrl) {
          this.apgUrl = apgUrl;
        }
        const mode = this.isPlaywright ? "Playwright (Real Browser)" : "jsdom (Fast)";
        this.log(`
${"\u2550".repeat(60)}`);
        this.log(`\u{1F50D} Testing ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} Component - ${mode}`);
        this.log(`${"\u2550".repeat(60)}
`);
      }
      reportStatic(passes, failures, warnings = 0) {
        this.staticPasses = passes;
        this.staticFailures = failures;
        this.staticWarnings = warnings;
      }
      /**
       * Report individual static test pass
       */
      reportStaticTest(description, status, failureMessage, level) {
        if (!this.hasPrintedStaticSection) {
          this.log(`${"\u2500".repeat(60)}`);
          this.log(`\u{1F9EA} Static Assertions`);
          this.log(`${"\u2500".repeat(60)}`);
          this.hasPrintedStaticSection = true;
        }
        const icon = status === "pass" ? "\u2713" : status === "warn" ? "\u26A0" : status === "skip" ? "\u25CB" : "\u2717";
        this.log(`  ${icon} ${description}`);
        if (level) {
          this.log(`     \u21B3 level=${level}`);
        }
        if ((status === "fail" || status === "warn" || status === "skip") && failureMessage) {
          this.log(`     \u21B3 ${failureMessage}`);
        }
      }
      /**
       * Report individual dynamic test result
       */
      reportTest(test, status, failureMessage) {
        if (!this.hasPrintedDynamicSection) {
          this.log("");
          this.log(`${"\u2500".repeat(60)}`);
          this.log(`\u2328\uFE0F Dynamic Interaction Tests`);
          this.log(`${"\u2500".repeat(60)}`);
          this.hasPrintedDynamicSection = true;
        }
        const result = {
          description: test.description,
          status,
          failureMessage,
          level: test.level
        };
        if (status === "skip") {
          result.skipReason = "Requires real browser (addEventListener events)";
        }
        this.dynamicResults.push(result);
        const icons = { pass: "\u2713", fail: "\u2717", warn: "\u26A0", skip: "\u25CB" };
        const levelPrefix = test.level ? `[${test.level.toUpperCase()}] ` : "";
        this.log(`  ${icons[status]} ${levelPrefix}${test.description}`);
        if (status === "skip" && !this.isPlaywright) {
          this.log(`     \u21B3 Skipped in jsdom (runs in Playwright)`);
        }
        if (status === "fail" && failureMessage) {
          this.log(`     \u21B3 ${failureMessage}`);
        }
        if (status === "warn" && failureMessage) {
          this.log(`     \u21B3 ${failureMessage}`);
        }
        if (status === "skip" && failureMessage) {
          this.log(`     \u21B3 ${failureMessage}`);
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
      reportWarnings() {
        const warnings = this.dynamicResults.filter((r) => r.status === "warn");
        if (warnings.length === 0 && this.staticWarnings === 0) return;
        this.log(`
${"\u2500".repeat(60)}`);
        this.log(`\u26A0\uFE0F Warnings (${this.staticWarnings + warnings.length}):
`);
        this.log(`These checks are failing but treated as warnings under the active strictness mode.
`);
        warnings.forEach((test, index) => {
          this.log(`${index + 1}. ${test.description}`);
          if (test.failureMessage) {
            this.log(`   \u21B3 ${test.failureMessage}`);
          }
          if (test.level) {
            this.log(`   \u21B3 level=${test.level}`);
          }
        });
        if (this.apgUrl) {
          this.log(`
Reference: ${this.apgUrl}
`);
        }
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
        this.log(`   testUiComponent('${this.componentName}', null, 'http://localhost:5173/test-harness?component=component_name')
`);
      }
      /**
       * Generate final summary with statistics
       */
      summary(failures) {
        const duration = Date.now() - this.startTime;
        const dynamicPasses = this.dynamicResults.filter((r) => r.status === "pass").length;
        const dynamicFailures = this.dynamicResults.filter((r) => r.status === "fail").length;
        const dynamicWarnings = this.dynamicResults.filter((r) => r.status === "warn").length;
        this.skipped = this.dynamicResults.filter((r) => r.status === "skip").length;
        this.warnings = this.staticWarnings + dynamicWarnings;
        const totalPasses = this.staticPasses + dynamicPasses;
        const totalFailures = this.staticFailures + dynamicFailures;
        const totalRun = totalPasses + totalFailures + this.warnings;
        const getComponentMessage = () => {
          const componentDisplayName = `${this.componentName.charAt(0).toUpperCase()}${this.componentName.slice(1)}`;
          if (this.isCustomContract) {
            return `${componentDisplayName} component validates against your custom accessibility policy \u2713`;
          }
          return `${componentDisplayName} component meets Aria-Ease baseline WAI-ARIA expectations \u2713`;
        };
        if (failures.length > 0) {
          this.reportFailures(failures);
        }
        this.reportWarnings();
        this.reportSkipped();
        this.log(`
${"\u2550".repeat(60)}`);
        this.log(`\u{1F4CA} Summary
`);
        if (totalFailures === 0 && this.skipped === 0 && this.warnings === 0) {
          this.log(`\u2705 All ${totalRun} tests passed!`);
          this.log(`   ${getComponentMessage()}`);
        } else if (totalFailures === 0) {
          this.log(`\u2705 ${totalPasses}/${totalRun} tests passed`);
          if (this.skipped > 0) {
            this.log(`\u25CB  ${this.skipped} tests skipped`);
          }
          if (this.warnings > 0) {
            this.log(`\u26A0\uFE0F ${this.warnings} warning${this.warnings > 1 ? "s" : ""}`);
          }
          this.log(`   ${getComponentMessage()}`);
        } else {
          this.log(`\u274C ${totalFailures} test${totalFailures > 1 ? "s" : ""} failed`);
          this.log(`\u2705 ${totalPasses} test${totalPasses > 1 ? "s" : ""} passed`);
          if (this.warnings > 0) {
            this.log(`\u26A0\uFE0F ${this.warnings} warning${this.warnings > 1 ? "s" : ""}`);
          }
          if (this.skipped > 0) {
            this.log(`\u25CB  ${this.skipped} test${this.skipped > 1 ? "s" : ""} skipped`);
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

// src/utils/test/src/strictness.ts
function normalizeLevel(level) {
  if (level === "required" || level === "recommended" || level === "optional") {
    return level;
  }
  return FALLBACK_LEVEL;
}
function normalizeStrictness(strictness) {
  if (strictness === "minimal" || strictness === "balanced" || strictness === "strict" || strictness === "paranoid") {
    return strictness;
  }
  return "balanced";
}
function resolveEnforcement(level, strictness) {
  const matrix = {
    minimal: {
      required: "error",
      recommended: "ignore",
      optional: "ignore"
    },
    balanced: {
      required: "error",
      recommended: "warning",
      optional: "ignore"
    },
    strict: {
      required: "error",
      recommended: "error",
      optional: "warning"
    },
    paranoid: {
      required: "error",
      recommended: "error",
      optional: "error"
    }
  };
  return matrix[strictness][level];
}
var FALLBACK_LEVEL;
var init_strictness = __esm({
  "src/utils/test/src/strictness.ts"() {
    "use strict";
    FALLBACK_LEVEL = "required";
  }
});

// src/utils/test/src/playwrightTestHarness.ts
async function getOrCreateBrowser() {
  if (!sharedBrowser) {
    sharedBrowser = await import_playwright.chromium.launch({
      headless: true,
      // Launch with clean browser profile - no extensions, no user data
      args: [
        "--disable-extensions",
        "--disable-blink-features=AutomationControlled"
      ]
    });
  }
  return sharedBrowser;
}
async function getOrCreateContext() {
  if (!sharedContext) {
    const browser = await getOrCreateBrowser();
    sharedContext = await browser.newContext({
      permissions: [],
      ignoreHTTPSErrors: true
    });
  }
  return sharedContext;
}
async function createTestPage() {
  const context = await getOrCreateContext();
  return await context.newPage();
}
async function closeSharedBrowser() {
  if (sharedContext) {
    await sharedContext.close();
    sharedContext = null;
  }
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
}
var import_playwright, sharedBrowser, sharedContext;
var init_playwrightTestHarness = __esm({
  "src/utils/test/src/playwrightTestHarness.ts"() {
    "use strict";
    import_playwright = require("playwright");
    sharedBrowser = null;
    sharedContext = null;
  }
});

// src/utils/cli/configLoader.ts
var configLoader_exports = {};
__export(configLoader_exports, {
  loadConfig: () => loadConfig
});
function validateConfig(config) {
  const errors = [];
  if (!config || typeof config !== "object") {
    errors.push("Config must be an object");
    return { valid: false, errors };
  }
  const cfg = config;
  if (cfg.audit !== void 0) {
    if (typeof cfg.audit !== "object" || cfg.audit === null) {
      errors.push("audit must be an object");
    } else {
      if (cfg.audit.urls !== void 0) {
        if (!Array.isArray(cfg.audit.urls)) {
          errors.push("audit.urls must be an array");
        } else if (cfg.audit.urls.some((url) => typeof url !== "string")) {
          errors.push("audit.urls must contain only strings");
        }
      }
      if (cfg.audit.output !== void 0) {
        if (typeof cfg.audit.output !== "object") {
          errors.push("audit.output must be an object");
        } else {
          const output = cfg.audit.output;
          if (output.format !== void 0) {
            if (!["json", "csv", "html", "all"].includes(output.format)) {
              errors.push("audit.output.format must be one of: json, csv, html, all");
            }
          }
          if (output.out !== void 0 && typeof output.out !== "string") {
            errors.push("audit.output.out must be a string");
          }
        }
      }
    }
  }
  if (cfg.test !== void 0) {
    if (typeof cfg.test !== "object" || cfg.test === null) {
      errors.push("test must be an object");
    } else {
      if (cfg.test.disableTimeouts !== void 0 && typeof cfg.test.disableTimeouts !== "boolean") {
        errors.push("test.disableTimeouts must be a boolean when provided");
      }
      const testTimeoutFields = [
        "actionTimeoutMs",
        "assertionTimeoutMs",
        "navigationTimeoutMs",
        "componentReadyTimeoutMs"
      ];
      for (const field of testTimeoutFields) {
        const value = cfg.test[field];
        if (value !== void 0) {
          if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
            errors.push(`test.${field} must be a non-negative number when provided`);
          }
        }
      }
      if (cfg.test.components !== void 0) {
        if (!Array.isArray(cfg.test.components)) {
          errors.push("test.components must be an array");
        } else {
          cfg.test.components.forEach((comp, idx) => {
            if (typeof comp !== "object" || comp === null) {
              errors.push(`test.components[${idx}] must be an object`);
            } else {
              if (typeof comp.name !== "string") {
                errors.push(`test.components[${idx}].name must be a string`);
              }
              if (comp.contractPath !== void 0 && typeof comp.contractPath !== "string") {
                errors.push(`test.components[${idx}].contractPath must be a string when provided`);
              }
              if (comp.strategyPath !== void 0 && typeof comp.strategyPath !== "string") {
                errors.push(`test.components[${idx}].strategyPath must be a string when provided`);
              }
              if (comp.strictness !== void 0 && !["minimal", "balanced", "strict", "paranoid"].includes(comp.strictness)) {
                errors.push(`test.components[${idx}].strictness must be one of: minimal, balanced, strict, paranoid`);
              }
              if (comp.disableTimeouts !== void 0 && typeof comp.disableTimeouts !== "boolean") {
                errors.push(`test.components[${idx}].disableTimeouts must be a boolean when provided`);
              }
              const componentTimeoutFields = [
                "actionTimeoutMs",
                "assertionTimeoutMs",
                "navigationTimeoutMs",
                "componentReadyTimeoutMs"
              ];
              for (const field of componentTimeoutFields) {
                const value = comp[field];
                if (value !== void 0) {
                  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
                    errors.push(`test.components[${idx}].${field} must be a non-negative number when provided`);
                  }
                }
              }
            }
          });
        }
      }
      if (cfg.test.strictness !== void 0) {
        if (!["minimal", "balanced", "strict", "paranoid"].includes(cfg.test.strictness)) {
          errors.push("test.strictness must be one of: minimal, balanced, strict, paranoid");
        }
      }
    }
  }
  if (cfg.contracts !== void 0) {
    if (!Array.isArray(cfg.contracts)) {
      errors.push("contracts must be an array");
    } else {
      cfg.contracts.forEach((contract, idx) => {
        if (typeof contract !== "object" || contract === null) {
          errors.push(`contracts[${idx}] must be an object`);
        } else {
          if (typeof contract.src !== "string") {
            errors.push(`contracts[${idx}].src is required and must be a string`);
          }
          if (contract.out !== void 0 && typeof contract.out !== "string") {
            errors.push(`contracts[${idx}].out must be a string`);
          }
        }
      });
    }
  }
  return { valid: errors.length === 0, errors };
}
async function loadConfigFile(filePath) {
  try {
    const ext = import_path.default.extname(filePath);
    if (ext === ".json") {
      const content = await import_fs_extra.default.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } else if ([".js", ".mjs", ".cjs", ".ts"].includes(ext)) {
      const imported = await import(filePath);
      return imported.default || imported;
    }
    return null;
  } catch {
    return null;
  }
}
async function loadConfig(cwd = process.cwd()) {
  const configNames = [
    "ariaease.config.js",
    "ariaease.config.mjs",
    "ariaease.config.cjs",
    "ariaease.config.json",
    "ariaease.config.ts"
  ];
  let loadedConfig = null;
  let foundPath = null;
  const errors = [];
  for (const name of configNames) {
    const configPath = import_path.default.resolve(cwd, name);
    if (await import_fs_extra.default.pathExists(configPath)) {
      foundPath = configPath;
      loadedConfig = await loadConfigFile(configPath);
      if (loadedConfig === null) {
        errors.push(`Found config at ${name} but failed to load it. Check for syntax errors.`);
        continue;
      }
      const validation = validateConfig(loadedConfig);
      if (!validation.valid) {
        errors.push(`Config validation failed in ${name}:`);
        errors.push(...validation.errors.map((err) => `  - ${err}`));
        loadedConfig = null;
        continue;
      }
      break;
    }
  }
  return {
    config: loadedConfig || {},
    configPath: loadedConfig ? foundPath : null,
    errors
  };
}
var import_path, import_fs_extra;
var init_configLoader = __esm({
  "src/utils/cli/configLoader.ts"() {
    "use strict";
    import_path = __toESM(require("path"), 1);
    import_fs_extra = __toESM(require("fs-extra"), 1);
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

// src/utils/test/src/component-strategies/MenuComponentStrategy.ts
var MenuComponentStrategy_exports = {};
__export(MenuComponentStrategy_exports, {
  MenuComponentStrategy: () => MenuComponentStrategy
});
var MenuComponentStrategy;
var init_MenuComponentStrategy = __esm({
  "src/utils/test/src/component-strategies/MenuComponentStrategy.ts"() {
    "use strict";
    init_test();
    MenuComponentStrategy = class {
      constructor(mainSelector, selectors, actionTimeoutMs = 400, assertionTimeoutMs = 400) {
        this.mainSelector = mainSelector;
        this.selectors = selectors;
        this.actionTimeoutMs = actionTimeoutMs;
        this.assertionTimeoutMs = assertionTimeoutMs;
      }
      async resetState(page) {
        if (!this.selectors.popup) return;
        const popupSelector = this.selectors.popup;
        const popupElement = page.locator(popupSelector).first();
        const isPopupVisible = await popupElement.isVisible().catch(() => false);
        if (!isPopupVisible) return;
        let menuClosed = false;
        let closeSelector = this.selectors.input;
        if (!closeSelector && this.selectors.focusable) {
          closeSelector = this.selectors.focusable;
        } else if (!closeSelector) {
          closeSelector = this.selectors.main;
        }
        if (closeSelector) {
          const closeElement = page.locator(closeSelector).first();
          await closeElement.focus();
          await page.keyboard.press("Escape");
          menuClosed = await (0, test_exports.expect)(popupElement).toBeHidden({ timeout: this.assertionTimeoutMs }).then(() => true).catch(() => false);
        }
        if (!menuClosed && this.selectors.main) {
          const triggerElement = page.locator(this.selectors.main).first();
          await triggerElement.click({ timeout: this.actionTimeoutMs });
          menuClosed = await (0, test_exports.expect)(popupElement).toBeHidden({ timeout: this.assertionTimeoutMs }).then(() => true).catch(() => false);
        }
        if (!menuClosed) {
          await page.mouse.click(10, 10);
          menuClosed = await (0, test_exports.expect)(popupElement).toBeHidden({ timeout: this.assertionTimeoutMs }).then(() => true).catch(() => false);
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
        if (this.selectors.input) {
          await page.locator(this.selectors.input).first().clear();
        }
        if (this.selectors.main) {
          const triggerElement = page.locator(this.selectors.main).first();
          await triggerElement.focus();
        }
      }
      async shouldSkipTest(test, page) {
        const requiresSubmenu = test.action.some(
          (act) => act.target === "submenu" || act.target === "submenuTrigger" || act.target === "submenuItems"
        ) || test.assertions.some(
          (assertion) => assertion.target === "submenu" || assertion.target === "submenuTrigger" || assertion.target === "submenuItems"
        );
        if (!requiresSubmenu) {
          return false;
        }
        const submenuTriggerSelector = this.selectors.submenuTrigger;
        if (!submenuTriggerSelector) {
          return true;
        }
        const submenuTriggerCount = await page.locator(submenuTriggerSelector).count();
        return submenuTriggerCount === 0;
      }
      getMainSelector() {
        return this.mainSelector;
      }
    };
  }
});

// src/utils/test/src/component-strategies/AccordionComponentStrategy.ts
var AccordionComponentStrategy_exports = {};
__export(AccordionComponentStrategy_exports, {
  AccordionComponentStrategy: () => AccordionComponentStrategy
});
var AccordionComponentStrategy;
var init_AccordionComponentStrategy = __esm({
  "src/utils/test/src/component-strategies/AccordionComponentStrategy.ts"() {
    "use strict";
    init_test();
    AccordionComponentStrategy = class {
      constructor(mainSelector, selectors, actionTimeoutMs = 400, assertionTimeoutMs = 400) {
        this.mainSelector = mainSelector;
        this.selectors = selectors;
        this.actionTimeoutMs = actionTimeoutMs;
        this.assertionTimeoutMs = assertionTimeoutMs;
      }
      async resetState(page) {
        if (!this.selectors.panel || !this.selectors.trigger || this.selectors.popup) {
          return;
        }
        const triggerSelector = this.selectors.trigger;
        const panelSelector = this.selectors.panel;
        if (!triggerSelector || !panelSelector) return;
        const allTriggers = await page.locator(triggerSelector).all();
        for (const trigger of allTriggers) {
          const isExpanded = await trigger.getAttribute("aria-expanded") === "true";
          const triggerPanel = await trigger.getAttribute("aria-controls");
          if (isExpanded && triggerPanel) {
            await trigger.click({ timeout: this.actionTimeoutMs });
            const panel = page.locator(`#${triggerPanel}`);
            await (0, test_exports.expect)(panel).toBeHidden({ timeout: this.assertionTimeoutMs }).catch(() => {
            });
          }
        }
      }
      async shouldSkipTest() {
        return false;
      }
      getMainSelector() {
        return this.mainSelector;
      }
    };
  }
});

// src/utils/test/src/component-strategies/ComboboxComponentStrategy.ts
var ComboboxComponentStrategy_exports = {};
__export(ComboboxComponentStrategy_exports, {
  ComboboxComponentStrategy: () => ComboboxComponentStrategy
});
var ComboboxComponentStrategy;
var init_ComboboxComponentStrategy = __esm({
  "src/utils/test/src/component-strategies/ComboboxComponentStrategy.ts"() {
    "use strict";
    init_test();
    ComboboxComponentStrategy = class {
      constructor(mainSelector, selectors, actionTimeoutMs = 400, assertionTimeoutMs = 400) {
        this.mainSelector = mainSelector;
        this.selectors = selectors;
        this.actionTimeoutMs = actionTimeoutMs;
        this.assertionTimeoutMs = assertionTimeoutMs;
      }
      async resetState(page) {
        if (!this.selectors.popup) return;
        const popupSelector = this.selectors.popup;
        const popupElement = page.locator(popupSelector).first();
        const isPopupVisible = await popupElement.isVisible().catch(() => false);
        if (!isPopupVisible) return;
        let popupClosed = false;
        let closeSelector = this.selectors.input;
        if (!closeSelector && this.selectors.focusable) {
          closeSelector = this.selectors.focusable;
        } else if (!closeSelector) {
          closeSelector = this.selectors.button;
        }
        if (closeSelector) {
          const closeElement = page.locator(closeSelector).first();
          await closeElement.focus();
          await page.keyboard.press("Escape");
          popupClosed = await (0, test_exports.expect)(popupElement).toBeHidden({ timeout: this.assertionTimeoutMs }).then(() => true).catch(() => false);
        }
        if (!popupClosed && this.selectors.button) {
          const buttonElement = page.locator(this.selectors.button).first();
          await buttonElement.click({ timeout: this.actionTimeoutMs });
          popupClosed = await (0, test_exports.expect)(popupElement).toBeHidden({ timeout: this.assertionTimeoutMs }).then(() => true).catch(() => false);
        }
        if (!popupClosed) {
          await page.mouse.click(10, 10);
          popupClosed = await (0, test_exports.expect)(popupElement).toBeHidden({ timeout: this.assertionTimeoutMs }).then(() => true).catch(() => false);
        }
        if (!popupClosed) {
          throw new Error(
            `\u274C FATAL: Cannot close combobox popup between tests. Popup remains visible after trying:
  1. Escape key
  2. Clicking button
  3. Clicking outside
This indicates a problem with the combobox component's close functionality.`
          );
        }
        if (this.selectors.input) {
          await page.locator(this.selectors.input).first().clear();
        }
      }
      async shouldSkipTest() {
        return false;
      }
      getMainSelector() {
        return this.mainSelector;
      }
    };
  }
});

// src/utils/test/src/component-strategies/TabsComponentStrategy.ts
var TabsComponentStrategy_exports = {};
__export(TabsComponentStrategy_exports, {
  TabsComponentStrategy: () => TabsComponentStrategy
});
var TabsComponentStrategy;
var init_TabsComponentStrategy = __esm({
  "src/utils/test/src/component-strategies/TabsComponentStrategy.ts"() {
    "use strict";
    TabsComponentStrategy = class {
      constructor(mainSelector, selectors) {
        this.mainSelector = mainSelector;
        this.selectors = selectors;
      }
      async resetState() {
      }
      async shouldSkipTest(test, page) {
        if (test.isVertical !== void 0 && this.selectors.tablist) {
          const tablistSelector = this.selectors.tablist;
          const tablist = page.locator(tablistSelector).first();
          const orientation = await tablist.getAttribute("aria-orientation");
          const isVertical = orientation === "vertical";
          if (test.isVertical !== isVertical) {
            return true;
          }
        }
        return false;
      }
      getMainSelector() {
        return this.mainSelector;
      }
    };
  }
});

// src/utils/test/src/StrategyRegistry.ts
var import_path2, import_url, StrategyRegistry;
var init_StrategyRegistry = __esm({
  "src/utils/test/src/StrategyRegistry.ts"() {
    "use strict";
    import_path2 = __toESM(require("path"), 1);
    import_url = require("url");
    StrategyRegistry = class {
      builtInStrategies = /* @__PURE__ */ new Map();
      constructor() {
        this.registerBuiltInStrategies();
      }
      /**
       * Register built-in strategies
       */
      registerBuiltInStrategies() {
        this.builtInStrategies.set(
          "menu",
          () => Promise.resolve().then(() => (init_MenuComponentStrategy(), MenuComponentStrategy_exports)).then(
            (m) => m.MenuComponentStrategy
          )
        );
        this.builtInStrategies.set(
          "accordion",
          () => Promise.resolve().then(() => (init_AccordionComponentStrategy(), AccordionComponentStrategy_exports)).then(
            (m) => m.AccordionComponentStrategy
          )
        );
        this.builtInStrategies.set(
          "combobox",
          () => Promise.resolve().then(() => (init_ComboboxComponentStrategy(), ComboboxComponentStrategy_exports)).then(
            (m) => m.ComboboxComponentStrategy
          )
        );
        this.builtInStrategies.set(
          "tabs",
          () => Promise.resolve().then(() => (init_TabsComponentStrategy(), TabsComponentStrategy_exports)).then(
            (m) => m.TabsComponentStrategy
          )
        );
      }
      /**
       * Load a strategy - either from custom path or built-in registry
       * @param componentName - Component name (e.g., "menu", "accordion")
       * @param customStrategyPath - Optional custom strategy file path
       * @returns Strategy constructor function or null if not found
       */
      async loadStrategy(componentName, customStrategyPath, configBaseDir) {
        try {
          if (customStrategyPath) {
            try {
              const resolvedCustomPath = import_path2.default.isAbsolute(customStrategyPath) ? customStrategyPath : import_path2.default.resolve(configBaseDir || process.cwd(), customStrategyPath);
              const customModule = await import((0, import_url.pathToFileURL)(resolvedCustomPath).href);
              const strategy = customModule.default || customModule;
              if (!strategy) {
                throw new Error(`No default export found in ${customStrategyPath}`);
              }
              return strategy;
            } catch (error) {
              throw new Error(
                `Failed to load custom strategy from ${customStrategyPath}: ${error instanceof Error ? error.message : String(error)}`
              );
            }
          }
          const builtInLoader = this.builtInStrategies.get(componentName);
          if (!builtInLoader) {
            return null;
          }
          return builtInLoader();
        } catch (error) {
          throw new Error(
            `Strategy loading failed for ${componentName}: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
      /**
       * Check if a strategy exists (either built-in or custom path provided)
       */
      has(componentName, customStrategyPath) {
        return !!customStrategyPath || this.builtInStrategies.has(componentName);
      }
    };
  }
});

// src/utils/test/src/ComponentDetector.ts
var import_fs, import_path3, import_meta, ComponentDetector;
var init_ComponentDetector = __esm({
  "src/utils/test/src/ComponentDetector.ts"() {
    "use strict";
    import_fs = require("fs");
    import_path3 = __toESM(require("path"), 1);
    init_StrategyRegistry();
    import_meta = {};
    ComponentDetector = class {
      static strategyRegistry = new StrategyRegistry();
      static isComponentConfig(value) {
        return typeof value === "object" && value !== null;
      }
      /**
       * Detect and instantiate a component strategy
       * Supports:
       * - Built-in strategies (menu, accordion, combobox, tabs)
       * - Custom strategies via config (strategyPath)
       * - Custom contract paths via config (path)
       * @param componentName - Component name
       * @param componentConfig - Component config from ariaease.config.js
       * @param actionTimeoutMs - Action timeout in milliseconds
       * @param assertionTimeoutMs - Assertion timeout in milliseconds
       * @returns Instantiated ComponentStrategy or null
       */
      static async detect(componentName, componentConfig, actionTimeoutMs = 400, assertionTimeoutMs = 400, configBaseDir) {
        const typedComponentConfig = this.isComponentConfig(componentConfig) ? componentConfig : void 0;
        const contractPath = typedComponentConfig?.contractPath;
        if (!contractPath) {
          throw new Error(`Contract path not found for component: ${componentName}`);
        }
        const resolvedPath = (() => {
          if (import_path3.default.isAbsolute(contractPath)) return contractPath;
          if (configBaseDir) {
            const configResolved = import_path3.default.resolve(configBaseDir, contractPath);
            try {
              (0, import_fs.readFileSync)(configResolved, "utf-8");
              return configResolved;
            } catch {
            }
          }
          const cwdResolved = import_path3.default.resolve(process.cwd(), contractPath);
          try {
            (0, import_fs.readFileSync)(cwdResolved, "utf-8");
            return cwdResolved;
          } catch {
            return new URL(contractPath, import_meta.url).pathname;
          }
        })();
        const contractData = (0, import_fs.readFileSync)(resolvedPath, "utf-8");
        const componentContract = JSON.parse(contractData);
        const selectors = componentContract.selectors;
        const strategyClass = await this.strategyRegistry.loadStrategy(
          componentName,
          typedComponentConfig?.strategyPath,
          configBaseDir
        );
        if (!strategyClass) {
          return null;
        }
        const mainSelector = selectors.main;
        if (componentName === "tabs") {
          return new strategyClass(mainSelector, selectors);
        }
        return new strategyClass(
          mainSelector,
          selectors,
          actionTimeoutMs,
          assertionTimeoutMs
        );
      }
    };
  }
});

// src/utils/test/src/RelativeTargetResolver.ts
var RelativeTargetResolver_exports = {};
__export(RelativeTargetResolver_exports, {
  RelativeTargetResolver: () => RelativeTargetResolver
});
var RelativeTargetResolver;
var init_RelativeTargetResolver = __esm({
  "src/utils/test/src/RelativeTargetResolver.ts"() {
    "use strict";
    RelativeTargetResolver = class {
      /**
       * Resolve a relative target like "first", "second", "last", "next", "previous"
       * @param page Playwright page instance
       * @param selector Base selector to find elements
       * @param relative Relative position (first, second, last, next, previous)
       * @returns The resolved Locator or null if not found
       */
      static async resolve(page, selector, relative) {
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
    };
  }
});

// src/utils/test/src/ActionExecutor.ts
var ActionExecutor;
var init_ActionExecutor = __esm({
  "src/utils/test/src/ActionExecutor.ts"() {
    "use strict";
    init_RelativeTargetResolver();
    ActionExecutor = class {
      constructor(page, selectors, timeoutMs = 400) {
        this.page = page;
        this.selectors = selectors;
        this.timeoutMs = timeoutMs;
      }
      /**
       * Check if error is due to browser/page being closed
       */
      isBrowserClosedError(error) {
        return error instanceof Error && error.message.includes("Target page, context or browser has been closed");
      }
      /**
       * Execute focus action
       */
      /**
       * Execute focus action (supports absolute, relative, and virtual focus)
       * @param target - selector key (e.g. "input", "button", "relative", or "virtual")
       * @param relativeTarget - for relative focus (e.g. "first", "last")
       * @param virtualId - for virtual focus (aria-activedescendant value)
       */
      async focus(target, relativeTarget, virtualId) {
        try {
          if (target === "virtual" && virtualId) {
            const mainSelector = this.selectors.main;
            if (!mainSelector) {
              return { success: false, error: `Main selector not defined for virtual focus.` };
            }
            const main = this.page.locator(mainSelector).first();
            const exists = await main.count();
            if (!exists) {
              return { success: false, error: `Main element not found for virtual focus.` };
            }
            await main.evaluate((el, id) => {
              el.setAttribute("aria-activedescendant", id);
            }, virtualId);
            return { success: true };
          }
          if (target === "relative" && relativeTarget) {
            const relativeSelector = this.selectors.relative;
            if (!relativeSelector) {
              return { success: false, error: `Relative selector not defined for focus action.` };
            }
            const element = await RelativeTargetResolver.resolve(this.page, relativeSelector, relativeTarget);
            if (!element) {
              return { success: false, error: `Could not resolve relative target ${relativeTarget} for focus.` };
            }
            await element.focus({ timeout: this.timeoutMs });
            return { success: true };
          }
          const selector = this.selectors[target];
          if (!selector) {
            return { success: false, error: `Selector for focus target ${target} not found.` };
          }
          await this.page.locator(selector).first().focus({ timeout: this.timeoutMs });
          return { success: true };
        } catch (error) {
          if (this.isBrowserClosedError(error)) {
            return {
              success: false,
              error: `CRITICAL: Browser/page closed during test execution. Remaining actions skipped.`,
              shouldBreak: true
            };
          }
          return {
            success: false,
            error: `Failed to focus ${target}: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
      /**
       * Execute type/fill action
       */
      async type(target, value) {
        try {
          const selector = this.selectors[target];
          if (!selector) {
            return { success: false, error: `Selector for type target ${target} not found.` };
          }
          await this.page.locator(selector).first().fill(value, { timeout: this.timeoutMs });
          return { success: true };
        } catch (error) {
          if (this.isBrowserClosedError(error)) {
            return {
              success: false,
              error: `CRITICAL: Browser/page closed during test execution. Remaining actions skipped.`,
              shouldBreak: true
            };
          }
          return {
            success: false,
            error: `Failed to type into ${target}: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
      /**
       * Execute click action
       */
      async click(target, relativeTarget) {
        try {
          if (target === "document") {
            await this.page.mouse.click(10, 10);
            return { success: true };
          }
          if (target === "relative" && relativeTarget) {
            const relativeSelector = this.selectors.relative;
            if (!relativeSelector) {
              return { success: false, error: `Relative selector not defined for click action.` };
            }
            const element = await RelativeTargetResolver.resolve(this.page, relativeSelector, relativeTarget);
            if (!element) {
              return { success: false, error: `Could not resolve relative target ${relativeTarget} for click.` };
            }
            await element.click({ timeout: this.timeoutMs });
            return { success: true };
          }
          const selector = this.selectors[target];
          if (!selector) {
            return { success: false, error: `Selector for action target ${target} not found.` };
          }
          await this.page.locator(selector).first().click({ timeout: this.timeoutMs });
          return { success: true };
        } catch (error) {
          if (this.isBrowserClosedError(error)) {
            return {
              success: false,
              error: `CRITICAL: Browser/page closed during test execution. Remaining actions skipped.`,
              shouldBreak: true
            };
          }
          return {
            success: false,
            error: `Failed to click ${target}: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
      /**
       * Execute keypress action
       */
      async keypress(target, key) {
        try {
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
          let keyValue = keyMap[key] || key;
          if (keyValue === "Space") {
            keyValue = " ";
          } else if (keyValue.includes(" ")) {
            keyValue = keyValue.replace(/ /g, "");
          }
          if (target === "focusable" && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Escape", "Home", "End", "Tab", "Shift+Tab"].includes(keyValue)) {
            await this.page.keyboard.press(keyValue);
            return { success: true };
          }
          const selector = this.selectors[target];
          if (!selector) {
            return { success: false, error: `Selector for keypress target ${target} not found.` };
          }
          const locator = this.page.locator(selector).first();
          const elementCount = await locator.count();
          if (elementCount === 0) {
            return {
              success: false,
              error: `${target} element not found.`,
              shouldBreak: true
              // Signal to skip this test
            };
          }
          await locator.press(keyValue, { timeout: this.timeoutMs });
          return { success: true };
        } catch (error) {
          if (this.isBrowserClosedError(error)) {
            return {
              success: false,
              error: `CRITICAL: Browser/page closed during test execution. Remaining actions skipped.`,
              shouldBreak: true
            };
          }
          return {
            success: false,
            error: `Failed to press ${key} on ${target}: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
      /**
       * Execute hover action
       */
      async hover(target, relativeTarget) {
        try {
          if (target === "relative" && relativeTarget) {
            const relativeSelector = this.selectors.relative;
            if (!relativeSelector) {
              return { success: false, error: `Relative selector not defined for hover action.` };
            }
            const element = await RelativeTargetResolver.resolve(this.page, relativeSelector, relativeTarget);
            if (!element) {
              return { success: false, error: `Could not resolve relative target ${relativeTarget} for hover.` };
            }
            await element.hover({ timeout: this.timeoutMs });
            return { success: true };
          }
          const selector = this.selectors[target];
          if (!selector) {
            return { success: false, error: `Selector for hover target ${target} not found.` };
          }
          await this.page.locator(selector).first().hover({ timeout: this.timeoutMs });
          return { success: true };
        } catch (error) {
          if (this.isBrowserClosedError(error)) {
            return {
              success: false,
              error: `CRITICAL: Browser/page closed during test execution. Remaining actions skipped.`,
              shouldBreak: true
            };
          }
          return {
            success: false,
            error: `Failed to hover ${target}: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    };
  }
});

// src/utils/test/src/AssertionRunner.ts
var AssertionRunner;
var init_AssertionRunner = __esm({
  "src/utils/test/src/AssertionRunner.ts"() {
    "use strict";
    init_test();
    init_RelativeTargetResolver();
    AssertionRunner = class {
      constructor(page, selectors, timeoutMs = 400) {
        this.page = page;
        this.selectors = selectors;
        this.timeoutMs = timeoutMs;
      }
      /**
       * Resolve the target element for an assertion
       */
      async resolveTarget(targetName, relativeTarget, selectorKey) {
        try {
          if (targetName === "relative") {
            const relativeSelector = selectorKey ? this.selectors[selectorKey] : this.selectors.relative;
            if (!relativeSelector) {
              return { target: null, error: "Relative selector is not defined in the contract." };
            }
            if (!relativeTarget) {
              return { target: null, error: "Relative target or expected value is not defined." };
            }
            const target = await RelativeTargetResolver.resolve(this.page, relativeSelector, relativeTarget);
            if (!target) {
              return { target: null, error: `Target ${targetName} not found.` };
            }
            return { target };
          }
          const selector = this.selectors[targetName];
          if (!selector) {
            return { target: null, error: `Selector for assertion target ${targetName} not found.` };
          }
          return { target: this.page.locator(selector).first() };
        } catch (error) {
          return {
            target: null,
            error: `Failed to resolve target ${targetName}: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
      /**
       * Validate visibility assertion
       */
      async validateVisibility(target, targetName, expectedVisible, failureMessage, testDescription) {
        try {
          if (expectedVisible) {
            await (0, test_exports.expect)(target).toBeVisible({ timeout: this.timeoutMs });
            return {
              success: true,
              passMessage: `${targetName} is visible as expected. Test: "${testDescription}".`
            };
          } else {
            await (0, test_exports.expect)(target).toBeHidden({ timeout: this.timeoutMs });
            return {
              success: true,
              passMessage: `${targetName} is not visible as expected. Test: "${testDescription}".`
            };
          }
        } catch {
          const selector = this.selectors[targetName] || "";
          const debugState = await this.page.evaluate((sel) => {
            const el = sel ? document.querySelector(sel) : null;
            if (!el) return "element not found";
            const styles = window.getComputedStyle(el);
            return `display:${styles.display}, visibility:${styles.visibility}, opacity:${styles.opacity}`;
          }, selector);
          if (expectedVisible) {
            return {
              success: false,
              failMessage: `${failureMessage} (actual: ${debugState})`
            };
          } else {
            return {
              success: false,
              failMessage: `${failureMessage} ${targetName} is still visible (actual: ${debugState}).`
            };
          }
        }
      }
      /**
       * Validate attribute assertion
       */
      async validateAttribute(target, targetName, attribute, expectedValue, failureMessage, testDescription) {
        if (expectedValue === "!empty") {
          const attributeValue2 = await target.getAttribute(attribute);
          if (attributeValue2 && attributeValue2.trim() !== "") {
            return {
              success: true,
              passMessage: `${targetName} has non-empty "${attribute}". Test: "${testDescription}".`
            };
          } else {
            return {
              success: false,
              failMessage: `${failureMessage} ${targetName} "${attribute}" should not be empty, found "${attributeValue2}".`
            };
          }
        }
        if (typeof expectedValue !== "string") {
          console.error("[AssertionRunner] expectedValue is not a string:", expectedValue);
          throw new Error(`AssertionRunner: expectedValue for attribute assertion must be a string, but got: ${JSON.stringify(expectedValue)}`);
        }
        const expectedValues = expectedValue.split(" | ").map((v) => v.trim());
        const attributeValue = await target.getAttribute(attribute);
        if (attributeValue !== null && expectedValues.includes(attributeValue)) {
          return {
            success: true,
            passMessage: `${targetName} has expected "${attribute}". Test: "${testDescription}".`
          };
        } else {
          return {
            success: false,
            failMessage: `${failureMessage} ${targetName} "${attribute}" should be "${expectedValue}", found "${attributeValue}".`
          };
        }
      }
      /**
       * Validate input value assertion
       */
      async validateValue(target, targetName, expectedValue, failureMessage, testDescription) {
        const inputValue = await target.inputValue().catch(() => "");
        if (expectedValue === "!empty") {
          if (inputValue && inputValue.trim() !== "") {
            return {
              success: true,
              passMessage: `${targetName} has non-empty value. Test: "${testDescription}".`
            };
          } else {
            return {
              success: false,
              failMessage: `${failureMessage} ${targetName} value should not be empty, found "${inputValue}".`
            };
          }
        }
        if (expectedValue === "") {
          if (inputValue === "") {
            return {
              success: true,
              passMessage: `${targetName} has empty value. Test: "${testDescription}".`
            };
          } else {
            return {
              success: false,
              failMessage: `${failureMessage} ${targetName} value should be empty, found "${inputValue}".`
            };
          }
        }
        if (inputValue === expectedValue) {
          return {
            success: true,
            passMessage: `${targetName} has expected value. Test: "${testDescription}".`
          };
        } else {
          return {
            success: false,
            failMessage: `${failureMessage} ${targetName} value should be "${expectedValue}", found "${inputValue}".`
          };
        }
      }
      /**
       * Validate focus assertion
       */
      async validateFocus(target, targetName, expectedFocus, failureMessage, testDescription) {
        try {
          if (expectedFocus) {
            await (0, test_exports.expect)(target).toBeFocused({ timeout: this.timeoutMs });
            return {
              success: true,
              passMessage: `${targetName} has focus as expected. Test: "${testDescription}".`
            };
          } else {
            await (0, test_exports.expect)(target).not.toBeFocused({ timeout: this.timeoutMs });
            return {
              success: true,
              passMessage: `${targetName} does not have focus as expected. Test: "${testDescription}".`
            };
          }
        } catch {
          const actualFocus = await this.page.evaluate(() => {
            const focused = document.activeElement;
            return focused ? `${focused.tagName}#${focused.id || "no-id"}.${focused.className || "no-class"}` : "no element focused";
          });
          return {
            success: false,
            failMessage: `${failureMessage} (actual focus: ${actualFocus})`
          };
        }
      }
      /**
       * Validate role assertion
       */
      async validateRole(target, targetName, expectedRole, failureMessage, testDescription) {
        const roleValue = await target.getAttribute("role");
        if (roleValue === expectedRole) {
          return {
            success: true,
            passMessage: `${targetName} has role "${expectedRole}". Test: "${testDescription}".`
          };
        } else {
          return {
            success: false,
            failMessage: `${failureMessage} Expected role "${expectedRole}", found "${roleValue}".`
          };
        }
      }
      /**
       * Main validation method - routes to specific validators
       */
      async validate(assertion, testDescription) {
        if (this.page.isClosed()) {
          return {
            success: false,
            failMessage: `CRITICAL: Browser/page closed before completing all tests. Increase test timeout or reduce test complexity.`
          };
        }
        const { target, error } = await this.resolveTarget(
          assertion.target,
          assertion.relativeTarget || assertion.expectedValue,
          assertion.selectorKey
        );
        if (error || !target) {
          return { success: false, failMessage: error || `Target ${assertion.target} not found.`, target: null };
        }
        if (assertion.target === "input" && assertion.attribute === "aria-activedescendant" && assertion.expectedValue === "!empty" && assertion.relativeTarget && assertion.selectorKey) {
          const optionLocator = await RelativeTargetResolver.resolve(this.page, this.selectors[assertion.selectorKey], assertion.relativeTarget);
          const optionId = optionLocator ? await optionLocator.getAttribute("id") : null;
          const inputId = await target.getAttribute("aria-activedescendant");
          if (optionId && inputId === optionId) {
            return {
              success: true,
              passMessage: `input[aria-activedescendant] matches id of ${assertion.relativeTarget}(${assertion.selectorKey}). Test: "${testDescription}".`
            };
          } else {
            return {
              success: false,
              failMessage: `input[aria-activedescendant] should match id of ${assertion.relativeTarget}(${assertion.selectorKey}), found "${inputId}".`
            };
          }
        }
        switch (assertion.assertion) {
          case "toBeVisible":
            return this.validateVisibility(target, assertion.target, true, assertion.failureMessage || "", testDescription);
          case "notToBeVisible":
            return this.validateVisibility(target, assertion.target, false, assertion.failureMessage || "", testDescription);
          case "toHaveAttribute":
            if (assertion.attribute && assertion.expectedValue !== void 0) {
              return this.validateAttribute(
                target,
                assertion.target,
                assertion.attribute,
                assertion.expectedValue,
                assertion.failureMessage || "",
                testDescription
              );
            }
            return { success: false, failMessage: "Missing attribute or expectedValue for toHaveAttribute assertion" };
          case "toHaveValue":
            if (assertion.expectedValue !== void 0) {
              return this.validateValue(target, assertion.target, assertion.expectedValue, assertion.failureMessage || "", testDescription);
            }
            return { success: false, failMessage: "Missing expectedValue for toHaveValue assertion" };
          case "toHaveFocus":
            return this.validateFocus(target, assertion.target, true, assertion.failureMessage || "", testDescription);
          case "notToHaveFocus":
            return this.validateFocus(target, assertion.target, false, assertion.failureMessage || "", testDescription);
          case "toHaveRole":
            if (assertion.expectedValue !== void 0) {
              return this.validateRole(target, assertion.target, assertion.expectedValue, assertion.failureMessage || "", testDescription);
            }
            return { success: false, failMessage: "Missing expectedValue for toHaveRole assertion" };
          default:
            return { success: false, failMessage: `Unknown assertion type: ${assertion.assertion}` };
        }
      }
    };
  }
});

// src/utils/test/src/contractTestRunnerPlaywright.ts
var contractTestRunnerPlaywright_exports = {};
__export(contractTestRunnerPlaywright_exports, {
  runContractTestsPlaywright: () => runContractTestsPlaywright
});
async function runContractTestsPlaywright(componentName, url, strictness, config, configBaseDir) {
  const componentConfig = config?.test?.components?.find((c) => c.name === componentName);
  const isCustomContract = !!componentConfig?.contractPath;
  const reporter = new ContractReporter(true, isCustomContract);
  const defaultTimeouts = { actionTimeoutMs: 400, assertionTimeoutMs: 400, navigationTimeoutMs: 3e4, componentReadyTimeoutMs: 5e3 };
  const globalDisableTimeouts = config?.test?.disableTimeouts === true;
  const componentDisableTimeouts = componentConfig?.disableTimeouts === true;
  const disableTimeouts = componentDisableTimeouts || globalDisableTimeouts;
  const resolveTimeout = (componentValue, globalValue, fallback) => {
    if (disableTimeouts) return 0;
    const value = componentValue ?? globalValue;
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      return fallback;
    }
    return value;
  };
  const actionTimeoutMs = resolveTimeout(componentConfig?.actionTimeoutMs, config?.test?.actionTimeoutMs, defaultTimeouts.actionTimeoutMs);
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
  const contractPath = componentConfig?.contractPath;
  if (!contractPath) {
    throw new Error(`Contract path not found for component: ${componentName}`);
  }
  const resolvedPath = (() => {
    if (import_path4.default.isAbsolute(contractPath)) return contractPath;
    if (configBaseDir) {
      const configResolved = import_path4.default.resolve(configBaseDir, contractPath);
      try {
        (0, import_fs2.readFileSync)(configResolved, "utf-8");
        return configResolved;
      } catch {
      }
    }
    const cwdResolved = import_path4.default.resolve(process.cwd(), contractPath);
    try {
      (0, import_fs2.readFileSync)(cwdResolved, "utf-8");
      return cwdResolved;
    } catch {
      return new URL(contractPath, import_meta2.url).pathname;
    }
  })();
  const contractData = (0, import_fs2.readFileSync)(resolvedPath, "utf-8");
  const componentContract = JSON.parse(contractData);
  const totalTests = (componentContract.relationships?.length || 0) + (componentContract.static[0]?.assertions.length || 0) + componentContract.dynamic.length;
  const apgUrl = componentContract.meta?.source?.apg;
  const failures = [];
  const warnings = [];
  const passes = [];
  const skipped = [];
  let page = null;
  const classifyFailure = (message, levelRaw) => {
    const level = normalizeLevel(levelRaw);
    const enforcement = resolveEnforcement(level, strictnessMode);
    if (enforcement === "error") {
      failures.push(message);
      return { status: "fail", level, detail: message };
    }
    if (enforcement === "warning") {
      warnings.push(message);
      return { status: "warn", level, detail: message };
    }
    const ignoredMessage = `${message} (ignored by strictness=${strictnessMode}, level=${level})`;
    skipped.push(ignoredMessage);
    return { status: "skip", level, detail: ignoredMessage };
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
          `Failed to navigate to ${url}. Ensure dev server is running and accessible. Original error: ${error instanceof Error ? error.message : String(error)}`
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
      await page.locator(mainSelector).first().waitFor({ state: "attached", timeout: componentReadyTimeoutMs });
    } catch (error) {
      throw new Error(
        `
\u274C CRITICAL: Component not found on page!
This usually means:
  - The component didn't render
  - The URL is incorrect
  - The component selector '${mainSelector}' in the contract is wrong
  - Original error: ${error}`
      );
    }
    reporter.start(componentName, totalTests, apgUrl);
    if (componentName === "menu" && componentContract.selectors.main) {
      await page.locator(componentContract.selectors.main).first().waitFor({ state: "visible", timeout: componentReadyTimeoutMs }).catch(() => {
      });
    }
    const hasSubmenuCapability = componentName === "menu" && !!componentContract.selectors.submenuTrigger ? await page.locator(componentContract.selectors.submenuTrigger).count() > 0 : false;
    const isSubmenuRelation = (rel) => rel.type === "aria-reference" && [rel.from, rel.to].some((name) => ["submenu", "submenuTrigger", "submenuItems"].includes(name || "")) || rel.type === "contains" && [rel.parent, rel.child].some((name) => ["submenu", "submenuTrigger", "submenuItems"].includes(name || ""));
    let staticPassed = 0;
    let staticFailed = 0;
    let staticWarnings = 0;
    for (const rel of componentContract.relationships || []) {
      if (strategy && typeof strategy.resetState === "function") {
        try {
          await strategy.resetState(page);
        } catch (err) {
          warnings.push(`Warning: resetState failed before relationship test: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
      const relationshipLevel = normalizeLevel(rel.level);
      if (Array.isArray(rel.setup) && rel.setup.length > 0) {
        const actionExecutor = new ActionExecutor(page, componentContract.selectors, actionTimeoutMs);
        const relDescription = rel.type === "aria-reference" ? `${rel.from}.${rel.attribute} references ${rel.to}` : `${rel.parent} contains ${rel.child}`;
        const setupResult = await runSetupActions(rel.setup, actionExecutor, strategy, page, relDescription, ["submenu", "submenuTrigger", "submenuItems"]);
        if (setupResult.skip) {
          skipped.push(setupResult.message);
          reporter.reportStaticTest(relDescription, "skip", setupResult.message, relationshipLevel);
          continue;
        }
        if (!setupResult.success) {
          const failure = `Relationship setup failed: ${setupResult.error}`;
          const outcome = classifyFailure(failure, rel.level);
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }
      }
      if (componentName === "menu" && !hasSubmenuCapability) {
        const involvesSubmenu = isSubmenuRelation(rel);
        if (involvesSubmenu) {
          const relDescription = rel.type === "aria-reference" ? `${rel.from}.${rel.attribute} references ${rel.to}` : `${rel.parent} contains ${rel.child}`;
          const skipMessage = `Skipping submenu relationship assertion: no submenu capability detected in rendered component.`;
          skipped.push(skipMessage);
          reporter.reportStaticTest(relDescription, "skip", skipMessage, relationshipLevel);
          continue;
        }
      }
      if (rel.type === "aria-reference") {
        const relDescription = `${rel.from}.${rel.attribute} references ${rel.to}`;
        const fromSelector = componentContract.selectors[rel.from];
        const toSelector = componentContract.selectors[rel.to];
        if (!fromSelector || !toSelector) {
          const outcome = classifyFailure(
            `Relationship selector missing: from="${rel.from}" or to="${rel.to}" not found in selectors.`,
            rel.level
          );
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }
        const fromTarget = page.locator(fromSelector).first();
        const toTarget = page.locator(toSelector).first();
        const fromExists = await fromTarget.count() > 0;
        const toExists = await toTarget.count() > 0;
        if (!fromExists || !toExists) {
          if (componentName === "menu" && isSubmenuRelation(rel)) {
            const skipMessage = "Skipping submenu relationship assertion in static phase: submenu elements are not present until submenu is opened.";
            skipped.push(skipMessage);
            reporter.reportStaticTest(relDescription, "skip", skipMessage, relationshipLevel);
            continue;
          }
          const outcome = classifyFailure(
            `Relationship target not found: ${!fromExists ? rel.from : rel.to}.`,
            rel.level
          );
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }
        const attrValue = await fromTarget.getAttribute(rel.attribute);
        const toId = await toTarget.getAttribute("id");
        if (!toId) {
          const outcome = classifyFailure(
            `Relationship target "${rel.to}" must have an id for ${rel.attribute} validation.`,
            rel.level
          );
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }
        const references = (attrValue || "").split(/\s+/).filter(Boolean);
        const matches = references.includes(toId);
        if (!matches) {
          const outcome = classifyFailure(
            `Expected ${rel.from} ${rel.attribute} to reference id "${toId}", found "${attrValue || ""}".`,
            rel.level
          );
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }
        passes.push(`Relationship valid: ${rel.from}.${rel.attribute} -> ${rel.to} (id=${toId}).`);
        staticPassed += 1;
        reporter.reportStaticTest(relDescription, "pass", void 0, relationshipLevel);
        continue;
      }
      if (rel.type === "contains") {
        const relDescription = `${rel.parent} contains ${rel.child}`;
        const parentSelector = componentContract.selectors[rel.parent];
        const childSelector = componentContract.selectors[rel.child];
        if (!parentSelector || !childSelector) {
          const outcome = classifyFailure(
            `Relationship selector missing: parent="${rel.parent}" or child="${rel.child}" not found in selectors.`,
            rel.level
          );
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }
        const parent = page.locator(parentSelector).first();
        const parentExists = await parent.count() > 0;
        if (!parentExists) {
          if (componentName === "menu" && isSubmenuRelation(rel)) {
            const skipMessage = "Skipping submenu relationship assertion in static phase: submenu container is not present until submenu is opened.";
            skipped.push(skipMessage);
            reporter.reportStaticTest(relDescription, "skip", skipMessage, relationshipLevel);
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
          if (componentName === "menu" && isSubmenuRelation(rel)) {
            const skipMessage = "Skipping submenu relationship assertion in static phase: submenu descendants are not present until submenu is opened.";
            skipped.push(skipMessage);
            reporter.reportStaticTest(relDescription, "skip", skipMessage, relationshipLevel);
            continue;
          }
          const outcome = classifyFailure(
            `Expected ${rel.parent} to contain descendant matching selector for ${rel.child}.`,
            rel.level
          );
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }
        passes.push(`Relationship valid: ${rel.parent} contains ${rel.child}.`);
        staticPassed += 1;
        reporter.reportStaticTest(relDescription, "pass", void 0, relationshipLevel);
      }
    }
    async function resolveExpectedValue(expectedValue, selectors, page2, context = {}) {
      if (!expectedValue || typeof expectedValue !== "object" || !("ref" in expectedValue)) return expectedValue;
      let refSelector;
      if (expectedValue.ref === "relative") {
        if (!expectedValue.relativeTarget || !context.relativeBaseSelector) return void 0;
        const baseLocator = page2.locator(context.relativeBaseSelector);
        const count = await baseLocator.count();
        let idx = 0;
        if (expectedValue.relativeTarget === "first") idx = 0;
        else if (expectedValue.relativeTarget === "second") idx = 1;
        else if (expectedValue.relativeTarget === "last") idx = count - 1;
        else if (!isNaN(Number(expectedValue.relativeTarget))) idx = Number(expectedValue.relativeTarget);
        else idx = 0;
        if (idx < 0 || idx >= count) return void 0;
        const relElem = baseLocator.nth(idx);
        return await getPropertyFromLocator(relElem, expectedValue.property || expectedValue.attribute);
      } else {
        refSelector = selectors[expectedValue.ref];
        if (!refSelector) throw new Error(`Selector for ref '${expectedValue.ref}' not found in contract selectors.`);
        const refLocator = page2.locator(refSelector).first();
        return await getPropertyFromLocator(refLocator, expectedValue.property || expectedValue.attribute);
      }
    }
    async function getPropertyFromLocator(locator, property) {
      if (!locator) return void 0;
      if (!property || property === "id") {
        return await locator.getAttribute("id") ?? void 0;
      } else if (property === "class") {
        return await locator.getAttribute("class") ?? void 0;
      } else if (property === "textContent") {
        return await locator.evaluate((el) => el.textContent ?? void 0);
      } else if (property.startsWith("aria-")) {
        return await locator.getAttribute(property) ?? void 0;
      } else if (property.endsWith("*")) {
        const attrs = await locator.evaluate((el) => {
          const out = [];
          for (const attr of Array.from(el.attributes)) {
            if (attr.name.startsWith("aria-")) out.push(`${attr.name}=${attr.value}`);
          }
          return out.join(";");
        });
        return attrs;
      } else {
        return await locator.getAttribute(property) ?? void 0;
      }
    }
    const staticAssertionRunner = new AssertionRunner(page, componentContract.selectors, assertionTimeoutMs);
    async function runSetupActions(setup, actionExecutor, strategy2, page2, description, skipKeywords = []) {
      if (!Array.isArray(setup) || setup.length === 0) return { success: true };
      if (strategy2 && typeof strategy2.resetState === "function") {
        await strategy2.resetState(page2);
      }
      for (const setupAct of setup) {
        let setupResult = { success: true };
        try {
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
            continue;
          }
        } catch (err) {
          setupResult = { success: false, error: err instanceof Error ? err.message : String(err) };
        }
        if (!setupResult.success) {
          const setupMsg = setupResult.error || "Setup action failed";
          const isSkip = skipKeywords.some((kw) => description.includes(kw) || setupMsg.includes(kw));
          if (isSkip) {
            return { success: false, skip: true, message: `Skipping test - capability not present: ${setupMsg}` };
          }
          return { success: false, error: setupMsg };
        }
      }
      return { success: true };
    }
    for (const test of componentContract.static[0]?.assertions || []) {
      if (strategy && typeof strategy.resetState === "function") {
        try {
          await strategy.resetState(page);
        } catch (err) {
          warnings.push(`Warning: resetState failed before static test: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
      if (test.target === "relative") continue;
      const staticDescription = `${test.target}${test.attribute ? ` (${test.attribute})` : ""}`;
      const staticLevel = normalizeLevel(test.level);
      if (componentName === "menu" && test.target === "submenuTrigger" && !hasSubmenuCapability) {
        const skipMessage = `Skipping submenu static assertion for ${test.target}: no submenu capability detected in rendered component.`;
        skipped.push(skipMessage);
        reporter.reportStaticTest(staticDescription, "skip", skipMessage, staticLevel);
        continue;
      }
      if (Array.isArray(test.setup) && test.setup.length > 0) {
        const actionExecutor = new ActionExecutor(page, componentContract.selectors, actionTimeoutMs);
        const setupResult = await runSetupActions(test.setup, actionExecutor, strategy, page, staticDescription, ["submenu", "submenuTrigger", "submenuItems"]);
        if (setupResult.skip) {
          skipped.push(setupResult.message);
          reporter.reportStaticTest(staticDescription, "skip", setupResult.message, staticLevel);
          continue;
        }
        if (!setupResult.success) {
          const failure = `Static setup failed: ${setupResult.error}`;
          const outcome = classifyFailure(failure, test.level);
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(staticDescription, outcome.status, outcome.detail, outcome.level);
          continue;
        }
      }
      const targetSelector = componentContract.selectors[test.target];
      if (!targetSelector) {
        const failure = `Selector for target ${test.target} not found.`;
        const outcome = classifyFailure(failure, test.level);
        if (outcome.status === "fail") staticFailed += 1;
        if (outcome.status === "warn") staticWarnings += 1;
        reporter.reportStaticTest(staticDescription, outcome.status, outcome.detail, outcome.level);
        continue;
      }
      const target = page.locator(targetSelector).first();
      const exists = await target.count() > 0;
      if (!exists) {
        const failure = `Target ${test.target} not found.`;
        const outcome = classifyFailure(failure, test.level);
        if (outcome.status === "fail") staticFailed += 1;
        if (outcome.status === "warn") staticWarnings += 1;
        reporter.reportStaticTest(staticDescription, outcome.status, outcome.detail, outcome.level);
        continue;
      }
      const isRedundantCheck = (selector, attrName, expectedVal) => {
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
      let expectedValue = test.expectedValue;
      if (test.expectedValue && typeof test.expectedValue === "object" && "ref" in test.expectedValue) {
        const context = {};
        const relTarget = test.relativeTarget;
        if (test.expectedValue.ref === "relative" && test.target === "relative" && relTarget) {
          const baseSel = componentContract.selectors[relTarget];
          if (!baseSel) throw new Error(`Selector for relativeTarget '${relTarget}' not found in contract selectors.`);
          context.relativeBaseSelector = baseSel;
        } else if (test.expectedValue.ref === "relative" && relTarget) {
          const baseSel = componentContract.selectors[relTarget];
          if (!baseSel) throw new Error(`Selector for relativeTarget '${relTarget}' not found in contract selectors.`);
          context.relativeBaseSelector = baseSel;
        }
        expectedValue = await resolveExpectedValue(test.expectedValue, componentContract.selectors, page, context);
        console.log("Expected value in static check", expectedValue);
      }
      if (!test.expectedValue) {
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
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(staticDescription, outcome.status, outcome.detail, outcome.level);
        } else if (!allRedundant && hasAny) {
          passes.push(`At least one of the attributes "${test.attribute}" exists on the element.`);
          staticPassed += 1;
          reporter.reportStaticTest(staticDescription, "pass", void 0, staticLevel);
        } else {
          staticPassed += 1;
          reporter.reportStaticTest(staticDescription, "pass", void 0, staticLevel);
        }
      } else {
        if (isRedundantCheck(targetSelector, test.attribute, typeof expectedValue === "string" ? expectedValue : void 0)) {
          passes.push(`${test.attribute}="${expectedValue}" on ${test.target} verified by selector (already present in: ${targetSelector}).`);
          staticPassed += 1;
          reporter.reportStaticTest(staticDescription, "pass", void 0, staticLevel);
        } else {
          const valueToCheck = expectedValue ?? "";
          const result = await staticAssertionRunner.validateAttribute(
            target,
            test.target,
            test.attribute,
            valueToCheck,
            test.failureMessage,
            "Static ARIA Test"
          );
          if (result.success && result.passMessage) {
            passes.push(result.passMessage);
            staticPassed += 1;
            reporter.reportStaticTest(staticDescription, "pass", void 0, staticLevel);
          } else if (!result.success && result.failMessage) {
            const outcome = classifyFailure(result.failMessage, test.level);
            if (outcome.status === "fail") staticFailed += 1;
            if (outcome.status === "warn") staticWarnings += 1;
            reporter.reportStaticTest(staticDescription, outcome.status, outcome.detail, outcome.level);
          }
        }
      }
    }
    for (const dynamicTest of componentContract.dynamic || []) {
      if (!page || page.isClosed()) {
        console.warn(`
\u26A0\uFE0F  Browser closed - skipping remaining ${componentContract.dynamic.length - componentContract.dynamic.indexOf(dynamicTest)} tests
`);
        failures.push(`CRITICAL: Browser/page closed before completing all tests. ${componentContract.dynamic.length - componentContract.dynamic.indexOf(dynamicTest)} tests skipped.`);
        break;
      }
      try {
        await strategy.resetState(page);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        reporter.error(errorMessage);
        throw error;
      }
      const { setup = [], action, assertions } = dynamicTest;
      const dynamicLevel = normalizeLevel(dynamicTest.level);
      const actionExecutor = new ActionExecutor(page, componentContract.selectors, actionTimeoutMs);
      if (Array.isArray(setup) && setup.length > 0) {
        const setupResult = await runSetupActions(setup, actionExecutor, strategy, page, dynamicTest.description, ["submenu", "submenuTrigger", "submenuItems"]);
        if (setupResult.skip) {
          skipped.push(setupResult.message);
          reporter.reportTest({ description: dynamicTest.description, level: dynamicLevel }, "skip", setupResult.message);
          continue;
        }
        if (!setupResult.success) {
          const outcome = classifyFailure(`Setup failed: ${setupResult.error}`, dynamicTest.level);
          reporter.reportTest({ description: dynamicTest.description, level: dynamicLevel }, outcome.status, outcome.detail);
          continue;
        }
      }
      const failuresBeforeTest = failures.length;
      const warningsBeforeTest = warnings.length;
      const skippedBeforeTest = skipped.length;
      const shouldSkipTest = await strategy.shouldSkipTest(dynamicTest, page);
      if (shouldSkipTest) {
        const skipMessage = `Skipping test - component-specific conditions not met`;
        skipped.push(skipMessage);
        reporter.reportTest({ description: dynamicTest.description, level: dynamicLevel }, "skip", skipMessage);
        continue;
      }
      const assertionRunner = new AssertionRunner(page, componentContract.selectors, assertionTimeoutMs);
      let shouldAbortCurrentTest = false;
      let actionOutcome = null;
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
          continue;
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
          actionOutcome?.status || "fail",
          actionOutcome?.detail || failures[failures.length - 1]
        );
        continue;
      }
      for (const assertion of assertions) {
        let expectedValue;
        if (assertion.expectedValue && typeof assertion.expectedValue === "object" && "ref" in assertion.expectedValue) {
          if (assertion.expectedValue.ref === "relative") {
            const { RelativeTargetResolver: RelativeTargetResolver2 } = await Promise.resolve().then(() => (init_RelativeTargetResolver(), RelativeTargetResolver_exports));
            const relativeSelector = componentContract.selectors.relative;
            if (!relativeSelector) throw new Error("Relative selector not defined in contract selectors.");
            const relTarget = assertion.relativeTarget || "first";
            const relElem = await RelativeTargetResolver2.resolve(page, relativeSelector, relTarget);
            if (!relElem) throw new Error(`Could not resolve relative target '${relTarget}' for expectedValue.`);
            const prop = assertion.expectedValue.property || assertion.expectedValue.attribute || "id";
            if (prop === "textContent") {
              expectedValue = await relElem.evaluate((el) => el.textContent ?? void 0);
            } else {
              const attr = await relElem.getAttribute(prop);
              expectedValue = attr === null ? void 0 : attr;
            }
          } else {
            expectedValue = await resolveExpectedValue(assertion.expectedValue, componentContract.selectors, page, {});
          }
        } else if (typeof assertion.expectedValue === "string" || typeof assertion.expectedValue === "undefined") {
          expectedValue = assertion.expectedValue;
        } else {
          expectedValue = "";
        }
        const assertionToRun = { ...assertion, expectedValue };
        const valueToCheck = expectedValue ?? "";
        const result = await assertionRunner.validate({ ...assertionToRun, expectedValue: valueToCheck }, dynamicTest.description);
        if (result.success && result.passMessage) {
          passes.push(result.passMessage);
        } else if (!result.success && result.failMessage) {
          const assertionLevel = normalizeLevel(assertion.level || dynamicTest.level);
          const outcome = classifyFailure(result.failMessage, assertionLevel);
          if (outcome.status === "skip") {
            continue;
          }
        }
      }
      const failuresAfterTest = failures.length;
      const warningsAfterTest = warnings.length;
      const skippedAfterTest = skipped.length;
      if (failuresAfterTest > failuresBeforeTest) {
        reporter.reportTest(
          { description: dynamicTest.description, level: dynamicLevel },
          "fail",
          failures[failures.length - 1]
        );
      } else if (warningsAfterTest > warningsBeforeTest) {
        reporter.reportTest(
          { description: dynamicTest.description, level: dynamicLevel },
          "warn",
          warnings[warnings.length - 1]
        );
      } else if (skippedAfterTest > skippedBeforeTest) {
        reporter.reportTest(
          { description: dynamicTest.description, level: dynamicLevel },
          "skip",
          skipped[skipped.length - 1]
        );
      } else {
        reporter.reportTest({ description: dynamicTest.description, level: dynamicLevel }, "pass");
      }
    }
    reporter.reportStatic(staticPassed, staticFailed, staticWarnings);
    reporter.summary(failures);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Executable doesn't exist") || error.message.includes("browserType.launch")) {
        throw new Error("\n\u274C CRITICAL: Playwright browsers not found!\n\u{1F4E6} Run: npx playwright install chromium");
      } else if (error.message.includes("net::ERR_CONNECTION_REFUSED") || error.message.includes("NS_ERROR_CONNECTION_REFUSED")) {
        throw new Error(`
\u274C CRITICAL: Cannot connect to dev server!
Make sure your dev server is running at ${url}`);
      } else if (error.message.includes("Timeout") && error.message.includes("waitFor")) {
        throw new Error(
          `
\u274C CRITICAL: Component not found on page!
The component selector could not be found within ${componentReadyTimeoutMs}ms.
This usually means:
  - The component didn't render
  - The URL is incorrect
  - The component selector was not provided to the component utility, or a wrong selector was used
`
        );
      } else if (error.message.includes("Target page, context or browser has been closed")) {
        throw new Error(
          "\n\u274C CRITICAL: Browser/page was closed unexpectedly!\nThis usually means:\n  - The test timeout was too short\n  - The browser crashed\n  - An external process killed the browser"
        );
      } else {
        throw error;
      }
    }
  } finally {
    if (page) await page.close();
  }
  return { passes, failures, skipped, warnings };
}
var import_fs2, import_path4, import_meta2;
var init_contractTestRunnerPlaywright = __esm({
  "src/utils/test/src/contractTestRunnerPlaywright.ts"() {
    "use strict";
    import_fs2 = require("fs");
    import_path4 = __toESM(require("path"), 1);
    init_playwrightTestHarness();
    init_ComponentDetector();
    init_ContractReporter();
    init_ActionExecutor();
    init_AssertionRunner();
    init_strictness();
    import_meta2 = {};
  }
});

// src/utils/cli/badgeHelper.ts
var badgeHelper_exports = {};
__export(badgeHelper_exports, {
  BADGE_CONFIGS: () => BADGE_CONFIGS,
  displayAllBadges: () => displayAllBadges,
  displayBadgeInfo: () => displayBadgeInfo,
  getBadgeMarkdown: () => getBadgeMarkdown,
  promptAddBadge: () => promptAddBadge
});
function getBadgeMarkdown(badgeType) {
  const config = BADGE_CONFIGS[badgeType];
  return `[![${config.label}](${config.markdownUrl})](https://github.com/aria-ease/aria-ease)`;
}
function displayBadgeInfo(badgeType) {
  const markdown = getBadgeMarkdown(badgeType);
  console.log(import_chalk.default.cyan("\n\u{1F3C5} Show your accessibility commitment!"));
  console.log(import_chalk.default.white("   Add this badge to your README.md:\n"));
  console.log(import_chalk.default.green("   " + markdown));
  console.log(import_chalk.default.dim("\n   This helps others discover accessibility tools and shows you care!\n"));
}
async function promptAddBadge(badgeType, cwd = process.cwd()) {
  const readmePath = import_path5.default.join(cwd, "README.md");
  const readmeExists = await import_fs_extra2.default.pathExists(readmePath);
  if (!readmeExists) {
    console.log(import_chalk.default.yellow("   \u2139\uFE0F  No README.md found in current directory"));
    return;
  }
  const readmeContent = await import_fs_extra2.default.readFile(readmePath, "utf-8");
  const markdown = getBadgeMarkdown(badgeType);
  if (readmeContent.includes(markdown) || readmeContent.includes(BADGE_CONFIGS[badgeType].fileName)) {
    console.log(import_chalk.default.gray("   \u2713 Badge already in README.md"));
    return;
  }
  const rl = import_readline.default.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const answer = await new Promise((resolve) => {
    rl.question(import_chalk.default.cyan("   Add badge to README.md now? (y/n): "), (ans) => {
      rl.close();
      resolve(ans.toLowerCase().trim());
    });
  });
  if (answer === "y" || answer === "yes") {
    await addBadgeToReadme(readmePath, readmeContent, markdown);
    console.log(import_chalk.default.green("   \u2713 Badge added to README.md!"));
  } else {
    console.log(import_chalk.default.gray("   Skipped. You can add it manually anytime."));
  }
}
async function addBadgeToReadme(readmePath, content, badge) {
  const lines = content.split("\n");
  let insertIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("[![") || line.startsWith("[!")) {
      insertIndex = i + 1;
      continue;
    }
    if (insertIndex > 0 && !line.startsWith("[![") && !line.startsWith("[!") && line.length > 0) {
      break;
    }
    if (insertIndex === 0 && line.startsWith("#")) {
      insertIndex = i + 2;
      break;
    }
  }
  if (insertIndex === 0) {
    insertIndex = 1;
  }
  lines.splice(insertIndex, 0, badge);
  await import_fs_extra2.default.writeFile(readmePath, lines.join("\n"), "utf-8");
}
function displayAllBadges() {
  console.log(import_chalk.default.cyan("\n\u{1F4CD} Available badges:"));
  console.log(import_chalk.default.white("\n   For audits:"));
  console.log(import_chalk.default.green("   " + getBadgeMarkdown("audit")));
  console.log(import_chalk.default.white("\n   For component testing:"));
  console.log(import_chalk.default.green("   " + getBadgeMarkdown("component")));
  console.log(import_chalk.default.white("\n   For both (verified):"));
  console.log(import_chalk.default.green("   " + getBadgeMarkdown("verified")));
  console.log("");
}
var import_fs_extra2, import_path5, import_chalk, import_readline, BADGE_CONFIGS;
var init_badgeHelper = __esm({
  "src/utils/cli/badgeHelper.ts"() {
    "use strict";
    import_fs_extra2 = __toESM(require("fs-extra"), 1);
    import_path5 = __toESM(require("path"), 1);
    import_chalk = __toESM(require("chalk"), 1);
    import_readline = __toESM(require("readline"), 1);
    BADGE_CONFIGS = {
      audit: {
        type: "audit",
        fileName: "audited-by-aria-ease.svg",
        label: "Audited by aria-ease",
        markdownUrl: "https://cdn.jsdelivr.net/gh/aria-ease/aria-ease@main/badges/audited-by-aria-ease.svg"
      },
      component: {
        type: "component",
        fileName: "components-tested-aria-ease.svg",
        label: "Components tested: aria-ease",
        markdownUrl: "https://cdn.jsdelivr.net/gh/aria-ease/aria-ease@main/badges/components-tested-aria-ease.svg"
      },
      verified: {
        type: "verified",
        fileName: "verified-by-aria-ease.svg",
        label: "Verified by aria-ease",
        markdownUrl: "https://cdn.jsdelivr.net/gh/aria-ease/aria-ease@main/badges/verified-by-aria-ease.svg"
      }
    };
  }
});

// index.ts
var index_exports = {};
__export(index_exports, {
  cleanupTests: () => cleanupTests,
  createContract: () => createContract,
  makeAccordionAccessible: () => makeAccordionAccessible,
  makeBlockAccessible: () => makeBlockAccessible,
  makeCheckboxAccessible: () => makeCheckboxAccessible,
  makeComboboxAccessible: () => makeComboboxAccessible,
  makeMenuAccessible: () => makeMenuAccessible,
  makeRadioAccessible: () => makeRadioAccessible,
  makeTabsAccessible: () => makeTabsAccessible,
  makeToggleAccessible: () => makeToggleAccessible,
  testUiComponent: () => testUiComponent
});
module.exports = __toCommonJS(index_exports);

// src/accordion/src/makeAccordionAccessible/makeAccordionAccessible.ts
function makeAccordionAccessible({ accordionId, triggersClass, panelsClass, allowMultipleOpen = false, callback }) {
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
      if (!allowMultipleOpen || triggers.length <= 6) {
        panel.setAttribute("role", "region");
      }
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
    if (callback?.onExpand) {
      try {
        callback.onExpand(index);
      } catch (error) {
        console.error("[aria-ease] Error in accordion onExpand callback:", error);
      }
    }
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
    if (callback?.onCollapse) {
      try {
        callback.onCollapse(index);
      } catch (error) {
        console.error("[aria-ease] Error in accordion onCollapse callback:", error);
      }
    }
  }
  function toggleItem(index) {
    const trigger = triggers[index];
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      collapseItem(index);
    } else {
      if (!allowMultipleOpen) {
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
  function refresh() {
    removeListeners();
    const newTriggers = Array.from(accordionContainer.querySelectorAll(`.${triggersClass}`));
    const newPanels = Array.from(accordionContainer.querySelectorAll(`.${panelsClass}`));
    triggers.length = 0;
    triggers.push(...newTriggers);
    panels.length = 0;
    panels.push(...newPanels);
    initialize();
    addListeners();
  }
  initialize();
  addListeners();
  return { expandItem, collapseItem, toggleItem, cleanup, refresh };
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
function handleKeyPress(event, elementItems, elementItemIndex) {
  const currentEl = elementItems.item(elementItemIndex);
  switch (event.key) {
    case "ArrowUp":
    case "ArrowLeft": {
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
function makeMenuAccessible({ menuId, menuItemsClass, triggerId, callback }) {
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
        const isDisabled = item.getAttribute("aria-disabled") === "true";
        if (!isNested) {
          if (!item.hasAttribute("tabindex")) {
            item.setAttribute("tabindex", "-1");
          }
          if (!isDisabled) {
            filteredItems.push(item);
          }
        }
      }
    }
    return filteredItems;
  }
  function toNodeListLike(items) {
    const nodeListLike = {
      length: items.length,
      item: (index) => items[index],
      forEach: (callback2) => {
        items.forEach(callback2);
      },
      [Symbol.iterator]: function* () {
        for (const item of items) {
          yield item;
        }
      }
    };
    return nodeListLike;
  }
  function intializeMenuItems() {
    const items = getItems();
    items.forEach((item) => {
      item.setAttribute("role", "menuitem");
      const submenuId = item.getAttribute("data-submenu-id") ?? item.getAttribute("aria-controls");
      const hasSubmenuTriggerAttributes = item.hasAttribute("aria-haspopup") && submenuId;
      if (submenuId && (item.hasAttribute("data-submenu-id") || hasSubmenuTriggerAttributes)) {
        item.setAttribute("aria-haspopup", "menu");
        item.setAttribute("aria-controls", submenuId);
        if (!item.hasAttribute("aria-expanded")) {
          item.setAttribute("aria-expanded", "false");
        }
      }
    });
  }
  function moveFocus2(elementItems, currentIndex, direction) {
    const len = elementItems.length;
    const nextIndex = (currentIndex + direction + len) % len;
    elementItems.item(nextIndex).focus();
  }
  function focusItemAtIndex(items, index) {
    if (items.length === 0) return;
    items[index]?.focus();
  }
  function hasSubmenu(menuItem) {
    return menuItem.hasAttribute("aria-controls") && menuItem.hasAttribute("aria-haspopup") && menuItem.getAttribute("role") === "menuitem";
  }
  function closeAncestorMenusFromTrigger(triggerEl) {
    let currentTrigger = triggerEl;
    while (currentTrigger && currentTrigger.getAttribute("role") === "menuitem") {
      const parentMenu = currentTrigger.closest('[role="menu"]');
      if (!parentMenu) break;
      parentMenu.style.display = "none";
      currentTrigger.setAttribute("aria-expanded", "false");
      const parentTriggerId = parentMenu.getAttribute("aria-labelledby");
      if (!parentTriggerId) break;
      const nextTrigger = document.getElementById(parentTriggerId);
      if (!nextTrigger) break;
      currentTrigger = nextTrigger;
    }
  }
  intializeMenuItems();
  function handleItemsKeydown(event, menuItem, menuItemIndex) {
    switch (event.key) {
      case "ArrowLeft": {
        if (event.key === "ArrowLeft" && triggerButton.getAttribute("role") === "menuitem") {
          event.preventDefault();
          closeMenu();
          return;
        }
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        moveFocus2(toNodeListLike(getFilteredItems()), menuItemIndex, -1);
        break;
      }
      case "ArrowRight": {
        if (event.key === "ArrowRight" && hasSubmenu(menuItem)) {
          event.preventDefault();
          const submenuId = menuItem.getAttribute("aria-controls");
          if (submenuId) {
            openSubmenu(submenuId);
            return;
          }
        }
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        moveFocus2(toNodeListLike(getFilteredItems()), menuItemIndex, 1);
        break;
      }
      case "Home": {
        event.preventDefault();
        focusItemAtIndex(getFilteredItems(), 0);
        break;
      }
      case "End": {
        event.preventDefault();
        const items = getFilteredItems();
        focusItemAtIndex(items, items.length - 1);
        break;
      }
      case "Escape": {
        event.preventDefault();
        closeMenu();
        triggerButton.focus();
        if (onOpenChange) {
          onOpenChange(false);
        }
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        if (hasSubmenu(menuItem)) {
          const submenuId = menuItem.getAttribute("aria-controls");
          if (submenuId) {
            openSubmenu(submenuId);
            return;
          }
        }
        menuItem.click();
        closeMenu();
        if (onOpenChange) {
          onOpenChange(false);
        }
        break;
      }
      case "Tab": {
        closeMenu();
        closeAncestorMenusFromTrigger(triggerButton);
        if (onOpenChange) {
          onOpenChange(false);
        }
        break;
      }
      default:
        break;
    }
  }
  function isItemInNestedSubmenu(item) {
    let parent = item.parentElement;
    while (parent && parent !== menuDiv) {
      if (parent.getAttribute("role") === "menu") {
        return true;
      }
      if (parent.id) {
        const parentMenuTrigger = menuDiv.querySelector(`[aria-controls="${parent.id}"]`);
        if (parentMenuTrigger) {
          return true;
        }
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
        triggerId: submenuTrigger.id,
        callback
      });
      submenuInstances.set(submenuId, submenuInstance);
    }
    submenuInstance.openMenu();
  }
  function onOpenChange(isOpen) {
    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(isOpen);
      } catch (error) {
        console.error("[aria-ease] Error in menu onOpenChange callback:", error);
      }
    }
  }
  function addListeners() {
    const items = getFilteredItems();
    items.forEach((menuItem, index) => {
      if (!handlerMap.has(menuItem)) {
        const handler = (event) => handleItemsKeydown(event, menuItem, index);
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
    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(true);
      } catch (error) {
        console.error("[aria-ease] Error in menu onOpenChange callback:", error);
      }
    }
  }
  function closeMenu() {
    submenuInstances.forEach((instance) => instance.closeMenu());
    setAria(false);
    menuDiv.style.display = "none";
    removeListeners();
    triggerButton.focus();
    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(false);
      } catch (error) {
        console.error("[aria-ease] Error in menu onOpenChange callback:", error);
      }
    }
  }
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
        case "Enter":
          event.preventDefault();
          selectRadio(index);
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
function makeComboboxAccessible({ comboboxInputId, comboboxButtonId, listBoxId, listBoxItemsClass, callback }) {
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
    if (index >= 0 && index < visibleItems.length) {
      const activeItem = visibleItems[index];
      const itemId = activeItem.id || `${listBoxId}-option-${index}`;
      if (!activeItem.id) {
        activeItem.id = itemId;
      }
      comboboxInput.setAttribute("aria-activedescendant", itemId);
      if (typeof activeItem.scrollIntoView === "function") {
        activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      if (callback?.onActiveDescendantChange) {
        try {
          callback.onActiveDescendantChange(itemId, activeItem);
        } catch (error) {
          console.error("[aria-ease] Error in combobox onActiveDescendantChange callback:", error);
        }
      }
    } else {
      comboboxInput.setAttribute("aria-activedescendant", "");
    }
    activeIndex = index;
  }
  function openListbox() {
    comboboxInput.setAttribute("aria-expanded", "true");
    listBox.style.display = "block";
    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(true);
      } catch (error) {
        console.error("[aria-ease] Error in combobox onOpenChange callback:", error);
      }
    }
  }
  function closeListbox() {
    comboboxInput.setAttribute("aria-expanded", "false");
    comboboxInput.setAttribute("aria-activedescendant", "");
    listBox.style.display = "none";
    activeIndex = -1;
    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(false);
      } catch (error) {
        console.error("[aria-ease] Error in combobox onOpenChange callback:", error);
      }
    }
  }
  function selectOption(item) {
    const value = item.textContent?.trim() || "";
    comboboxInput.value = value;
    item.setAttribute("aria-selected", "true");
    closeListbox();
    if (callback?.onSelect) {
      try {
        callback.onSelect(item);
      } catch (error) {
        console.error("[aria-ease] Error in combobox onSelect callback:", error);
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
          comboboxInput.setAttribute("aria-activedescendant", "");
          const visibleItems2 = getVisibleItems();
          visibleItems2.forEach((item) => {
            if (item.getAttribute("aria-selected") === "true") item.setAttribute("aria-selected", "false");
          });
          if (callback?.onClear) {
            try {
              callback.onClear();
            } catch (error) {
              console.error("[aria-ease] Error in combobox onClear callback:", error);
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
        if (isOpen && activeIndex >= 0 && activeIndex < visibleItems.length) {
          selectOption(visibleItems[activeIndex]);
        }
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
    let selectedValue = null;
    for (const item of items) {
      if (item.getAttribute("aria-selected") === "true") {
        selectedValue = item.textContent?.trim() || null;
        break;
      }
    }
    if (!selectedValue && comboboxInput.value) {
      selectedValue = comboboxInput.value.trim();
    }
    items.forEach((item, index) => {
      item.setAttribute("role", "option");
      const itemValue = item.textContent?.trim() || "";
      if (selectedValue && itemValue === selectedValue) {
        item.setAttribute("aria-selected", "true");
      } else {
        item.setAttribute("aria-selected", "false");
      }
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
  return { cleanup, refresh, openListbox, closeListbox };
}

// src/tabs/src/makeTabsAccessible/makeTabsAccessible.ts
function makeTabsAccessible({ tabListId, tabsClass, tabPanelsClass, orientation = "horizontal", activateOnFocus = true, callback }) {
  const tabList = document.querySelector(`#${tabListId}`);
  if (!tabList) {
    console.error(`[aria-ease] Element with id="${tabListId}" not found. Make sure the tab list container exists before calling makeTabsAccessible.`);
    return { cleanup: () => {
    } };
  }
  const tabs = Array.from(tabList.querySelectorAll(`.${tabsClass}`));
  if (tabs.length === 0) {
    console.error(`[aria-ease] No elements with class="${tabsClass}" found. Make sure tab buttons exist before calling makeTabsAccessible.`);
    return { cleanup: () => {
    } };
  }
  const tabPanels = Array.from(document.querySelectorAll(`.${tabPanelsClass}`));
  if (tabPanels.length === 0) {
    console.error(`[aria-ease] No elements with class="${tabPanelsClass}" found. Make sure tab panels exist before calling makeTabsAccessible.`);
    return { cleanup: () => {
    } };
  }
  if (tabs.length !== tabPanels.length) {
    console.error(`[aria-ease] Tab/panel mismatch: found ${tabs.length} tabs but ${tabPanels.length} panels.`);
    return { cleanup: () => {
    } };
  }
  const handlerMap = /* @__PURE__ */ new WeakMap();
  const clickHandlerMap = /* @__PURE__ */ new WeakMap();
  const contextMenuHandlerMap = /* @__PURE__ */ new WeakMap();
  let activeTabIndex = 0;
  function initialize() {
    tabList.setAttribute("role", "tablist");
    tabList.setAttribute("aria-orientation", orientation);
    tabs.forEach((tab, index) => {
      const panel = tabPanels[index];
      if (!tab.id) {
        tab.id = `${tabListId}-tab-${index}`;
      }
      if (!panel.id) {
        panel.id = `${tabListId}-panel-${index}`;
      }
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panel.id);
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tab.id);
      panel.hidden = true;
      const hasFocusableContent = panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!hasFocusableContent) {
        panel.setAttribute("tabindex", "0");
      }
    });
    activateTab(0, false);
  }
  function activateTab(index, shouldFocus = true) {
    if (index < 0 || index >= tabs.length) {
      console.error(`[aria-ease] Invalid tab index: ${index}`);
      return;
    }
    const previousIndex = activeTabIndex;
    tabs.forEach((tab, i) => {
      const panel = tabPanels[i];
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
      panel.hidden = true;
    });
    const activeTab = tabs[index];
    const activePanel = tabPanels[index];
    activeTab.setAttribute("aria-selected", "true");
    activeTab.setAttribute("tabindex", "0");
    activePanel.hidden = false;
    if (shouldFocus) {
      activeTab.focus();
    }
    activeTabIndex = index;
    if (callback?.onTabChange && previousIndex !== index) {
      try {
        callback.onTabChange(index, previousIndex);
      } catch (error) {
        console.error("[aria-ease] Error in tabs onTabChange callback:", error);
      }
    }
  }
  function moveFocus2(direction) {
    const currentFocusedIndex = tabs.findIndex((tab) => tab === document.activeElement);
    const currentIndex = currentFocusedIndex !== -1 ? currentFocusedIndex : activeTabIndex;
    let newIndex = currentIndex;
    switch (direction) {
      case "first":
        newIndex = 0;
        break;
      case "last":
        newIndex = tabs.length - 1;
        break;
      case "next":
        newIndex = (currentIndex + 1) % tabs.length;
        break;
      case "prev":
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
    }
    tabs[newIndex].focus();
    tabs[newIndex].setAttribute("tabindex", "0");
    tabs[activeTabIndex].setAttribute("tabindex", "-1");
    if (activateOnFocus) {
      activateTab(newIndex, false);
    } else {
      const currentActive = activeTabIndex;
      tabs.forEach((tab, i) => {
        if (i === newIndex) {
          tab.setAttribute("tabindex", "0");
        } else if (i !== currentActive) {
          tab.setAttribute("tabindex", "-1");
        }
      });
    }
  }
  function handleTabClick(index) {
    return () => {
      activateTab(index);
    };
  }
  function handleTabKeydown(index) {
    return (event) => {
      const { key } = event;
      let handled = false;
      if (orientation === "horizontal") {
        switch (key) {
          case "ArrowLeft":
            event.preventDefault();
            moveFocus2("prev");
            handled = true;
            break;
          case "ArrowRight":
            event.preventDefault();
            moveFocus2("next");
            handled = true;
            break;
        }
      } else {
        switch (key) {
          case "ArrowUp":
            event.preventDefault();
            moveFocus2("prev");
            handled = true;
            break;
          case "ArrowDown":
            event.preventDefault();
            moveFocus2("next");
            handled = true;
            break;
        }
      }
      if (!handled) {
        switch (key) {
          case "Home":
            event.preventDefault();
            moveFocus2("first");
            break;
          case "End":
            event.preventDefault();
            moveFocus2("last");
            break;
          case " ":
          case "Enter":
            if (!activateOnFocus) {
              event.preventDefault();
              activateTab(index);
            }
            break;
          case "F10":
            if (event.shiftKey && callback?.onContextMenu) {
              event.preventDefault();
              try {
                callback.onContextMenu(index, tabs[index]);
              } catch (error) {
                console.error("[aria-ease] Error in tabs onContextMenu callback:", error);
              }
            }
            break;
        }
      }
    };
  }
  function handleTabContextMenu(index) {
    return (event) => {
      if (callback?.onContextMenu) {
        event.preventDefault();
        try {
          callback.onContextMenu(index, tabs[index]);
        } catch (error) {
          console.error("[aria-ease] Error in tabs onContextMenu callback:", error);
        }
      }
    };
  }
  function addListeners() {
    tabs.forEach((tab, index) => {
      const clickHandler = handleTabClick(index);
      const keydownHandler = handleTabKeydown(index);
      const contextMenuHandler = handleTabContextMenu(index);
      tab.addEventListener("click", clickHandler);
      tab.addEventListener("keydown", keydownHandler);
      if (callback?.onContextMenu) {
        tab.addEventListener("contextmenu", contextMenuHandler);
        contextMenuHandlerMap.set(tab, contextMenuHandler);
      }
      handlerMap.set(tab, keydownHandler);
      clickHandlerMap.set(tab, clickHandler);
    });
  }
  function removeListeners() {
    tabs.forEach((tab) => {
      const keydownHandler = handlerMap.get(tab);
      const clickHandler = clickHandlerMap.get(tab);
      const contextMenuHandler = contextMenuHandlerMap.get(tab);
      if (keydownHandler) {
        tab.removeEventListener("keydown", keydownHandler);
        handlerMap.delete(tab);
      }
      if (clickHandler) {
        tab.removeEventListener("click", clickHandler);
        clickHandlerMap.delete(tab);
      }
      if (contextMenuHandler) {
        tab.removeEventListener("contextmenu", contextMenuHandler);
        contextMenuHandlerMap.delete(tab);
      }
    });
  }
  function cleanup() {
    removeListeners();
    tabs.forEach((tab, index) => {
      const panel = tabPanels[index];
      tab.removeAttribute("role");
      tab.removeAttribute("aria-selected");
      tab.removeAttribute("aria-controls");
      tab.removeAttribute("tabindex");
      panel.removeAttribute("role");
      panel.removeAttribute("aria-labelledby");
      panel.removeAttribute("tabindex");
      panel.hidden = false;
    });
    tabList.removeAttribute("role");
    tabList.removeAttribute("aria-orientation");
  }
  function refresh() {
    removeListeners();
    const newTabs = Array.from(tabList.querySelectorAll(`.${tabsClass}`));
    const newPanels = Array.from(document.querySelectorAll(`.${tabPanelsClass}`));
    tabs.length = 0;
    tabs.push(...newTabs);
    tabPanels.length = 0;
    tabPanels.push(...newPanels);
    initialize();
    addListeners();
  }
  initialize();
  addListeners();
  return { activateTab, cleanup, refresh };
}

// src/utils/test/dsl/src/state-packs/combobox/comboboxStatePack.ts
var COMBOBOX_STATES = {
  "popup.open": {
    setup: [
      {
        when: ["keyboard", "textInput"],
        steps: () => [
          { type: "keypress", target: "input", key: "ArrowDown" }
        ]
      },
      {
        when: ["pointer"],
        steps: () => [
          { type: "click", target: "button" }
        ]
      }
    ],
    assertion: isComboboxOpen
  },
  "popup.closed": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          /* { type: "keypress", target: "input", key: "Escape" } */
        ]
      },
      {
        when: ["pointer"],
        steps: () => [
          /* { type: "click", target: "button" } */
        ]
      }
    ],
    assertion: [...isComboboxClosed(), ...isActiveDescendantEmpty()]
  },
  "main.focused": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "focus", target: "main" }
        ]
      }
    ],
    assertion: isMainFocused
  },
  "main.notFocused": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          //what to do here?
        ]
      }
    ],
    assertion: isMainNotFocused
  },
  "input.filled": {
    setup: [
      {
        when: ["keyboard", "textInput"],
        steps: () => [
          { type: "type", target: "input", value: "test" }
        ]
      }
    ],
    assertion: isInputFilled
  },
  "input.notFilled": {
    setup: [
      {
        when: ["keyboard", "textInput"],
        steps: () => [
          { type: "type", target: "input", value: "" }
        ]
      }
    ],
    assertion: isInputNotFilled
  },
  "activeOption.first": {
    requires: ["popup.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "input", key: "ArrowDown" }
        ]
      }
    ],
    assertion: isActiveDescendantFirst
  },
  "activeOption.last": {
    requires: ["activeOption.first"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "input", key: "ArrowUp" }
        ]
      }
    ],
    assertion: isActiveDescendantLast
  },
  "activeDescendant.notEmpty": {
    requires: [],
    setup: [
      {
        when: ["keyboard"],
        steps: () => []
      }
    ],
    assertion: isActiveDescendantNotEmpty
  },
  "activeDescendant.Empty": {
    requires: [],
    setup: [
      {
        when: ["keyboard"],
        steps: () => []
      }
    ],
    assertion: isActiveDescendantEmpty
  },
  "selectedOption.first": {
    requires: ["popup.open"],
    setup: [
      {
        when: ["pointer"],
        steps: () => [
          { type: "click", target: "relative", relativeTarget: "first" }
        ]
      }
    ],
    assertion: () => isAriaSelected("first")
  },
  "selectedOption.last": {
    requires: ["popup.open"],
    setup: [
      {
        when: ["pointer"],
        steps: () => [
          { type: "click", target: "relative", relativeTarget: "last" }
        ]
      }
    ],
    assertion: () => isAriaSelected("last")
  }
};
function isComboboxOpen() {
  return [
    {
      target: "popup",
      assertion: "toBeVisible",
      failureMessage: "Expected popup to be visible"
    },
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-expanded",
      expectedValue: "true",
      failureMessage: "Expect combobox main to have aria-expanded='true'."
    }
  ];
}
function isComboboxClosed() {
  return [
    {
      target: "popup",
      assertion: "notToBeVisible",
      failureMessage: "Expected popup to be closed"
    },
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-expanded",
      expectedValue: "false",
      failureMessage: "Expect combobox main to have aria-expanded='false'."
    }
  ];
}
function isActiveDescendantFirst() {
  return [
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-activedescendant",
      expectedValue: { ref: "relative", relativeTarget: "first", property: "id" },
      failureMessage: "Expected aria-activedescendant on main to match the id of the first option."
    }
  ];
}
function isActiveDescendantLast() {
  return [
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-activedescendant",
      expectedValue: { ref: "relative", relativeTarget: "last", property: "id" },
      failureMessage: "Expected aria-activedescendant on main to match the id of the last option."
    }
  ];
}
function isActiveDescendantNotEmpty() {
  return [
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-activedescendant",
      expectedValue: "!empty",
      failureMessage: "Expected aria-activedescendant on main to not be empty."
    }
  ];
}
function isActiveDescendantEmpty() {
  return [
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-activedescendant",
      expectedValue: "",
      failureMessage: "Expected aria-activedescendant on main to be empty."
    }
  ];
}
function isAriaSelected(index) {
  return [
    {
      target: "relative",
      relativeTarget: index,
      assertion: "toHaveAttribute",
      attribute: "aria-selected",
      expectedValue: "true",
      failureMessage: `Expected ${index} option to have aria-selected='true'.`
    }
  ];
}
function isMainFocused() {
  return [
    {
      target: "main",
      assertion: "toHaveFocus",
      failureMessage: "Expected main to be focused."
    }
  ];
}
function isMainNotFocused() {
  return [
    {
      target: "main",
      assertion: "notToHaveFocus",
      failureMessage: "Expected main to not have focused."
    }
  ];
}
function isInputFilled() {
  return [
    {
      target: "input",
      assertion: "toHaveValue",
      expectedValue: "test",
      failureMessage: "Expected input to have the value 'test'."
    }
  ];
}
function isInputNotFilled() {
  return [
    {
      target: "input",
      assertion: "toHaveValue",
      expectedValue: "",
      failureMessage: "Expected input to have the value ''."
    }
  ];
}

// src/utils/test/dsl/src/state-packs/menu/menuStatePack.ts
var MENU_STATES = {
  "popup.open": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "main", key: "Enter" }
        ]
      },
      {
        when: ["pointer"],
        steps: () => [
          { type: "click", target: "main" }
        ]
      }
    ],
    assertion: isMenuPopupOpen
  },
  "popup.closed": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          // component resets after each test so popup is closed
        ]
      },
      {
        when: ["pointer"],
        steps: () => []
      }
    ],
    assertion: isMenuPopupClosed
  },
  "main.focused": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "focus", target: "main" }
        ]
      }
    ],
    assertion: isMainFocused2
  },
  "main.notFocused": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          //what to do here?
        ]
      }
    ],
    assertion: isMainNotFocused2
  },
  "activeItem.first": {
    requires: ["popup.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          // By default, the first item should be active when the menu opens, so no action is needed to set this state
        ]
      }
    ],
    assertion: isActiveItemFirst
  },
  "activeItem.last": {
    requires: ["popup.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "main", key: "ArrowUp" }
        ]
      }
    ],
    assertion: isActiveItemLast
  },
  "submenu.open": {
    requires: ["popup.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "submenuTrigger", key: "ArrowRight" }
        ]
      },
      {
        when: ["pointer"],
        steps: () => [
          { type: "click", target: "submenuTrigger" }
        ]
      }
    ],
    assertion: isSubmenuPopupOpen
  },
  "submenu.closed": {
    requires: ["submenu.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "submenuTrigger", key: "ArrowLeft" }
        ]
      },
      {
        when: ["pointer"],
        steps: () => [
          { type: "click", target: "submenuTrigger" }
        ]
      }
    ],
    assertion: isSubmenuPopupClosed
  },
  "submenuTrigger.focused": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "focus", target: "submenuTrigger" }
        ]
      }
    ],
    assertion: isSubmenuTriggerFocused
  },
  "submenuTrigger.notFocused": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          //what to do here?
        ]
      }
    ],
    assertion: isSubmenuTriggerNotFocused
  },
  "submenuActiveItem.first": {
    requires: ["submenu.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          // By default, the first item should be active when the submenu opens, so no action is needed to set this state
        ]
      },
      {
        when: ["pointer"],
        steps: () => []
      }
    ],
    assertion: isSubmenuActiveItemFirst
  }
};
function isMenuPopupOpen() {
  return [
    {
      target: "popup",
      assertion: "toBeVisible",
      failureMessage: "Expected popup to be visible"
    },
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-expanded",
      expectedValue: "true",
      failureMessage: "Expect menu main to have aria-expanded='true'."
    }
  ];
}
function isMenuPopupClosed() {
  return [
    {
      target: "popup",
      assertion: "notToBeVisible",
      failureMessage: "Expected popup to be closed"
    },
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-expanded",
      expectedValue: "false",
      failureMessage: "Expect menu main to have aria-expanded='false'."
    }
  ];
}
function isMainFocused2() {
  return [
    {
      target: "main",
      assertion: "toHaveFocus",
      failureMessage: "Expected menu main to be focused."
    }
  ];
}
function isMainNotFocused2() {
  return [
    {
      target: "main",
      assertion: "notToHaveFocus",
      failureMessage: "Expected menu main to not have focused."
    }
  ];
}
function isActiveItemFirst() {
  return [
    {
      target: "relative",
      assertion: "toHaveFocus",
      expectedValue: "first",
      failureMessage: "First menu item should have focus."
    }
  ];
}
function isActiveItemLast() {
  return [
    {
      target: "relative",
      assertion: "toHaveFocus",
      expectedValue: "last",
      failureMessage: "Last menu item should have focus."
    }
  ];
}
function isSubmenuPopupOpen() {
  return [
    {
      target: "submenu",
      assertion: "toBeVisible",
      failureMessage: "Expected submenu to be visible"
    },
    {
      target: "submenuTrigger",
      assertion: "toHaveAttribute",
      attribute: "aria-expanded",
      expectedValue: "true",
      failureMessage: "Expect submenu trigger to have aria-expanded='true'."
    }
  ];
}
function isSubmenuPopupClosed() {
  return [
    {
      target: "submenu",
      assertion: "notToBeVisible",
      failureMessage: "Expected submenu to be closed"
    },
    {
      target: "submenuTrigger",
      assertion: "toHaveAttribute",
      attribute: "aria-expanded",
      expectedValue: "false",
      failureMessage: "Expect submenu trigger to have aria-expanded='false'."
    }
  ];
}
function isSubmenuTriggerFocused() {
  return [
    {
      target: "submenuTrigger",
      assertion: "toHaveFocus",
      failureMessage: "Expected submenu trigger to be focused."
    }
  ];
}
function isSubmenuTriggerNotFocused() {
  return [
    {
      target: "submenuTrigger",
      assertion: "notToHaveFocus",
      failureMessage: "Expected submenu trigger to not have focused."
    }
  ];
}
function isSubmenuActiveItemFirst() {
  return [
    {
      target: "submenuItems",
      assertion: "toHaveFocus",
      failureMessage: "First interactive item in the submenu should have focus after Right Arrow open the submenu."
    }
  ];
}

// src/utils/test/dsl/src/state-packs/Capability.ts
function hasCapabilities(ctx, requiredCaps) {
  return requiredCaps.some((cap) => ctx.capabilities.includes(cap));
}
function resolveSetup(setup, ctx) {
  if (Array.isArray(setup) && setup.length && !setup[0].when) {
    setup = [{ when: ["keyboard"], steps: () => setup }];
  }
  for (const strat of setup) {
    if (hasCapabilities(ctx, strat.when)) {
      return strat.steps(ctx);
    }
  }
  throw new Error(
    `No setup strategy matches capabilities: ${ctx.capabilities.join(", ")}`
  );
}

// src/utils/test/dsl/src/contractBuilder.ts
var STATE_PACKS = {
  "combobox": COMBOBOX_STATES,
  "menu": MENU_STATES
  // Add more mappings as needed
};
var FluentContract = class {
  constructor(jsonContract) {
    this.jsonContract = jsonContract;
  }
  toJSON() {
    return this.jsonContract;
  }
};
var ContractBuilder = class {
  constructor(componentName) {
    this.componentName = componentName;
    this.statePack = STATE_PACKS[componentName] || {};
  }
  metaValue = {};
  selectorsValue = {};
  relationshipInvariants = [];
  staticAssertions = [];
  dynamicTests = [];
  statePack;
  meta(meta) {
    this.metaValue = meta;
    return this;
  }
  selectors(selectors) {
    this.selectorsValue = selectors;
    return this;
  }
  relationships(fn) {
    const statePack = this.statePack;
    const ctx = { capabilities: ["keyboard"] };
    const resolveAllSetups = (stateName, visited = /* @__PURE__ */ new Set()) => {
      if (visited.has(stateName)) return [];
      visited.add(stateName);
      const s = statePack[stateName];
      if (!s) return [];
      let actions = [];
      if (Array.isArray(s.requires)) {
        for (const req of s.requires) {
          actions = actions.concat(resolveAllSetups(req, visited));
        }
      }
      if (s.setup) actions = actions.concat(resolveSetup(s.setup, ctx));
      return actions;
    };
    const api = {
      ariaReference: (from, attribute, to) => {
        return {
          requires: (state) => {
            const setupActions = resolveAllSetups(state, /* @__PURE__ */ new Set());
            return {
              required: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "required", setup: setupActions }),
              optional: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "optional", setup: setupActions }),
              recommended: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "recommended", setup: setupActions })
            };
          },
          required: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "required" }),
          optional: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "optional" }),
          recommended: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "recommended" })
        };
      },
      contains: (parent, child) => {
        return {
          requires: (state) => {
            const setupActions = resolveAllSetups(state, /* @__PURE__ */ new Set());
            return {
              required: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "required", setup: setupActions }),
              optional: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "optional", setup: setupActions }),
              recommended: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "recommended", setup: setupActions })
            };
          },
          required: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "required" }),
          optional: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "optional" }),
          recommended: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "recommended" })
        };
      }
    };
    fn(api);
    return this;
  }
  static(fn) {
    const api = {
      target: (target) => {
        return {
          requires: (state) => {
            const statePack = this.statePack;
            const ctx = { capabilities: ["keyboard"] };
            const resolveAllSetups = (stateName, visited = /* @__PURE__ */ new Set()) => {
              if (visited.has(stateName)) return [];
              visited.add(stateName);
              const s = statePack[stateName];
              if (!s) return [];
              let actions = [];
              if (Array.isArray(s.requires)) {
                for (const req of s.requires) {
                  actions = actions.concat(resolveAllSetups(req, visited));
                }
              }
              if (s.setup) actions = actions.concat(resolveSetup(s.setup, ctx));
              return actions;
            };
            const setupActions = resolveAllSetups(state, /* @__PURE__ */ new Set());
            return {
              has: (attribute, expectedValue) => ({
                required: () => this.staticAssertions.push({ target, attribute, expectedValue, failureMessage: "", level: "required", setup: setupActions }),
                optional: () => this.staticAssertions.push({ target, attribute, expectedValue, failureMessage: "", level: "optional", setup: setupActions }),
                recommended: () => this.staticAssertions.push({ target, attribute, expectedValue, failureMessage: "", level: "recommended", setup: setupActions })
              })
            };
          },
          has: (attribute, expectedValue) => ({
            required: () => this.staticAssertions.push({ target, attribute, expectedValue, failureMessage: "", level: "required" }),
            optional: () => this.staticAssertions.push({ target, attribute, expectedValue, failureMessage: "", level: "optional" }),
            recommended: () => this.staticAssertions.push({ target, attribute, expectedValue, failureMessage: "", level: "recommended" })
          })
        };
      }
    };
    fn(api);
    return this;
  }
  when(event) {
    return new DynamicTestBuilder(this, this.statePack, event);
  }
  addDynamicTest(test) {
    this.dynamicTests.push(test);
  }
  build() {
    return {
      meta: this.metaValue,
      selectors: this.selectorsValue,
      relationships: this.relationshipInvariants.length ? this.relationshipInvariants : void 0,
      static: this.staticAssertions.length ? [{ assertions: this.staticAssertions }] : [],
      dynamic: this.dynamicTests
    };
  }
};
var DynamicTestBuilder = class {
  constructor(parent, statePack, event) {
    this.parent = parent;
    this.statePack = statePack;
    this.event = event;
  }
  _as;
  _on;
  _given = [];
  _then = [];
  _desc = "";
  _level = "required";
  as(actionType) {
    this._as = actionType;
    return this;
  }
  on(target) {
    this._on = target;
    return this;
  }
  given(states) {
    this._given = Array.isArray(states) ? states : [states];
    return this;
  }
  then(states) {
    this._then = Array.isArray(states) ? states : [states];
    return this;
  }
  describe(desc) {
    this._desc = desc;
    return this;
  }
  required() {
    this._level = "required";
    this._finalize();
    return this.parent;
  }
  optional() {
    this._level = "optional";
    this._finalize();
    return this.parent;
  }
  recommended() {
    this._level = "recommended";
    this._finalize();
    return this.parent;
  }
  _finalize() {
    const capabilityMap = {
      keypress: "keyboard",
      click: "pointer",
      type: "textInput",
      focus: "keyboard",
      hover: "pointer"
      // add more mappings as needed
    };
    const capability = capabilityMap[this._as || "keyboard"] || (this._as || "keyboard");
    const ctx = { capabilities: [capability] };
    const resolveAllSetups = (stateName, visited = /* @__PURE__ */ new Set()) => {
      if (visited.has(stateName)) return [];
      visited.add(stateName);
      const s = this.statePack[stateName];
      if (!s) return [];
      let actions = [];
      if (Array.isArray(s.requires)) {
        for (const req of s.requires) {
          actions = actions.concat(resolveAllSetups(req, visited));
        }
      }
      if (s.setup) actions = actions.concat(resolveSetup(s.setup, ctx));
      return actions;
    };
    const setup = [];
    for (const state of this._given) {
      setup.push(...resolveAllSetups(state));
    }
    const assertions = [];
    for (const state of this._then) {
      const s = this.statePack[state];
      if (s && s.assertion !== void 0) {
        let value = s.assertion;
        if (typeof value === "function") {
          try {
            value = value();
          } catch (e) {
            throw new Error(`Error calling assertion function for state '${state}': ${e.message}`);
          }
        }
        if (Array.isArray(value)) assertions.push(...value);
        else assertions.push(value);
      }
    }
    const action = [
      {
        type: this._as,
        target: this._on,
        key: this._as === "keypress" ? this.event : void 0
      }
    ];
    this.parent.addDynamicTest({
      description: this._desc || "",
      level: this._level,
      action,
      assertions,
      ...setup.length ? { setup } : {}
    });
  }
};
function createContract(componentName, define) {
  const builder = new ContractBuilder(componentName);
  define(builder);
  return new FluentContract(builder.build());
}

// src/utils/test/src/test.ts
var import_jest_axe = require("jest-axe");

// src/utils/test/src/contractTestRunner.ts
var import_promises = __toESM(require("fs/promises"), 1);
init_ContractReporter();
init_strictness();
async function runContractTests(contractPath, componentName, component, strictness) {
  const reporter = new ContractReporter(false);
  const strictnessMode = normalizeStrictness(strictness);
  if (!contractPath) {
    throw new Error(`No contract path provided for component: ${componentName}`);
  }
  const contractData = await import_promises.default.readFile(contractPath, "utf-8");
  const componentContract = JSON.parse(contractData);
  const totalTests = (componentContract.relationships?.length || 0) + (componentContract.static[0]?.assertions.length || 0) + componentContract.dynamic.length;
  reporter.start(componentName, totalTests);
  const failures = [];
  const passes = [];
  const skipped = [];
  const warnings = [];
  const classifyFailure = (message, levelRaw) => {
    const level = normalizeLevel(levelRaw);
    const enforcement = resolveEnforcement(level, strictnessMode);
    if (enforcement === "error") {
      failures.push(message);
      return { status: "fail", level, detail: message };
    }
    if (enforcement === "warning") {
      warnings.push(message);
      return { status: "warn", level, detail: message };
    }
    const ignoredMessage = `${message} (ignored by strictness=${strictnessMode}, level=${level})`;
    skipped.push(ignoredMessage);
    return { status: "skip", level, detail: ignoredMessage };
  };
  let staticPassed = 0;
  let staticFailed = 0;
  let staticWarnings = 0;
  for (const rel of componentContract.relationships || []) {
    const relationshipLevel = normalizeLevel(rel.level);
    if (rel.type === "aria-reference") {
      const fromSelector = componentContract.selectors[rel.from];
      const toSelector = componentContract.selectors[rel.to];
      const relDescription = `${rel.from}.${rel.attribute} references ${rel.to}`;
      if (!fromSelector || !toSelector) {
        const outcome = classifyFailure(`Relationship selector missing: from="${rel.from}" or to="${rel.to}" not found in selectors.`, rel.level);
        if (outcome.status === "fail") staticFailed += 1;
        if (outcome.status === "warn") staticWarnings += 1;
        reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
        continue;
      }
      const fromTarget = component.querySelector(fromSelector);
      const toTarget = component.querySelector(toSelector);
      if (!fromTarget || !toTarget) {
        const outcome = classifyFailure(`Relationship target not found: ${!fromTarget ? rel.from : rel.to}.`, rel.level);
        if (outcome.status === "fail") staticFailed += 1;
        if (outcome.status === "warn") staticWarnings += 1;
        reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
        continue;
      }
      const toId = toTarget.getAttribute("id");
      const attrValue = fromTarget.getAttribute(rel.attribute) || "";
      if (!toId) {
        const outcome = classifyFailure(`Relationship target "${rel.to}" must have an id for ${rel.attribute} validation.`, rel.level);
        if (outcome.status === "fail") staticFailed += 1;
        if (outcome.status === "warn") staticWarnings += 1;
        reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
        continue;
      }
      const references = attrValue.split(/\s+/).filter(Boolean);
      if (!references.includes(toId)) {
        const outcome = classifyFailure(`Expected ${rel.from} ${rel.attribute} to reference id "${toId}", found "${attrValue}".`, rel.level);
        if (outcome.status === "fail") staticFailed += 1;
        if (outcome.status === "warn") staticWarnings += 1;
        reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
        continue;
      }
      passes.push(`Relationship valid: ${rel.from}.${rel.attribute} -> ${rel.to} (id=${toId}).`);
      staticPassed += 1;
      reporter.reportStaticTest(relDescription, "pass", void 0, relationshipLevel);
      continue;
    }
    if (rel.type === "contains") {
      const parentSelector = componentContract.selectors[rel.parent];
      const childSelector = componentContract.selectors[rel.child];
      const relDescription = `${rel.parent} contains ${rel.child}`;
      if (!parentSelector || !childSelector) {
        const outcome = classifyFailure(`Relationship selector missing: parent="${rel.parent}" or child="${rel.child}" not found in selectors.`, rel.level);
        if (outcome.status === "fail") staticFailed += 1;
        if (outcome.status === "warn") staticWarnings += 1;
        reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
        continue;
      }
      const parentTarget = component.querySelector(parentSelector);
      if (!parentTarget) {
        const outcome = classifyFailure(`Relationship parent target not found: ${rel.parent}.`, rel.level);
        if (outcome.status === "fail") staticFailed += 1;
        if (outcome.status === "warn") staticWarnings += 1;
        reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
        continue;
      }
      const nestedChild = parentTarget.querySelector(childSelector);
      if (!nestedChild) {
        const outcome = classifyFailure(`Expected ${rel.parent} to contain descendant matching selector for ${rel.child}.`, rel.level);
        if (outcome.status === "fail") staticFailed += 1;
        if (outcome.status === "warn") staticWarnings += 1;
        reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
        continue;
      }
      passes.push(`Relationship valid: ${rel.parent} contains ${rel.child}.`);
      staticPassed += 1;
      reporter.reportStaticTest(relDescription, "pass", void 0, relationshipLevel);
    }
  }
  for (const test of componentContract.static[0].assertions) {
    if (test.target !== "relative") {
      const staticLevel = normalizeLevel(test.level);
      const selector = componentContract.selectors[test.target];
      if (!selector) {
        const outcome = classifyFailure(`Selector for target ${test.target} not found.`, test.level);
        if (outcome.status === "fail") staticFailed += 1;
        if (outcome.status === "warn") staticWarnings += 1;
        reporter.reportStaticTest(`${test.target} has required ARIA attributes`, outcome.status, outcome.detail, outcome.level);
        continue;
      }
      const target = component.querySelector(selector);
      if (!target) {
        const outcome = classifyFailure(`Target ${test.target} not found.`, test.level);
        if (outcome.status === "fail") staticFailed += 1;
        if (outcome.status === "warn") staticWarnings += 1;
        reporter.reportStaticTest(`${test.target} has required ARIA attributes`, outcome.status, outcome.detail, outcome.level);
        continue;
      }
      const attributeValue = target.getAttribute(test.attribute);
      if (!test.expectedValue) {
        const attributes = test.attribute.split(" | ");
        const hasAnyAttribute = attributes.some((attr) => target.hasAttribute(attr));
        if (!hasAnyAttribute) {
          const outcome = classifyFailure(test.failureMessage + ` None of the attributes "${test.attribute}" are present.`, test.level);
          if (outcome.status === "fail") staticFailed += 1;
          if (outcome.status === "warn") staticWarnings += 1;
          reporter.reportStaticTest(`${test.target} has ${test.attribute}`, outcome.status, outcome.detail, outcome.level);
        } else {
          passes.push(`At least one of the attributes "${test.attribute}" exists on the element.`);
          staticPassed += 1;
          reporter.reportStaticTest(`${test.target} has ${test.attribute}`, "pass", void 0, staticLevel);
        }
      } else if (!attributeValue || typeof test.expectedValue === "string" && !test.expectedValue.split(" | ").includes(attributeValue)) {
        const outcome = classifyFailure(test.failureMessage + ` Attribute value does not match expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`, test.level);
        if (outcome.status === "fail") staticFailed += 1;
        if (outcome.status === "warn") staticWarnings += 1;
        reporter.reportStaticTest(`${test.target} has ${test.attribute}="${test.expectedValue}"`, outcome.status, outcome.detail, outcome.level);
      } else {
        passes.push(`Attribute value matches expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
        staticPassed += 1;
        reporter.reportStaticTest(`${test.target} has ${test.attribute}="${attributeValue}"`, "pass", void 0, staticLevel);
      }
    }
  }
  for (const dynamicTest of componentContract.dynamic) {
    skipped.push(dynamicTest.description);
    reporter.reportTest({ description: dynamicTest.description, level: dynamicTest.level }, "skip");
  }
  reporter.reportStatic(staticPassed, staticFailed, staticWarnings);
  reporter.summary(failures);
  return { passes, failures, skipped, warnings };
}

// src/utils/test/src/test.ts
init_playwrightTestHarness();
init_strictness();
var import_path6 = __toESM(require("path"), 1);
async function testUiComponent(componentName, component, url, options = {}) {
  if (!componentName || typeof componentName !== "string") {
    throw new Error("\u274C testUiComponent requires a valid componentName (string)");
  }
  if (!url && (!component || !(component instanceof HTMLElement))) {
    throw new Error("\u274C testUiComponent requires either a valid component (HTMLElement) or a URL");
  }
  if (url && typeof url !== "string") {
    throw new Error("\u274C testUiComponent url parameter must be a string");
  }
  let results;
  if (component) {
    try {
      results = await (0, import_jest_axe.axe)(component);
    } catch (error) {
      throw new Error(
        `\u274C Axe accessibility scan failed
Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  } else {
    results = { violations: [] };
  }
  async function checkDevServer(url2) {
    try {
      const response = await fetch(url2, {
        method: "HEAD",
        signal: AbortSignal.timeout(1e3)
      });
      if (response.ok || response.status === 304) {
        return url2;
      }
    } catch {
      return null;
    }
    return null;
  }
  let strictness = normalizeStrictness(options.strictness);
  let config = {};
  let configBaseDir = typeof process !== "undefined" ? process.cwd() : "";
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    try {
      const { loadConfig: loadConfig2 } = await Promise.resolve().then(() => (init_configLoader(), configLoader_exports));
      const result2 = await loadConfig2(process.cwd());
      config = result2.config;
      if (result2.configPath) {
        configBaseDir = import_path6.default.dirname(result2.configPath);
      }
      if (options.strictness === void 0) {
        const componentStrictness = config.test?.components?.find((comp) => comp?.name === componentName)?.strictness;
        strictness = normalizeStrictness(componentStrictness ?? config.test?.strictness);
      }
    } catch {
      if (options.strictness === void 0) {
        strictness = "balanced";
      }
    }
  }
  let contract;
  try {
    if (url) {
      const devServerUrl = await checkDevServer(url);
      if (devServerUrl) {
        console.log(`\u{1F3AD} Running Playwright tests on ${devServerUrl}`);
        const { runContractTestsPlaywright: runContractTestsPlaywright2 } = await Promise.resolve().then(() => (init_contractTestRunnerPlaywright(), contractTestRunnerPlaywright_exports));
        contract = await runContractTestsPlaywright2(componentName, devServerUrl, strictness, config, configBaseDir);
      } else {
        throw new Error(
          `\u274C Dev server not running at ${url}
Please start your dev server and try again.`
        );
      }
    } else if (component) {
      console.log(`\u{1F3AD} Running component contract tests in JSDOM mode`);
      const contractPath = config.test?.components?.find((comp) => comp?.name === componentName)?.contractPath;
      if (!contractPath) {
        throw new Error(`\u274C No contract path found for component: ${componentName}`);
      }
      contract = await runContractTests(
        import_path6.default.resolve(configBaseDir, contractPath),
        componentName,
        component,
        strictness
      );
    } else {
      throw new Error("\u274C Either component or URL must be provided");
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
  return {
    passes: [],
    failures: [],
    skipped: []
  };
};
if (typeof window === "undefined") {
  runTest = async () => {
    console.log(`\u{1F680} Running component accessibility tests...
`);
    const { exec } = await import("child_process");
    const chalk2 = (await import("chalk")).default;
    return new Promise((resolve, reject) => {
      exec(
        `npx vitest --run --reporter verbose`,
        async (error, stdout, stderr) => {
          console.log(stdout);
          if (stderr) console.error(stderr);
          const testsPassed = !error || error.code === 0;
          if (testsPassed) {
            try {
              const { displayBadgeInfo: displayBadgeInfo2, promptAddBadge: promptAddBadge2 } = await Promise.resolve().then(() => (init_badgeHelper(), badgeHelper_exports));
              displayBadgeInfo2("component");
              await promptAddBadge2("component", process.cwd());
              console.log(chalk2.dim("\n" + "\u2500".repeat(60)));
              console.log(chalk2.cyan("\u{1F499} Found aria-ease helpful?"));
              console.log(chalk2.white("   \u2022 Star us on GitHub: ") + chalk2.blue.underline("https://github.com/aria-ease/aria-ease"));
              console.log(chalk2.white("   \u2022 Share feedback: ") + chalk2.blue.underline("https://github.com/aria-ease/aria-ease/discussions"));
              console.log(chalk2.dim("\u2500".repeat(60) + "\n"));
            } catch (badgeError) {
              console.error("Warning: Could not display badge prompt:", badgeError);
            }
            resolve({ passes: [], failures: [], skipped: [] });
            process.exit(0);
          } else {
            const exitCode = error?.code || 1;
            reject(new Error(`Tests failed with code ${exitCode}`));
            process.exit(exitCode);
          }
        }
      );
    });
  };
}
async function cleanupTests() {
  await closeSharedBrowser();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cleanupTests,
  createContract,
  makeAccordionAccessible,
  makeBlockAccessible,
  makeCheckboxAccessible,
  makeComboboxAccessible,
  makeMenuAccessible,
  makeRadioAccessible,
  makeTabsAccessible,
  makeToggleAccessible,
  testUiComponent
});
