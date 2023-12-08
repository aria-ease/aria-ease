/**
 * Adds keyboard navigation to tab. The tab traps focus and can be interacted with using the keyboard.
 * @param {string} tabId The id of the tab
 * @param {string} tabItemClass The class of the items that are children of the tab
*/
export function makeTabAccessible(tabId, tabItemClass) {
    var tabDiv = document.querySelector("#".concat(tabId));
    var tabItems = tabDiv.querySelectorAll(".".concat(tabItemClass));
    tabItems.forEach(function (tabItem, tabItemIndex) {
        tabItem.addEventListener('keydown', function (event) { return handleKeyPress(event, tabItems, tabItemIndex); });
    });
    function handleKeyPress(event, tabItems, tabItemIndex) {
        event.preventDefault();
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                if (tabItemIndex === 0) {
                    tabItems.item(tabItems.length - 1).focus();
                }
                else {
                    tabItems.item(tabItemIndex - 1).focus();
                }
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                if (tabItemIndex === tabItems.length - 1) {
                    tabItems.item(0).focus();
                }
                else {
                    tabItems.item(tabItemIndex + 1).focus();
                }
                break;
            default:
                break;
        }
    }
}
