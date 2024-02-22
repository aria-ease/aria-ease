/**
 * Declares the module 'aria-ease' and includes type information and JSDoc comments.
 */

import { AccordionStates, CheckboxStates, RadioStates } from "./Types";

declare module 'aria-ease' {
    /**
     * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first item of the menu has focus when menu appears.
     * @param {string} menuId - The id of the menu.
     * @param {string} menuItemsClass - The class of the items that are children of the menu.
    */
    function makeMenuAccessible(menuId: string, menuItemsClass: string): void;
  
    /**
     * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
     * @param {string} blockId - The id of the block container.
     * @param {string} blockItemsClass - The class of the individual block items.
    */
    function makeBlockAccessible(blockId: string, blockItemsClass: string);

    /**
     * Updates the aria attributes of the menu trigger button. Trigger button element must possess the following aria attributes; aria-expanded and aria-label.
     * @param {string} triggerId The id of the trigger button that toggles the menu.
     * @param {string} ariaLabel The aria-label to be updated.
    */
    function updateMenuTriggerAriaAttributes(triggerId: string, ariaLabel: string): void;

    /**
     * Cleans up the event listeners that were added to childen items of the menu, to prevent memory leak.
     * @param {string} menuId The id of the menu
     * @param {string} menuItemsClass The class of the items that are children of the menu
    */
   function cleanUpMenuEventListeners(menuId: string, menuItemsClass: string): void;

   /**
     * Adds screen reader accessibility to accordions. Updates the aria attributes of the accordion trigger button. Trigger button element must possess the following aria attributes; aria-expanded and aria-label.
     * @param {AccordionStates[]} accordionStates Array of objects containing accordion state information
     * @param {string} accordionsClass The shared class of all the accordion triggers
     * @param {number} currentClickedTriggerIndex Index of the currently clicked accordion trigger
   */
   function updateAccordionTriggerAriaAttributes(accordionStates: AccordionStates[], accordionsClass: string, currentClickedTriggerIndex: number): void;

   /**
     * Adds screen reader accessibility to checkboxes. Updates the aria attributes of the checkbox. Checkbox element must possess the following aria attributes; aria-checked and aria-label.
     * @param {CheckboxStates[]} checkboxStates Array of objects containing checkboxes state information
     * @param {string} checkboxesClass The shared class of all the checkboxes
     * @param {number} currentPressedCheckboxIndex Index of the currently checked or unchecked checkbox
   */
   function updateCheckboxAriaAttributes(checkboxStates: CheckboxStates[], checkboxesClass: string, currentPressedCheckboxIndex: number): void;

   /**
     * Adds screen reader accessibility to radio buttons. Updates the aria attributes of the radio button. Radio element must possess the following aria attributes; aria-checked and aria-label.
     * @param {RadioStates[]} radioStates Array of objects containing radio buttons state information
     * @param {string} radiosClass The shared class of all the radio buttons
     * @param {number} currentPressedRadioIndex Index of the currently checked or unchecked radio button
   */
   function updateRadioAriaAttributes(radioStates: RadioStates[], radiosClass: string, currentPressedRadioIndex: number): void;
  
  export { 
    makeMenuAccessible, 
    makeBlockAccessible, 
    updateMenuTriggerAriaAttributes, 
    cleanUpMenuEventListeners, 
    updateAccordionTriggerAriaAttributes, 
    updateCheckboxAriaAttributes, 
    updateRadioAriaAttributes 
  };
}