/**
 * AssertionRunner - Validates test assertions (visibility, attributes, focus, values, roles)
 * Centralizes assertion logic and error reporting
 */

import { Page, Locator, expect } from "@playwright/test";
import type { ComponentContract } from "Types";
import { RelativeTargetResolver } from "./RelativeTargetResolver";

export type AssertionResult = {
  success: boolean;
  passMessage?: string;
  failMessage?: string;
};

type ContractAssertion = {
  target: string;
  assertion: string;
  attribute?: string;
  expectedValue?: string;
  failureMessage?: string;
  relativeTarget?: string;
  selectorKey?: string;
};

export class AssertionRunner {
  constructor(
    private page: Page,
    private selectors: ComponentContract["selectors"],
    private timeoutMs: number = 400
  ) {}

  /**
   * Resolve the target element for an assertion
   */
  private async resolveTarget(
    targetName: string,
    relativeTarget?: string,
    selectorKey?: string
  ): Promise<{ target: Locator | null; error?: string }> {
    try {
      if (targetName === "relative") {
        // Use selectorKey if provided (for semantic expressions like first(options))
        const relativeSelector = selectorKey
          ? this.selectors[selectorKey as keyof typeof this.selectors]
          : this.selectors.relative;
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
      const selector = this.selectors[targetName as keyof typeof this.selectors];
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
  async validateVisibility( target: Locator, targetName: string, expectedVisible: boolean, failureMessage: string, testDescription: string ): Promise<AssertionResult> {
    try {
      if (expectedVisible) {
        await expect(target).toBeVisible({ timeout: this.timeoutMs });
        return {
          success: true,
          passMessage: `${targetName} is visible as expected. Test: "${testDescription}".`
        };
      } else {
        await expect(target).toBeHidden({ timeout: this.timeoutMs });
        return {
          success: true,
          passMessage: `${targetName} is not visible as expected. Test: "${testDescription}".`
        };
      }
    } catch {
      const selector = this.selectors[targetName as keyof typeof this.selectors] || '';
      const debugState = await this.page.evaluate((sel) => {
        const el = sel ? document.querySelector(sel) : null;
        if (!el) return 'element not found';
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
  async validateAttribute( target: Locator, targetName: string, attribute: string, expectedValue: string, failureMessage: string, testDescription: string ): Promise<AssertionResult> {
    // Handle special case: !empty means attribute should have any non-empty value
    if (expectedValue === "!empty") {
      const attributeValue = await target.getAttribute(attribute);
      if (attributeValue && attributeValue.trim() !== "") {
        return {
          success: true,
          passMessage: `${targetName} has non-empty "${attribute}". Test: "${testDescription}".`
        };
      } else {
        return {
          success: false,
          failMessage: `${failureMessage} ${targetName} "${attribute}" should not be empty, found "${attributeValue}".`
        };
      }
    }

    // Handle multiple acceptable values separated by " | "
    const expectedValues = expectedValue.split(" | ").map(v => v.trim());
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
  async validateValue( target: Locator, targetName: string, expectedValue: string, failureMessage: string, testDescription: string ): Promise<AssertionResult> {
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
  async validateFocus( target: Locator, targetName: string, failureMessage: string, testDescription: string ): Promise<AssertionResult> {
    try {
      await expect(target).toBeFocused({ timeout: this.timeoutMs });
      return {
        success: true,
        passMessage: `${targetName} has focus as expected. Test: "${testDescription}".`
      };
    } catch {
      const actualFocus = await this.page.evaluate(() => {
        const focused = document.activeElement;
        return focused
          ? `${focused.tagName}#${focused.id || 'no-id'}.${focused.className || 'no-class'}`
          : 'no element focused';
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
  async validateRole(
    target: Locator,
    targetName: string,
    expectedRole: string,
    failureMessage: string,
    testDescription: string
  ): Promise<AssertionResult> {
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
  async validate(assertion: ContractAssertion, testDescription: string): Promise<AssertionResult & { target?: Locator | null }> {
    // Check for browser closed
    if (this.page.isClosed()) {
      return {
        success: false,
        failMessage: `CRITICAL: Browser/page closed before completing all tests. Increase test timeout or reduce test complexity.`
      };
    }

    // Resolve target element (support selectorKey for semantic relative assertions)
    const { target, error } = await this.resolveTarget(
      assertion.target,
      assertion.relativeTarget || assertion.expectedValue,
      assertion.selectorKey
    );
    if (error || !target) {
      return { success: false, failMessage: error || `Target ${assertion.target} not found.`, target: null };
    }

    // Special case: for input[aria-activedescendant] assertions, check that the attribute matches the id of the correct option
    if (
      assertion.target === "input" &&
      assertion.attribute === "aria-activedescendant" &&
      assertion.expectedValue === "!empty" &&
      assertion.relativeTarget && assertion.selectorKey
    ) {
      // Find the expected option element
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

    // Route to appropriate validator
    switch (assertion.assertion) {
      case "toBeVisible":
        return this.validateVisibility(target, assertion.target, true, assertion.failureMessage || '', testDescription);
      case "notToBeVisible":
        return this.validateVisibility(target, assertion.target, false, assertion.failureMessage || '', testDescription);
      case "toHaveAttribute":
        if (assertion.attribute && assertion.expectedValue !== undefined) {
          return this.validateAttribute(
            target,
            assertion.target,
            assertion.attribute,
            assertion.expectedValue,
            assertion.failureMessage || '',
            testDescription
          );
        }
        return { success: false, failMessage: "Missing attribute or expectedValue for toHaveAttribute assertion" };
      case "toHaveValue":
        if (assertion.expectedValue !== undefined) {
          return this.validateValue(target, assertion.target, assertion.expectedValue, assertion.failureMessage || '', testDescription);
        }
        return { success: false, failMessage: "Missing expectedValue for toHaveValue assertion" };
      case "toHaveFocus":
        return this.validateFocus(target, assertion.target, assertion.failureMessage || '', testDescription);
      case "toHaveRole":
        if (assertion.expectedValue !== undefined) {
          return this.validateRole(target, assertion.target, assertion.expectedValue, assertion.failureMessage || '', testDescription);
        }
        return { success: false, failMessage: "Missing expectedValue for toHaveRole assertion" };
      default:
        return { success: false, failMessage: `Unknown assertion type: ${assertion.assertion}` };
    }
  }
}