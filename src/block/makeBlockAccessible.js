/**
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block
 * @param {string} blockItemClass The shared class of the items that are children of the block
*/
import { handleKeyPress } from '../handleKeyPress';
var eventListenersAdded = new Set();
export function makeBlockAccessible(blockId, blockItemClass) {
    var blockDiv = document.querySelector("#".concat(blockId));
    var blockItems = blockDiv.querySelectorAll(".".concat(blockItemClass));
    blockItems.forEach(function (blockItem, blockItemIndex) {
        if (!eventListenersAdded.has(blockItem)) {
            eventListenersAdded.add(blockItem);
            blockItem.addEventListener('keydown', function (event) { return handleKeyPress(event, blockItems, blockItemIndex); });
        }
    });
    return function cleanUpBlockEventListeners() {
        blockItems.forEach(function (blockItem, blockItemIndex) {
            if (eventListenersAdded.has(blockItem)) {
                blockItem.removeEventListener('keydown', function (event) { return handleKeyPress(event, blockItems, blockItemIndex); });
                eventListenersAdded.delete(blockItem);
            }
        });
    };
}
