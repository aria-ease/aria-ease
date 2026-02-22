import { A as AccessibilityInstance } from '../Types.d-CBuuHF3d.js';

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

export { makeCheckboxAccessible };
