import { NodeListOfHTMLElement, HTMLElement } from "../Types";
import { updateMenuTriggerAriaAttributes } from "./menu/updateMenuTriggerAriaAttributes";

function handleMenuEscapeKeyPress(menuElement: HTMLElement, menuTriggerButton: HTMLElement, menuClosedStateAriaLabel: string) {
    menuElement.style.display = 'none';
    const menuTriggerButtonId = menuTriggerButton.getAttribute('id');
    updateMenuTriggerAriaAttributes(`${menuTriggerButtonId}`, `${menuClosedStateAriaLabel}`)
}

export function handleKeyPress(event: KeyboardEvent, elementItems: NodeListOfHTMLElement, elementItemIndex: number, menuElementDiv?: HTMLElement | undefined, triggerButton?: HTMLElement | undefined, menuClosedStateAriaLabel?: string | undefined): void {
    switch(event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
            event.preventDefault()
            if (elementItemIndex === 0) {
                elementItems.item(elementItems.length - 1).focus();
            } else {
                elementItems.item(elementItemIndex - 1).focus();
            }
            break;
        case 'ArrowDown':
        case 'ArrowRight':
            event.preventDefault()
            if (elementItemIndex === elementItems.length - 1) {
                elementItems.item(0).focus();
            } else {
                elementItems.item(elementItemIndex + 1).focus();
            }
            break;
        case 'Escape':
            event.preventDefault();
            if(menuElementDiv && triggerButton && menuClosedStateAriaLabel) {
                (getComputedStyle(menuElementDiv).display === 'block') ?
                    handleMenuEscapeKeyPress(menuElementDiv, triggerButton, menuClosedStateAriaLabel) :
                    null
                triggerButton.focus()
            }
            
            break;
        case 'Enter':
        case ' ':
            event.preventDefault()
            if(elementItems.item(elementItemIndex).tagName === 'BUTTON') {
                elementItems.item(elementItemIndex).click();
                break;
            } else if (elementItems.item(elementItemIndex).tagName === 'A') {
                window.location.href = elementItems.item(elementItemIndex).href; 
                break;
            }
            break;
        default:
            break;
    }
}