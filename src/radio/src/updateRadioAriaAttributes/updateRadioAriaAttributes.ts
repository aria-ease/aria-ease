/**
 * Adds screen reader accessibility to multiple radio buttons. Updates the aria attributes of the radio buttons. Radio elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} radioId The id of the radio parent container.
 * @param {string} radiosClass The shared class of all the radios.
 * @param {RadioStates[]} radioStates Array of objects containing radio buttons state information.
 * @param {number} currentPressedRadioIndex Index of the currently checked or unchecked radio button.
 */

import { HTMLElement, RadioStates } from "../../../../Types";

export function updateRadioAriaAttributes(radioId: string, radiosClass: string, radioStates: RadioStates[], currentPressedRadioIndex: number): void {
    const radioDiv: HTMLElement | null = document.querySelector(`#${radioId}`);
    if (!radioDiv) {
        throw new Error("Invalid radio main div id provided.");
    }
    
    const radioItems: HTMLElement[] = Array.from(radioDiv.querySelectorAll(`.${radiosClass}`));
    if(radioItems.length === 0) {
      throw new Error('Invalid radios shared class provided.');
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