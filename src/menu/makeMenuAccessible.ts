/**
 * Adds keyboard navigation to menu.
 * @param {string} menu The id of the menu
 * @param {string} menuItem The class of the items that are children of the menu
 **/

import { HTMLElement, NodeListOfHTMLElement } from '../../Types'

export function makeMenuAccessible(menu: string, menuItem: string): void {
    const menuDiv: HTMLElement = document.querySelector(`#${menu}`) as HTMLElement
    const menuItems: NodeListOfHTMLElement = menuDiv.querySelectorAll(`.${menuItem}`)
    
    menuItems.item(0).focus();
    menuItems.forEach((menuItem: HTMLElement, menuItemIndex: number) => {
        menuItem.addEventListener('keydown', (event: KeyboardEvent) => handleKeyPress(event, menuItems, menuItemIndex))
    })

    function handleKeyPress(event: KeyboardEvent, menuItems: NodeListOfHTMLElement, menuItemIndex: number): void {
        event.preventDefault()
        switch(event.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                if (menuItemIndex === 0) {
                    menuItems.item(menuItems.length - 1).focus();
                } else {
                    menuItems.item(menuItemIndex - 1).focus();
                }
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                if (menuItemIndex === menuItems.length - 1) {
                    menuItems.item(0).focus();
                } else {
                    menuItems.item(menuItemIndex + 1).focus();
                }
                break;
            default:
                break;
        }
    }
}