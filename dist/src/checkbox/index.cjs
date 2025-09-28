'use strict';
// src/checkbox/src/updateCheckboxAriaAttributes/updateCheckboxAriaAttributes.ts
function updateCheckboxAriaAttributes(checkboxId, checkboxesClass, checkboxStates, currentPressedCheckboxIndex) {
    var checkboxDiv = document.querySelector("#".concat(checkboxId));
    if (!checkboxDiv) {
        throw new Error("Invalid checkbox main div id provided.");
    }
    var checkboxItems = Array.from(document.querySelectorAll(".".concat(checkboxesClass)));
    if (checkboxItems.length === 0) {
        throw new Error("Invalid checkboxes shared class provided.");
    }
    checkboxItems.forEach(function(checkbox, index) {
        if (index === currentPressedCheckboxIndex) {
            checkbox.setAttribute("aria-checked", checkboxStates[index].checked ? "true" : "false");
        }
    });
}
exports.updateCheckboxAriaAttributes = updateCheckboxAriaAttributes; //# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map