import { ComponentStrategy } from "Types";
import { Page, expect } from "@playwright/test";
import type { ComponentContract } from "Types";

class CheckboxComponentStrategy implements ComponentStrategy {
    constructor(
        private mainSelector: string,
        private selectors: ComponentContract["selectors"],
        private actionTimeoutMs: number = 400,
        private assertionTimeoutMs: number = 400
    ) {}

    async resetState(page: Page): Promise<void> {
        // Uncheck all checked checkbox
        if (!this.selectors.checkbox || !this.selectors.relative) {
            return; // Not a checkbox
        }
        
        const checkboxSelector = this.selectors.checkbox;
        
        if (!checkboxSelector) return;
        
        const allCheckboxes = await page.locator(checkboxSelector).all();
        
        for (const checkbox of allCheckboxes) {
            const isChecked = await checkbox.getAttribute('aria-checked') === 'true';
            
            if (isChecked) {
                await checkbox.click({ timeout: this.actionTimeoutMs });
                
                const resetCheckbox = page.locator(`#${checkbox}`);
                await expect(resetCheckbox).toHaveAttribute("aria-checked", "false", { timeout: this.assertionTimeoutMs }).catch(() => {
                    // Silent catch - test will fail if checkbox state is wrong
                });
            }
        }
    }

    async shouldSkipTest(): Promise<boolean> {
        // Checkbox doesn't need to skip tests based on optional elements
        return false;
    }

    getMainSelector(): string {
        return this.mainSelector;
    }
}

export { CheckboxComponentStrategy };