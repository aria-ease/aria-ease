/**
  * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first interactive item of the menu has focus when menu open.
  * @param {string} menuId - The id of the menu.
  * @param {string} menuElementsClass - The class of the items that are children of the menu.
  * @param {string} triggerId - The id of the button that triggers the menu.
*/
export declare function makeMenuAccessible({ menuId, menuElementsClass, triggerId }: {
    menuId: string;
    menuElementsClass: string;
    triggerId: string;
}): {
    openMenu: () => void;
    closeMenu: () => void;
    cleanup: () => void;
};
