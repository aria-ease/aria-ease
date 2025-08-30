/**
 * Adds screen reader accessibility to toggle buttons. Updates the aria attributes of the toggle buttons. Button must be button element with a role of button, and possess the aria-pressed attribute.
 * @param {ToggleStates[]} toggleStates Array of objects containing toggle buttons state information
 * @param {string} togglesClass The shared class of all the toggle buttons
 * @param {number} currentPressedToggleIndex Index of the currently pressed or unpressed toggle button
 */

import { HTMLElement, ToggleStates } from "../../../../Types";

export function updateGroupTogglesAriaAttributes(toggleStates: ToggleStates[], togglesClass: string, currentPressedToggleIndex: number): void {
    console.log('Toggle updateGroupTogglesAriaAttributes initiated');
}