/**
 * Adds screen reader accessibility to a single checkbox. Updates the aria attributes of the checkbox. Checkbox element must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} checkboxClass The shared class of all the checkboxes
 * @param {string} updatedAriaLabel The aria label to be updated to checkbox element
 */

import { HTMLElement } from "../../../Types";

export function updateSingleCheckboxAriaAttribute(checkboxClass: string, updatedAriaLabel: string): void {
    const checkbox: HTMLElement = document.querySelector(`.${checkboxClass}`) as HTMLElement;

    if ( !checkbox) {
      throw new Error('Invalid checkbox class provided.');
    };

    const currentAriaCheckedState: string = checkbox.getAttribute('aria-checked') as string
    if(!currentAriaCheckedState) {
        throw new Error("Checkbox element does not have aria-checked attribute")
    }

    function checkboxChecked(ariaLabel: string): void {
        checkbox.setAttribute('aria-checked', 'true');
        checkbox.setAttribute('aria-label', ariaLabel);
    }

    function checkboxUnchecked(ariaLabel: string): void {
        checkbox.setAttribute('aria-checked', 'false');
        checkbox.setAttribute('aria-label', ariaLabel);
    }

    (currentAriaCheckedState === 'false') ?
        checkboxChecked(updatedAriaLabel) :
        checkboxUnchecked(updatedAriaLabel)
}