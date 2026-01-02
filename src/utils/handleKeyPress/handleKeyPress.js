function isTextInput(el) {
    if (el.tagName !== "INPUT")
        return false;
    const type = el.type;
    return ["text", "email", "password", "tel", "number"].includes(type);
}
function isTextArea(el) {
    return el.tagName === "TEXTAREA";
}
export function isNativeButton(el) {
    return el.tagName === "BUTTON" || (el.tagName === "INPUT" && ["button", "submit", "reset"].includes(el.type));
}
export function isLink(el) {
    return el.tagName === "A";
}
function moveFocus(elementItems, currentIndex, direction) {
    const len = elementItems.length;
    const nextIndex = (currentIndex + direction + len) % len;
    elementItems.item(nextIndex).focus();
}
function isClickableButNotSemantic(el) {
    return el.getAttribute("data-custom-click") !== null && el.getAttribute("data-custom-click") !== undefined;
}
function handleMenuClose(menuElement, menuTriggerButton) {
    menuElement.style.display = "none";
    const menuTriggerButtonId = menuTriggerButton.getAttribute("id");
    if (!menuTriggerButtonId) {
        console.error("[aria-ease] Menu trigger button must have an id attribute to properly set aria attributes.");
        return;
    }
    menuTriggerButton.setAttribute("aria-expanded", "false");
}
function hasSubmenu(menuItem) {
    return menuItem.getAttribute("aria-haspopup") === "true" || menuItem.getAttribute("aria-haspopup") === "menu";
}
function getSubmenuId(menuItem) {
    return menuItem.getAttribute("aria-controls");
}
export function handleKeyPress(event, elementItems, elementItemIndex, menuElementDiv, triggerButton, openSubmenu, closeSubmenu) {
    const currentEl = elementItems.item(elementItemIndex);
    switch (event.key) {
        case "ArrowUp":
        case "ArrowLeft": {
            if (event.key === "ArrowLeft" && menuElementDiv && closeSubmenu) {
                const labelledBy = menuElementDiv.getAttribute("aria-labelledby");
                if (labelledBy) {
                    const parentTrigger = document.getElementById(labelledBy);
                    if (parentTrigger && parentTrigger.getAttribute("role") === "menuitem") {
                        event.preventDefault();
                        closeSubmenu();
                        parentTrigger.focus();
                        return;
                    }
                }
            }
            if (!isTextInput(currentEl) && !isTextArea(currentEl)) {
                event.preventDefault();
                moveFocus(elementItems, elementItemIndex, -1);
            }
            else if (isTextInput(currentEl) || isTextArea(currentEl)) {
                const cursorStart = currentEl.selectionStart;
                if (cursorStart === 0) {
                    event.preventDefault();
                    moveFocus(elementItems, elementItemIndex, -1);
                }
            }
            break;
        }
        case "ArrowDown":
        case "ArrowRight": {
            if (event.key === "ArrowRight" && hasSubmenu(currentEl) && openSubmenu) {
                event.preventDefault();
                const submenuId = getSubmenuId(currentEl);
                if (submenuId) {
                    openSubmenu(submenuId);
                    return;
                }
            }
            if (!isTextInput(currentEl) && !isTextArea(currentEl)) {
                event.preventDefault();
                moveFocus(elementItems, elementItemIndex, 1);
            }
            else if (isTextInput(currentEl) || isTextArea(currentEl)) {
                const value = currentEl.value;
                const cursorEnd = currentEl.selectionStart;
                if (cursorEnd === value.length) {
                    event.preventDefault();
                    moveFocus(elementItems, elementItemIndex, 1);
                }
            }
            break;
        }
        case "Escape": {
            event.preventDefault();
            if (menuElementDiv && triggerButton) {
                if (getComputedStyle(menuElementDiv).display === "block") {
                    handleMenuClose(menuElementDiv, triggerButton);
                }
                triggerButton.focus();
            }
            break;
        }
        case "Enter":
        case " ": {
            if (!isNativeButton(currentEl) && !isLink(currentEl) && isClickableButNotSemantic(currentEl)) {
                event.preventDefault();
                currentEl.click();
            }
            else if (isNativeButton(currentEl)) {
                event.preventDefault();
                currentEl.click();
            }
            break;
        }
        case "Tab": {
            if (menuElementDiv && triggerButton && (!event.shiftKey || event.shiftKey)) {
                handleMenuClose(menuElementDiv, triggerButton);
            }
            break;
        }
        default:
            break;
    }
}
