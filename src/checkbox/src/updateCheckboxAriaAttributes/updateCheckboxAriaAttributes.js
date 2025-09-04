/**
 * Adds screen reader accessibility to multiple checkboxes. Updates the aria attributes of the checkboxes. Checkbox elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} checkboxId The id of the checkbox parent container.
 * @param {string} checkboxesClass The shared class of all the checkboxes.
 * @param {CheckboxStates[]} checkboxStates Array of objects containing checkboxes state information.
 * @param {number} currentPressedCheckboxIndex Index of the currently checked or unchecked checkbox.
 */
export function updateCheckboxAriaAttributes(checkboxId, checkboxesClass, checkboxStates, currentPressedCheckboxIndex) {
    var checkboxDiv = document.querySelector("#".concat(checkboxId));
    if (!checkboxDiv) {
        throw new Error("Invalid checkbox main div id provided.");
    }
    var checkboxItems = Array.from(document.querySelectorAll(".".concat(checkboxesClass)));
    if (checkboxItems.length === 0) {
        throw new Error('Invalid checkboxes shared class provided.');
    }
    ;
    checkboxItems.forEach(function (checkbox, index) {
        if (index === currentPressedCheckboxIndex) {
            checkbox.setAttribute("aria-checked", checkboxStates[index].checked ? 'true' : 'false');
        }
    });
}
