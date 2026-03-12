import { ComponentStrategy, DynamicTest } from "Types";
import { Page, expect } from "@playwright/test";
import type { ComponentContract } from "Types";

class AccordionComponentStrategy implements ComponentStrategy {
    constructor(
        private mainSelector: string,
        private selectors: ComponentContract["selectors"],
        private actionTimeoutMs: number = 400,
        private assertionTimeoutMs: number = 400
    ) {}

    async resetState(page: Page): Promise<void> {
        // Collapse all expanded panels for accordion components
        if (!this.selectors.panel || !this.selectors.trigger || this.selectors.popup) {
            return; // Not an accordion or has popup (menu/combobox)
        }
        
        const triggerSelector = this.selectors.trigger;
        const panelSelector = this.selectors.panel;
        
        if (!triggerSelector || !panelSelector) return;
        
        const allTriggers = await page.locator(triggerSelector).all();
        
        for (const trigger of allTriggers) {
            const isExpanded = await trigger.getAttribute('aria-expanded') === 'true';
            const triggerPanel = await trigger.getAttribute('aria-controls');
            
            if (isExpanded && triggerPanel) {
                await trigger.click({ timeout: this.actionTimeoutMs });
                
                const panel = page.locator(`#${triggerPanel}`);
                await expect(panel).toBeHidden({ timeout: this.assertionTimeoutMs }).catch(() => {
                    // Silent catch - test will fail if panel state is wrong
                });
            }
        }
    }

    async shouldSkipTest(_test: DynamicTest, _page: Page): Promise<boolean> {
        // Accordion doesn't need to skip tests based on optional elements
        return false;
    }

    getMainSelector(): string {
        return this.mainSelector;
    }
}

export { AccordionComponentStrategy };