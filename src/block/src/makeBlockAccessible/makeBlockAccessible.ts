/** 
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block container
 * @param {string} blockElementsClass The shared class of the elements that are children of the block
*/

import { HTMLElement, NodeListOfHTMLElement } from "../../../../Types"
import { handleKeyPress } from '../../../utils/handleKeyPress/handleKeyPress';

const eventListenersAdded: Set<HTMLElement> = new Set();

export function makeBlockAccessible(blockId: string, blockElementsClass: string) {
  const noBlockDiv = () => { throw new Error('Invalid block main div id provided.') };
  const noBlockItems = () => { throw new Error('Invalid block items shared class provided.') };

  const blockDiv: HTMLElement = document.querySelector(`#${blockId}`) as HTMLElement
  if(!blockDiv) {
    return noBlockDiv;
  }

  const blockItems: NodeListOfHTMLElement = blockDiv.querySelectorAll(`.${blockElementsClass}`);
  if(!blockItems) {
    return noBlockItems;
  }

  blockItems.forEach((blockItem: HTMLElement): void => {
    if (!eventListenersAdded.has(blockItem)) {
      blockItem.addEventListener('keydown', (event: KeyboardEvent) => {
        const items = blockDiv.querySelectorAll(`.${blockElementsClass}`) as NodeListOf<HTMLElement>;
        const index = Array.prototype.indexOf.call(items, blockItem);
        handleKeyPress(event, items, index);
      });
      eventListenersAdded.add(blockItem);
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