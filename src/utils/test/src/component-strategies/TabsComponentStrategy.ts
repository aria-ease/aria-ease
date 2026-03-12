import { ComponentStrategy, DynamicTest } from "Types";
import { Page } from "@playwright/test";
import type { ComponentContract } from "Types";

class TabsComponentStrategy implements ComponentStrategy {
    constructor(
        private mainSelector: string,
        private selectors: ComponentContract["selectors"]
    ) {}

    async resetState(): Promise<void> {
        // Tabs component typically doesn't need state reset between tests
        // Each test specifies which tab to interact with
    }

    async shouldSkipTest(test: DynamicTest, page: Page): Promise<boolean> {
        // Skip tests that don't match the tabs orientation
        if (test.isVertical !== undefined && this.selectors.tablist) {
            const tablistSelector = this.selectors.tablist;
            const tablist = page.locator(tablistSelector).first();
            const orientation = await tablist.getAttribute('aria-orientation');
            
            const isVertical = orientation === 'vertical';
            
            if (test.isVertical !== isVertical) {
                return true; // Skip test - orientation mismatch
            }
        }
        
        return false;
    }

    getMainSelector(): string {
        return this.mainSelector;
    }
}

export { TabsComponentStrategy };