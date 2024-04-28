/**
 * Adds screen reader accessibility to toggle elements. Updates the aria attributes of the toggle elements. Toggle element must possess the following aria attributes; aria-pressed and aria-label.
 * @param {ToggleStates[]} toggleStates Array of objects containing toggle elements state information
 * @param {string} togglesClass The shared class of all the toggle elements
 * @param {number} currentPressedToggleIndex Index of the currently pressed or unpressed toggle element
 */
export function updateGroupTogglesAriaAttributes(toggleStates, togglesClass, currentPressedToggleIndex) {
    var allToggles = Array.from(document.querySelectorAll(".".concat(togglesClass)));
    if (!allToggles) {
        throw new Error('Invalid toggles shared class provided.');
    }
    allToggles.forEach(function (toggle, index) {
        if (index === currentPressedToggleIndex) {
            toggle.setAttribute("aria-pressed", toggleStates[index].pressed ? 'true' : 'false');
            toggle.setAttribute("aria-label", toggleStates[index].pressed ? toggleStates[index].pressedAriaLabel : toggleStates[index].unpressedAriaLabel);
        }
    });
}
