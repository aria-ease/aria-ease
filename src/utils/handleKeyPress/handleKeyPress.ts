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
 * Handles keyboard press events for accessible navigation within interactive elements.
 * @param {KeyboardEvent} event The keyboard event.
 * @param {NodeListOfHTMLElement} elementItems List of interactive elements to navigate.
 * @param {number} elementItemIndex The index of the currently focused element.
 */
export function handleKeyPress( event: KeyboardEvent, elementItems: NodeListOfHTMLElement, elementItemIndex: number ): void {
    const currentEl = elementItems.item(elementItemIndex);
    switch (event.key) {
        case "ArrowUp":
        case "ArrowLeft": {
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
            event.preventDefault()
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
            break;
        }
        default:
            break;
    }
}