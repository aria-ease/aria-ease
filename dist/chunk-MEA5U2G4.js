// src/accordion/src/updateAccordionTriggerAriaAttributes/updateAccordionTriggerAriaAttributes.ts
function updateAccordionTriggerAriaAttributes(accordionId, accordionTriggersClass, accordionStates, clickedTriggerIndex) {
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
    accordionItems.forEach(function(accordionItem, index) {
        var state = accordionStates[index];
        var expanded = accordionItem.getAttribute("aria-expanded");
        var shouldBeExpanded = index === clickedTriggerIndex ? state.display ? "true" : "false" : "false";
        if (expanded && expanded !== shouldBeExpanded) {
            accordionItem.setAttribute("aria-expanded", shouldBeExpanded);
        }
    });
}
export { updateAccordionTriggerAriaAttributes }; //# sourceMappingURL=chunk-MEA5U2G4.js.map
//# sourceMappingURL=chunk-MEA5U2G4.js.map