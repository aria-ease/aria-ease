import { b as CheckboxStates } from '../Types.d-BjpUW0_M.js';

/**
 * Adds screen reader accessibility to multiple checkboxes. Updates the aria attributes of the checkboxes. Checkbox elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} checkboxId The id of the checkbox parent container.
 * @param {string} checkboxesClass The shared class of all the checkboxes.
 * @param {CheckboxStates[]} checkboxStates Array of objects containing checkboxes state information.
 * @param {number} currentPressedCheckboxIndex Index of the currently checked or unchecked checkbox.
*/

declare function updateCheckboxAriaAttributes(checkboxId: string, checkboxesClass: string, checkboxStates: CheckboxStates[], currentPressedCheckboxIndex: number): void;

export { updateCheckboxAriaAttributes };
