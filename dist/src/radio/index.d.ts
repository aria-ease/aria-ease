import { A as AccessibilityInstance } from '../Types.d-COr5IFp5.js';

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

export { makeRadioAccessible };
