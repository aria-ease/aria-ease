/**
 * Adds screen reader accessibility to toggle buttons. Updates the aria attributes of the toggle buttons. Button must be a semantic button element or a non-semantic element with a role of button, and possess the aria-pressed attribute.
 * @param {string} toggleId The id of the toggle buttons parent container.
 * @param {string} togglesClass The shared class of all the toggle buttons.
 * @param {ToggleStates[]} toggleStates Array of objects containing toggle buttons state information.
 * @param {number} currentPressedToggleIndex Index of the currently pressed or unpressed toggle button.
*/
export function updateToggleAriaAttribute(toggleId, togglesClass, toggleStates, currentPressedToggleIndex) {
    var toggleDiv = document.querySelector("#".concat(toggleId));
    if (!toggleDiv) {
        throw new Error("Invalid toggle main div id provided.");
    }
    var toggleItems = Array.from(toggleDiv.querySelectorAll(".".concat(togglesClass)));
    if (toggleItems.length === 0) {
        throw new Error('Invalid toggles shared class provided.');
    }
    if (toggleItems.length !== toggleStates.length) {
        throw new Error("Toggle state/DOM length mismatch: found ".concat(toggleItems.length, " triggers, but got ").concat(toggleStates.length, " state objects."));
    }
    toggleItems.forEach(function (toggle, index) {
        if (index === currentPressedToggleIndex) {
            toggle.setAttribute("aria-pressed", toggleStates[index].pressed ? 'true' : 'false');
        }
    });
}
