/**
 * Adds screen reader accessibility to multiple radio buttons. Updates the aria attributes of the radio buttons. Radio elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} radioId The id of the radio parent container.
 * @param {string} radiosClass The shared class of all the radios.
 * @param {RadioStates[]} radioStates Array of objects containing radio buttons state information.
 * @param {number} currentPressedRadioIndex Index of the currently checked or unchecked radio button.
 */

import { RadioStates } from "../../../../Types";

export function updateRadioAriaAttributes(radioId: string, radiosClass: string, radioStates: RadioStates[], currentPressedRadioIndex: number): void {
    const radioDiv: HTMLElement | null = document.querySelector(`#${radioId}`);
    if (!radioDiv) {
      console.error(`[aria-ease] Element with id="${radioId}" not found. Make sure the radio element exists before calling updateRadioAriaAttributes.`);
      return;
    }
    
    const radioItems: HTMLElement[] = Array.from(radioDiv.querySelectorAll(`.${radiosClass}`));
    if(radioItems.length === 0) {
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

    radioItems.forEach((radioItem: HTMLElement, index: number) => {
      const state = radioStates[index];
      const checked = radioItem.getAttribute("aria-checked");
      const shouldBeChecked = index === currentPressedRadioIndex ? (state.checked ? "true" : "false") : "false";
      if (checked && checked !== shouldBeChecked) {
        radioItem.setAttribute("aria-checked", shouldBeChecked);
      }
    });
}