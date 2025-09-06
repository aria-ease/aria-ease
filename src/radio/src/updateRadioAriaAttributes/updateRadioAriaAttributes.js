/**
 * Adds screen reader accessibility to multiple radio buttons. Updates the aria attributes of the radio buttons. Radio elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} radioId The id of the radio parent container.
 * @param {string} radiosClass The shared class of all the radios.
 * @param {RadioStates[]} radioStates Array of objects containing radio buttons state information.
 * @param {number} currentPressedRadioIndex Index of the currently checked or unchecked radio button.
 */
export function updateRadioAriaAttributes(radioId, radiosClass, radioStates, currentPressedRadioIndex) {
    var radioDiv = document.querySelector("#".concat(radioId));
    if (!radioDiv) {
        throw new Error("Invalid radio main div id provided.");
    }
    var radioItems = Array.from(radioDiv.querySelectorAll(".".concat(radiosClass)));
    if (radioItems.length === 0) {
        throw new Error('Invalid radios shared class provided.');
    }
    radioItems.forEach(function (radioItem, index) {
        var state = radioStates[index];
        var checked = radioItem.getAttribute("aria-checked");
        var shouldBeChecked = index === currentPressedRadioIndex ? (state.checked ? "true" : "false") : "false";
        if (checked && checked !== shouldBeChecked) {
            radioItem.setAttribute("aria-checked", shouldBeChecked);
        }
    });
}
