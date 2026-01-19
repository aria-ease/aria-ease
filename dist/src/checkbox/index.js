// src/checkbox/src/updateCheckboxAriaAttributes/updateCheckboxAriaAttributes.ts
function updateCheckboxAriaAttributes(checkboxId, checkboxesClass, checkboxStates, currentPressedCheckboxIndex) {
  const checkboxDiv = document.querySelector(`#${checkboxId}`);
  if (!checkboxDiv) {
    console.error(`[aria-ease] Invalid checkbox main div id provided. No checkbox div with id '${checkboxDiv} found.'`);
    return;
  }
  const checkboxItems = Array.from(document.querySelectorAll(`.${checkboxesClass}`));
  if (checkboxItems.length === 0) {
    console.error(`[aria-ease] Element with class="${checkboxesClass}" not found. Make sure the checkbox items exist before calling updateCheckboxAriaAttributes.`);
    return;
  }
  if (checkboxStates.length === 0) {
    console.error(`[aria-ease] Checkbox states array is empty. Make sure the checkboxStates array is populated before calling updateCheckboxAriaAttributes.`);
    return;
  }
  if (currentPressedCheckboxIndex < 0 || currentPressedCheckboxIndex >= checkboxStates.length) {
    console.error(`[aria-ease] Checkbox index ${currentPressedCheckboxIndex} is out of bounds for states array of length ${checkboxStates.length}.`);
    return;
  }
  checkboxItems.forEach((checkbox, index) => {
    if (index === currentPressedCheckboxIndex) {
      const checked = checkbox.getAttribute("aria-checked");
      const shouldBeChecked = checkboxStates[index].checked ? "true" : "false";
      if (checked && checked !== shouldBeChecked) {
        checkbox.setAttribute("aria-checked", shouldBeChecked);
      }
    }
  });
}

export { updateCheckboxAriaAttributes };
