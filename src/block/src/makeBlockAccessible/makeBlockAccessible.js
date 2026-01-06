/**
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block container.
 * @param {string} blockItemsClass The shared class of the elements that are children of the block.
*/
import { handleKeyPress } from "../../../utils/handleKeyPress/handleKeyPress";
export function makeBlockAccessible(blockId, blockItemsClass) {
    const blockDiv = document.querySelector(`#${blockId}`);
    if (!blockDiv) {
        console.error(`[aria-ease] Element with id="${blockId}" not found. Make sure the block element exists before calling makeBlockAccessible.`);
        return { cleanup: () => { } };
    }
    let cachedItems = null;
    function getItems() {
        if (!cachedItems) {
            cachedItems = blockDiv.querySelectorAll(`.${blockItemsClass}`);
        }
        return cachedItems;
    }
    const blockItems = getItems();
    if (!blockItems || blockItems.length === 0) {
        console.error(`[aria-ease] Element with class="${blockItemsClass}" not found. Make sure the block items exist before calling makeBlockAccessible.`);
        return { cleanup: () => { } };
    }
    const eventListenersMap = new Map();
    blockItems.forEach((blockItem) => {
        if (!eventListenersMap.has(blockItem)) {
            const handler = (event) => {
                const items = blockDiv.querySelectorAll(`.${blockItemsClass}`);
                const index = Array.prototype.indexOf.call(items, blockItem);
                handleKeyPress(event, items, index);
            };
            blockItem.addEventListener("keydown", handler);
            eventListenersMap.set(blockItem, handler);
        }
    });
    function cleanup() {
        blockItems.forEach((blockItem) => {
            const handler = eventListenersMap.get(blockItem);
            if (handler) {
                blockItem.removeEventListener("keydown", handler);
                eventListenersMap.delete(blockItem);
            }
        });
    }
    function refresh() {
        cachedItems = null;
    }
    return { cleanup, refresh };
}
