/**
  * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first interactive item of the menu has focus when menu open.
  * @param {string} menuId - The id of the menu.
  * @param {string} menuItemsClass - The class of the items that are children of the menu.
  * @param {string} triggerId - The id of the button that triggers the menu.
*/

import { handleKeyPress } from "../../../utils/handleKeyPress/handleKeyPress";
import { NodeListOfHTMLElement } from "Types";


export function makeMenuAccessible({ menuId, menuItemsClass, triggerId }: {menuId: string; menuItemsClass: string; triggerId: string;}) {
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


  const handlerMap = new Map<HTMLElement, (event: KeyboardEvent) => void>();
  const submenuInstances = new Map<string, ReturnType<typeof makeMenuAccessible>>();

  let cachedItems: NodeListOfHTMLElement | null = null;
  function getItems() {
    if (!cachedItems) {
      cachedItems = menuDiv.querySelectorAll(`:scope > .${menuItemsClass}`) as NodeListOfHTMLElement;
    }
    return cachedItems;
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

      // Ensure the trigger has an ID for proper ARIA references
      if (!submenuTrigger.id) {
        const generatedId = `trigger-${submenuId}`;
        submenuTrigger.id = generatedId;
        console.warn(`[aria-ease] Submenu trigger for "${submenuId}" had no ID. Auto-generated ID: "${generatedId}".`);
      }

      // Verify the submenu element exists before creating instance
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
    const menuItems = getItems();
    menuItems.forEach((menuItem: HTMLElement, index: number) => {
      if (!handlerMap.has(menuItem)) {
        const handler = (event: KeyboardEvent) => handleKeyPress(
          event, 
          menuItems, 
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
    const menuItems = getItems();
    menuItems.forEach((menuItem: HTMLElement) => {
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
    addListeners();
  
    const menuItems = getItems();
    if (menuItems.length > 0) menuItems[0].focus();
  }

  function closeMenu() {
    removeListeners();
    menuDiv.style.display = "none";
    setAria(false);
    triggerButton.focus();
  }

  function cleanup() {
    removeListeners();
    
    // Close menu and reset ARIA attributes
    menuDiv.style.display = "none";
    setAria(false);
    
    submenuInstances.forEach(instance => instance.cleanup());
    submenuInstances.clear();
  }

  function refresh() {
    cachedItems = null;
  }

  return { openMenu, closeMenu, cleanup, refresh };
}