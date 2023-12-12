/**
 * Adds keyboard interaction to tab. The tab traps focus and can be interacted with using the keyboard.
 * @param {string} tabId The id of the tab
 * @param {string} tabItemClass The class of the items that are children of the tab
*/
var eventListenersAdded = new Set();
export function makeTabAccessible(tabId, tabItemClass) {
    var tabDiv = document.querySelector("#".concat(tabId));
    var tabItems = tabDiv.querySelectorAll(".".concat(tabItemClass));
    tabItems.forEach(function (tabItem, tabItemIndex) {
        if (!eventListenersAdded.has(tabItem)) {
            eventListenersAdded.add(tabItem);
            tabItem.addEventListener('keydown', function (event) { return handleKeyPress(event, tabItems, tabItemIndex); });
        }
    });
    function handleKeyPress(event, tabItems, tabItemIndex) {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                event.preventDefault();
                if (tabItemIndex === 0) {
                    tabItems.item(tabItems.length - 1).focus();
                }
                else {
                    tabItems.item(tabItemIndex - 1).focus();
                }
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                event.preventDefault();
                if (tabItemIndex === tabItems.length - 1) {
                    tabItems.item(0).focus();
                }
                else {
                    tabItems.item(tabItemIndex + 1).focus();
                }
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (tabItems.item(tabItemIndex).type === 'radio') {
                    tabItems.item(tabItemIndex).checked = true;
                    break;
                }
                else if (tabItems.item(tabItemIndex).type === 'checkbox') {
                    tabItems.item(tabItemIndex).checked = !tabItems.item(tabItemIndex).checked;
                    break;
                }
                else if (tabItems.item(tabItemIndex).tagName === 'BUTTON') {
                    tabItems.item(tabItemIndex).click();
                    break;
                }
                else if (tabItems.item(tabItemIndex).tagName === 'A') {
                    window.location.href = tabItems.item(tabItemIndex).href;
                    break;
                }
                break;
            default:
                break;
        }
    }
}
