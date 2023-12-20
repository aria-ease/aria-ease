/**
 * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first item of the menu has focus when menu appears.
 * @param {string} menuId The id of the menu
 * @param {string} menuItemClass The class of the items that are children of the menu
*/
import { handleKeyPress } from '../handleKeyPress';
var eventListenersAdded = new Set();
export function makeMenuAccessible(menuId, menuItemClass) {
    var menuDiv = document.querySelector("#".concat(menuId));
    var menuItems = menuDiv.querySelectorAll(".".concat(menuItemClass));
    var triggerId = menuDiv.getAttribute('aria-labelledby');
    var triggerButton = document.querySelector("#".concat(triggerId));
    if (window.innerWidth >= 1025) {
        menuItems.item(0).focus();
        menuItems.forEach(function (menuItem, menuItemIndex) {
            if (!eventListenersAdded.has(menuItem)) {
                eventListenersAdded.add(menuItem);
                menuItem.addEventListener('keydown', function (event) { return handleKeyPress(event, menuItems, menuItemIndex, menuDiv, triggerButton); });
            }
        });
    }
}
