import { A as AccessibilityInstance } from '../Types.d-COr5IFp5.js';

/**
 * Makes an accordion accessible by managing ARIA attributes, keyboard navigation, and state.
 * Handles multiple accordion items with proper focus management and keyboard interactions.
 * @param {string} accordionId - The id of the accordion container.
 * @param {string} triggersClass - The shared class of all accordion trigger buttons.
 * @param {string} panelsClass - The shared class of all accordion panels.
 * @param {boolean} allowMultiple - Whether multiple panels can be open simultaneously (default: false).
 */

interface AccordionConfig {
    accordionId: string;
    triggersClass: string;
    panelsClass: string;
    allowMultiple?: boolean;
}
declare function makeAccordionAccessible({ accordionId, triggersClass, panelsClass, allowMultiple }: AccordionConfig): AccessibilityInstance;

export { makeAccordionAccessible };
