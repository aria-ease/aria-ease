import { T as ToggleStates } from '../../Types.d-p85gN5m_.js';

/**
 * Adds screen reader accessibility to toggle buttons. Updates the aria attributes of the toggle buttons. Button must be a semantic button element or a non-semantic element with a role of button, and possess the aria-pressed attribute.
 * @param {string} toggleId The id of the toggle buttons parent container.
 * @param {string} togglesClass The shared class of all the toggle buttons.
 * @param {ToggleStates[]} toggleStates Array of objects containing toggle buttons state information.
 * @param {number} currentPressedToggleIndex Index of the currently pressed or unpressed toggle button.
*/

declare function updateToggleAriaAttribute(toggleId: string, togglesClass: string, toggleStates: ToggleStates[], currentPressedToggleIndex: number): void;

export { updateToggleAriaAttribute };
