/**
 * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first item of the menu has focus when menu appears.
 * @param {string} menuId The id of the menu
 * @param {string} menuItemClass The class of the items that are children of the menu
*/

import { HTMLElement, NodeListOfHTMLElement } from '../../Types'
import { handleKeyPress } from '../handleKeyPress';

let eventListenersAdded: Set<HTMLElement> = new Set();

export function makeMenuAccessible(menuId: string, menuItemClass: string): void {
    const menuDiv: HTMLElement = document.querySelector(`#${menuId}`) as HTMLElement
    const menuItems: NodeListOfHTMLElement = menuDiv.querySelectorAll(`.${menuItemClass}`)

    const triggerId: string = menuDiv.getAttribute('aria-labelledby') as string
    const triggerButton: HTMLElement = document.querySelector(`#${triggerId}`) as HTMLElement

    if(window.innerWidth >= 1025) {
        menuItems.item(0).focus();
        menuItems.forEach((menuItem: HTMLElement, menuItemIndex: number): void => {
            if (!eventListenersAdded.has(menuItem)) {
                eventListenersAdded.add(menuItem);
                menuItem.addEventListener('keydown', (event: KeyboardEvent): void => handleKeyPress(event, menuItems, menuItemIndex, menuDiv, triggerButton))
            }
        })
    }
}