/**
 * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded and aria-label.
 * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information
 * @param {string} accordionsClass The shared class of all the accordion triggers
 * @param {number} currentClickedTriggerIndex Index of the currently clicked accordion trigger
 */

import { HTMLElement, AccordionStates } from "../../../../Types";

export function updateAccordionTriggerAriaAttributes(accordionStates: AccordionStates[], accordionsClass: string, currentClickedTriggerIndex: number): void {
    console.log('Accordion updateAccordionTriggerAriaAttributes initiated')
}