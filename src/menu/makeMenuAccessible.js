/**
 * Adds keyboard navigation to menu.
 * @param {string} menu The id of the menu
 * @param {string} menuItem The class of the items that are children of the menu
 **/
function makeMenuAccessible(menu, menuItem) {
    var menuDiv = document.querySelector("#".concat(menu));
    var menuItems = menuDiv.querySelectorAll(".".concat(menuItem));
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
            default:
                break;
        }
    }
}
export { makeMenuAccessible };