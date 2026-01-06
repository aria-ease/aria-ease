import { A as AccordionStates } from '../Types.d-w1KLKLcA.cjs';

/**
 * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded, aria-controls, aria-label (for only non-text triggers).
 * @param {string} accordionId The id of the accordion triggers parent container.
 * @param {string} accordionTriggersClass The shared class of all the accordion triggers.
 * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information.
 * @param {number} clickedTriggerIndex Index of the currently clicked accordion trigger within the accordion div container.
*/

declare function updateAccordionTriggerAriaAttributes(accordionId: string, accordionTriggersClass: string, accordionStates: AccordionStates[], clickedTriggerIndex: number): void;

export { updateAccordionTriggerAriaAttributes };
