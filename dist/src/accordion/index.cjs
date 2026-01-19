'use strict';

// src/accordion/src/updateAccordionTriggerAriaAttributes/updateAccordionTriggerAriaAttributes.ts
function updateAccordionTriggerAriaAttributes(accordionId, accordionTriggersClass, accordionStates, clickedTriggerIndex) {
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
    const shouldBeExpanded = index === clickedTriggerIndex ? state.display ? "true" : "false" : "false";
    if (expanded && expanded !== shouldBeExpanded) {
      accordionItem.setAttribute("aria-expanded", shouldBeExpanded);
    }
  });
}

exports.updateAccordionTriggerAriaAttributes = updateAccordionTriggerAriaAttributes;
