declare global {
  type HTMLElement = Element;
  type NodeListOf<HTMLElement> = Iterable<HTMLElement>;
}

interface AccordionStates {
    display: boolean;
    openedAriaLabel: string;
    closedAriaLabel: string;
}

interface CheckboxStates {
    checked: boolean;
    checkedAriaLabel: string;
    uncheckedAriaLabel: string;
}
  
interface RadioStates {
    checked: boolean;
}
  
interface ToggleStates {
    pressed: boolean;
}

/**
 * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded and aria-label.
 * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information
 * @param {string} accordionsClass The shared class of all the accordion triggers
 * @param {number} currentClickedTriggerIndex Index of the currently clicked accordion trigger
 */

declare function updateAccordionTriggerAriaAttributes(accordionStates: AccordionStates[], accordionsClass: string, currentClickedTriggerIndex: number): void;

declare const index$5_updateAccordionTriggerAriaAttributes: typeof updateAccordionTriggerAriaAttributes;
declare namespace index$5 {
  export { index$5_updateAccordionTriggerAriaAttributes as updateAccordionTriggerAriaAttributes };
}

/**
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block
 * @param {string} blockItemsClass The shared class of the items that are children of thes block
*/
declare function makeBlockAccessible(blockId: string, blockItemsClass: string): void;

declare const index$4_makeBlockAccessible: typeof makeBlockAccessible;
declare namespace index$4 {
  export { index$4_makeBlockAccessible as makeBlockAccessible };
}

/**
 * Adds screen reader accessibility to a single checkbox. Updates the aria attributes of the checkbox. Checkbox element must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} checkboxClass The shared class of all the checkboxes
 * @param {string} updatedAriaLabel The aria label to be updated to checkbox element
 */
declare function updateSingleCheckboxAriaAttributes(checkboxClass: string, updatedAriaLabel: string): void;

/**
 * Adds screen reader accessibility to multiple checkboxes. Updates the aria attributes of the checkboxes. Checkbox elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {CheckboxStates[]} checkboxStates Array of objects containing checkboxes state information
 * @param {string} checkboxesClass The shared class of all the checkboxes
 * @param {number} currentPressedCheckboxIndex Index of the currently checked or unchecked checkbox
 */

declare function updateGroupCheckboxesAriaAttributes(checkboxStates: CheckboxStates[], checkboxesClass: string, currentPressedCheckboxIndex: number): void;

declare const index$3_updateGroupCheckboxesAriaAttributes: typeof updateGroupCheckboxesAriaAttributes;
declare const index$3_updateSingleCheckboxAriaAttributes: typeof updateSingleCheckboxAriaAttributes;
declare namespace index$3 {
  export { index$3_updateGroupCheckboxesAriaAttributes as updateGroupCheckboxesAriaAttributes, index$3_updateSingleCheckboxAriaAttributes as updateSingleCheckboxAriaAttributes };
}

declare function cleanUpMenuEventListeners(menuId: string, menuItemsClass: string): void;

/**
 * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first item of the menu has focus when menu appears.
 * @param {string} menuId The id of the menu
 * @param {string} menuItemsClass The shared class of the items that are children of the menu
*/
declare function makeMenuAccessible(menuId: string, menuItemsClass: string): void;

/**
 * Adds screen reader accessibility to menus. Updates the aria attributes of the menu trigger button. Trigger button element must possess the following aria attributes; aria-expanded and aria-label.
 * @param {string} triggerId The id of the trigger button that toggles the menu
 * @param {string} ariaLabel The aria label to be updated to trigger element
 */
declare function updateMenuTriggerAriaAttributes(triggerId: string, ariaLabel: string): void;

declare const index$2_cleanUpMenuEventListeners: typeof cleanUpMenuEventListeners;
declare const index$2_makeMenuAccessible: typeof makeMenuAccessible;
declare const index$2_updateMenuTriggerAriaAttributes: typeof updateMenuTriggerAriaAttributes;
declare namespace index$2 {
  export { index$2_cleanUpMenuEventListeners as cleanUpMenuEventListeners, index$2_makeMenuAccessible as makeMenuAccessible, index$2_updateMenuTriggerAriaAttributes as updateMenuTriggerAriaAttributes };
}

/**
 * Adds screen reader accessibility to single radio button. Updates the aria attribute of the radio button. Radio element must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} radioClass The class of the radio button
 * @param {string} updatedAriaLabel The aria label to be updated to button element
 */
declare function updateSingleRadioAriaAttributes(radioClass: string): void;

/**
 * Adds screen reader accessibility to multiple radio buttons. Updates the aria attributes of the radio buttons. Radio elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {RadioStates[]} radioStates Array of objects containing radio buttons state information
 * @param {string} radiosClass The shared class of all the radio buttons
 * @param {number} currentPressedRadioIndex Index of the currently checked or unchecked radio button
 */

declare function updateGroupRadiosAriaAttributes(radioStates: RadioStates[], radiosClass: string, currentPressedRadioIndex: number): void;

declare const index$1_updateGroupRadiosAriaAttributes: typeof updateGroupRadiosAriaAttributes;
declare const index$1_updateSingleRadioAriaAttributes: typeof updateSingleRadioAriaAttributes;
declare namespace index$1 {
  export { index$1_updateGroupRadiosAriaAttributes as updateGroupRadiosAriaAttributes, index$1_updateSingleRadioAriaAttributes as updateSingleRadioAriaAttributes };
}

/**
 * Adds screen reader accessibility to a single toggle element. Updates the aria attribute of the toggle element. Toggle element must possess the aria-pressed attribute.
 * @param {string} toggleClass The class of all the toggle element
 */
declare function updateSingleToggleAriaAttributes(toggleClass: string): void;

/**
 * Adds screen reader accessibility to toggle buttons. Updates the aria attributes of the toggle buttons. Button must be button element with a role of button, and possess the aria-pressed attribute.
 * @param {ToggleStates[]} toggleStates Array of objects containing toggle buttons state information
 * @param {string} togglesClass The shared class of all the toggle buttons
 * @param {number} currentPressedToggleIndex Index of the currently pressed or unpressed toggle button
 */

declare function updateGroupTogglesAriaAttributes(toggleStates: ToggleStates[], togglesClass: string, currentPressedToggleIndex: number): void;

declare const index_updateGroupTogglesAriaAttributes: typeof updateGroupTogglesAriaAttributes;
declare const index_updateSingleToggleAriaAttributes: typeof updateSingleToggleAriaAttributes;
declare namespace index {
  export { index_updateGroupTogglesAriaAttributes as updateGroupTogglesAriaAttributes, index_updateSingleToggleAriaAttributes as updateSingleToggleAriaAttributes };
}

export { index$5 as Accordion, index$4 as Block, index$3 as Checkbox, index$2 as Menu, index$1 as Radio, index as Toggle };
