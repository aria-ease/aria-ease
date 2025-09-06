/** 
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block container.
 * @param {string} blockElementsClass The shared class of the elements that are children of the block.
*/

import { HTMLElement, NodeListOfHTMLElement } from "../../../../Types"
import { handleKeyPress } from "../../../utils/handleKeyPress/handleKeyPress";

const eventListenersMap = new Map<HTMLElement, (event: KeyboardEvent) => void>();

export function makeBlockAccessible(blockId: string, blockElementsClass: string) {
  const blockDiv: HTMLElement = document.querySelector(`#${blockId}`) as HTMLElement
  if(!blockDiv) {
    throw new Error("Invalid block main div id provided.")
  }

  const blockItems: NodeListOfHTMLElement = blockDiv.querySelectorAll(`.${blockElementsClass}`);
  if(!blockItems) {
    throw new Error("Invalid block items shared class provided.")
  }

  blockItems.forEach((blockItem: HTMLElement): void => {
    if (!eventListenersMap.has(blockItem)) {
      blockItem.addEventListener("keydown", (event: KeyboardEvent) => {
        const items = blockDiv.querySelectorAll(`.${blockElementsClass}`) as NodeListOf<HTMLElement>;
        const index = Array.prototype.indexOf.call(items, blockItem);
        handleKeyPress(event, items, index);
        const handler = (event: KeyboardEvent) => handleKeyPress(event, items, index);
        eventListenersMap.set(blockItem, handler);
      });
      
    }
  });



  return function cleanUpBlockEventListeners(): void {
    blockItems.forEach((blockItem: HTMLElement, blockItemIndex: number): void => {
      if (eventListenersMap.has(blockItem)) {
        blockItem.removeEventListener("keydown", (event: KeyboardEvent) => handleKeyPress(event, blockItems, blockItemIndex));
        eventListenersMap.delete(blockItem);
      }
    });
  };
}