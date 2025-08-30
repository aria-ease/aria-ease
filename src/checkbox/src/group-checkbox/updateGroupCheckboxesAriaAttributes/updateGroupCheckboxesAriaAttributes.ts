/**
 * Adds screen reader accessibility to multiple checkboxes. Updates the aria attributes of the checkboxes. Checkbox elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {CheckboxStates[]} checkboxStates Array of objects containing checkboxes state information
 * @param {string} checkboxesClass The shared class of all the checkboxes
 * @param {number} currentPressedCheckboxIndex Index of the currently checked or unchecked checkbox
 */

import { HTMLElement, CheckboxStates } from "../../../../../Types";

export function updateGroupCheckboxesAriaAttributes(checkboxStates: CheckboxStates[], checkboxesClass: string, currentPressedCheckboxIndex: number): void {
    console.log('Checkbox updateGroupCheckboxesAriaAttributes initiated');
}