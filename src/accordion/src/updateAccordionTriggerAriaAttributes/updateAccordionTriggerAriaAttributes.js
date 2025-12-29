/**
 * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded, aria-controls, aria-label (for only non-text triggers).
 * @param {string} accordionId The id of the accordion triggers parent container.
 * @param {string} accordionTriggersClass The shared class of all the accordion triggers.
 * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information.
 * @param {number} clickedTriggerIndex Index of the currently clicked accordion trigger within the accordion div container.
*/
export function updateAccordionTriggerAriaAttributes(accordionId, accordionTriggersClass, accordionStates, clickedTriggerIndex) {
    const accordionDiv = document.querySelector(`#${accordionId}`);
    if (!accordionDiv) {
        console.error(`[aria-ease] Element with id="${accordionId}" not found. Make sure the accordion element exists before calling updateAccordionTriggerAriaAttributes.`);
        return;
    }
    const accordionItems = Array.from(accordionDiv.querySelectorAll(`.${accordionTriggersClass}`));
    if (accordionItems.length === 0) {
        console.error(`[aria-ease] Element with class="${accordionTriggersClass}" not found. Make sure the accordion items exist before calling updateAccordionTriggerAriaAttributes.`);
        return;
    }
    if (accordionItems.length !== accordionStates.length) {
        console.error(`[aria-ease] Accordion state/DOM length mismatch: found ${accordionItems.length} triggers, but got ${accordionStates.length} state objects.'`);
        return;
    }
    accordionItems.forEach((accordionItem, index) => {
        const state = accordionStates[index];
        const expanded = accordionItem.getAttribute("aria-expanded");
        const shouldBeExpanded = index === clickedTriggerIndex ? (state.display ? "true" : "false") : "false";
        if (expanded && expanded !== shouldBeExpanded) {
            accordionItem.setAttribute("aria-expanded", shouldBeExpanded);
        }
    });
}
