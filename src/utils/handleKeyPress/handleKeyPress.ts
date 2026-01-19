import { NodeListOfHTMLElement } from "Types";

/**
 * Checks if an element is a text input field.
 * @param {HTMLElement} el The element to check.
 * @returns {boolean} True if the element is a text input (text, email, password, tel, number).
 */
function isTextInput(el: HTMLElement): boolean {
    if (el.tagName !== "INPUT") return false;
    const type = (el as HTMLInputElement).type;
    return ["text", "email", "password", "tel", "number"].includes(type);
}

/**
 * Checks if an element is a textarea.
 * @param {HTMLElement} el The element to check.
 * @returns {boolean} True if the element is a textarea.
 */
function isTextArea(el: HTMLElement): boolean {
    return el.tagName === "TEXTAREA";
}

/**
 * Checks if an element is a native button element.
 * @param {HTMLElement} el The element to check.
 * @returns {boolean} True if the element is a semantic button or input with button type.
 */
export function isNativeButton(el: HTMLElement): boolean {
    return el.tagName === "BUTTON" || (el.tagName === "INPUT" && ["button", "submit", "reset"].includes((el as HTMLInputElement).type));
}

/**
 * Checks if an element is a link (anchor tag).
 * @param {HTMLElement} el The element to check.
 * @returns {boolean} True if the element is an anchor tag.
 */
export function isLink(el: HTMLElement): boolean {
    return el.tagName === "A";
}

/**
 * Moves focus to the next or previous element in a circular manner.
 * @param {NodeListOfHTMLElement} elementItems List of elements to navigate.
 * @param {number} currentIndex The current focused element index.
 * @param {-1 | 1} direction Direction to move focus (-1 for previous, 1 for next).
 */
function moveFocus(elementItems: NodeListOfHTMLElement, currentIndex: number, direction: -1 | 1) {
    const len = elementItems.length;
    const nextIndex = (currentIndex + direction + len) % len;
    elementItems.item(nextIndex).focus();
}

/**
 * Checks if an element has a custom click handler indicated by data attribute.
 * @param {HTMLElement} el The element to check.
 * @returns {boolean} True if the element has a data-custom-click attribute.
 */
function isClickableButNotSemantic(el: HTMLElement): boolean {
    return el.getAttribute("data-custom-click") !== null && el.getAttribute("data-custom-click") !== undefined;
}

/**
 * Closes a menu and updates ARIA attributes.
 * @param {HTMLElement} menuElement The menu element to close.
 * @param {HTMLElement} menuTriggerButton The button that triggers the menu.
 */
function handleMenuClose(menuElement: HTMLElement, menuTriggerButton: HTMLElement) {
    menuElement.style.display = "none";
    const menuTriggerButtonId = menuTriggerButton.getAttribute("id");
    if (!menuTriggerButtonId) {
        console.error("[aria-ease] Menu trigger button must have an id attribute to properly set aria attributes.");
        return;
    }
    menuTriggerButton.setAttribute("aria-expanded", "false");
}

/**
 * Checks if a menu item has a submenu.
 * @param {HTMLElement} menuItem The menu item to check.
 * @returns {boolean} True if the item has aria-haspopup attribute set.
 */
function hasSubmenu(menuItem: HTMLElement): boolean {
    return menuItem.getAttribute("aria-haspopup") === "true" || menuItem.getAttribute("aria-haspopup") === "menu";
}

/**
 * Gets the submenu ID from a menu item's aria-controls attribute.
 * @param {HTMLElement} menuItem The menu item to get submenu ID from.
 * @returns {string | null} The submenu ID or null if not found.
 */
function getSubmenuId(menuItem: HTMLElement): string | null {
    return menuItem.getAttribute("aria-controls");
}

/**
 * Handles keyboard press events for accessible navigation within interactive elements.
 * Supports arrow key navigation, Enter/Space activation, and menu-specific behaviors.
 * @param {KeyboardEvent} event The keyboard event.
 * @param {NodeListOfHTMLElement} elementItems List of interactive elements to navigate.
 * @param {number} elementItemIndex The index of the currently focused element.
 * @param {HTMLElement} [menuElementDiv] Optional menu container element.
 * @param {HTMLElement} [triggerButton] Optional menu trigger button.
 * @param {Function} [openSubmenu] Optional callback to open a submenu.
 * @param {Function} [closeSubmenu] Optional callback to close a submenu.
 */
export function handleKeyPress(
    event: KeyboardEvent,
    elementItems: NodeListOfHTMLElement,
    elementItemIndex: number,
    menuElementDiv?: HTMLElement,
    triggerButton?: HTMLElement,
    openSubmenu?: (submenuId: string) => void,
    closeSubmenu?: () => void
): void {
    const currentEl = elementItems.item(elementItemIndex);
    switch (event.key) {
        case "ArrowUp":
        case "ArrowLeft": {
            if(event.key === "ArrowLeft" && menuElementDiv && closeSubmenu) {
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
            } else if (isTextInput(currentEl) || isTextArea(currentEl)) {
                const cursorStart = (currentEl as HTMLInputElement | HTMLTextAreaElement).selectionStart;
                if (cursorStart === 0) {
                    event.preventDefault();
                    moveFocus(elementItems, elementItemIndex, -1);
                }
            }
            break;
        }
        case "ArrowDown":
        case "ArrowRight": {
            if(event.key === "ArrowRight" && hasSubmenu(currentEl) && openSubmenu) {
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
            } else if (isTextInput(currentEl) || isTextArea(currentEl)) {
                const value = (currentEl as HTMLInputElement | HTMLTextAreaElement).value;
                const cursorEnd = (currentEl as HTMLInputElement | HTMLTextAreaElement).selectionStart;
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
            } else if (isNativeButton(currentEl)) {
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