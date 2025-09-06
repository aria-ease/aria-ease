/**
 * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded, aria-controls, aria-label (for only non-text triggers).
 * @param {string} accordionId The id of the accordion triggers parent container.
 * @param {string} accordionTriggersClass The shared class of all the accordion triggers.
 * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information.
 * @param {number} clickedTriggerIndex Index of the currently clicked accordion trigger within the accordion div container.
*/

import { HTMLElement, AccordionStates } from "../../../../Types";

export function updateAccordionTriggerAriaAttributes(accordionId: string, accordionTriggersClass: string, accordionStates: AccordionStates[], clickedTriggerIndex: number): void {
    const accordionDiv: HTMLElement | null = document.querySelector(`#${accordionId}`);
    if (!accordionDiv) {
        throw new Error("Invalid accordion main div id provided.");
    }

    const accordionItems: HTMLElement[] = Array.from(accordionDiv.querySelectorAll(`.${accordionTriggersClass}`));
    if (accordionItems.length === 0) {
        throw new Error("Invalid accordion items shared class provided.");
    }

    if (accordionItems.length !== accordionStates.length) {
        throw new Error(`Accordion state/DOM length mismatch: found ${accordionItems.length} triggers, but got ${accordionStates.length} state objects.`);
    }

    accordionItems.forEach((accordionItem: HTMLElement, index: number) => {
        const state = accordionStates[index];
        const expanded = accordionItem.getAttribute("aria-expanded");
        const shouldBeExpanded = index === clickedTriggerIndex ? (state.display ? "true" : "false") : "false";
        if (expanded && expanded !== shouldBeExpanded) {
            accordionItem.setAttribute("aria-expanded", shouldBeExpanded);
        }
    });
}