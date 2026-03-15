/**
 * ActionExecutor - Handles all test actions (focus, type, click, keypress, hover)
 * Centralizes action execution logic and error handling
 */

import { Page } from "playwright";
import type { ComponentContract } from "Types";
import { RelativeTargetResolver } from "./RelativeTargetResolver";

export type ActionResult = {
  success: boolean;
  error?: string;
  shouldBreak?: boolean; // Indicates critical error that should halt test
};

export class ActionExecutor {
  constructor(
    private page: Page,
    private selectors: ComponentContract["selectors"],
    private timeoutMs: number = 400
  ) {}

  private isOptionalMenuTarget(target: string): boolean {
    return ["submenu", "submenuTrigger", "submenuItems"].includes(target);
  }

  /**
   * Check if error is due to browser/page being closed
   */
  private isBrowserClosedError(error: unknown): boolean {
    return error instanceof Error && error.message.includes("Target page, context or browser has been closed");
  }

  /**
   * Execute focus action
   */
  async focus(target: string): Promise<ActionResult> {
    try {
      const selector = this.selectors[target as keyof typeof this.selectors];
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
  async type(target: string, value: string): Promise<ActionResult> {
    try {
      const selector = this.selectors[target as keyof typeof this.selectors];
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
  async click(target: string, relativeTarget?: string): Promise<ActionResult> {
    try {
      // Special case: click outside component
      if (target === "document") {
        await this.page.mouse.click(10, 10);
        return { success: true };
      }

      // Relative target resolution
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

      // Standard click
      const selector = this.selectors[target as keyof typeof this.selectors];
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
  async keypress(target: string, key: string): Promise<ActionResult> {
    try {
      // Map human-readable key names to Playwright key codes
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

      let keyValue = keyMap[key] || key;
      if (keyValue === "Space") {
        keyValue = " ";
      } else if (keyValue.includes(" ")) {
        keyValue = keyValue.replace(/ /g, "");
      }

      // Use the currently focused element for menu-style keyboard interactions.
      if (target === "focusable" && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Escape", "Home", "End", "Tab", "Shift+Tab"].includes(keyValue)) {
        await this.page.keyboard.press(keyValue);
        return { success: true };
      }

      // Standard keypress on element
      const selector = this.selectors[target as keyof typeof this.selectors];
      if (!selector) {
        return { success: false, error: `Selector for keypress target ${target} not found.` };
      }

      const locator = this.page.locator(selector).first();
      const elementCount = await locator.count();
      
      // Element not found - submenu targets may be optional depending on the contract.
      if (elementCount === 0) {
        const optionalMenuTarget = this.isOptionalMenuTarget(target);
        return {
          success: false,
          error: optionalMenuTarget
            ? `${target} element not found (optional submenu test)`
            : `${target} element not found.`,
          shouldBreak: true // Signal to skip this test
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
  async hover(target: string, relativeTarget?: string): Promise<ActionResult> {
    try {
      // Relative target resolution
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

      // Standard hover
      const selector = this.selectors[target as keyof typeof this.selectors];
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
}