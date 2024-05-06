import { updateMenuTriggerAriaAttributes } from "./menu/updateMenuTriggerAriaAttributes";
function handleMenuEscapeKeyPress(menuElement, menuTriggerButton, menuClosedStateAriaLabel) {
    menuElement.style.display = 'none';
    var menuTriggerButtonId = menuTriggerButton.getAttribute('id');
    if (!menuTriggerButtonId) {
        throw new Error("Menu trigger button does not have id attribute");
    }
    updateMenuTriggerAriaAttributes("".concat(menuTriggerButtonId), "".concat(menuClosedStateAriaLabel));
}
export function handleKeyPress(event, elementItems, elementItemIndex, menuElementDiv, triggerButton, menuClosedStateAriaLabel) {
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
            if (((elementItems.item(elementItemIndex).tagName !== 'INPUT') && (elementItems.item(elementItemIndex).tagName !== 'TEXTAREA')) || (elementItems.item(elementItemIndex).tagName === 'INPUT' && (elementItems.item(elementItemIndex).type !== 'text' && elementItems.item(elementItemIndex).type !== 'email' && elementItems.item(elementItemIndex).type !== 'password' && elementItems.item(elementItemIndex).type !== 'tel' && elementItems.item(elementItemIndex).type !== 'number'))) {
                event.preventDefault();
                if (elementItemIndex === 0) {
                    elementItems.item(elementItems.length - 1).focus();
                }
                else {
                    elementItems.item(elementItemIndex - 1).focus();
                }
            }
            if ((elementItems.item(elementItemIndex).tagName === 'INPUT' && (elementItems.item(elementItemIndex).type === 'text' || elementItems.item(elementItemIndex).type === 'tel' || elementItems.item(elementItemIndex).type === 'password' || elementItems.item(elementItemIndex).type === 'email' || elementItems.item(elementItemIndex).type === 'number')) || elementItems.item(elementItemIndex).tagName === 'TEXTAREA') {
                if (elementItems.item(elementItemIndex).selectionStart === 0) {
                    event.preventDefault();
                    if (elementItemIndex === 0) {
                        elementItems.item(elementItems.length - 1).focus();
                    }
                    else {
                        elementItems.item(elementItemIndex - 1).focus();
                    }
                }
            }
            break;
        case 'ArrowDown':
        case 'ArrowRight':
            if (((elementItems.item(elementItemIndex).tagName !== 'INPUT') && (elementItems.item(elementItemIndex).tagName !== 'TEXTAREA')) || (elementItems.item(elementItemIndex).tagName === 'INPUT' && (elementItems.item(elementItemIndex).type !== 'text' && elementItems.item(elementItemIndex).type !== 'email' && elementItems.item(elementItemIndex).type !== 'password' && elementItems.item(elementItemIndex).type !== 'tel' && elementItems.item(elementItemIndex).type !== 'number'))) {
                event.preventDefault();
                if (elementItemIndex === elementItems.length - 1) {
                    elementItems.item(0).focus();
                }
                else {
                    elementItems.item(elementItemIndex + 1).focus();
                }
            }
            if ((elementItems.item(elementItemIndex).tagName === 'INPUT' && (elementItems.item(elementItemIndex).type === 'text' || elementItems.item(elementItemIndex).type === 'tel' || elementItems.item(elementItemIndex).type === 'password' || elementItems.item(elementItemIndex).type === 'email' || elementItems.item(elementItemIndex).type === 'number')) || elementItems.item(elementItemIndex).tagName === 'TEXTAREA') {
                if (elementItems.item(elementItemIndex).selectionStart === elementItems.item(elementItemIndex).value.length) {
                    event.preventDefault();
                    if (elementItemIndex === elementItems.length - 1) {
                        elementItems.item(0).focus();
                    }
                    else {
                        elementItems.item(elementItemIndex + 1).focus();
                    }
                }
            }
            break;
        case 'Escape':
            event.preventDefault();
            if (menuElementDiv && triggerButton && menuClosedStateAriaLabel) {
                (getComputedStyle(menuElementDiv).display === 'block') ?
                    handleMenuEscapeKeyPress(menuElementDiv, triggerButton, menuClosedStateAriaLabel) :
                    null;
                triggerButton.focus();
            }
            break;
        case 'Enter':
        case ' ':
            if (elementItems.item(elementItemIndex).tagName === 'BUTTON') {
                event.preventDefault();
                elementItems.item(elementItemIndex).click();
                break;
            }
            else if (elementItems.item(elementItemIndex).tagName === 'A') {
                event.preventDefault();
                window.location.href = elementItems.item(elementItemIndex).href;
                break;
            }
            break;
        default:
            break;
    }
}
