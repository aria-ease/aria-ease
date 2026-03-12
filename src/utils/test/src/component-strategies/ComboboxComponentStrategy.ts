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
        // Close popup if open (combobox has a listbox popup)
        if (!this.selectors.popup) return;
        
        const popupSelector = this.selectors.popup;
        const popupElement = page.locator(popupSelector).first();
        
        const isPopupVisible = await popupElement.isVisible().catch(() => false);
        
        if (!isPopupVisible) return;
        
        let menuClosed = false;
        
        // Strategy 1: Try Escape key (standard for combobox)
        let closeSelector = this.selectors.input; // For combobox
        if (!closeSelector && this.selectors.focusable) {
            closeSelector = this.selectors.focusable;
        } else if (!closeSelector) {
            closeSelector = this.selectors.trigger;
        }
        
        if (closeSelector) {
            const closeElement = page.locator(closeSelector).first();
            await closeElement.focus();
            await page.keyboard.press('Escape');
            
            menuClosed = await expect(popupElement).toBeHidden({ timeout: this.assertionTimeoutMs })
                .then(() => true)
                .catch(() => false);
        }
        
        // Strategy 2: Click trigger to toggle closed
        if (!menuClosed && this.selectors.trigger) {
            const triggerElement = page.locator(this.selectors.trigger).first();
            await triggerElement.click({ timeout: this.actionTimeoutMs });
            
            menuClosed = await expect(popupElement).toBeHidden({ timeout: this.assertionTimeoutMs })
                .then(() => true)
                .catch(() => false);
        }
        
        // Strategy 3: Click outside
        if (!menuClosed) {
            await page.mouse.click(10, 10);
            menuClosed = await expect(popupElement).toBeHidden({ timeout: this.assertionTimeoutMs })
                .then(() => true)
                .catch(() => false);
        }
        
        // Fatal error if still open
        if (!menuClosed) {
            throw new Error(
                `❌ FATAL: Cannot close combobox popup between tests. Popup remains visible after trying:\n` +
                `  1. Escape key\n` +
                `  2. Clicking trigger\n` +
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