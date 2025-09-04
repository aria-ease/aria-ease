import { NodeListOfHTMLElement, HTMLElement } from "../../../Types";


function isTextInput(el: HTMLElement): boolean {
    if (el.tagName !== 'INPUT') return false;
    const type = (el as HTMLInputElement).type;
    return ['text', 'email', 'password', 'tel', 'number'].includes(type);
}

function isTextArea(el: HTMLElement): boolean {
    return el.tagName === 'TEXTAREA';
}

export function isNativeButton(el: HTMLElement): boolean {
    return el.tagName === 'BUTTON' || (el.tagName === 'INPUT' && ['button', 'submit', 'reset'].includes((el as HTMLInputElement).type));
}

export function isLink(el: HTMLElement): boolean {
    return el.tagName === 'A';
}

function moveFocus(elementItems: NodeListOfHTMLElement, currentIndex: number, direction: -1 | 1) {
    const len = elementItems.length;
    const nextIndex = (currentIndex + direction + len) % len;
    elementItems.item(nextIndex).focus();
}

function isClickableButNotSemantic(el: HTMLElement): boolean {
    return el.getAttribute("data-custom-click") !== null || el.getAttribute("data-custom-click") !== undefined;
}

function handleMenuEscapeKeyPress(menuElement: HTMLElement, menuTriggerButton: HTMLElement) {
    menuElement.style.display = 'none';
    const menuTriggerButtonId = menuTriggerButton.getAttribute('id');
    if (!menuTriggerButtonId) {
        throw new Error("Menu trigger button does not have id attribute");
    }
    menuTriggerButton.setAttribute("aria-expanded", "false");
}

export function handleKeyPress(
    event: KeyboardEvent,
    elementItems: NodeListOfHTMLElement,
    elementItemIndex: number,
    menuElementDiv?: HTMLElement,
    triggerButton?: HTMLElement
): void {
    const currentEl = elementItems.item(elementItemIndex);
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft': {
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
        case 'ArrowDown':
        case 'ArrowRight': {
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
        case 'Escape': {
            event.preventDefault();
            if (menuElementDiv && triggerButton) {
                if (getComputedStyle(menuElementDiv).display === 'block') {
                    handleMenuEscapeKeyPress(menuElementDiv, triggerButton);
                }
                triggerButton.focus();
            }
            break;
        }
        case 'Enter':
        case ' ': {
            if (!isNativeButton(currentEl) && !isLink(currentEl) && isClickableButNotSemantic(currentEl)) {
                event.preventDefault();
                currentEl.click();
            }
            break;
        }
        default:
            break;
    }
}