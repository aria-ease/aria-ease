interface JestAxeResult {
    violations: unknown[];
    raw: unknown;
    contract: unknown;
}

interface AccessibilityInstance {
  cleanup: () => void;
  refresh?: () => void;
  openMenu?: () => void;
  closeMenu?: () => void;
  // Accordion methods
  expandItem?: (index: number) => void;
  collapseItem?: (index: number) => void;
  toggleItem?: (index: number) => void;
  // Radio methods
  selectRadio?: (index: number) => void;
  getSelectedIndex?: () => number;
  // Checkbox methods
  toggleCheckbox?: (index: number) => void;
  setCheckboxState?: (index: number, checked: boolean) => void;
  getCheckedStates?: () => boolean[];
  getCheckedIndices?: () => number[];
  // Toggle methods
  toggleButton?: (index: number) => void;
  setPressed?: (index: number, pressed: boolean) => void;
  getPressedStates?: () => boolean[];
  getPressedIndices?: () => number[];
}

interface AccordionConfig {
  accordionId: string;
  triggersClass: string;
  panelsClass: string;
  allowMultipleOpen?: boolean;
  callback?: AccordionCallback;
}

interface AccordionCallback {
    onExpand?: (index: number) => void;
    onCollapse?: (index: number) => void;
}

interface ComboboxConfig {
    comboboxInputId: string; 
    comboboxButtonId?: string; 
    listBoxId: string; 
    listBoxItemsClass: string;
    callback?: ComboboxCallback;
}

interface ComboboxCallback {
    onSelect?: (item: HTMLElement) => void;
    onOpenChange?: (isOpen: boolean) => void;
    onActiveDescendantChange?: (optionId: string, item: HTMLElement) => void;
    onClear?: () => void;
}

interface MenuConfig {
    menuId: string; 
    menuItemsClass: string; 
    triggerId: string;
    callback: MenuCallback;
}

interface MenuCallback {
    onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Makes an accordion accessible by managing ARIA attributes, keyboard navigation, and state.
 * Handles multiple accordion items with proper focus management and keyboard interactions.
 * @param {string} accordionId - The id of the accordion container.
 * @param {string} triggersClass - The shared class of all accordion trigger buttons.
 * @param {string} panelsClass - The shared class of all accordion panels.
 * @param {boolean} allowMultipleOpen - Whether multiple panels can be open simultaneously (default: false).
 * @param {AccordionCallback} callback - Configuration options for callbacks.
 */

declare function makeAccordionAccessible({ accordionId, triggersClass, panelsClass, allowMultipleOpen, callback }: AccordionConfig): AccessibilityInstance;

/**
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block container.
 * @param {string} blockItemsClass The shared class of the elements that are children of the block.
*/

interface BlockConfig {
    blockId: string;
    blockItemsClass: string;
}
declare function makeBlockAccessible({ blockId, blockItemsClass }: BlockConfig): AccessibilityInstance;

/**
 * Makes a checkbox group accessible by managing ARIA attributes and keyboard navigation.
 * Handles multiple independent checkboxes with proper focus management and keyboard interactions.
 * @param {string} checkboxGroupId - The id of the checkbox group container.
 * @param {string} checkboxesClass - The shared class of all checkboxes.
 */

interface CheckboxConfig {
    checkboxGroupId: string;
    checkboxesClass: string;
}
declare function makeCheckboxAccessible({ checkboxGroupId, checkboxesClass }: CheckboxConfig): AccessibilityInstance;

/**
  * Adds keyboard interaction to toggle menu. The menu traps focus and can be interacted with using the keyboard. The first interactive item of the menu has focus when menu open.
  * @param {string} menuId - The id of the menu.
  * @param {string} menuItemsClass - The class of the items that are children of the menu.
  * @param {string} triggerId - The id of the button that triggers the menu.
*/

declare function makeMenuAccessible({ menuId, menuItemsClass, triggerId, callback }: MenuConfig): AccessibilityInstance;

/**
 * Makes a radio group accessible by managing ARIA attributes, keyboard navigation, and state.
 * Handles radio button selection with proper focus management and keyboard interactions.
 * @param {string} radioGroupId - The id of the radio group container.
 * @param {string} radiosClass - The shared class of all radio buttons.
 * @param {number} defaultSelectedIndex - The index of the initially selected radio (default: 0).
 */

interface RadioConfig {
    radioGroupId: string;
    radiosClass: string;
    defaultSelectedIndex?: number;
}
declare function makeRadioAccessible({ radioGroupId, radiosClass, defaultSelectedIndex }: RadioConfig): AccessibilityInstance;

/**
 * Makes a toggle button accessible by managing ARIA attributes and keyboard interactions.
 * Handles toggle button state with proper focus management.
 * @param {string} toggleId - The id of the toggle button or toggle button container.
 * @param {string} togglesClass - The shared class of toggle buttons (for groups).
 * @param {boolean} isSingleToggle - Whether this is a single toggle button (default: true).
 */

interface ToggleConfig {
    toggleId: string;
    togglesClass?: string;
    isSingleToggle?: boolean;
}
declare function makeToggleAccessible({ toggleId, togglesClass, isSingleToggle }: ToggleConfig): AccessibilityInstance;

/**
 * Makes a Combobox accessible by adding appropriate ARIA attributes, keyboard interactions and focus management.
 * @param {string} comboboxInputId - The id of the combobox input element.
 * @param {string} comboboxButtonId - The id of the button that toggles the listbox (optional).
 * @param {string} listBoxId - The id of the listbox element.
 * @param {string} listBoxItemsClass - The class of the items within the listbox.
 * @param {ComboboxCallback} callback - Configuration options for callbacks.
 */

declare function makeComboboxAccessible({ comboboxInputId, comboboxButtonId, listBoxId, listBoxItemsClass, callback }: ComboboxConfig): AccessibilityInstance;

/**
 * Runs static and interactions accessibility test on UI components.
 * @param {string} componentName The name of the component contract to test against
 * @param {HTMLElement} component The UI component to be tested
 * @param {string} url Optional URL to run full Playwright E2E tests. If omitted, uses isolated component testing with page.setContent()
 */

declare function testUiComponent(componentName: string, component: HTMLElement | null, url: string | null): Promise<JestAxeResult>;
/**
 * Cleanup function to close the shared Playwright browser
 * Call this in afterAll() or after all tests complete
 */
declare function cleanupTests(): Promise<void>;

export { cleanupTests, makeAccordionAccessible, makeBlockAccessible, makeCheckboxAccessible, makeComboboxAccessible, makeMenuAccessible, makeRadioAccessible, makeToggleAccessible, testUiComponent };
