/**
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block container
 * @param {string} blockElementsClass The shared class of the elements that are children of the block
*/
import { handleKeyPress } from '../../../utils/handleKeyPress/handleKeyPress';
var eventListenersAdded = new Set();
export function makeBlockAccessible(blockId, blockElementsClass) {
    var noBlockDiv = function () { throw new Error('Invalid block main div id provided.'); };
    var noBlockItems = function () { throw new Error('Invalid block items shared class provided.'); };
    var blockDiv = document.querySelector("#".concat(blockId));
    if (!blockDiv) {
        return noBlockDiv;
    }
    var blockItems = blockDiv.querySelectorAll(".".concat(blockElementsClass));
    if (!blockItems) {
        return noBlockItems;
    }
    blockItems.forEach(function (blockItem) {
        if (!eventListenersAdded.has(blockItem)) {
            blockItem.addEventListener('keydown', function (event) {
                var items = blockDiv.querySelectorAll(".".concat(blockElementsClass));
                var index = Array.prototype.indexOf.call(items, blockItem);
                handleKeyPress(event, items, index);
            });
            eventListenersAdded.add(blockItem);
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
