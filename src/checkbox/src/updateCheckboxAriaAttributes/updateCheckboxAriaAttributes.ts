/**
 * Adds screen reader accessibility to multiple checkboxes. Updates the aria attributes of the checkboxes. Checkbox elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} checkboxId The id of the checkbox parent container.
 * @param {string} checkboxesClass The shared class of all the checkboxes.
 * @param {CheckboxStates[]} checkboxStates Array of objects containing checkboxes state information.
 * @param {number} currentPressedCheckboxIndex Index of the currently checked or unchecked checkbox.
*/

import { CheckboxStates } from "Types";

export function updateCheckboxAriaAttributes(checkboxId: string, checkboxesClass: string, checkboxStates: CheckboxStates[], currentPressedCheckboxIndex: number): void {
  const checkboxDiv: HTMLElement | null = document.querySelector(`#${checkboxId}`);
  if (!checkboxDiv) {
    console.error(`[aria-ease] Invalid checkbox main div id provided. No checkbox div with id '${checkboxDiv} found.'`);
    return;
  }
            
  const checkboxItems: HTMLElement[] = Array.from(document.querySelectorAll(`.${checkboxesClass}`));
  if (checkboxItems.length === 0) {
    console.error(`[aria-ease] Element with class="${checkboxesClass}" not found. Make sure the checkbox items exist before calling updateCheckboxAriaAttributes.`);
    return;
  };

  if (checkboxStates.length === 0) {
    console.error(`[aria-ease] Checkbox states array is empty. Make sure the checkboxStates array is populated before calling updateCheckboxAriaAttributes.`);
    return;
  }

  if (currentPressedCheckboxIndex < 0 || currentPressedCheckboxIndex >= checkboxStates.length) {
    console.error(`[aria-ease] Checkbox index ${currentPressedCheckboxIndex} is out of bounds for states array of length ${checkboxStates.length}.`);
    return;
  }

  checkboxItems.forEach((checkbox: HTMLElement, index: number) => {
    if (index === currentPressedCheckboxIndex) {
      const checked = checkbox.getAttribute("aria-checked");
      const shouldBeChecked = checkboxStates[index].checked ? 'true' : 'false';
      if (checked && checked !== shouldBeChecked) {
        checkbox.setAttribute("aria-checked", shouldBeChecked);
      }
    }
  });
}