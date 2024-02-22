import { handleKeyPress } from "../handleKeyPress";
export function cleanUpMenuEventListeners(menuId, menuItemsClass) {
    var menuDiv = document.querySelector("#".concat(menuId));
    var menuItems = menuDiv.querySelectorAll(".".concat(menuItemsClass));
    var triggerId = menuDiv.getAttribute('aria-labelledby');
    var triggerButton = document.querySelector("#".concat(triggerId));
    menuItems.forEach(function (menuItem, menuItemIndex) {
        menuItem.removeEventListener('keydown', function (event) { return handleKeyPress(event, menuItems, menuItemIndex, menuDiv, triggerButton); });
    });
}
