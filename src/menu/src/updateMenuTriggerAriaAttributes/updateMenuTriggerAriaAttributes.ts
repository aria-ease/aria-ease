/**
 * Adds screen reader accessibility to menus. Updates the aria attributes of the menu trigger button. Trigger button element must possess the following aria attributes; aria-expanded and aria-label.
 * @param {string} triggerId The id of the trigger button that toggles the menu
 * @param {string} ariaLabel The aria label to be updated to trigger element
 */

import { HTMLElement } from "../../../../Types";

export function updateMenuTriggerAriaAttributes(triggerId: string, ariaLabel: string): void {
    console.log('Menu updateMenuTriggerAriaAttributes initiated');
}