/**
 * Adds screen reader accessibility to menus. Updates the aria attributes of the menu trigger button. Trigger button element must possess the following aria attributes; aria-expanded and aria-label.
 * @param {string} triggerId The id of the trigger button that toggles the menu.
 * @param {string} ariaLabel The aria-label to be updated.
 */

import { HTMLElement } from "../../Types";

export function updateMenuTriggerAriaAttributes(triggerId: string, ariaLabel: string): void {
    const triggerButton: HTMLElement = document.querySelector(`#${triggerId}`) as HTMLElement
    if(!triggerButton) {
        throw new Error("Invalid menu trigger button id provided")
    }

    const currentAriaExpandedState: string = triggerButton.getAttribute('aria-expanded') as string
    if(!currentAriaExpandedState) {
        throw new Error("Menu trigger button does not have aria-expanded attribute")
    }

    function triggerOpen(ariaLabel: string): void {
        triggerButton.setAttribute('aria-expanded', 'true')
        triggerButton.setAttribute('aria-label', ariaLabel)
    }

    function triggerClose(ariaLabel: string): void {
        triggerButton.setAttribute('aria-expanded', 'false')
        triggerButton.setAttribute('aria-label', ariaLabel)
    }

    (currentAriaExpandedState === 'false') ?
        triggerOpen(ariaLabel) :
        triggerClose(ariaLabel)
}