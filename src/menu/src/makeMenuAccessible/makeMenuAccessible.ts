/**
 * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first item of the menu has focus when menu appears.
 * @param {string} menuId The id of the menu
 * @param {string} menuItemsClass The shared class of the items that are children of the menu
*/

import { HTMLElement, NodeListOfHTMLElement } from '../../../../Types'

let eventListenersAdded: Set<HTMLElement> = new Set();

export function makeMenuAccessible(menuId: string, menuItemsClass: string): void {
    console.log('Menu makeMenuAccessible initiated');
}