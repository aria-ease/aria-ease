/**
 * Consolidated menu accessibility utility for robust, scalable, and ergonomic menu keyboard support.
 * Usage: see example below.
 */
import { handleKeyPress } from "../../../utils/handleKeyPress/handleKeyPress";
import { NodeListOfHTMLElement } from "../../../../Types";

export function makeMenuAccessible({ menuId, menuItemsClass, triggerId, openLabel, closeLabel }: { menuId: string; menuItemsClass: string; triggerId: string; openLabel: string; closeLabel: string; }) {
  const menuDiv = document.querySelector(`#${menuId}`) as HTMLElement;
  if (!menuDiv) throw new Error("Invalid menu div id provided");

  const triggerButton = document.querySelector(`#${triggerId}`) as HTMLElement;
  if (!triggerButton) throw new Error("Invalid trigger button id provided");

  const menuClosedStateAriaLabel: string = closeLabel;

  const handlerMap = new Map<HTMLElement, (event: KeyboardEvent) => void>();

  function setAria(isOpen: boolean, label: string) {
    triggerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    triggerButton.setAttribute("aria-label", label);
  }

  function addListeners() {
    const menuItems = menuDiv.querySelectorAll(`.${menuItemsClass}`) as NodeListOfHTMLElement<HTMLElement>;
    menuItems.forEach((item: HTMLElement, idx: number) => {
      if (!handlerMap.has(item)) {
        const handler = (event: KeyboardEvent) => handleKeyPress(event, menuItems, idx, menuDiv, triggerButton, menuClosedStateAriaLabel);
        item.addEventListener("keydown", handler);
        handlerMap.set(item, handler);
      }
    });
  }

  function removeListeners() {
    const menuItems = menuDiv.querySelectorAll(`.${menuItemsClass}`) as NodeListOfHTMLElement<HTMLElement>;
    menuItems.forEach((item: HTMLElement) => {
      const handler = handlerMap.get(item);
      if (handler) {
        item.removeEventListener("keydown", handler);
        handlerMap.delete(item);
      }
    });
  }

  function openMenu() {
    menuDiv.style.display = "block";
    setAria(true, closeLabel);
    addListeners();
    // Focus first interactive item
    const menuItems = menuDiv.querySelectorAll(`.${menuItemsClass}`) as NodeListOfHTMLElement<HTMLElement>;
    if (menuItems.length > 0) menuItems[0].focus();
  }

  function closeMenu() {
    removeListeners();
    menuDiv.style.display = "none";
    setAria(false, openLabel);
    triggerButton.focus();
  }

  // Cleanup for React/unmount
  function cleanup() {
    removeListeners();
  }

  return { openMenu, closeMenu, cleanup };
}
