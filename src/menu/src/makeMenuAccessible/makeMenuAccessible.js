/**
 * Consolidated menu accessibility utility for robust, scalable, and ergonomic menu keyboard support.
 * Usage: see example below.
 */
import { handleKeyPress } from "../../../utils/handleKeyPress/handleKeyPress";
export function makeMenuAccessible(_a) {
    var menuId = _a.menuId, menuItemsClass = _a.menuItemsClass, triggerId = _a.triggerId, openLabel = _a.openLabel, closeLabel = _a.closeLabel;
    var menuDiv = document.querySelector("#".concat(menuId));
    if (!menuDiv)
        throw new Error("Invalid menu div id provided");
    var triggerButton = document.querySelector("#".concat(triggerId));
    if (!triggerButton)
        throw new Error("Invalid trigger button id provided");
    var menuClosedStateAriaLabel = closeLabel;
    // Store handler references for cleanup
    var handlerMap = new Map();
    function setAria(isOpen, label) {
        triggerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
        triggerButton.setAttribute("aria-label", label);
    }
    function addListeners() {
        var menuItems = menuDiv.querySelectorAll(".".concat(menuItemsClass));
        menuItems.forEach(function (item, idx) {
            if (!handlerMap.has(item)) {
                var handler = function (event) { return handleKeyPress(event, menuItems, idx, menuDiv, triggerButton, menuClosedStateAriaLabel); };
                item.addEventListener("keydown", handler);
                handlerMap.set(item, handler);
            }
        });
    }
    function removeListeners() {
        var menuItems = menuDiv.querySelectorAll(".".concat(menuItemsClass));
        menuItems.forEach(function (item) {
            var handler = handlerMap.get(item);
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
        var menuItems = menuDiv.querySelectorAll(".".concat(menuItemsClass));
        if (menuItems.length > 0)
            menuItems[0].focus();
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
    return { openMenu: openMenu, closeMenu: closeMenu, cleanup: cleanup };
}
