// src/radio/src/updateRadioAriaAttributes/updateRadioAriaAttributes.ts
function updateRadioAriaAttributes(radioId, radiosClass, radioStates, currentPressedRadioIndex) {
    var radioDiv = document.querySelector("#".concat(radioId));
    if (!radioDiv) {
        throw new Error("Invalid radio main div id provided.");
    }
    var radioItems = Array.from(radioDiv.querySelectorAll(".".concat(radiosClass)));
    if (radioItems.length === 0) {
        throw new Error("Invalid radios shared class provided.");
    }
    radioItems.forEach(function(radioItem, index) {
        var state = radioStates[index];
        var checked = radioItem.getAttribute("aria-checked");
        var shouldBeChecked = index === currentPressedRadioIndex ? state.checked ? "true" : "false" : "false";
        if (checked && checked !== shouldBeChecked) {
            radioItem.setAttribute("aria-checked", shouldBeChecked);
        }
    });
}
export { updateRadioAriaAttributes }; //# sourceMappingURL=chunk-5HQ6LLC5.js.map
//# sourceMappingURL=chunk-5HQ6LLC5.js.map