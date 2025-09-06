/**
  * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first interactive item of the menu has focus when menu open.
  * @param {string} menuId - The id of the menu.
  * @param {string} menuElementsClass - The class of the items that are children of the menu.
  * @param {string} triggerId - The id of the button that triggers the menu.
*/

import { handleKeyPress } from "../../../utils/handleKeyPress/handleKeyPress";
import { NodeListOfHTMLElement } from "../../../../Types";

export function makeMenuAccessible({ menuId, menuElementsClass, triggerId }: {menuId: string; menuElementsClass: string; triggerId: string;}) {
  const menuDiv = document.querySelector(`#${menuId}`) as HTMLElement;
  if (!menuDiv) throw new Error("Invalid menu div id provided");

  const triggerButton = document.querySelector(`#${triggerId}`) as HTMLElement;
  if (!triggerButton) throw new Error("Invalid trigger button id provided");


  const handlerMap = new Map<HTMLElement, (event: KeyboardEvent) => void>();

  function setAria(isOpen: boolean) {
    triggerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function addListeners() {
    const menuItems = menuDiv.querySelectorAll(`.${menuElementsClass}`) as NodeListOfHTMLElement<HTMLElement>;
    menuItems.forEach((menuItem: HTMLElement, index: number) => {
      if (!handlerMap.has(menuItem)) {
        const handler = (event: KeyboardEvent) => handleKeyPress(event, menuItems, index, menuDiv, triggerButton);
        menuItem.addEventListener("keydown", handler);
        handlerMap.set(menuItem, handler);
      }
    });
  }

  function removeListeners() {
    const menuItems = menuDiv.querySelectorAll(`.${menuElementsClass}`) as NodeListOfHTMLElement<HTMLElement>;
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
  
    const menuItems = menuDiv.querySelectorAll(`.${menuElementsClass}`) as NodeListOfHTMLElement<HTMLElement>;
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
  }

  return { openMenu, closeMenu, cleanup };
}
