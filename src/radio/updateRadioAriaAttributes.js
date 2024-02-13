/**
 * Adds screen reader accessibility to radio buttons. Updates the aria attributes of the radio button. Radio element must possess the following aria attributes; aria-checked and aria-label.
 * @param {RadioStates[]} radioStates Array of objects containing radio buttons state information
 * @param {string} radiosClass The shared class of all the radio buttons
 * @param {number} currentPressedRadioIndex Index of the currently checked or unchecked radio button
 */
export function updateRadioAriaAttributes(radioStates, radiosClass, currentPressedRadioIndex) {
    var allRadios = Array.from(document.querySelectorAll(".".concat(radiosClass)));
    if (!allRadios) {
        throw new Error('Invalid radios class provided.');
    }
    allRadios.forEach(function (radio, index) {
        if (index === currentPressedRadioIndex) {
            radio.setAttribute("aria-checked", radioStates[index].checked ? 'true' : 'false');
        }
        else {
            if (radio.getAttribute("aria-checked") === "true") {
                radio.setAttribute("aria-checked", 'false');
            }
        }
        radio.setAttribute("aria-label", radioStates[index].checked ? radioStates[index].checkedAriaLabel : radioStates[index].uncheckedAriaLabel);
    });
}
