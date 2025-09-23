'use strict';
// src/toggle/src/updateToggleAriaAttribute/updateToggleAriaAttribute.ts
function updateToggleAriaAttribute(toggleId, togglesClass, toggleStates, currentPressedToggleIndex) {
    var toggleDiv = document.querySelector("#".concat(toggleId));
    if (!toggleDiv) {
        throw new Error("Invalid toggle main div id provided.");
    }
    var toggleItems = Array.from(toggleDiv.querySelectorAll(".".concat(togglesClass)));
    if (toggleItems.length === 0) {
        throw new Error("Invalid toggles shared class provided.");
    }
    if (toggleItems.length !== toggleStates.length) {
        throw new Error("Toggle state/DOM length mismatch: found ".concat(toggleItems.length, " triggers, but got ").concat(toggleStates.length, " state objects."));
    }
    toggleItems.forEach(function(toggle, index) {
        if (index === currentPressedToggleIndex) {
            toggle.setAttribute("aria-pressed", toggleStates[index].pressed ? "true" : "false");
        }
    });
}
exports.updateToggleAriaAttribute = updateToggleAriaAttribute; //# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map