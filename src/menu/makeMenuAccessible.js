/**
 * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first item of the menu has focus when menu appears.
 * @param {string} menuId The id of the menu
 * @param {string} menuItemsClass The shared class of the items that are children of the menu
*/
import { handleKeyPress } from '../handleKeyPress';
var eventListenersAdded = new Set();
export function makeMenuAccessible(menuId, menuItemsClass) {
    var menuDiv = document.querySelector("#".concat(menuId));
    if (!menuDiv) {
        throw new Error("Invalid menu div id provided");
    }
    var menuItems = menuDiv.querySelectorAll(".".concat(menuItemsClass));
    var triggerId = menuDiv.getAttribute('aria-labelledby');
    if (!triggerId) {
        throw new Error("Menu div doesn't contain aria-labelledby attribute");
    }
    var triggerButton = document.querySelector("#".concat(triggerId));
    if (!triggerButton) {
        throw new Error("Menu trigger button id does not match menu div aria-labelledby attribute");
    }
    var menuClosedStateAriaLabel = triggerButton.getAttribute('aria-label');
    if (!menuClosedStateAriaLabel) {
        throw new Error("Menu trigger button does not have initial aria-label");
    }
    if (menuItems && menuItems.length > 0) {
        menuItems.item(0).focus();
        menuItems.forEach(function (menuItem, menuItemIndex) {
            if (!eventListenersAdded.has(menuItem)) {
                eventListenersAdded.add(menuItem);
                menuItem.addEventListener('keydown', function (event) { return handleKeyPress(event, menuItems, menuItemIndex, menuDiv, triggerButton, menuClosedStateAriaLabel); });
            }
        });
    }
    else {
        throw new Error("Invalid menu items shared class provided");
    }
}
