import { T as ToggleStates, a as AccessibilityInstance } from '../Types.d-BrHSyS03.js';

/**
 * Adds screen reader accessibility to toggle buttons. Updates the aria attributes of the toggle buttons. Button must be a semantic button element or a non-semantic element with a role of button, and possess the aria-pressed attribute.
 * @param {string} toggleId The id of the toggle buttons parent container.
 * @param {string} togglesClass The shared class of all the toggle buttons.
 * @param {ToggleStates[]} toggleStates Array of objects containing toggle buttons state information.
 * @param {number} currentPressedToggleIndex Index of the currently pressed or unpressed toggle button.
*/

declare function updateToggleAriaAttribute(toggleId: string, togglesClass: string, toggleStates: ToggleStates[], currentPressedToggleIndex: number): void;

/**
 * Makes a toggle button accessible by managing ARIA attributes and keyboard interactions.
 * Handles toggle button state with proper focus management.
 * @param {string} toggleId - The id of the toggle button or toggle button container.
 * @param {string} togglesClass - The shared class of toggle buttons (for groups).
 * @param {boolean} isSingleToggle - Whether this is a single toggle button (default: true).
 */

interface ToggleConfig {
    toggleId: string;
    togglesClass?: string;
    isSingleToggle?: boolean;
}
declare function makeToggleAccessible({ toggleId, togglesClass, isSingleToggle }: ToggleConfig): AccessibilityInstance;

export { makeToggleAccessible, updateToggleAriaAttribute };
