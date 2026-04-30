import { R as RadioConfig, a as AccessibilityInstance } from '../Types.d-C8k7pabS.js';

/**
 * Makes a radio group accessible by managing ARIA attributes, keyboard interaction, and state.
 * Handles radio button selection with proper focus management and keyboard interactions.
 * @param {string} radioGroupId - The id of the radio group container.
 * @param {string} radiosClass - The shared class of all radio buttons.
 * @param {number} defaultSelectedIndex - The index of the initially selected radio (default: 0).
 * @param {RadioCallback} callback - Configuration options for callbacks.
 */

declare function makeRadioAccessible({ radioGroupId, radiosClass, defaultSelectedIndex, callback }: RadioConfig): AccessibilityInstance;

export { makeRadioAccessible };
