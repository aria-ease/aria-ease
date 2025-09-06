declare global {
  type HTMLElement = Element;
  type NodeListOf<HTMLElement> = Iterable<HTMLElement>;
}

interface AccordionStates {
    display: boolean;
}

interface CheckboxStates {
    checked: boolean;
}
  
interface RadioStates {
    checked: boolean;
}
  
interface ToggleStates {
    pressed: boolean;
}

/**
 * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded, aria-controls, aria-label (for only non-text triggers).
 * @param {string} accordionId The id of the accordion triggers parent container.
 * @param {string} accordionTriggersClass The shared class of all the accordion triggers.
 * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information.
 * @param {number} clickedTriggerIndex Index of the currently clicked accordion trigger within the accordion div container.
*/

declare function updateAccordionTriggerAriaAttributes(accordionId: string, accordionTriggersClass: string, accordionStates: AccordionStates[], clickedTriggerIndex: number): void;

declare const index$5_updateAccordionTriggerAriaAttributes: typeof updateAccordionTriggerAriaAttributes;
declare namespace index$5 {
  export { index$5_updateAccordionTriggerAriaAttributes as updateAccordionTriggerAriaAttributes };
}

/**
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block container.
 * @param {string} blockElementsClass The shared class of the elements that are children of the block.
*/
declare function makeBlockAccessible(blockId: string, blockElementsClass: string): () => void;

declare const index$4_makeBlockAccessible: typeof makeBlockAccessible;
declare namespace index$4 {
  export { index$4_makeBlockAccessible as makeBlockAccessible };
}

/**
 * Adds screen reader accessibility to multiple checkboxes. Updates the aria attributes of the checkboxes. Checkbox elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} checkboxId The id of the checkbox parent container.
 * @param {string} checkboxesClass The shared class of all the checkboxes.
 * @param {CheckboxStates[]} checkboxStates Array of objects containing checkboxes state information.
 * @param {number} currentPressedCheckboxIndex Index of the currently checked or unchecked checkbox.
 */

declare function updateCheckboxAriaAttributes(checkboxId: string, checkboxesClass: string, checkboxStates: CheckboxStates[], currentPressedCheckboxIndex: number): void;

declare const index$3_updateCheckboxAriaAttributes: typeof updateCheckboxAriaAttributes;
declare namespace index$3 {
  export { index$3_updateCheckboxAriaAttributes as updateCheckboxAriaAttributes };
}

/**
  * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first interactive item of the menu has focus when menu open.
  * @param {string} menuId - The id of the menu.
  * @param {string} menuElementsClass - The class of the items that are children of the menu.
  * @param {string} triggerId - The id of the button that triggers the menu.
*/
declare function makeMenuAccessible({ menuId, menuElementsClass, triggerId }: {
    menuId: string;
    menuElementsClass: string;
    triggerId: string;
}): {
    openMenu: () => void;
    closeMenu: () => void;
    cleanup: () => void;
};

declare const index$2_makeMenuAccessible: typeof makeMenuAccessible;
declare namespace index$2 {
  export { index$2_makeMenuAccessible as makeMenuAccessible };
}

/**
 * Adds screen reader accessibility to multiple radio buttons. Updates the aria attributes of the radio buttons. Radio elements must possess the following aria attributes; aria-checked and aria-label.
 * @param {string} radioId The id of the radio parent container.
 * @param {string} radiosClass The shared class of all the radios.
 * @param {RadioStates[]} radioStates Array of objects containing radio buttons state information.
 * @param {number} currentPressedRadioIndex Index of the currently checked or unchecked radio button.
 */

declare function updateRadioAriaAttributes(radioId: string, radiosClass: string, radioStates: RadioStates[], currentPressedRadioIndex: number): void;

declare const index$1_updateRadioAriaAttributes: typeof updateRadioAriaAttributes;
declare namespace index$1 {
  export { index$1_updateRadioAriaAttributes as updateRadioAriaAttributes };
}

/**
 * Adds screen reader accessibility to toggle buttons. Updates the aria attributes of the toggle buttons. Button must be a semantic button element or a non-semantic element with a role of button, and possess the aria-pressed attribute.
 * @param {string} toggleId The id of the toggle buttons parent container.
 * @param {string} togglesClass The shared class of all the toggle buttons.
 * @param {ToggleStates[]} toggleStates Array of objects containing toggle buttons state information.
 * @param {number} currentPressedToggleIndex Index of the currently pressed or unpressed toggle button.
*/

declare function updateToggleAriaAttribute(toggleId: string, togglesClass: string, toggleStates: ToggleStates[], currentPressedToggleIndex: number): void;

declare const index_updateToggleAriaAttribute: typeof updateToggleAriaAttribute;
declare namespace index {
  export { index_updateToggleAriaAttribute as updateToggleAriaAttribute };
}

export { index$5 as Accordion, index$4 as Block, index$3 as Checkbox, index$2 as Menu, index$1 as Radio, index as Toggle };
