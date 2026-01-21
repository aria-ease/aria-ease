import { C as CheckboxStates, a as AccessibilityInstance } from '../Types.d-BrHSyS03.cjs';

/**
 * Adds screen reader accessibility to multiple checkboxes. Updates the aria attributes of the checkboxes. Checkbox elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} checkboxId The id of the checkbox parent container.
 * @param {string} checkboxesClass The shared class of all the checkboxes.
 * @param {CheckboxStates[]} checkboxStates Array of objects containing checkboxes state information.
 * @param {number} currentPressedCheckboxIndex Index of the currently checked or unchecked checkbox.
*/

declare function updateCheckboxAriaAttributes(checkboxId: string, checkboxesClass: string, checkboxStates: CheckboxStates[], currentPressedCheckboxIndex: number): void;

/**
 * Makes a checkbox group accessible by managing ARIA attributes and keyboard navigation.
 * Handles multiple independent checkboxes with proper focus management and keyboard interactions.
 * @param {string} checkboxGroupId - The id of the checkbox group container.
 * @param {string} checkboxesClass - The shared class of all checkboxes.
 */

interface CheckboxConfig {
    checkboxGroupId: string;
    checkboxesClass: string;
}
declare function makeCheckboxAccessible({ checkboxGroupId, checkboxesClass }: CheckboxConfig): AccessibilityInstance;

export { makeCheckboxAccessible, updateCheckboxAriaAttributes };
