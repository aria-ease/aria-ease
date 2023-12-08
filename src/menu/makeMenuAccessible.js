/**
 * Adds keyboard navigation to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first item of the menu has focus when menu appears.
 * @param {string} menuId The id of the menu
 * @param {string} menuItemClass The class of the items that are children of the menu
*/
export function makeMenuAccessible(menuId, menuItemClass) {
    var menuDiv = document.querySelector("#".concat(menuId));
    var menuItems = menuDiv.querySelectorAll(".".concat(menuItemClass));
    var triggerId = menuDiv.getAttribute('aria-labelledby');
    var triggerButton = document.querySelector("#".concat(triggerId));
    menuItems.item(0).focus();
    menuItems.forEach(function (menuItem, menuItemIndex) {
        menuItem.addEventListener('keydown', function (event) { return handleKeyPress(event, menuItems, menuItemIndex); });
    });
    function handleKeyPress(event, menuItems, menuItemIndex) {
        event.preventDefault();
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                if (menuItemIndex === 0) {
                    menuItems.item(menuItems.length - 1).focus();
                }
                else {
                    menuItems.item(menuItemIndex - 1).focus();
                }
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                if (menuItemIndex === menuItems.length - 1) {
                    menuItems.item(0).focus();
                }
                else {
                    menuItems.item(menuItemIndex + 1).focus();
                }
                break;
            case 'Escape':
                (getComputedStyle(menuDiv).display === 'block') ?
                    triggerButton.click() :
                    null;
                triggerButton.focus();
                break;
            default:
                break;
        }
    }
}
