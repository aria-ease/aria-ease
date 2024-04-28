/**
 * Adds screen reader accessibility to single radio button. Updates the aria attribute of the radio button. Radio element must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} radioClass The class of the radio button
 * @param {string} updatedAriaLabel The aria label to be updated to button element
 */

import { HTMLElement } from "../../../Types";

export function updateSingleRadioAriaAttribute(radioClass: string, updatedAriaLabel: string): void {
    const radio: HTMLElement = document.querySelector(`.${radioClass}`) as HTMLElement;

    if( !radio) {
      throw new Error('Invalid radio button class provided.');
    }

    const currentAriaCheckedState: string = radio.getAttribute('aria-checked') as string
    if(!currentAriaCheckedState) {
        throw new Error("Radio element does not have aria-checked attribute")
    }

    function radioChecked(ariaLabel: string): void {
        radio.setAttribute('aria-checked', 'true');
        radio.setAttribute('aria-label', ariaLabel);
    }

    function radioUnchecked(ariaLabel: string): void {
        radio.setAttribute('aria-checked', 'false');
        radio.setAttribute('aria-label', ariaLabel);
    }

    (currentAriaCheckedState === 'false') ?
        radioChecked(updatedAriaLabel) :
        radioUnchecked(updatedAriaLabel)
}