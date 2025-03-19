/**
 * Adds screen reader accessibility to a single toggle element. Updates the aria attributes of the toggle element. Toggle element must possess the following aria attributes; aria-pressed and aria-label.
 * @param {string} toggleClass The class of all the toggle element
 */

import { HTMLElement } from "../../../Types";

export function updateSingleToggleAriaAttribute(toggleClass: string): void {
    const toggle: HTMLElement = document.querySelector(`.${toggleClass}`) as HTMLElement;

    if( !toggle) {
      throw new Error('Invalid toggle class provided.');
    }

    const currentAriaPressedState: string = toggle.getAttribute('aria-pressed') as string
    if(!currentAriaPressedState) {
        throw new Error("Toggle element does not have aria-pressed attribute")
    }

    function togglePressed(): void {
        toggle.setAttribute('aria-pressed', 'true');
    }

    function toggleUnpressed(): void {
        toggle.setAttribute('aria-pressed', 'false');
    }

    (currentAriaPressedState === 'false') ?
        togglePressed() :
        toggleUnpressed()
}