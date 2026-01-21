import { R as RadioStates, a as AccessibilityInstance } from '../Types.d-BrHSyS03.js';

/**
 * Adds screen reader accessibility to multiple radio buttons. Updates the aria attributes of the radio buttons. Radio elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} radioId The id of the radio parent container.
 * @param {string} radiosClass The shared class of all the radios.
 * @param {RadioStates[]} radioStates Array of objects containing radio buttons state information.
 * @param {number} currentPressedRadioIndex Index of the currently checked or unchecked radio button.
 */

declare function updateRadioAriaAttributes(radioId: string, radiosClass: string, radioStates: RadioStates[], currentPressedRadioIndex: number): void;

/**
 * Makes a radio group accessible by managing ARIA attributes, keyboard navigation, and state.
 * Handles radio button selection with proper focus management and keyboard interactions.
 * @param {string} radioGroupId - The id of the radio group container.
 * @param {string} radiosClass - The shared class of all radio buttons.
 * @param {number} defaultSelectedIndex - The index of the initially selected radio (default: 0).
 */

interface RadioConfig {
    radioGroupId: string;
    radiosClass: string;
    defaultSelectedIndex?: number;
}
declare function makeRadioAccessible({ radioGroupId, radiosClass, defaultSelectedIndex }: RadioConfig): AccessibilityInstance;

export { makeRadioAccessible, updateRadioAriaAttributes };
