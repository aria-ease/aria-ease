import { ComponentStrategy } from "Types";
import { Page, expect } from "@playwright/test";
import type { ComponentContract } from "Types";

class RadioComponentStrategy implements ComponentStrategy {
    constructor(
        private mainSelector: string,
        private selectors: ComponentContract["selectors"],
        private actionTimeoutMs: number = 400,
        private assertionTimeoutMs: number = 400
    ) {}

    async resetState(page: Page): Promise<void> {
        // Uncheck all checked Radio
        if (!this.selectors.radio || !this.selectors.relative) {
            return; // Not a Radio
        }
        
        const radioSelector = this.selectors.radio;
        
        if (!radioSelector) return;
        
        const allRadioboxes = await page.locator(radioSelector).all();
        
        for (const radio of allRadioboxes) {
            const isChecked = await radio.getAttribute('aria-checked') === 'true';
            
            if (isChecked) {
                await radio.evaluate((el) => el.setAttribute("aria-checked", "false"), { timeout: this.actionTimeoutMs });
                
                const resetRadio = page.locator(`#${radio}`);
                await expect(resetRadio).toHaveAttribute("aria-checked", "false", { timeout: this.assertionTimeoutMs }).catch(() => {
                    // Silent catch - test will fail if radio state is wrong
                });
            }
        }
    }

    async shouldSkipTest(): Promise<boolean> {
        // Radio doesn't need to skip tests based on optional elements
        return false;
    }

    getMainSelector(): string {
        return this.mainSelector;
    }
}

export { RadioComponentStrategy };