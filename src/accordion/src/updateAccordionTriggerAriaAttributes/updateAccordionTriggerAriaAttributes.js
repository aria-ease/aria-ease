/**
 * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded and aria-label.
 * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information.
 * @param {string} accordionId The id of the accordion container.
 * @param {string} accordionElementsClass The shared class of all the accordion triggers.
 * @param {number} currentClickedTriggerIndex Index of the currently clicked accordion trigger within the accordion div container.
 */
export function updateAccordionTriggerAriaAttributes(accordionId, accordionElementsClass, accordionStates, currentClickedTriggerIndex) {
    var accordionDiv = document.querySelector("#".concat(accordionId));
    if (!accordionDiv) {
        throw new Error("Invalid accordion main div id provided.");
    }
    var accordionItems = Array.from(accordionDiv.querySelectorAll(".".concat(accordionElementsClass)));
    if (accordionItems.length === 0) {
        throw new Error("Invalid accordion items shared class provided.");
    }
    if (accordionItems.length !== accordionStates.length) {
        throw new Error("Accordion state/DOM length mismatch: found ".concat(accordionItems.length, " triggers, but got ").concat(accordionStates.length, " state objects."));
    }
    accordionItems.forEach(function (accordionItem, index) {
        var state = accordionStates[index];
        var expanded = accordionItem.getAttribute("aria-expanded");
        var label = accordionItem.getAttribute("aria-label");
        var shouldBeExpanded = index === currentClickedTriggerIndex ? (state.display ? "true" : "false") : "false";
        var shouldBeLabel = state.display ? state.openedAriaLabel : state.closedAriaLabel;
        if (expanded !== shouldBeExpanded) {
            accordionItem.setAttribute("aria-expanded", shouldBeExpanded);
        }
        if (label !== shouldBeLabel) {
            accordionItem.setAttribute("aria-label", shouldBeLabel);
        }
    });
}
