/** 
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block
 * @param {string} blockItemsClass The shared class of the items that are children of thes block
*/

import { HTMLElement, NodeListOfHTMLElement } from "../../Types"
import { handleKeyPress } from '../handleKeyPress';

let eventListenersAdded: Set<HTMLElement> = new Set();

export function makeBlockAccessible(blockId: string, blockItemsClass: string) {
  const blockDiv: HTMLElement = document.querySelector(`#${blockId}`) as HTMLElement
  const blockItems: NodeListOfHTMLElement = blockDiv.querySelectorAll(`.${blockItemsClass}`)

  blockItems.forEach((blockItem: HTMLElement, blockItemIndex: number): void => {
    if (!eventListenersAdded.has(blockItem)) {
      eventListenersAdded.add(blockItem);
      blockItem.addEventListener('keydown', (event: KeyboardEvent) => handleKeyPress(event, blockItems, blockItemIndex));
    }
  });

  return function cleanUpBlockEventListeners(): void {
    blockItems.forEach((blockItem: HTMLElement, blockItemIndex: number): void => {
      if (eventListenersAdded.has(blockItem)) {
        blockItem.removeEventListener('keydown', (event: KeyboardEvent) => handleKeyPress(event, blockItems, blockItemIndex));
        eventListenersAdded.delete(blockItem);
      }
    });
  };
}