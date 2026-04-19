/**
 * Resolves relative target selectors (first, second, last, next, previous)
 * Used by action handlers and assertion validators
 */

import { Page, Locator } from "playwright";

export class RelativeTargetResolver {
  /**
   * Resolve a relative target like "first", "second", "last", "next", "previous"
   * @param page Playwright page instance
   * @param selector Base selector to find elements
   * @param relative Relative position (first, second, last, next, previous)
   * @returns The resolved Locator or null if not found
   */
  static async resolve( page: Page, selector: string, relative: string | number ): Promise<Locator | null> {
    const items = await page.locator(selector).all();

    if (typeof relative === "number") {
      return items[relative - 1];
    } else {
      switch (relative) {
        case "first":
          return items[0];
          
        case "second":
          return items[1];
          
        case "last":
          return items[items.length - 1];
          
        case "next": {
          const currentIndex = await page.evaluate(([sel]) => {
            const items = Array.from(document.querySelectorAll(sel as string));
            return items.indexOf(document.activeElement as Element);
          }, [selector]);
          const nextIndex = (currentIndex + 1) % items.length;
          return items[nextIndex];
        }
        
        case "previous": {
          const currentIndex = await page.evaluate(([sel]) => {
            const items = Array.from(document.querySelectorAll(sel as string));
            return items.indexOf(document.activeElement as Element);
          }, [selector]);
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          return items[prevIndex];
        }
        
        default:
          return null;
      }
    }    
  }
}