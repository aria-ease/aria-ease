/**
 * Adds screen reader accessibility to multiple checkboxes. Updates the aria attributes of the checkboxes. Checkbox elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} checkboxId The id of the checkbox parent container.
 * @param {string} checkboxesClass The shared class of all the checkboxes.
 * @param {CheckboxStates[]} checkboxStates Array of objects containing checkboxes state information.
 * @param {number} currentPressedCheckboxIndex Index of the currently checked or unchecked checkbox.
*/

import { HTMLElement, CheckboxStates } from "../../../../Types";

export function updateCheckboxAriaAttributes(checkboxId: string, checkboxesClass: string, checkboxStates: CheckboxStates[], currentPressedCheckboxIndex: number): void {
  const checkboxDiv: HTMLElement | null = document.querySelector(`#${checkboxId}`);
  if (!checkboxDiv) {
    throw new Error("Invalid checkbox main div id provided.");
  }
            
  const checkboxItems: HTMLElement[] = Array.from(document.querySelectorAll(`.${checkboxesClass}`));
  if (checkboxItems.length === 0) {
    throw new Error('Invalid checkboxes shared class provided.');
  };

  checkboxItems.forEach((checkbox: HTMLElement, index: number) => {
    if (index === currentPressedCheckboxIndex) {
      checkbox.setAttribute("aria-checked", checkboxStates[index].checked ? 'true' : 'false');
    }
  });
}