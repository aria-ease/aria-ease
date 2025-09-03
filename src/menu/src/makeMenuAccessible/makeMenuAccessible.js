/**
  * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first interactive item of the menu has focus when menu open.
  * @param {string} menuId - The id of the menu.
  * @param {string} menuElementsClass - The class of the items that are children of the menu.
  * @param {string} triggerId - The id of the button that triggers the menu.
  * @param {string} openLabel - The aria label of the menu trigger button when it is open, e.g, Open profile menu.
  * @param {string} closeLabel - The aria label of the menu trigger button when it is closed, e.g Close profile menu.
*/
import { handleKeyPress } from "../../../utils/handleKeyPress/handleKeyPress";
export function makeMenuAccessible(_a) {
    var menuId = _a.menuId, menuElementsClass = _a.menuElementsClass, triggerId = _a.triggerId, openLabel = _a.openLabel, closeLabel = _a.closeLabel;
    var menuDiv = document.querySelector("#".concat(menuId));
    if (!menuDiv)
        throw new Error("Invalid menu div id provided");
    var triggerButton = document.querySelector("#".concat(triggerId));
    if (!triggerButton)
        throw new Error("Invalid trigger button id provided");
    var menuClosedStateAriaLabel = closeLabel;
    var handlerMap = new Map();
    function setAria(isOpen, label) {
        triggerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
        triggerButton.setAttribute("aria-label", label);
    }
    function addListeners() {
        var menuItems = menuDiv.querySelectorAll(".".concat(menuElementsClass));
        menuItems.forEach(function (menuItem, index) {
            if (!handlerMap.has(menuItem)) {
                var handler = function (event) { return handleKeyPress(event, menuItems, index, menuDiv, triggerButton, menuClosedStateAriaLabel); };
                menuItem.addEventListener("keydown", handler);
                handlerMap.set(menuItem, handler);
            }
        });
    }
    function removeListeners() {
        var menuItems = menuDiv.querySelectorAll(".".concat(menuElementsClass));
        menuItems.forEach(function (menuItem) {
            var handler = handlerMap.get(menuItem);
            if (handler) {
                menuItem.removeEventListener("keydown", handler);
                handlerMap.delete(menuItem);
            }
        });
    }
    function openMenu() {
        menuDiv.style.display = "block";
        setAria(true, closeLabel);
        addListeners();
        var menuItems = menuDiv.querySelectorAll(".".concat(menuElementsClass));
        if (menuItems.length > 0)
            menuItems[0].focus();
    }
    function closeMenu() {
        removeListeners();
        menuDiv.style.display = "none";
        setAria(false, openLabel);
        triggerButton.focus();
    }
    function cleanup() {
        removeListeners();
    }
    return { openMenu: openMenu, closeMenu: closeMenu, cleanup: cleanup };
}
