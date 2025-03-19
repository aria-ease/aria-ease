/**
 * Adds screen reader accessibility to single radio button. Updates the aria attribute of the radio button. Radio element must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} radioClass The class of the radio button
 * @param {string} updatedAriaLabel The aria label to be updated to button element
 */
export function updateSingleRadioAriaAttribute(radioClass) {
    var radio = document.querySelector(".".concat(radioClass));
    if (!radio) {
        throw new Error('Invalid radio button class provided.');
    }
    var currentAriaCheckedState = radio.getAttribute('aria-checked');
    if (!currentAriaCheckedState) {
        throw new Error("Radio element does not have aria-checked attribute");
    }
    function radioChecked() {
        radio.setAttribute('aria-checked', 'true');
    }
    function radioUnchecked() {
        radio.setAttribute('aria-checked', 'false');
    }
    (currentAriaCheckedState === 'false') ?
        radioChecked() :
        radioUnchecked();
}
