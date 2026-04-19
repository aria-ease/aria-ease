interface JestAxeResult {
    violations: unknown[];
    raw: unknown;
    contract: unknown;
}

interface AccessibilityInstance {
  cleanup: () => void;
  refresh?: () => void;

  //Menu methods
  openMenu?: () => void;
  closeMenu?: () => void;

  // Accordion methods
  expandItem?: (index: number) => void;
  collapseItem?: (index: number) => void;
  toggleItem?: (index: number) => void;

  // Tabs methods
  activateTab?: (index: number, shouldFocus?: boolean) => void;

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

  //Combobox methods
  openListbox?: () => void;
  closeListbox?: () => void;
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

interface TabsConfig {
  tabListId: string;
  tabsClass: string;
  tabPanelsClass: string;
  orientation?: "horizontal" | "vertical";
  activateOnFocus?: boolean;
  callback?: TabsCallback;
}

interface TabsCallback {
  onTabChange?: (activeIndex: number, previousIndex: number) => void;
  onContextMenu?: (tabIndex: number, tabElement: HTMLElement) => void;
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
 * Makes an accordion accessible by managing ARIA attributes, keyboard interaction, and state.
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
 * Makes a checkbox group accessible by managing ARIA attributes and keyboard interaction.
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
 * Makes a radio group accessible by managing ARIA attributes, keyboard interaction, and state.
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
 * Makes tabs accessible by managing ARIA attributes, keyboard interaction, and state.
 * Implements WAI-ARIA tabs pattern with full keyboard support and ARIA properties.
 * @param {string} tabListId - The id of the tab list container.
 * @param {string} tabsClass - The shared class of all tab buttons.
 * @param {string} tabPanelsClass - The shared class of all tab panels.
 * @param {('horizontal' | 'vertical')} orientation - Tab list orientation (default: 'horizontal').
 * @param {boolean} activateOnFocus - Whether tabs activate automatically on focus (default: true).
 * @param {TabsCallback} callback - Configuration options for callbacks.
 */

declare function makeTabsAccessible({ tabListId, tabsClass, tabPanelsClass, orientation, activateOnFocus, callback }: TabsConfig): AccessibilityInstance;

type StatePack = Record<string, {
    setup?: Array<{
        when: string[];
        steps: ((arg?: {
            relativeTarget?: string | number;
        }) => DynamicAction[]) | DynamicAction[];
    }>;
    assertion?: ((arg?: {
        relativeTarget?: string | number;
    }) => DynamicAssertion[] | DynamicAssertion) | DynamicAssertion[] | DynamicAssertion;
    requires?: string[];
}>;
type RelativeState = {
    type: string;
    ref: string | number;
};
type Level = "required" | "recommended" | "optional";
type ContractMeta = {
    id?: string;
    version?: string;
    description?: string;
    source?: {
        apg?: string;
        wcag?: string[];
    };
    W3CName?: string;
};
type SelectorsMap = Record<string, string>;
type RelationshipInvariant = {
    type: "aria-reference";
    from: string;
    attribute: string;
    to: string;
    level?: Level;
    requires?: string;
    setup?: DynamicAction[];
} | {
    type: "contains";
    parent: string;
    child: string;
    level?: Level;
    requires?: string;
    setup?: DynamicAction[];
};
type StaticAssertion = {
    target: string;
    assertion: "toBeVisible" | "notToBeVisible" | "toHaveAttribute" | "toHaveValue" | "toHaveFocus" | "notToHaveFocus" | "toHaveRole";
    attribute: string;
    expectedValue?: string;
    failureMessage?: string;
    level: Level;
    requires?: string;
    setup?: DynamicAction[];
};
type DynamicAssertion = {
    target: string;
    assertion: "toBeVisible" | "notToBeVisible" | "toHaveAttribute" | "toHaveValue" | "toHaveFocus" | "notToHaveFocus" | "toHaveRole";
    attribute?: string;
    expectedValue?: string;
    failureMessage?: string;
    relativeTarget?: string | number;
    virtualId?: string;
    selectorKey?: string;
    level?: Level;
};
type DynamicAction = {
    type: "focus";
    target: string;
    relativeTarget?: "first" | "last" | "next" | "previous" | number;
    virtualId?: string;
} | {
    type: "click" | "keypress" | "type" | "hover" | "focus";
    target: string;
    key?: string;
    value?: string;
    relativeTarget?: string | number;
};
type DynamicTest = {
    description: string;
    orientation?: "vertical" | "horizontal";
    level?: Level;
    action: DynamicAction[];
    assertions: DynamicAssertion[];
};
type JsonContract = {
    meta?: ContractMeta;
    selectors: SelectorsMap;
    relationships?: RelationshipInvariant[];
    static: Array<{
        assertions: StaticAssertion[];
    }>;
    dynamic: DynamicTest[];
};
declare class FluentContract {
    private readonly jsonContract;
    constructor(jsonContract: JsonContract);
    toJSON(): JsonContract;
}
declare class ContractBuilder {
    private readonly componentName;
    private metaValue;
    private selectorsValue;
    private readonly relationshipInvariants;
    private readonly staticAssertions;
    private readonly dynamicTests;
    private statePack;
    constructor(componentName: string);
    meta(meta: ContractMeta): this;
    selectors(selectors: SelectorsMap): this;
    relationships(fn: (r: {
        ariaReference: (from: string, attribute: string, to: string) => {
            requires: (state: string) => {
                required: () => void;
                optional: () => void;
                recommended: () => void;
            };
            required: () => void;
            optional: () => void;
            recommended: () => void;
        };
        contains: (parent: string, child: string) => {
            requires: (state: string) => {
                required: () => void;
                optional: () => void;
                recommended: () => void;
            };
            required: () => void;
            optional: () => void;
            recommended: () => void;
        };
    }) => void): this;
    static(fn: (s: {
        target: (target: string) => {
            has: (attribute: string, expectedValue: string) => {
                requires: (state: string) => {
                    required: () => void;
                    optional: () => void;
                    recommended: () => void;
                };
                required: () => void;
                optional: () => void;
                recommended: () => void;
            };
        };
    }) => void): this;
    when(event: string): DynamicTestBuilder;
    addDynamicTest(test: DynamicTest): void;
    build(): JsonContract;
}
declare class DynamicTestBuilder {
    private parent;
    private statePack;
    private event;
    private _as;
    private _onTarget;
    private _onRelativeTarget;
    private _given;
    private _then;
    private _desc;
    private _level;
    private _orientation;
    constructor(parent: ContractBuilder, statePack: StatePack, event: string);
    as(actionType: string): this;
    on(target: string, relativeTarget?: string | number): this;
    given(states: string | string[] | RelativeState | RelativeState[]): this;
    then(states: string | string[] | RelativeState | RelativeState[]): this;
    orientation(orientation: "vertical" | "horizontal"): this;
    /**
     * Normalize states to an array of string or resolved state keys from relative state objects.
     */
    private _normalizeStates;
    /**
     * Find a generic state key in the state pack by type.
     */
    private _findStateKeyByTypeAndRef;
    describe(desc: string): this;
    required(): ContractBuilder;
    optional(): ContractBuilder;
    recommended(): ContractBuilder;
    private _finalize;
}
declare function createContract(componentName: string, define: (c: ContractBuilder) => void): FluentContract;

type StrictnessMode = 'minimal' | 'balanced' | 'strict' | 'paranoid';

/**
 * Runs static and interactions accessibility test on UI components.
 * @param {string} componentName The name of the component contract to test against
 * @param {HTMLElement} component The UI component to be tested
 * @param {string} url URL for Playwright E2E tests
 */

type TestAuditOptions = {
    strictness?: StrictnessMode;
};
declare function testUiComponent(componentName: string, url: string | null, options?: TestAuditOptions): Promise<JestAxeResult>;
/**
 * Cleanup function to close the shared Playwright browser
 * Call this in afterAll() or after all tests complete
 */
declare function cleanupTests(): Promise<void>;

export { cleanupTests, createContract, makeAccordionAccessible, makeBlockAccessible, makeCheckboxAccessible, makeComboboxAccessible, makeMenuAccessible, makeRadioAccessible, makeTabsAccessible, makeToggleAccessible, testUiComponent };
