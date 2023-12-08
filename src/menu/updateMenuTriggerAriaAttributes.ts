/**
 * Updates the aria attributes of the menu trigger button.
 * @param {string} triggerId The id of the trigger button that toggles the menu.
 * @param {string} ariaLabel The aria-label to be updated.
 */

import { HTMLElement } from "../../Types";

export function updateMenuTriggerAriaAttributes(triggerId: string, ariaLabel: string): void {
    const triggerButton: HTMLElement = document.querySelector(`#${triggerId}`) as HTMLElement

    const currentAriaExpandedState: string = triggerButton.getAttribute('aria-expanded') as string

    function triggerOpen(ariaLabel: string): void {
        triggerButton.setAttribute('aria-expanded', 'true')
        triggerButton.setAttribute('aria-pressed', 'true')
        triggerButton.setAttribute('aria-label', ariaLabel)
    }

    function triggerClose(ariaLabel: string): void {
        triggerButton.setAttribute('aria-expanded', 'false')
        triggerButton.setAttribute('aria-pressed', 'false')
        triggerButton.setAttribute('aria-label', ariaLabel)
    }

    (currentAriaExpandedState === 'false') ?
        triggerOpen(ariaLabel) :
        triggerClose(ariaLabel)
}