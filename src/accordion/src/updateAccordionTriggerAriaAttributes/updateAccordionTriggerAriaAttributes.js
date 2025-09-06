/**
 * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded, aria-controls, aria-label (for only non-text triggers).
 * @param {string} accordionId The id of the accordion triggers parent container.
 * @param {string} accordionTriggersClass The shared class of all the accordion triggers.
 * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information.
 * @param {number} clickedTriggerIndex Index of the currently clicked accordion trigger within the accordion div container.
*/
export function updateAccordionTriggerAriaAttributes(accordionId, accordionTriggersClass, accordionStates, clickedTriggerIndex) {
    var accordionDiv = document.querySelector("#".concat(accordionId));
    if (!accordionDiv) {
        throw new Error("Invalid accordion main div id provided.");
    }
    var accordionItems = Array.from(accordionDiv.querySelectorAll(".".concat(accordionTriggersClass)));
    if (accordionItems.length === 0) {
        throw new Error("Invalid accordion items shared class provided.");
    }
    if (accordionItems.length !== accordionStates.length) {
        throw new Error("Accordion state/DOM length mismatch: found ".concat(accordionItems.length, " triggers, but got ").concat(accordionStates.length, " state objects."));
    }
    accordionItems.forEach(function (accordionItem, index) {
        var state = accordionStates[index];
        var expanded = accordionItem.getAttribute("aria-expanded");
        var shouldBeExpanded = index === clickedTriggerIndex ? (state.display ? "true" : "false") : "false";
        if (expanded && expanded !== shouldBeExpanded) {
            accordionItem.setAttribute("aria-expanded", shouldBeExpanded);
        }
    });
}
