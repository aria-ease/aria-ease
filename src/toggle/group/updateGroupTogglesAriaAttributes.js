/**
 * Adds screen reader accessibility to toggle buttons. Updates the aria attributes of the toggle buttons. Button must be button element with a role of button, and possess the following aria attributes; aria-pressed and aria-label.
 * @param {ToggleStates[]} toggleStates Array of objects containing toggle buttons state information
 * @param {string} togglesClass The shared class of all the toggle buttons
 * @param {number} currentPressedToggleIndex Index of the currently pressed or unpressed toggle button
 */
export function updateGroupTogglesAriaAttributes(toggleStates, togglesClass, currentPressedToggleIndex) {
    var allToggles = Array.from(document.querySelectorAll(".".concat(togglesClass)));
    if (!allToggles) {
        throw new Error('Invalid toggles shared class provided.');
    }
    allToggles.forEach(function (toggle, index) {
        if (index === currentPressedToggleIndex) {
            toggle.setAttribute("aria-pressed", toggleStates[index].pressed ? 'true' : 'false');
        }
    });
}
