import { R as RadioStates } from '../Types.d-BjpUW0_M.js';

/**
 * Adds screen reader accessibility to multiple radio buttons. Updates the aria attributes of the radio buttons. Radio elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} radioId The id of the radio parent container.
 * @param {string} radiosClass The shared class of all the radios.
 * @param {RadioStates[]} radioStates Array of objects containing radio buttons state information.
 * @param {number} currentPressedRadioIndex Index of the currently checked or unchecked radio button.
 */

declare function updateRadioAriaAttributes(radioId: string, radiosClass: string, radioStates: RadioStates[], currentPressedRadioIndex: number): void;

export { updateRadioAriaAttributes };
