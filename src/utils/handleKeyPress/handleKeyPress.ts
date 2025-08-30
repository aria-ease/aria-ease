import { NodeListOfHTMLElement, HTMLElement } from "../../../Types";
import { updateMenuTriggerAriaAttributes } from "../../menu";


function isTextInput(el: HTMLElement): boolean {
    if (el.tagName !== 'INPUT') return false;
    const type = (el as HTMLInputElement).type;
    return ['text', 'email', 'password', 'tel', 'number'].includes(type);
}

function isTextArea(el: HTMLElement): boolean {
    return el.tagName === 'TEXTAREA';
}

function isNativeButton(el: HTMLElement): boolean {
    return el.tagName === 'BUTTON' || (el.tagName === 'INPUT' && ['button', 'submit', 'reset'].includes((el as HTMLInputElement).type));
}

function isLink(el: HTMLElement): boolean {
    return el.tagName === 'A';
}

function moveFocus(elementItems: NodeListOfHTMLElement, currentIndex: number, direction: -1 | 1) {
    const len = elementItems.length;
    const nextIndex = (currentIndex + direction + len) % len;
    elementItems.item(nextIndex).focus();
}



function handleMenuEscapeKeyPress(menuElement: HTMLElement, menuTriggerButton: HTMLElement, menuClosedStateAriaLabel: string) {
    menuElement.style.display = 'none';
    const menuTriggerButtonId = menuTriggerButton.getAttribute('id');
    if (!menuTriggerButtonId) {
        throw new Error("Menu trigger button does not have id attribute");
    }
    updateMenuTriggerAriaAttributes(menuTriggerButtonId, menuClosedStateAriaLabel);
}

export function handleKeyPress(
    event: KeyboardEvent,
    elementItems: NodeListOfHTMLElement,
    elementItemIndex: number,
    menuElementDiv?: HTMLElement,
    triggerButton?: HTMLElement,
    menuClosedStateAriaLabel?: string
): void {
    const currentEl = elementItems.item(elementItemIndex);
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft': {
            if (!isTextInput(currentEl) && !isTextArea(currentEl)) {
                event.preventDefault();
                moveFocus(elementItems, elementItemIndex, -1);
            } else if (isTextInput(currentEl) || isTextArea(currentEl)) {
                const selectionStart = (currentEl as HTMLInputElement | HTMLTextAreaElement).selectionStart;
                if (selectionStart === 0) {
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
                const selectionStart = (currentEl as HTMLInputElement | HTMLTextAreaElement).selectionStart;
                if (selectionStart === value.length) {
                    event.preventDefault();
                    moveFocus(elementItems, elementItemIndex, 1);
                }
            }
            break;
        }
        case 'Escape': {
            event.preventDefault();
            if (menuElementDiv && triggerButton && menuClosedStateAriaLabel) {
                if (getComputedStyle(menuElementDiv).display === 'block') {
                    handleMenuEscapeKeyPress(menuElementDiv, triggerButton, menuClosedStateAriaLabel);
                }
                triggerButton.focus();
            }
            break;
        }
        case 'Enter':
        case ' ': {
            if (isNativeButton(currentEl) || isLink(currentEl)) {
                event.preventDefault();
                currentEl.click();
            }
            break;
        }
        default:
            break;
    }
}