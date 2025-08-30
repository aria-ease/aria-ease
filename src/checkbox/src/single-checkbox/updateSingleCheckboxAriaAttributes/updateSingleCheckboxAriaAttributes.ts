/**
 * Adds screen reader accessibility to a single checkbox. Updates the aria attributes of the checkbox. Checkbox element must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} checkboxClass The shared class of all the checkboxes
 * @param {string} updatedAriaLabel The aria label to be updated to checkbox element
 */

import { HTMLElement } from "../../../../../Types";

export function updateSingleCheckboxAriaAttributes(checkboxClass: string, updatedAriaLabel: string): void {
    console.log('Checkbox updateSingleCheckboxAriaAttributes initiated');
}