/**
 * Adds screen reader accessibility to a single toggle element. Updates the aria attributes of the toggle element. Toggle element must possess the following aria attributes; aria-pressed and aria-label.
 * @param {string} toggleClass The class of all the toggle element
 * @param {string} updatedAriaLabel The aria label to be updated to toggle element
 */

import { HTMLElement } from "../../../Types";

export function updateSingleToggleAriaAttribute(toggleClass: string, updatedAriaLabel: string): void {
    const toggle: HTMLElement = document.querySelector(`.${toggleClass}`) as HTMLElement;

    if( !toggle) {
      throw new Error('Invalid toggle class provided.');
    }

    const currentAriaPressedState: string = toggle.getAttribute('aria-pressed') as string
    if(!currentAriaPressedState) {
        throw new Error("Toggle element does not have aria-pressed attribute")
    }

    function togglePressed(ariaLabel: string): void {
        toggle.setAttribute('aria-pressed', 'true');
        toggle.setAttribute('aria-label', ariaLabel);
    }

    function toggleUnpressed(ariaLabel: string): void {
        toggle.setAttribute('aria-pressed', 'false');
        toggle.setAttribute('aria-label', ariaLabel);
    }

    (currentAriaPressedState === 'false') ?
        togglePressed(updatedAriaLabel) :
        toggleUnpressed(updatedAriaLabel)
}