'use strict';
// src/utils/handleKeyPress/handleKeyPress.ts
function isTextInput(el) {
    if (el.tagName !== "INPUT") return false;
    var type = el.type;
    return [
        "text",
        "email",
        "password",
        "tel",
        "number"
    ].includes(type);
}
function isTextArea(el) {
    return el.tagName === "TEXTAREA";
}
function isNativeButton(el) {
    return el.tagName === "BUTTON" || el.tagName === "INPUT" && [
        "button",
        "submit",
        "reset"
    ].includes(el.type);
}
function isLink(el) {
    return el.tagName === "A";
}
function moveFocus(elementItems, currentIndex, direction) {
    var len = elementItems.length;
    var nextIndex = (currentIndex + direction + len) % len;
    elementItems.item(nextIndex).focus();
}
function isClickableButNotSemantic(el) {
    return el.getAttribute("data-custom-click") !== null || el.getAttribute("data-custom-click") !== void 0;
}
function handleKeyPress(event, elementItems, elementItemIndex, menuElementDiv, triggerButton) {
    var currentEl = elementItems.item(elementItemIndex);
    switch(event.key){
        case "ArrowUp":
        case "ArrowLeft":
            {
                if (!isTextInput(currentEl) && !isTextArea(currentEl)) {
                    event.preventDefault();
                    moveFocus(elementItems, elementItemIndex, -1);
                } else if (isTextInput(currentEl) || isTextArea(currentEl)) {
                    var cursorStart = currentEl.selectionStart;
                    if (cursorStart === 0) {
                        event.preventDefault();
                        moveFocus(elementItems, elementItemIndex, -1);
                    }
                }
                break;
            }
        case "ArrowDown":
        case "ArrowRight":
            {
                if (!isTextInput(currentEl) && !isTextArea(currentEl)) {
                    event.preventDefault();
                    moveFocus(elementItems, elementItemIndex, 1);
                } else if (isTextInput(currentEl) || isTextArea(currentEl)) {
                    var value = currentEl.value;
                    var cursorEnd = currentEl.selectionStart;
                    if (cursorEnd === value.length) {
                        event.preventDefault();
                        moveFocus(elementItems, elementItemIndex, 1);
                    }
                }
                break;
            }
        case "Escape":
            {
                event.preventDefault();
                break;
            }
        case "Enter":
        case " ":
            {
                if (!isNativeButton(currentEl) && !isLink(currentEl) && isClickableButNotSemantic(currentEl)) {
                    event.preventDefault();
                    currentEl.click();
                }
                break;
            }
    }
}
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
exports.makeBlockAccessible = makeBlockAccessible; //# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map