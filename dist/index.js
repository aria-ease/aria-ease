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
function updateAccordionTriggerAriaAttributes(accordionId, accordionElementsClass, accordionStates, currentClickedTriggerIndex) {
    var accordionDiv = document.querySelector("#".concat(accordionId));
    if (!accordionDiv) {
        throw new Error("Invalid accordion main div id provided.");
    }
    var accordionItems = Array.from(accordionDiv.querySelectorAll(".".concat(accordionElementsClass)));
    if (accordionItems.length === 0) {
        throw new Error("Invalid accordion items shared class provided.");
    }
    if (accordionItems.length !== accordionStates.length) {
        throw new Error("Accordion state/DOM length mismatch: found ".concat(accordionItems.length, " triggers, but got ").concat(accordionStates.length, " state objects."));
    }
    accordionItems.forEach(function(accordionItem, index) {
        var state = accordionStates[index];
        var expanded = accordionItem.getAttribute("aria-expanded");
        var label = accordionItem.getAttribute("aria-label");
        var shouldBeExpanded = index === currentClickedTriggerIndex ? state.display ? "true" : "false" : "false";
        var shouldBeLabel = state.display ? state.openedAriaLabel : state.closedAriaLabel;
        if (expanded !== shouldBeExpanded) {
            accordionItem.setAttribute("aria-expanded", shouldBeExpanded);
        }
        if (label !== shouldBeLabel) {
            accordionItem.setAttribute("aria-label", shouldBeLabel);
        }
    });
}
// src/block/index.ts
var block_exports = {};
__export(block_exports, {
    makeBlockAccessible: function() {
        return makeBlockAccessible;
    }
});
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
function handleMenuEscapeKeyPress(menuElement, menuTriggerButton, menuClosedStateAriaLabel) {
    menuElement.style.display = "none";
    var menuTriggerButtonId = menuTriggerButton.getAttribute("id");
    if (!menuTriggerButtonId) {
        throw new Error("Menu trigger button does not have id attribute");
    }
    menuTriggerButton.setAttribute("aria-expanded", "false");
    menuTriggerButton.setAttribute("aria-label", menuClosedStateAriaLabel);
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
                if (menuElementDiv && triggerButton && menuClosedStateAriaLabel) {
                    if (getComputedStyle(menuElementDiv).display === "block") {
                        handleMenuEscapeKeyPress(menuElementDiv, triggerButton, menuClosedStateAriaLabel);
                    }
                    triggerButton.focus();
                }
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
// src/menu/index.ts
var menu_exports = {};
__export(menu_exports, {
    makeMenuAccessible: function() {
        return makeMenuAccessible;
    }
});
// src/menu/src/makeMenuAccessible/makeMenuAccessible.ts
function makeMenuAccessible(param) {
    var menuId = param.menuId, menuElementsClass = param.menuElementsClass, triggerId = param.triggerId, openLabel = param.openLabel, closeLabel = param.closeLabel;
    var menuDiv = document.querySelector("#".concat(menuId));
    if (!menuDiv) throw new Error("Invalid menu div id provided");
    var triggerButton = document.querySelector("#".concat(triggerId));
    if (!triggerButton) throw new Error("Invalid trigger button id provided");
    var menuClosedStateAriaLabel = closeLabel;
    var handlerMap = /* @__PURE__ */ new Map();
    function setAria(isOpen, label) {
        triggerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
        triggerButton.setAttribute("aria-label", label);
    }
    function addListeners() {
        var menuItems = menuDiv.querySelectorAll(".".concat(menuElementsClass));
        menuItems.forEach(function(menuItem, index) {
            if (!handlerMap.has(menuItem)) {
                var handler = function(event) {
                    return handleKeyPress(event, menuItems, index, menuDiv, triggerButton, menuClosedStateAriaLabel);
                };
                menuItem.addEventListener("keydown", handler);
                handlerMap.set(menuItem, handler);
            }
        });
    }
    function removeListeners() {
        var menuItems = menuDiv.querySelectorAll(".".concat(menuElementsClass));
        menuItems.forEach(function(menuItem) {
            var handler = handlerMap.get(menuItem);
            if (handler) {
                menuItem.removeEventListener("keydown", handler);
                handlerMap.delete(menuItem);
            }
        });
    }
    function openMenu() {
        menuDiv.style.display = "block";
        setAria(true, closeLabel);
        addListeners();
        var menuItems = menuDiv.querySelectorAll(".".concat(menuElementsClass));
        if (menuItems.length > 0) menuItems[0].focus();
    }
    function closeMenu() {
        removeListeners();
        menuDiv.style.display = "none";
        setAria(false, openLabel);
        triggerButton.focus();
    }
    function cleanup() {
        removeListeners();
    }
    return {
        openMenu: openMenu,
        closeMenu: closeMenu,
        cleanup: cleanup
    };
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
export { accordion_exports as Accordion, block_exports as Block, checkbox_exports as Checkbox, menu_exports as Menu, radio_exports as Radio, toggle_exports as Toggle }; //# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map