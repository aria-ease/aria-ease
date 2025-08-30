'use strict';
var __defProp = Object.defineProperty;
var __export = function(target, all) {
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
// src/accordion/index.ts
var accordion_exports = {};
__export(accordion_exports, {
    updateAccordionTriggerAriaAttributes: function() {
        return updateAccordionTriggerAriaAttributes;
    }
});
// src/accordion/src/updateAccordionTriggerAriaAttributes/updateAccordionTriggerAriaAttributes.ts
function updateAccordionTriggerAriaAttributes(accordionStates, accordionsClass, currentClickedTriggerIndex) {
    console.log("Accordion updateAccordionTriggerAriaAttributes initiated");
}
// src/block/index.ts
var block_exports = {};
__export(block_exports, {
    makeBlockAccessible: function() {
        return makeBlockAccessible;
    }
});
// src/menu/index.ts
var menu_exports = {};
__export(menu_exports, {
    cleanUpMenuEventListeners: function() {
        return cleanUpMenuEventListeners;
    },
    makeMenuAccessible: function() {
        return makeMenuAccessible;
    },
    updateMenuTriggerAriaAttributes: function() {
        return updateMenuTriggerAriaAttributes;
    }
});
// src/menu/src/cleanUpMenuEventListeners/cleanUpMenuEventListeners.ts
function cleanUpMenuEventListeners(menuId, menuItemsClass) {
    console.log("Menu cleanUpMenuEventListeners initiated");
}
// src/menu/src/makeMenuAccessible/makeMenuAccessible.ts
function makeMenuAccessible(menuId, menuItemsClass) {
    console.log("Menu makeMenuAccessible initiated");
}
// src/menu/src/updateMenuTriggerAriaAttributes/updateMenuTriggerAriaAttributes.ts
function updateMenuTriggerAriaAttributes(triggerId, ariaLabel) {
    console.log("Menu updateMenuTriggerAriaAttributes initiated");
}
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
function handleKeyPress(event, elementItems, elementItemIndex, menuElementDiv, triggerButton, menuClosedStateAriaLabel) {
    var currentEl = elementItems.item(elementItemIndex);
    switch(event.key){
        case "ArrowUp":
        case "ArrowLeft":
            {
                if (!isTextInput(currentEl) && !isTextArea(currentEl)) {
                    event.preventDefault();
                    moveFocus(elementItems, elementItemIndex, -1);
                } else if (isTextInput(currentEl) || isTextArea(currentEl)) {
                    var selectionStart = currentEl.selectionStart;
                    if (selectionStart === 0) {
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
                    var selectionStart1 = currentEl.selectionStart;
                    if (selectionStart1 === value.length) {
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
                if (isNativeButton(currentEl) || isLink(currentEl)) {
                    event.preventDefault();
                    currentEl.click();
                }
                break;
            }
    }
}
// src/block/src/makeBlockAccessible/makeBlockAccessible.ts
var eventListenersAdded = /* @__PURE__ */ new Set();
function makeBlockAccessible(blockId, blockItemsClass) {
    var blockDiv = document.querySelector("#".concat(blockId));
    if (!blockDiv) {
        throw new Error("Invalid block main div id provided.");
    }
    var blockItems = blockDiv.querySelectorAll(".".concat(blockItemsClass));
    if (!blockItems) {
        throw new Error("Invalid block items shared class provided.");
    }
    blockItems.forEach(function(blockItem, blockItemIndex) {
        if (!eventListenersAdded.has(blockItem)) {
            eventListenersAdded.add(blockItem);
            blockItem.addEventListener("keydown", function(event) {
                return handleKeyPress(event, blockItems, blockItemIndex);
            });
        }
    });
    return function cleanUpBlockEventListeners() {
        blockItems.forEach(function(blockItem, blockItemIndex) {
            if (eventListenersAdded.has(blockItem)) {
                blockItem.removeEventListener("keydown", function(event) {
                    return handleKeyPress(event, blockItems, blockItemIndex);
                });
                eventListenersAdded.delete(blockItem);
            }
        });
    };
}
// src/checkbox/index.ts
var checkbox_exports = {};
__export(checkbox_exports, {
    updateGroupCheckboxesAriaAttributes: function() {
        return updateGroupCheckboxesAriaAttributes;
    },
    updateSingleCheckboxAriaAttributes: function() {
        return updateSingleCheckboxAriaAttributes;
    }
});
// src/checkbox/src/single-checkbox/updateSingleCheckboxAriaAttributes/updateSingleCheckboxAriaAttributes.ts
function updateSingleCheckboxAriaAttributes(checkboxClass, updatedAriaLabel) {
    console.log("Checkbox updateSingleCheckboxAriaAttributes initiated");
}
// src/checkbox/src/group-checkbox/updateGroupCheckboxesAriaAttributes/updateGroupCheckboxesAriaAttributes.ts
function updateGroupCheckboxesAriaAttributes(checkboxStates, checkboxesClass, currentPressedCheckboxIndex) {
    console.log("Checkbox updateGroupCheckboxesAriaAttributes initiated");
}
// src/radio/index.ts
var radio_exports = {};
__export(radio_exports, {
    updateGroupRadiosAriaAttributes: function() {
        return updateGroupRadiosAriaAttributes;
    },
    updateSingleRadioAriaAttributes: function() {
        return updateSingleRadioAriaAttributes;
    }
});
// src/radio/src/single-radio/updateSingleRadioAriaAttributes.ts
function updateSingleRadioAriaAttributes(radioClass) {
    console.log("Radio updateSingleRadioAriaAttributes initiated");
}
// src/radio/src/group-radio/updateGroupRadiosAriaAttributes.ts
function updateGroupRadiosAriaAttributes(radioStates, radiosClass, currentPressedRadioIndex) {
    console.log("Radio updateGroupRadiosAriaAttributes initiated");
}
// src/toggle/index.ts
var toggle_exports = {};
__export(toggle_exports, {
    updateGroupTogglesAriaAttributes: function() {
        return updateGroupTogglesAriaAttributes;
    },
    updateSingleToggleAriaAttributes: function() {
        return updateSingleToggleAriaAttributes;
    }
});
// src/toggle/src/single-toggle/updateSingleToggleAriaAttributes.ts
function updateSingleToggleAriaAttributes(toggleClass) {
    console.log("Toggle updateSingleToggleAriaAttributes initiated");
}
// src/toggle/src/group-toggle/updateGroupTogglesAriaAttributes.ts
function updateGroupTogglesAriaAttributes(toggleStates, togglesClass, currentPressedToggleIndex) {
    console.log("Toggle updateGroupTogglesAriaAttributes initiated");
}
exports.Accordion = accordion_exports;
exports.Block = block_exports;
exports.Checkbox = checkbox_exports;
exports.Menu = menu_exports;
exports.Radio = radio_exports;
exports.Toggle = toggle_exports; //# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map