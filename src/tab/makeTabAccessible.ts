/** 
 * Adds keyboard navigation to tab. The tab traps focus and can be interacted with using the keyboard.
 * @param {string} tabId The id of the tab
 * @param {string} tabItemClass The class of the items that are children of the tab
*/

import { HTMLElement, NodeListOfHTMLElement } from "../../Types"

export function makeTabAccessible(tabId: string, tabItemClass: string): void {
    const tabDiv: HTMLElement = document.querySelector(`#${tabId}`) as HTMLElement
    const tabItems: NodeListOfHTMLElement = tabDiv.querySelectorAll(`.${tabItemClass}`)

    tabItems.forEach((tabItem: HTMLElement, tabItemIndex: number): void => {
        tabItem.addEventListener('keydown', (event: KeyboardEvent) => handleKeyPress(event, tabItems, tabItemIndex))
    })

    function handleKeyPress(event: KeyboardEvent, tabItems: NodeListOfHTMLElement, tabItemIndex: number): void {
        event.preventDefault()
        switch(event.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                if (tabItemIndex === 0) {
                    tabItems.item(tabItems.length - 1).focus();
                } else {
                    tabItems.item(tabItemIndex - 1).focus();
                }
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                if (tabItemIndex === tabItems.length - 1) {
                    tabItems.item(0).focus();
                } else {
                    tabItems.item(tabItemIndex + 1).focus();
                }
                break;
            case 'Enter':
            case ' ':
                if (tabItems.item(tabItemIndex).type === 'radio') {
                    tabItems.item(tabItemIndex).checked = true
                    break;
                } else if (tabItems.item(tabItemIndex).type === 'checkbox') {
                    tabItems.item(tabItemIndex).checked = !tabItems.item(tabItemIndex).checked
                    break;
                } else if (tabItems.item(tabItemIndex).tagName === 'BUTTON') {
                    tabItems.item(tabItemIndex).click()
                    break;
                } else if (tabItems.item(tabItemIndex).tagName === 'A') {
                    event.preventDefault()
                    window.location.href = tabItems.item(tabItemIndex).href
                    break;
                }
                break;
            default:
                break;
        }
    }
}