/**
 * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded and aria-label.
 * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information
 * @param {string} accordionsClass The shared class of all the accordion triggers
 * @param {number} currentClickedTriggerIndex Index of the currently clicked accordion trigger
 */

import { HTMLElement, AccordionStates } from "../../Types";

export function updateAccordionTriggerAriaAttributes(accordionStates: AccordionStates[], accordionsClass: string, currentClickedTriggerIndex: number): void {
    const allAccordionTriggers: HTMLElement[] = Array.from(document.querySelectorAll(`.${accordionsClass}`));

    if ( !allAccordionTriggers) {
      throw new Error('Invalid triggers shared class provided.');
    }

    allAccordionTriggers.forEach((trigger, index) => {
      if (index === currentClickedTriggerIndex) {
        trigger.setAttribute("aria-expanded", accordionStates[index].display ? 'true' : 'false');
      } else {
        trigger.setAttribute("aria-expanded", 'false');
      }
      trigger.setAttribute("aria-label", accordionStates[index].display ? accordionStates[index].openedAriaLabel : accordionStates[index].closedAriaLabel);
    });
}