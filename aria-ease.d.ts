/**
 * Declares the module 'aria-ease' and includes type information and JSDoc comments.
 */
declare module 'aria-ease' {
    /**
     * Adds keyboard navigation to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first item of the menu has focus when menu appears.
     * @param {string} menuId - The id of the menu.
     * @param {string} menuItemClass - The class of the items that are children of the menu.
     */
    declare function makeMenuAccessible(menuId: string, menuItemClass: string): void;
  
    /**
     * Adds keyboard navigation to tab. The tab traps focus and can be interacted with using the keyboard.
     * @param {string} tabId - The id of the tab container.
     * @param {string} tabItemClass - The class of the individual tab items.
     */
    declare function makeTabAccessible(tabId: string, tabItemClass: string): void;
  
    export { makeMenuAccessible, makeTabAccessible };
  }
  