import { A as AccordionConfig, a as AccessibilityInstance } from '../Types.d-Dt_ojd71.js';

/**
 * Makes an accordion accessible by managing ARIA attributes, keyboard navigation, and state.
 * Handles multiple accordion items with proper focus management and keyboard interactions.
 * @param {string} accordionId - The id of the accordion container.
 * @param {string} triggersClass - The shared class of all accordion trigger buttons.
 * @param {string} panelsClass - The shared class of all accordion panels.
 * @param {boolean} allowMultipleOpen - Whether multiple panels can be open simultaneously (default: false).
 * @param {AccordionCallback} callback - Configuration options for callbacks.
 */

declare function makeAccordionAccessible({ accordionId, triggersClass, panelsClass, allowMultipleOpen, callback }: AccordionConfig): AccessibilityInstance;

export { makeAccordionAccessible };
