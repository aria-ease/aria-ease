/**
 * Adds keyboard navigation to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first item of the menu has focus when menu appears.
 * @param {string} menuId The id of the menu
 * @param {string} menuItemClass The class of the items that are children of the menu
*/

import { HTMLElement, NodeListOfHTMLElement } from '../../Types'


let eventListenersAdded: boolean = false

export function makeMenuAccessible(menuId: string, menuItemClass: string): void {
    const menuDiv: HTMLElement = document.querySelector(`#${menuId}`) as HTMLElement
    const menuItems: NodeListOfHTMLElement = menuDiv.querySelectorAll(`.${menuItemClass}`)

    const triggerId: string = menuDiv.getAttribute('aria-labelledby') as string
    const triggerButton: HTMLElement = document.querySelector(`#${triggerId}`) as HTMLElement

    menuItems.item(0).focus();
    menuItems.forEach((menuItem: HTMLElement, menuItemIndex: number): void => {
        if(!eventListenersAdded) {
            menuItem.addEventListener('keydown', (event: KeyboardEvent): void => handleKeyPress(event, menuItems, menuItemIndex))
            eventListenersAdded = true
        }
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
            case 'Escape':
                (getComputedStyle(menuDiv).display === 'block') ?
                    triggerButton.click() :
                    null
                triggerButton.focus()
                break;
            case 'Enter':
            case ' ':
                if(menuItems.item(menuItemIndex).tagName === 'BUTTON') {
                    menuItems.item(menuItemIndex).click()
                    break;
                } else if (menuItems.item(menuItemIndex).tagName === 'A') {
                    event.preventDefault();
                    window.location.href = menuItems.item(menuItemIndex).href; 
                    break;
                } else if (menuItems.item(menuItemIndex).type === 'radio') {
                    menuItems.item(menuItemIndex).checked = true
                    break;
                } else if (menuItems.item(menuItemIndex).type === 'checkbox') {
                    menuItems.item(menuItemIndex).checked = !menuItems.item(menuItemIndex).checked
                    break;
                }
                break;
            default:
                break;
        }
    }
}