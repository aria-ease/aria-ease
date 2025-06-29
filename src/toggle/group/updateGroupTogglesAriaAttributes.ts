/**
 * Adds screen reader accessibility to toggle buttons. Updates the aria attributes of the toggle buttons. Button must be button element with a role of button, and possess the aria-pressed attribute.
 * @param {ToggleStates[]} toggleStates Array of objects containing toggle buttons state information
 * @param {string} togglesClass The shared class of all the toggle buttons
 * @param {number} currentPressedToggleIndex Index of the currently pressed or unpressed toggle button
 */

import { HTMLElement, ToggleStates } from "../../../Types";

export function updateGroupTogglesAriaAttributes(toggleStates: ToggleStates[], togglesClass: string, currentPressedToggleIndex: number): void {
    const allToggles: HTMLElement[] = Array.from(document.querySelectorAll(`.${togglesClass}`));

    if ( !allToggles) {
      throw new Error('Invalid toggles shared class provided.');
    }

    allToggles.forEach((toggle, index) => {
      if (index === currentPressedToggleIndex) {
        toggle.setAttribute("aria-pressed", toggleStates[index].pressed ? 'true' : 'false');
      }
    });
}