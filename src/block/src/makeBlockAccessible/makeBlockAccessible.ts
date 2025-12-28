/** 
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block container.
 * @param {string} blockItemsClass The shared class of the elements that are children of the block.
*/

import { NodeListOfHTMLElement } from "../../../../Types"
import { handleKeyPress } from "../../../utils/handleKeyPress/handleKeyPress";

const eventListenersMap = new Map<HTMLElement, (event: KeyboardEvent) => void>();

export function makeBlockAccessible(blockId: string, blockItemsClass: string) {
  const blockDiv: HTMLElement = document.querySelector(`#${blockId}`) as HTMLElement
  if(!blockDiv) {
    console.error(`[aria-ease] Element with id="${blockId}" not found. Make sure the block element exists before calling makeBlockAccessible.`);
    return function cleanUpBlockEventListeners(): void {};
  }

  const blockItems: NodeListOfHTMLElement = blockDiv.querySelectorAll(`.${blockItemsClass}`);
  if(!blockItems || blockItems.length === 0) {
    console.error(`[aria-ease] Element with class="${blockItemsClass}" not found. Make sure the block items exist before calling makeBlockAccessible.`);
    return function cleanUpBlockEventListeners(): void {};
  }

  blockItems.forEach((blockItem: HTMLElement): void => {
    if (!eventListenersMap.has(blockItem)) {
      const handler = (event: KeyboardEvent) => {
        const items = blockDiv.querySelectorAll(`.${blockItemsClass}`) as NodeListOf<HTMLElement>;
        const index = Array.prototype.indexOf.call(items, blockItem);
        handleKeyPress(event, items, index);
      };
      blockItem.addEventListener("keydown", handler);
      eventListenersMap.set(blockItem, handler);
    }
  });

  return function cleanUpBlockEventListeners(): void {
    blockItems.forEach((blockItem: HTMLElement): void => {
      const handler = eventListenersMap.get(blockItem);
      if (handler) {
        blockItem.removeEventListener("keydown", handler);
        eventListenersMap.delete(blockItem);
      }
    });
  };
}