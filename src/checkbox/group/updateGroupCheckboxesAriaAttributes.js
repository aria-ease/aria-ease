/**
 * Adds screen reader accessibility to multiple checkboxes. Updates the aria attributes of the checkboxes. Checkbox elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {CheckboxStates[]} checkboxStates Array of objects containing checkboxes state information
 * @param {string} checkboxesClass The shared class of all the checkboxes
 * @param {number} currentPressedCheckboxIndex Index of the currently checked or unchecked checkbox
 */
export function updateGroupCheckboxesAriaAttributes(checkboxStates, checkboxesClass, currentPressedCheckboxIndex) {
    var allCheckboxes = Array.from(document.querySelectorAll(".".concat(checkboxesClass)));
    if (!allCheckboxes) {
        throw new Error('Invalid checkboxes shared class provided.');
    }
    ;
    allCheckboxes.forEach(function (checkbox, index) {
        if (index === currentPressedCheckboxIndex) {
            checkbox.setAttribute("aria-checked", checkboxStates[index].checked ? 'true' : 'false');
            checkbox.setAttribute("aria-label", checkboxStates[index].checked ? checkboxStates[index].checkedAriaLabel : checkboxStates[index].uncheckedAriaLabel);
        }
    });
}
