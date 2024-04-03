import { handleKeyPress } from "../handleKeyPress";
export function cleanUpMenuEventListeners(menuId, menuItemsClass) {
    var menuDiv = document.querySelector("#".concat(menuId));
    if (!menuDiv) {
        throw new Error("Invalid menu div id provided");
    }
    var menuItems = menuDiv.querySelectorAll(".".concat(menuItemsClass));
    if (!menuItems) {
        throw new Error("Invalid menu items class provided");
    }
    var triggerId = menuDiv.getAttribute('aria-labelledby');
    if (!triggerId) {
        throw new Error("Menu div doesn't contain aria-labelledby attribute");
    }
    var triggerButton = document.querySelector("#".concat(triggerId));
    if (!triggerButton) {
        throw new Error("Menu trigger button id does not match menu div aria-labelledby attribute");
    }
    menuItems.forEach(function (menuItem, menuItemIndex) {
        menuItem.removeEventListener('keydown', function (event) { return handleKeyPress(event, menuItems, menuItemIndex, menuDiv, triggerButton); });
    });
}
