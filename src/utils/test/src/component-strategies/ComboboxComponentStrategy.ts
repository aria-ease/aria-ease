import { ComponentStrategy } from "Types";
import { Page, expect } from "@playwright/test";
import type { ComponentContract } from "Types";

class ComboboxComponentStrategy implements ComponentStrategy {
    constructor(
        private mainSelector: string,
        private selectors: ComponentContract["selectors"],
        private actionTimeoutMs: number = 400,
        private assertionTimeoutMs: number = 400
    ) {}

    async resetState(page: Page): Promise<void> {
        // Close popup if open (combobox has a popup)
        if (!this.selectors.popup) return;
        
        const popupSelector = this.selectors.popup;
        const popupElement = page.locator(popupSelector).first();
        
        const isPopupVisible = await popupElement.isVisible().catch(() => false);
        
        if (!isPopupVisible) return;
        
        let popupClosed = false;
        
        // Strategy 1: Try Escape key (standard for combobox)
        const closeSelector = this.selectors.main;
        
        if (closeSelector) {
            const closeElement = page.locator(closeSelector).first();
            await closeElement.focus();
            await page.keyboard.press('Escape');
            
            popupClosed = await expect(popupElement).toBeHidden({ timeout: this.assertionTimeoutMs })
                .then(() => true)
                .catch(() => false);
        }
        
        // Strategy 2: Click button to toggle closed
        if (!popupClosed && this.selectors.button) {
            const buttonElement = page.locator(this.selectors.button).first();
            await buttonElement.click({ timeout: this.actionTimeoutMs });
            
            popupClosed = await expect(popupElement).toBeHidden({ timeout: this.assertionTimeoutMs })
                .then(() => true)
                .catch(() => false);
        }
        
        // Strategy 3: Click outside
        if (!popupClosed) {
            await page.mouse.click(10, 10);
            popupClosed = await expect(popupElement).toBeHidden({ timeout: this.assertionTimeoutMs })
                .then(() => true)
                .catch(() => false);
        }
        
        // Fatal error if still open
        if (!popupClosed) {
            throw new Error(
                `❌ FATAL: Cannot close combobox popup between tests. Popup remains visible after trying:\n` +
                `  1. Escape key\n` +
                `  2. Clicking button\n` +
                `  3. Clicking outside\n` +
                `This indicates a problem with the combobox component's close functionality.`
            );
        }
        
        // Clear input if exists
        if (this.selectors.input) {
            await page.locator(this.selectors.input).first().clear();
        }
    }

    async shouldSkipTest(): Promise<boolean> {
        // Combobox doesn't need to skip tests based on optional elements
        return false;
    }

    getMainSelector(): string {
        return this.mainSelector;
    }
}

export { ComboboxComponentStrategy };