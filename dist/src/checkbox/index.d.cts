import { b as CheckboxConfig, a as AccessibilityInstance } from '../Types.d-C8k7pabS.cjs';

/**
 * Makes a checkbox group accessible by managing ARIA attributes and keyboard interaction.
 * Handles multiple independent checkboxes with proper focus management and keyboard interactions.
 * @param {string} checkboxGroupId - The id of the checkbox group container.
 * @param {string} checkboxesClass - The shared class of all checkboxes.
 */

declare function makeCheckboxAccessible({ checkboxGroupId, checkboxesClass, callback }: CheckboxConfig): AccessibilityInstance;

export { makeCheckboxAccessible };
