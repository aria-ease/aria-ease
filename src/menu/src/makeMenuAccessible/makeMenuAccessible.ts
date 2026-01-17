/**
  * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first interactive item of the menu has focus when menu open.
  * @param {string} menuId - The id of the menu.
  * @param {string} menuItemsClass - The class of the items that are children of the menu.
  * @param {string} triggerId - The id of the button that triggers the menu.
*/

import { handleKeyPress } from "../../../utils/handleKeyPress/handleKeyPress";
import { NodeListOfHTMLElement, AccessibilityInstance } from "Types";


export function makeMenuAccessible({ menuId, menuItemsClass, triggerId }: { menuId: string; menuItemsClass: string; triggerId: string }): AccessibilityInstance {
  const menuDiv = document.querySelector(`#${menuId}`) as HTMLElement;
  if (!menuDiv) {
    console.error(`[aria-ease] Element with id="${menuId}" not found. Make sure the menu element exists before calling makeMenuAccessible.`);
    return { openMenu: () => {}, closeMenu: () => {}, cleanup: () => {} };
  }

  const triggerButton = document.querySelector(`#${triggerId}`) as HTMLElement;
  if (!triggerButton) {
    console.error(`[aria-ease] Element with id="${triggerId}" not found. Make sure the trigger button element exists before calling makeMenuAccessible.`);
    return { openMenu: () => {}, closeMenu: () => {}, cleanup: () => {} };
  }

  if (!/^[\w-]+$/.test(menuId)) {
    console.error("[aria-ease] Invalid menuId: must be alphanumeric");
    return { openMenu: () => {}, closeMenu: () => {}, cleanup: () => {} }; 
  }

  triggerButton.setAttribute("aria-haspopup", "true");
  triggerButton.setAttribute("aria-controls", menuId);
  triggerButton.setAttribute("aria-expanded", "false");

  menuDiv.setAttribute("role", "menu");

  /* const handlerMap = new Map<HTMLElement, (event: KeyboardEvent) => void>();
  const submenuInstances = new Map<string, ReturnType<typeof makeMenuAccessible>>(); */

  const handlerMap = new WeakMap(); // Auto garbage collection
  const submenuInstances = new Map();

  let cachedItems: NodeListOfHTMLElement | null = null;
  let filteredItems: HTMLElement[] | null = null;
  
  function getItems() {
    if (!cachedItems) {
      cachedItems = menuDiv.querySelectorAll(`.${menuItemsClass}`) as NodeListOfHTMLElement;
    }
    return cachedItems;
  }

  function getFilteredItems(): HTMLElement[] {
    if (!filteredItems) {
      const allItems = getItems();
      filteredItems = [];
      
      for (let i = 0; i < allItems.length; i++) {
        const item = allItems.item(i);
        const isNested = isItemInNestedSubmenu(item);
        
        if (!isNested) {
          if (!item.hasAttribute("tabindex")) {
            item.setAttribute("tabindex", "-1");
          }
          filteredItems.push(item);
        }
      }
    }
    return filteredItems;
  }

  function toNodeListLike(items: HTMLElement[]): NodeListOfHTMLElement {
    const nodeListLike = {
      length: items.length,
      item: (index: number) => items[index],
      forEach: (callback: (item: HTMLElement, index: number) => void) => {
        items.forEach(callback);
      },
      [Symbol.iterator]: function* () {
        for (const item of items) {
          yield item;
        }
      }
    };
    return nodeListLike as NodeListOfHTMLElement;
  }

  function isItemInNestedSubmenu(item: HTMLElement): boolean {
    let parent = item.parentElement;
    while (parent && parent !== menuDiv) {
      if (parent.getAttribute("role") === "menu") {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  function setAria(isOpen: boolean) {
    triggerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function openSubmenu(submenuId: string) {
    let submenuInstance = submenuInstances.get(submenuId);
    if (!submenuInstance) {
      const submenuTrigger = menuDiv.querySelector(`[aria-controls="${submenuId}"]`) as HTMLElement;
      if (!submenuTrigger) {
        console.error(`[aria-ease] Submenu trigger with aria-controls="${submenuId}" not found in menu "${menuId}".`);
        return;
      }

      if (!submenuTrigger.id) {
        const generatedId = `trigger-${submenuId}`;
        submenuTrigger.id = generatedId;
        console.warn(`[aria-ease] Submenu trigger for "${submenuId}" had no ID. Auto-generated ID: "${generatedId}".`);
      }

      const submenuElement = document.querySelector(`#${submenuId}`);
      if (!submenuElement) {
        console.error(`[aria-ease] Submenu element with id="${submenuId}" not found. Cannot create submenu instance.`);
        return;
      }

      submenuInstance = makeMenuAccessible({
        menuId: submenuId,
        menuItemsClass: menuItemsClass,
        triggerId: submenuTrigger.id
      });
      submenuInstances.set(submenuId, submenuInstance);
    }
    
    submenuInstance.openMenu();
  }

  function closeSubmenu() {
    closeMenu();
  }

  function addListeners() {
    const items = getFilteredItems();
    const nodeListLike = toNodeListLike(items);
    
    items.forEach((menuItem: HTMLElement, index: number) => {
      if (!handlerMap.has(menuItem)) {
        const handler = (event: KeyboardEvent) => handleKeyPress(
          event, 
          nodeListLike, 
          index, 
          menuDiv, 
          triggerButton,
          openSubmenu,
          closeSubmenu
        );
        menuItem.addEventListener("keydown", handler);
        handlerMap.set(menuItem, handler);
      } 
    });
  }

  function removeListeners() {
    const items = getFilteredItems();
    items.forEach((menuItem: HTMLElement) => {
      const handler = handlerMap.get(menuItem);
      if (handler) {
        menuItem.removeEventListener("keydown", handler);
        handlerMap.delete(menuItem);
      }
    });
  }

  function openMenu() {
    menuDiv.style.display = "block";
    setAria(true);
    const items = getFilteredItems();
    addListeners();
    
    if (items && items.length > 0) {
      items[0].focus();
    }
  }

  function closeMenu() {
    removeListeners();
    menuDiv.style.display = "none";
    setAria(false);
    triggerButton.focus();
  }

  function intializeMenuItems() {
    const items = getItems();
    items.forEach((item: HTMLElement) => {
      item.setAttribute("role", "menuitem");
    });
  }

  intializeMenuItems();

  function cleanup() {
    removeListeners();
    menuDiv.style.display = "none";
    setAria(false);
    submenuInstances.forEach(instance => instance.cleanup());
    submenuInstances.clear();
  }

  function refresh() {
    cachedItems = null;
    filteredItems = null;
  }

  return { openMenu, closeMenu, cleanup, refresh }
}