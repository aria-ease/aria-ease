import { handleKeyPress } from "../handleKeyPress";
export function cleanUpMenuEventListeners(menuId, menuItemClass) {
    var menuDiv = document.querySelector("#".concat(menuId));
    var menuItems = menuDiv.querySelectorAll(".".concat(menuItemClass));
    var triggerId = menuDiv.getAttribute('aria-labelledby');
    var triggerButton = document.querySelector("#".concat(triggerId));
    menuItems.forEach(function (menuItem, menuItemIndex) {
        menuItem.removeEventListener('keydown', function (event) { return handleKeyPress(event, menuItems, menuItemIndex, menuDiv, triggerButton); });
    });
}
