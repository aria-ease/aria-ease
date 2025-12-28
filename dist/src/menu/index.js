import { handleKeyPress } from '../chunk-MNMWQWXH.js';

// src/menu/src/makeMenuAccessible/makeMenuAccessible.ts
function makeMenuAccessible({ menuId, menuItemsClass, triggerId }) {
  const menuDiv = document.querySelector(`#${menuId}`);
  if (!menuDiv) {
    console.error(`[aria-ease] Element with id="${menuId}" not found. Make sure the menu element exists before calling makeMenuAccessible.`);
    return { openMenu: () => {
    }, closeMenu: () => {
    }, cleanup: () => {
    } };
  }
  const triggerButton = document.querySelector(`#${triggerId}`);
  if (!triggerButton) {
    console.error(`[aria-ease] Element with id="${triggerId}" not found. Make sure the trigger button element exists before calling makeMenuAccessible.`);
    return { openMenu: () => {
    }, closeMenu: () => {
    }, cleanup: () => {
    } };
  }
  const handlerMap = /* @__PURE__ */ new Map();
  const submenuInstances = /* @__PURE__ */ new Map();
  let cachedItems = null;
  function getItems() {
    if (!cachedItems) {
      cachedItems = menuDiv.querySelectorAll(`:scope > .${menuItemsClass}`);
    }
    return cachedItems;
  }
  function setAria(isOpen) {
    triggerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
  function openSubmenu(submenuId) {
    let submenuInstance = submenuInstances.get(submenuId);
    if (!submenuInstance) {
      const submenuTrigger = menuDiv.querySelector(`[aria-controls="${submenuId}"]`);
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
        menuItemsClass,
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
    menuItems.forEach((menuItem, index) => {
      if (!handlerMap.has(menuItem)) {
        const handler = (event) => handleKeyPress(
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
    menuItems.forEach((menuItem) => {
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
    menuDiv.style.display = "none";
    setAria(false);
    submenuInstances.forEach((instance) => instance.cleanup());
    submenuInstances.clear();
  }
  function refresh() {
    cachedItems = null;
  }
  return { openMenu, closeMenu, cleanup, refresh };
}

export { makeMenuAccessible };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map