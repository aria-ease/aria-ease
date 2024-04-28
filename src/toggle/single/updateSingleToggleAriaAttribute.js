/**
 * Adds screen reader accessibility to a single toggle element. Updates the aria attributes of the toggle element. Toggle element must possess the following aria attributes; aria-pressed and aria-label.
 * @param {string} toggleClass The class of all the toggle element
 * @param {string} updatedAriaLabel The aria label to be updated to toggle element
 */
export function updateSingleToggleAriaAttribute(toggleClass, updatedAriaLabel) {
    var toggle = document.querySelector(".".concat(toggleClass));
    if (!toggle) {
        throw new Error('Invalid toggle class provided.');
    }
    var currentAriaPressedState = toggle.getAttribute('aria-pressed');
    if (!currentAriaPressedState) {
        throw new Error("Toggle element does not have aria-pressed attribute");
    }
    function togglePressed(ariaLabel) {
        toggle.setAttribute('aria-pressed', 'true');
        toggle.setAttribute('aria-label', ariaLabel);
    }
    function toggleUnpressed(ariaLabel) {
        toggle.setAttribute('aria-pressed', 'false');
        toggle.setAttribute('aria-label', ariaLabel);
    }
    (currentAriaPressedState === 'false') ?
        togglePressed(updatedAriaLabel) :
        toggleUnpressed(updatedAriaLabel);
}
