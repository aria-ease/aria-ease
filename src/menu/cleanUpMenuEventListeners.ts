import { NodeListOfHTMLElement } from "../../Types"
import { handleKeyPress } from "../handleKeyPress"


export function cleanUpMenuEventListeners(menuId: string, menuItemClass: string): void {
    const menuDiv: HTMLElement = document.querySelector(`#${menuId}`) as HTMLElement
    const menuItems: NodeListOfHTMLElement = menuDiv.querySelectorAll(`.${menuItemClass}`)

    const triggerId: string = menuDiv.getAttribute('aria-labelledby') as string
    const triggerButton: HTMLElement = document.querySelector(`#${triggerId}`) as HTMLElement

    menuItems.forEach((menuItem: HTMLElement, menuItemIndex: number): void => {
        menuItem.removeEventListener('keydown', (event: KeyboardEvent): void => handleKeyPress(event, menuItems, menuItemIndex, menuDiv, triggerButton));
    })
}