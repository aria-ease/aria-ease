import { makeMenuAccessible } from './src/menu/makeMenuAccessible.js'
import { makeBlockAccessible } from './src/block/makeBlockAccessible.js'
import { updateMenuTriggerAriaAttributes } from './src/menu/updateMenuTriggerAriaAttributes.js'
import { cleanUpMenuEventListeners } from './src/menu/cleanUpMenuEventListeners.js'
import { updateAccordionTriggerAriaAttributes } from './src/accordion/updateAccordionTriggerAriaAttributes.js'
import { updateSingleCheckboxAriaAttribute } from './src/checkbox/single/updateSingleCheckboxAriaAttribute.js'
import { updateGroupCheckboxesAriaAttributes } from './src/checkbox/group/updateGroupCheckboxesAriaAttributes.js'
import { updateSingleRadioAriaAttribute } from './src/radio/single/updateSingleRadioAriaAttribute.js'
import { updateGroupRadiosAriaAttributes } from './src/radio/group/updateGroupRadiosAriaAttributes.js'
import { updateSingleToggleAriaAttribute } from './src/toggle/single/updateSingleToggleAriaAttribute.js'
import { updateGroupTogglesAriaAttributes } from './src/toggle/group/updateGroupTogglesAriaAttributes.js'

export {
    makeMenuAccessible,
    makeBlockAccessible,
    updateMenuTriggerAriaAttributes,
    cleanUpMenuEventListeners,
    updateAccordionTriggerAriaAttributes,
    updateSingleCheckboxAriaAttribute,
    updateGroupCheckboxesAriaAttributes,
    updateSingleRadioAriaAttribute,
    updateGroupRadiosAriaAttributes,
    updateSingleToggleAriaAttribute,
    updateGroupTogglesAriaAttributes
}