import { M as MenuConfig, A as AccessibilityInstance } from '../Types.d-CBuuHF3d.cjs';

/**
  * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first interactive item of the menu has focus when menu open.
  * @param {string} menuId - The id of the menu.
  * @param {string} menuItemsClass - The class of the items that are children of the menu.
  * @param {string} triggerId - The id of the button that triggers the menu.
*/

declare function makeMenuAccessible({ menuId, menuItemsClass, triggerId, callback }: MenuConfig): AccessibilityInstance;

export { makeMenuAccessible };
