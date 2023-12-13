/** 
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block
 * @param {string} blockItemClass The class of the items that are children of the block
*/

import { HTMLElement, NodeListOfHTMLElement } from "../../Types"

let eventListenersAdded: Set<HTMLElement> = new Set();

export function makeBlockAccessible(blockId: string, blockItemClass: string): void {
    const blockDiv: HTMLElement = document.querySelector(`#${blockId}`) as HTMLElement
    const blockItems: NodeListOfHTMLElement = blockDiv.querySelectorAll(`.${blockItemClass}`)

    blockItems.forEach((blockItem: HTMLElement, blockItemIndex: number): void => {
        if (!eventListenersAdded.has(blockItem)) {
          eventListenersAdded.add(blockItem);
          blockItem.addEventListener('keydown', (event: KeyboardEvent) => handleKeyPress(event, blockItems, blockItemIndex));
        }
      });

    function handleKeyPress(event: KeyboardEvent, blockItems: NodeListOfHTMLElement, blockItemIndex: number): void {
        switch(event.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                event.preventDefault()
                if (blockItemIndex === 0) {
                    blockItems.item(blockItems.length - 1).focus();
                } else {
                    blockItems.item(blockItemIndex - 1).focus();
                }
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                event.preventDefault()
                if (blockItemIndex === blockItems.length - 1) {
                    blockItems.item(0).focus();
                } else {
                    blockItems.item(blockItemIndex + 1).focus();
                }
                break;
            case 'Enter':
            case ' ':
                event.preventDefault()
                if (blockItems.item(blockItemIndex).type === 'radio') {
                    blockItems.item(blockItemIndex).checked = true
                    break;
                } else if (blockItems.item(blockItemIndex).type === 'checkbox') {
                    blockItems.item(blockItemIndex).checked = !blockItems.item(blockItemIndex).checked
                    break;
                } else if (blockItems.item(blockItemIndex).tagName === 'BUTTON') {
                    blockItems.item(blockItemIndex).click()
                    break;
                } else if (blockItems.item(blockItemIndex).tagName === 'A') {
                    window.location.href = blockItems.item(blockItemIndex).href
                    break;
                }
                break;
            default:
                break;
        }
    }
}