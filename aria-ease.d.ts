/**
 * Declares the module 'aria-ease' and includes type information and JSDoc comments.
 */

import { AccordionStates, CheckboxStates, RadioStates, ToggleStates } from "./Types";

declare module 'aria-ease' {
  /**
    * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first item of the menu has focus when menu appears.
    * @param {string} menuId - The id of the menu.
    * @param {string} menuElementsClass - The class of the items that are children of the menu.
    * @param {string} triggerId - The id of the button that triggers the menu.
    * @param {string} openLabel - The aria label of the menu trigger button when it is open.
    * @param {string} closeLabel - The aria label of the menu trigger button when it is closed.
  */
  function makeMenuAccessible(menuId: string, menuElementsClass: string, triggerId: string, openLabel: string, closeLabel: string): void;

  
  /**
    * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
    * @param {string} blockId - The id of the block container.
    * @param {string} blockElementsClass - The shared class of the elements that are children of the block
  */
  function makeBlockAccessible(blockId: string, blockElementsClass: string): void;


  /**
   * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded, aria-controls, aria-label (for only non-text triggers).
   * @param {string} accordionId The id of the accordion triggers parent container.
   * @param {string} accordionTriggersClass The shared class of all the accordion triggers.
   * @param {AccordionStates[]} accordionStates Array of objects containing accordions state information.
   * @param {number} clickedTriggerIndex Index of the currently clicked accordion trigger within the accordion div container.
  */
  function updateAccordionTriggerAriaAttributes(accordionId: string, accordionTriggersClass: string, accordionStates: AccordionStates[], clickedTriggerIndex: number): void;

  /**
   * Adds screen reader accessibility to multiple checkboxes. Updates the aria attributes of the checkboxes. Checkbox elements must possess the following aria attributes; aria-checked and aria-label.
   * @param {string} checkboxId The id of the checkbox parent container.
   * @param {string} checkboxesClass The shared class of all the checkboxes.
   * @param {CheckboxStates[]} checkboxStates Array of objects containing checkboxes state information.
   * @param {number} currentPressedCheckboxIndex Index of the currently checked or unchecked checkbox.
  */
  function updateCheckboxAriaAttributes(checkboxId: string, checkboxesClass: string, checkboxStates: CheckboxStates[], currentPressedCheckboxIndex: number): void

  /**
   * Adds screen reader accessibility to multiple radio buttons. Updates the aria attributes of the radio buttons. Radio elements must possess the following aria attributes; aria-checked and aria-label.
   * @param {string} radioId The id of the radio parent container.
   * @param {string} radiosClass The shared class of all the radios.
   * @param {RadioStates[]} radioStates Array of objects containing radio buttons state information.
   * @param {number} currentPressedRadioIndex Index of the currently checked or unchecked radio button.
  */
  function updateRadioAriaAttributes(radioId: string, radiosClass: string, radioStates: RadioStates[], currentPressedRadioIndex: number): void

  /**
   * Adds screen reader accessibility to toggle buttons. Updates the aria attributes of the toggle buttons. Button must be a semantic button element or a non-semantic element with a role of button, and possess the aria-pressed attribute.
   * @param {string} toggleId The id of the toggle buttons parent container.
   * @param {string} togglesClass The shared class of all the toggle buttons.
   * @param {ToggleStates[]} toggleStates Array of objects containing toggle buttons state information.
   * @param {number} currentPressedToggleIndex Index of the currently pressed or unpressed toggle button.
  */
 function updateToggleAriaAttribute(toggleId: string, togglesClass: string, toggleStates: ToggleStates[], currentPressedToggleIndex: number): void


  export { 
    makeMenuAccessible, 
    makeBlockAccessible, 
    updateAccordionTriggerAriaAttributes, 
    updateCheckboxAriaAttributes,
    updateRadioAriaAttributes, 
    updateToggleAriaAttribute
  }
}