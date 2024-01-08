/**
 * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded, aria-pressed, aria-label.
 * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information
 * @param {string} accordionsClass The shared class of all the accordion triggers
 * @param {number} currentClickedTriggerIndex Index of the currently clicked accordion trigger
 */
export function updateAccordionTriggerAriaAttributes(accordionStates, accordionsClass, currentClickedTriggerIndex) {
    var allAccordionTrigger = Array.from(document.querySelectorAll(".".concat(accordionsClass)));
    if (!allAccordionTrigger) {
        throw new Error('Invalid trigger class provided.');
    }
    allAccordionTrigger.forEach(function (trigger, index) {
        if (index === currentClickedTriggerIndex) {
            trigger.setAttribute("aria-expanded", accordionStates[index].display ? 'true' : 'false');
            trigger.setAttribute("aria-pressed", accordionStates[index].display ? 'true' : 'false');
        }
        else {
            trigger.setAttribute("aria-expanded", 'false');
            trigger.setAttribute("aria-pressed", 'false');
        }
        trigger.setAttribute("aria-label", accordionStates[index].display ? accordionStates[index].openedAriaLabel : accordionStates[index].closedAriaLabel);
    });
}
