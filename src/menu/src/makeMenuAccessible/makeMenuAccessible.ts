/**
  * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first interactive item of the menu has focus when menu open.
  * @param {string} menuId - The id of the menu.
  * @param {string} menuItemsClass - The class of the items that are children of the menu.
  * @param {string} triggerId - The id of the button that triggers the menu.
*/

import { NodeListOfHTMLElement, AccessibilityInstance, MenuConfig } from "Types";


export function makeMenuAccessible({ menuId, menuItemsClass, triggerId, callback }: MenuConfig): AccessibilityInstance {
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
  menuDiv.setAttribute("aria-labelledby", triggerId);

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
        const isDisabled = item.getAttribute("aria-disabled") === "true";
        
        if (!isNested) {
          if (!item.hasAttribute('tabindex')) {
            item.setAttribute('tabindex', '-1');
          }

          if (!isDisabled) {
            filteredItems.push(item);
          }
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

  function intializeMenuItems() {
    const items = getItems();
    items.forEach((item: HTMLElement) => {
      item.setAttribute("role", "menuitem");

      const submenuId = item.getAttribute("data-submenu-id") ?? item.getAttribute("aria-controls");
      const hasSubmenuTriggerAttributes = item.hasAttribute("aria-haspopup") && submenuId;

      if (submenuId && (item.hasAttribute("data-submenu-id") || hasSubmenuTriggerAttributes)) {
        item.setAttribute("aria-haspopup", "menu");
        item.setAttribute("aria-controls", submenuId);
        if (!item.hasAttribute("aria-expanded")) {
          item.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  function moveFocus(elementItems: NodeListOfHTMLElement, currentIndex: number, direction: -1 | 1) {
    const len = elementItems.length;
    const nextIndex = (currentIndex + direction + len) % len;
    elementItems.item(nextIndex).focus();
  }

  function focusItemAtIndex(items: HTMLElement[], index: number) {
    if (items.length === 0) return;
    items[index]?.focus();
  }

  function hasSubmenu(menuItem: HTMLElement) {
    return menuItem.hasAttribute("aria-controls") && menuItem.hasAttribute("aria-haspopup") && menuItem.getAttribute("role") === "menuitem";
  }

  intializeMenuItems();

  function handleItemsKeydown(event: KeyboardEvent, menuItem: HTMLElement, menuItemIndex: number) {
    switch (event.key) {
      case "ArrowLeft": {
        if (event.key === "ArrowLeft" && triggerButton.getAttribute("role") === "menuitem") {
          event.preventDefault();
          closeMenu();
          return;
        }
        break;
      }

      case "ArrowUp": {
        event.preventDefault();
        moveFocus(toNodeListLike(getFilteredItems()), menuItemIndex, -1);
        break;
      }
      case "ArrowRight": {
        if(event.key === "ArrowRight" && hasSubmenu(menuItem)) {
          event.preventDefault();
          const submenuId = menuItem.getAttribute("aria-controls");
          if (submenuId) {
            openSubmenu(submenuId);
            return;
          }
        }
        break;
      }

      case "ArrowDown": {
        event.preventDefault();
        moveFocus(toNodeListLike(getFilteredItems()), menuItemIndex, 1);
        break;
      }

      case "Home": {
        event.preventDefault();
        focusItemAtIndex(getFilteredItems(), 0);
        break;
      }

      case "End": {
        event.preventDefault();
        const items = getFilteredItems();
        focusItemAtIndex(items, items.length - 1);
        break;
      }
            
      case "Escape": {
        event.preventDefault();
        closeMenu();
        triggerButton.focus();
        if (onOpenChange) {
          onOpenChange(false);
        }
          
        break;
      }
            
      case "Enter":
      case " ": {    
        event.preventDefault();

        if (hasSubmenu(menuItem)) {
          const submenuId = menuItem.getAttribute("aria-controls");
          if (submenuId) {
            openSubmenu(submenuId);
            return;
          }
        }

        menuItem.click();
        closeMenu();
        if (onOpenChange) {
          onOpenChange(false);
        }
        break;
      }
      
      case "Tab": {
        if (!event.shiftKey || event.shiftKey) {
          closeMenu();
          if (onOpenChange) {
            onOpenChange(false);
          }
        } 
        break;
      }
      default:
        break;
    }
  }

  function isItemInNestedSubmenu(item: HTMLElement): boolean {
    let parent = item.parentElement;
    while (parent && parent !== menuDiv) {
      if (parent.getAttribute('role') === 'menu') {
        return true;
      }

      if (parent.id) {
        const parentMenuTrigger = menuDiv.querySelector(`[aria-controls="${parent.id}"]`);
        if (parentMenuTrigger) {
          return true;
        }
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
        triggerId: submenuTrigger.id,
        callback: callback
      });
      submenuInstances.set(submenuId, submenuInstance);
    }
    submenuInstance.openMenu();
  }

  function onOpenChange(isOpen: boolean) {
    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(isOpen);
      } catch (error) {
        console.error("[aria-ease] Error in menu onOpenChange callback:", error);
      }
    }
  }

  function addListeners() {
    const items = getFilteredItems();
    
    items.forEach((menuItem: HTMLElement, index: number) => {
      if (!handlerMap.has(menuItem)) {
        const handler = (event: KeyboardEvent) => handleItemsKeydown(event, menuItem, index);
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
    setAria(true);
    menuDiv.style.display = "block";
    
    const items = getFilteredItems();
    addListeners();
    
    if (items && items.length > 0) {
      items[0].focus();
    }

    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(true);
      } catch (error) {
        console.error("[aria-ease] Error in menu onOpenChange callback:", error);
      }
    }
  }

  function closeMenu() {
    submenuInstances.forEach((instance) => instance.closeMenu());
    setAria(false);
    menuDiv.style.display = "none";
    
    removeListeners();
    triggerButton.focus();
    
    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(false);
      } catch (error) {
        console.error("[aria-ease] Error in menu onOpenChange callback:", error);
      }
    }
  }

  function handleTriggerClick() {
    const isOpen = triggerButton.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const isMenuOpen = triggerButton.getAttribute("aria-expanded") === "true";
    if (!isMenuOpen) return;
    
    const clickedTrigger = triggerButton.contains(event.target as Node);
    const clickedMenu = menuDiv.contains(event.target as Node);
    
    if (!clickedTrigger && !clickedMenu) {
      closeMenu();
    }
  }

  triggerButton.addEventListener("click", handleTriggerClick);
  document.addEventListener("click", handleClickOutside);

  function cleanup() {
    removeListeners();
    triggerButton.removeEventListener("click", handleTriggerClick);
    document.removeEventListener("click", handleClickOutside);
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