import { handleKeyPress } from '../chunk-MNMWQWXH.js';

// src/block/src/makeBlockAccessible/makeBlockAccessible.ts
var eventListenersMap = /* @__PURE__ */ new Map();
function makeBlockAccessible(blockId, blockItemsClass) {
  const blockDiv = document.querySelector(`#${blockId}`);
  if (!blockDiv) {
    console.error(`[aria-ease] Element with id="${blockId}" not found. Make sure the block element exists before calling makeBlockAccessible.`);
    return function cleanUpBlockEventListeners() {
    };
  }
  const blockItems = blockDiv.querySelectorAll(`.${blockItemsClass}`);
  if (!blockItems || blockItems.length === 0) {
    console.error(`[aria-ease] Element with class="${blockItemsClass}" not found. Make sure the block items exist before calling makeBlockAccessible.`);
    return function cleanUpBlockEventListeners() {
    };
  }
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
  return function cleanUpBlockEventListeners() {
    blockItems.forEach((blockItem) => {
      const handler = eventListenersMap.get(blockItem);
      if (handler) {
        blockItem.removeEventListener("keydown", handler);
        eventListenersMap.delete(blockItem);
      }
    });
  };
}

export { makeBlockAccessible };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map