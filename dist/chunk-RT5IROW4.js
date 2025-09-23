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
export { handleKeyPress }; //# sourceMappingURL=chunk-RT5IROW4.js.map
//# sourceMappingURL=chunk-RT5IROW4.js.map