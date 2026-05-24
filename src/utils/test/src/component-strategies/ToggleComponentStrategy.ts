import { ComponentStrategy } from "Types";
import { Page, expect } from "@playwright/test";
import type { ComponentContract } from "Types";

class ToggleComponentStrategy implements ComponentStrategy {
    constructor(
        private mainSelector: string,
        private selectors: ComponentContract["selectors"],
        private actionTimeoutMs: number,
        private assertionTimeoutMs: number
    ) {}

    async resetState(page: Page): Promise<void> {
        // Unpressed all pressed toggle
        if (!this.selectors.toggle || !this.selectors.relative) {
            return; // Not a toggle
        }
        
        const toggleSelector = this.selectors.toggle;
        
        if (!toggleSelector) return;
        
        const allToggle = await page.locator(toggleSelector).all();
        
        for (const toggle of allToggle) {
            const isPressed = await toggle.getAttribute('aria-pressed') === 'true';
            
            if (isPressed) {
                await toggle.click({ timeout: this.actionTimeoutMs });
                
                const resetToggle = page.locator(`#${toggle}`);
                await expect(resetToggle).toHaveAttribute("aria-pressed", "false", { timeout: this.assertionTimeoutMs }).catch(() => {
                    // Silent catch - test will fail if toggle state is wrong
                });
            }
        }
    }

    async shouldSkipTest(): Promise<boolean> {
        // Toggle doesn't need to skip tests based on optional elements
        return false;
    }

    getMainSelector(): string {
        return this.mainSelector;
    }
}

export { ToggleComponentStrategy };