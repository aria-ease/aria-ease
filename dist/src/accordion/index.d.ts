import { A as AccordionStates, a as AccessibilityInstance } from '../Types.d-BrHSyS03.js';

/**
 * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded, aria-controls, aria-label (for only non-text triggers).
 * @param {string} accordionId The id of the accordion triggers parent container.
 * @param {string} accordionTriggersClass The shared class of all the accordion triggers.
 * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information.
 * @param {number} clickedTriggerIndex Index of the currently clicked accordion trigger within the accordion div container.
*/

declare function updateAccordionTriggerAriaAttributes(accordionId: string, accordionTriggersClass: string, accordionStates: AccordionStates[], clickedTriggerIndex: number): void;

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

export { makeAccordionAccessible, updateAccordionTriggerAriaAttributes };
