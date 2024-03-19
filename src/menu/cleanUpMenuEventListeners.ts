import { NodeListOfHTMLElement } from "../../Types"
import { handleKeyPress } from "../handleKeyPress"


export function cleanUpMenuEventListeners(menuId: string, menuItemsClass: string): void {
    const menuDiv: HTMLElement = document.querySelector(`#${menuId}`) as HTMLElement
    if(!menuDiv) {
        throw new Error("Invalid menu div id provided")
    }

    const menuItems: NodeListOfHTMLElement = menuDiv.querySelectorAll(`.${menuItemsClass}`)
    if(!menuItems) {
        throw new Error("Invalid menu items class provided")
    }

    const triggerId: string = menuDiv.getAttribute('aria-labelledby') as string
    if(!triggerId) {
        throw new Error("Menu div doesn't contain aria-labelledby attribute")
    }

    const triggerButton: HTMLElement = document.querySelector(`#${triggerId}`) as HTMLElement
    if(!triggerButton) {
        throw new Error("Menu trigger button id does not match menu div aria-labelledby attribute")
    }

    menuItems.forEach((menuItem: HTMLElement, menuItemIndex: number): void => {
        menuItem.removeEventListener('keydown', (event: KeyboardEvent): void => handleKeyPress(event, menuItems, menuItemIndex, menuDiv, triggerButton));
    })
}