/**
 * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first item of the menu has focus when menu appears.
 * @param {string} menuId The id of the menu
 * @param {string} menuItemsClass The shared class of the items that are children of the menu
*/

import { HTMLElement, NodeListOfHTMLElement } from '../../Types'
import { handleKeyPress } from '../handleKeyPress';

let eventListenersAdded: Set<HTMLElement> = new Set();

export function makeMenuAccessible(menuId: string, menuItemsClass: string): void {
    const menuDiv: HTMLElement = document.querySelector(`#${menuId}`) as HTMLElement;
    if(!menuDiv) {
        throw new Error("Invalid menu div id provided")
    }

    const menuItems: NodeListOfHTMLElement = menuDiv.querySelectorAll(`.${menuItemsClass}`);
    
    const triggerId: string = menuDiv.getAttribute('aria-labelledby') as string;
    if(!triggerId) {
        throw new Error("Menu div doesn't contain aria-labelledby attribute")
    }

    const triggerButton: HTMLElement = document.querySelector(`#${triggerId}`) as HTMLElement;
    if(!triggerButton) {
        throw new Error("Menu trigger button id does not match menu div aria-labelledby attribute")
    }

    const menuClosedStateAriaLabel: string = triggerButton.getAttribute('aria-label')  as string;
    if(!menuClosedStateAriaLabel) {
        throw new Error("Menu trigger button does not have initial aria-label")
    }

    if(menuItems && menuItems.length > 0) {
        menuItems.item(0).focus();
        menuItems.forEach((menuItem: HTMLElement, menuItemIndex: number): void => {
            if (!eventListenersAdded.has(menuItem)) {
                eventListenersAdded.add(menuItem);
                menuItem.addEventListener('keydown', (event: KeyboardEvent): void => handleKeyPress(event, menuItems, menuItemIndex, menuDiv, triggerButton, menuClosedStateAriaLabel));
            }
        })
    } else {
        throw new Error("Invalid menu items shared class provided")
    }
}