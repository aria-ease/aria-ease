/**
 * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded, aria-pressed, aria-label.
 * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information
 * @param {string} accordionsClass The shared class of all the accordion triggers
 * @param {number} currentClickedTriggerIndex Index of the currently clicked accordion trigger
 */

import { HTMLElement, AccordionStates } from "../../Types";

export function updateAccordionTriggerAriaAttributes(accordionStates: AccordionStates[], accordionsClass: string, currentClickedTriggerIndex: number): void {
    const allAccordionTrigger: HTMLElement[] = Array.from(document.querySelectorAll(`.${accordionsClass}`));

    if ( !allAccordionTrigger) {
        throw new Error('Invalid trigger class provided.');
    }

    allAccordionTrigger.forEach((trigger, index) => {
        if (index === currentClickedTriggerIndex) {
          trigger.setAttribute("aria-expanded", accordionStates[index].display ? 'true' : 'false');
          trigger.setAttribute("aria-pressed", accordionStates[index].display ? 'true' : 'false');
        } else {
          trigger.setAttribute("aria-expanded", 'false');
          trigger.setAttribute("aria-pressed", 'false');
        }
    
        trigger.setAttribute("aria-label", accordionStates[index].display ? accordionStates[index].openedAriaLabel : accordionStates[index].closedAriaLabel);
    });
}