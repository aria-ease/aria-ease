/**
 * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first item of the menu has focus when menu appears.
 * @param {string} menuId The id of the menu
 * @param {string} menuItemClass The shared class of the items that are children of the menu
 * @param {string} menuClosedStateAriaLabel The aria label for when the menu is closed and not displayed
*/
import { handleKeyPress } from '../handleKeyPress';
var eventListenersAdded = new Set();
export function makeMenuAccessible(menuId, menuItemClass, menuClosedStateAriaLabel) {
    var menuDiv = document.querySelector("#".concat(menuId));
    var menuItems = menuDiv.querySelectorAll(".".concat(menuItemClass));
    var triggerId = menuDiv.getAttribute('aria-labelledby');
    var triggerButton = document.querySelector("#".concat(triggerId));
    menuItems.item(0).focus();
    menuItems.forEach(function (menuItem, menuItemIndex) {
        if (!eventListenersAdded.has(menuItem)) {
            eventListenersAdded.add(menuItem);
            menuItem.addEventListener('keydown', function (event) { return handleKeyPress(event, menuItems, menuItemIndex, menuDiv, triggerButton, menuClosedStateAriaLabel); });
        }
    });
}
