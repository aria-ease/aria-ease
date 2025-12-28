/**
 * Adds screen reader accessibility to toggle buttons. Updates the aria attributes of the toggle buttons. Button must be a semantic button element or a non-semantic element with a role of button, and possess the aria-pressed attribute.
 * @param {string} toggleId The id of the toggle buttons parent container.
 * @param {string} togglesClass The shared class of all the toggle buttons.
 * @param {ToggleStates[]} toggleStates Array of objects containing toggle buttons state information.
 * @param {number} currentPressedToggleIndex Index of the currently pressed or unpressed toggle button.
*/
export function updateToggleAriaAttribute(toggleId, togglesClass, toggleStates, currentPressedToggleIndex) {
    const toggleDiv = document.querySelector(`#${toggleId}`);
    if (!toggleDiv) {
        console.error(`[aria-ease] Element with id="${toggleId}" not found. Make sure the toggle element exists before calling updateToggleAriaAttribute.`);
        return;
    }
    const toggleItems = Array.from(toggleDiv.querySelectorAll(`.${togglesClass}`));
    if (toggleItems.length === 0) {
        console.error(`[aria-ease] Element with class="${togglesClass}" not found. Make sure the toggle items exist before calling updateToggleAriaAttribute.`);
        return;
    }
    if (toggleItems.length !== toggleStates.length) {
        console.error(`[aria-ease] Toggle state/DOM length mismatch: found ${toggleItems.length} triggers, but got ${toggleStates.length} state objects.'`);
        return;
    }
    toggleItems.forEach((toggle, index) => {
        if (index === currentPressedToggleIndex) {
            const pressed = toggle.getAttribute("aria-pressed");
            const shouldBePressed = toggleStates[index].pressed ? 'true' : 'false';
            if (pressed && pressed !== shouldBePressed) {
                toggle.setAttribute("aria-pressed", shouldBePressed);
            }
        }
    });
}
