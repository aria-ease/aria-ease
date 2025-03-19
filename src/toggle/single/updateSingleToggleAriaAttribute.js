/**
 * Adds screen reader accessibility to a single toggle element. Updates the aria attribute of the toggle element. Toggle element must possess the aria-pressed attribute.
 * @param {string} toggleClass The class of all the toggle element
 */
export function updateSingleToggleAriaAttribute(toggleClass) {
    var toggle = document.querySelector(".".concat(toggleClass));
    if (!toggle) {
        throw new Error('Invalid toggle class provided.');
    }
    var currentAriaPressedState = toggle.getAttribute('aria-pressed');
    if (!currentAriaPressedState) {
        throw new Error("Toggle element does not have aria-pressed attribute");
    }
    function togglePressed() {
        toggle.setAttribute('aria-pressed', 'true');
    }
    function toggleUnpressed() {
        toggle.setAttribute('aria-pressed', 'false');
    }
    (currentAriaPressedState === 'false') ?
        togglePressed() :
        toggleUnpressed();
}
