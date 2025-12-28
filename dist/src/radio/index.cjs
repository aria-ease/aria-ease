'use strict';

// src/radio/src/updateRadioAriaAttributes/updateRadioAriaAttributes.ts
function updateRadioAriaAttributes(radioId, radiosClass, radioStates, currentPressedRadioIndex) {
  const radioDiv = document.querySelector(`#${radioId}`);
  if (!radioDiv) {
    console.error(`[aria-ease] Element with id="${radioId}" not found. Make sure the radio element exists before calling updateRadioAriaAttributes.`);
    return;
  }
  const radioItems = Array.from(radioDiv.querySelectorAll(`.${radiosClass}`));
  if (radioItems.length === 0) {
    console.error(`[aria-ease] Element with class="${radiosClass}" not found. Make sure the radio items exist before calling updateRadioAriaAttributes.`);
    return;
  }
  if (radioStates.length === 0) {
    console.error(`[aria-ease] Radio states array is empty. Make sure the radioStates array is populated before calling updateRadioAriaAttributes.`);
    return;
  }
  if (currentPressedRadioIndex < 0 || currentPressedRadioIndex >= radioStates.length) {
    console.error(`[aria-ease] Radio index ${currentPressedRadioIndex} is out of bounds for states array of length ${radioStates.length}.`);
    return;
  }
  radioItems.forEach((radioItem, index) => {
    const state = radioStates[index];
    const checked = radioItem.getAttribute("aria-checked");
    const shouldBeChecked = index === currentPressedRadioIndex ? state.checked ? "true" : "false" : "false";
    if (checked && checked !== shouldBeChecked) {
      radioItem.setAttribute("aria-checked", shouldBeChecked);
    }
  });
}

exports.updateRadioAriaAttributes = updateRadioAriaAttributes;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map