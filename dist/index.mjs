var __defProp = Object.defineProperty;
var __export = function(target, all) {
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
// src/accordion/index.ts
var accordion_exports = {};
__export(accordion_exports, {
    updateAccordionTriggerAriaAttributes: function() {
        return updateAccordionTriggerAriaAttributes;
    }
});
// src/accordion/src/updateAccordionTriggerAriaAttributes/updateAccordionTriggerAriaAttributes.ts
function updateAccordionTriggerAriaAttributes(accordionStates, accordionsClass, currentClickedTriggerIndex) {
    console.log("Accordion updateAccordionTriggerAriaAttributes initiated");
}
// src/block/index.ts
var block_exports = {};
__export(block_exports, {
    makeBlockAccessible: function() {
        return makeBlockAccessible;
    }
});
// src/block/src/makeBlockAccessible/makeBlockAccessible.ts
function makeBlockAccessible(blockId, blockItemsClass) {
    console.log("Block makeBlockAccessible initiated");
}
// src/checkbox/index.ts
var checkbox_exports = {};
__export(checkbox_exports, {
    updateGroupCheckboxesAriaAttributes: function() {
        return updateGroupCheckboxesAriaAttributes;
    },
    updateSingleCheckboxAriaAttributes: function() {
        return updateSingleCheckboxAriaAttributes;
    }
});
// src/checkbox/src/single-checkbox/updateSingleCheckboxAriaAttributes/updateSingleCheckboxAriaAttributes.ts
function updateSingleCheckboxAriaAttributes(checkboxClass, updatedAriaLabel) {
    console.log("Checkbox updateSingleCheckboxAriaAttributes initiated");
}
// src/checkbox/src/group-checkbox/updateGroupCheckboxesAriaAttributes/updateGroupCheckboxesAriaAttributes.ts
function updateGroupCheckboxesAriaAttributes(checkboxStates, checkboxesClass, currentPressedCheckboxIndex) {
    console.log("Checkbox updateGroupCheckboxesAriaAttributes initiated");
}
// src/menu/index.ts
var menu_exports = {};
__export(menu_exports, {
    cleanUpMenuEventListeners: function() {
        return cleanUpMenuEventListeners;
    },
    makeMenuAccessible: function() {
        return makeMenuAccessible;
    },
    updateMenuTriggerAriaAttributes: function() {
        return updateMenuTriggerAriaAttributes;
    }
});
// src/menu/src/cleanUpMenuEventListeners/cleanUpMenuEventListeners.ts
function cleanUpMenuEventListeners(menuId, menuItemsClass) {
    console.log("Menu cleanUpMenuEventListeners initiated");
}
// src/menu/src/makeMenuAccessible/makeMenuAccessible.ts
function makeMenuAccessible(menuId, menuItemsClass) {
    console.log("Menu makeMenuAccessible initiated");
}
// src/menu/src/updateMenuTriggerAriaAttributes/updateMenuTriggerAriaAttributes.ts
function updateMenuTriggerAriaAttributes(triggerId, ariaLabel) {
    console.log("Menu updateMenuTriggerAriaAttributes initiated");
}
// src/radio/index.ts
var radio_exports = {};
__export(radio_exports, {
    updateGroupRadiosAriaAttributes: function() {
        return updateGroupRadiosAriaAttributes;
    },
    updateSingleRadioAriaAttributes: function() {
        return updateSingleRadioAriaAttributes;
    }
});
// src/radio/src/single-radio/updateSingleRadioAriaAttributes.ts
function updateSingleRadioAriaAttributes(radioClass) {
    console.log("Radio updateSingleRadioAriaAttributes initiated");
}
// src/radio/src/group-radio/updateGroupRadiosAriaAttributes.ts
function updateGroupRadiosAriaAttributes(radioStates, radiosClass, currentPressedRadioIndex) {
    console.log("Radio updateGroupRadiosAriaAttributes initiated");
}
// src/toggle/index.ts
var toggle_exports = {};
__export(toggle_exports, {
    updateGroupTogglesAriaAttributes: function() {
        return updateGroupTogglesAriaAttributes;
    },
    updateSingleToggleAriaAttributes: function() {
        return updateSingleToggleAriaAttributes;
    }
});
// src/toggle/src/single-toggle/updateSingleToggleAriaAttributes.ts
function updateSingleToggleAriaAttributes(toggleClass) {
    console.log("Toggle updateSingleToggleAriaAttributes initiated");
}
// src/toggle/src/group-toggle/updateGroupTogglesAriaAttributes.ts
function updateGroupTogglesAriaAttributes(toggleStates, togglesClass, currentPressedToggleIndex) {
    console.log("Toggle updateGroupTogglesAriaAttributes initiated");
}
export { accordion_exports as Accordion, block_exports as Block, checkbox_exports as Checkbox, menu_exports as Menu, radio_exports as Radio, toggle_exports as Toggle }; //# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map