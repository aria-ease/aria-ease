'use strict';
// src/accordion/src/updateAccordionTriggerAriaAttributes/updateAccordionTriggerAriaAttributes.ts
function updateAccordionTriggerAriaAttributes(accordionId, accordionTriggersClass, accordionStates, clickedTriggerIndex) {
    var accordionDiv = document.querySelector("#".concat(accordionId));
    if (!accordionDiv) {
        throw new Error("Invalid accordion main div id provided.");
    }
    var accordionItems = Array.from(accordionDiv.querySelectorAll(".".concat(accordionTriggersClass)));
    if (accordionItems.length === 0) {
        throw new Error("Invalid accordion items shared class provided.");
    }
    if (accordionItems.length !== accordionStates.length) {
        throw new Error("Accordion state/DOM length mismatch: found ".concat(accordionItems.length, " triggers, but got ").concat(accordionStates.length, " state objects."));
    }
    accordionItems.forEach(function(accordionItem, index) {
        var state = accordionStates[index];
        var expanded = accordionItem.getAttribute("aria-expanded");
        var shouldBeExpanded = index === clickedTriggerIndex ? state.display ? "true" : "false" : "false";
        if (expanded && expanded !== shouldBeExpanded) {
            accordionItem.setAttribute("aria-expanded", shouldBeExpanded);
        }
    });
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
function isClickableButNotSemantic(el) {
    return el.getAttribute("data-custom-click") !== null || el.getAttribute("data-custom-click") !== void 0;
}
function handleMenuEscapeKeyPress(menuElement, menuTriggerButton) {
    menuElement.style.display = "none";
    var menuTriggerButtonId = menuTriggerButton.getAttribute("id");
    if (!menuTriggerButtonId) {
        throw new Error("Menu trigger button does not have id attribute");
    }
    menuTriggerButton.setAttribute("aria-expanded", "false");
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
                if (menuElementDiv && triggerButton) {
                    if (getComputedStyle(menuElementDiv).display === "block") {
                        handleMenuEscapeKeyPress(menuElementDiv, triggerButton);
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
// src/checkbox/src/updateCheckboxAriaAttributes/updateCheckboxAriaAttributes.ts
function updateCheckboxAriaAttributes(checkboxId, checkboxesClass, checkboxStates, currentPressedCheckboxIndex) {
    var checkboxDiv = document.querySelector("#".concat(checkboxId));
    if (!checkboxDiv) {
        throw new Error("Invalid checkbox main div id provided.");
    }
    var checkboxItems = Array.from(document.querySelectorAll(".".concat(checkboxesClass)));
    if (checkboxItems.length === 0) {
        throw new Error("Invalid checkboxes shared class provided.");
    }
    checkboxItems.forEach(function(checkbox, index) {
        if (index === currentPressedCheckboxIndex) {
            checkbox.setAttribute("aria-checked", checkboxStates[index].checked ? "true" : "false");
        }
    });
}
// src/menu/src/makeMenuAccessible/makeMenuAccessible.ts
function makeMenuAccessible(param) {
    var menuId = param.menuId, menuElementsClass = param.menuElementsClass, triggerId = param.triggerId;
    var menuDiv = document.querySelector("#".concat(menuId));
    if (!menuDiv) throw new Error("Invalid menu div id provided");
    var triggerButton = document.querySelector("#".concat(triggerId));
    if (!triggerButton) throw new Error("Invalid trigger button id provided");
    var handlerMap = /* @__PURE__ */ new Map();
    function setAria(isOpen) {
        triggerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    function addListeners() {
        var menuItems = menuDiv.querySelectorAll(".".concat(menuElementsClass));
        menuItems.forEach(function(menuItem, index) {
            if (!handlerMap.has(menuItem)) {
                var handler = function(event) {
                    return handleKeyPress(event, menuItems, index, menuDiv, triggerButton);
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
        setAria(true);
        addListeners();
        var menuItems = menuDiv.querySelectorAll(".".concat(menuElementsClass));
        if (menuItems.length > 0) menuItems[0].focus();
    }
    function closeMenu() {
        removeListeners();
        menuDiv.style.display = "none";
        setAria(false);
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
// src/radio/src/updateRadioAriaAttributes/updateRadioAriaAttributes.ts
function updateRadioAriaAttributes(radioId, radiosClass, radioStates, currentPressedRadioIndex) {
    var radioDiv = document.querySelector("#".concat(radioId));
    if (!radioDiv) {
        throw new Error("Invalid radio main div id provided.");
    }
    var radioItems = Array.from(radioDiv.querySelectorAll(".".concat(radiosClass)));
    if (radioItems.length === 0) {
        throw new Error("Invalid radios shared class provided.");
    }
    radioItems.forEach(function(radioItem, index) {
        var state = radioStates[index];
        var checked = radioItem.getAttribute("aria-checked");
        var shouldBeChecked = index === currentPressedRadioIndex ? state.checked ? "true" : "false" : "false";
        if (checked && checked !== shouldBeChecked) {
            radioItem.setAttribute("aria-checked", shouldBeChecked);
        }
    });
}
// src/toggle/src/updateToggleAriaAttribute/updateToggleAriaAttribute.ts
function updateToggleAriaAttribute(toggleId, togglesClass, toggleStates, currentPressedToggleIndex) {
    var toggleDiv = document.querySelector("#".concat(toggleId));
    if (!toggleDiv) {
        throw new Error("Invalid toggle main div id provided.");
    }
    var toggleItems = Array.from(toggleDiv.querySelectorAll(".".concat(togglesClass)));
    if (toggleItems.length === 0) {
        throw new Error("Invalid toggles shared class provided.");
    }
    if (toggleItems.length !== toggleStates.length) {
        throw new Error("Toggle state/DOM length mismatch: found ".concat(toggleItems.length, " triggers, but got ").concat(toggleStates.length, " state objects."));
    }
    toggleItems.forEach(function(toggle, index) {
        if (index === currentPressedToggleIndex) {
            toggle.setAttribute("aria-pressed", toggleStates[index].pressed ? "true" : "false");
        }
    });
}
exports.makeBlockAccessible = makeBlockAccessible;
exports.makeMenuAccessible = makeMenuAccessible;
exports.updateAccordionTriggerAriaAttributes = updateAccordionTriggerAriaAttributes;
exports.updateCheckboxAriaAttributes = updateCheckboxAriaAttributes;
exports.updateRadioAriaAttributes = updateRadioAriaAttributes;
exports.updateToggleAriaAttribute = updateToggleAriaAttribute; //# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map