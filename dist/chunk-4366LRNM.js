import { handleKeyPress } from './chunk-RT5IROW4.js';
// src/block/src/makeBlockAccessible/makeBlockAccessible.ts
var eventListenersMap = /* @__PURE__ */ new Map();
function makeBlockAccessible(blockId, blockElementsClass) {
    var blockDiv = document.querySelector("#".concat(blockId));
    if (!blockDiv) {
        throw new Error("Invalid block main div id provided.");
    }
    var blockItems = blockDiv.querySelectorAll(".".concat(blockElementsClass));
    if (!blockItems) {
        throw new Error("Invalid block items shared class provided.");
    }
    blockItems.forEach(function(blockItem) {
        if (!eventListenersMap.has(blockItem)) {
            blockItem.addEventListener("keydown", function(event) {
                var items = blockDiv.querySelectorAll(".".concat(blockElementsClass));
                var index = Array.prototype.indexOf.call(items, blockItem);
                handleKeyPress(event, items, index);
                var handler = function(event2) {
                    return handleKeyPress(event2, items, index);
                };
                eventListenersMap.set(blockItem, handler);
            });
        }
    });
    return function cleanUpBlockEventListeners() {
        blockItems.forEach(function(blockItem, blockItemIndex) {
            if (eventListenersMap.has(blockItem)) {
                blockItem.removeEventListener("keydown", function(event) {
                    return handleKeyPress(event, blockItems, blockItemIndex);
                });
                eventListenersMap.delete(blockItem);
            }
        });
    };
}
export { makeBlockAccessible }; //# sourceMappingURL=chunk-4366LRNM.js.map
//# sourceMappingURL=chunk-4366LRNM.js.map