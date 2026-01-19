'use strict';

// src/toggle/src/updateToggleAriaAttribute/updateToggleAriaAttribute.ts
function updateToggleAriaAttribute(toggleId, togglesClass, toggleStates, currentPressedToggleIndex) {
  const toggleDiv = document.querySelector(`#${toggleId}`);
  if (!toggleDiv) {
    console.error(`[aria-ease] Element with id="${toggleId}" not found. Make sure the toggle element exists before calling updateToggleAriaAttribute.`);
    return;
  }
  const toggleItems = Array.from(toggleDiv.querySelectorAll(`.${togglesClass}`));
  if (toggleItems.length === 0) {
    console.error(`[aria-ease] Element with class="${togglesClass}" not found. Make sure the toggle items exist before calling updateToggleAriaAttribute.`);
    return;
  }
  if (toggleItems.length !== toggleStates.length) {
    console.error(`[aria-ease] Toggle state/DOM length mismatch: found ${toggleItems.length} triggers, but got ${toggleStates.length} state objects.'`);
    return;
  }
  toggleItems.forEach((toggle, index) => {
    if (index === currentPressedToggleIndex) {
      const pressed = toggle.getAttribute("aria-pressed");
      const shouldBePressed = toggleStates[index].pressed ? "true" : "false";
      if (pressed && pressed !== shouldBePressed) {
        toggle.setAttribute("aria-pressed", shouldBePressed);
      }
    }
  });
}

exports.updateToggleAriaAttribute = updateToggleAriaAttribute;
