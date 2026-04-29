import AxeBuilder from "@axe-core/playwright";

type AxeResult = Awaited<ReturnType<AxeBuilder["analyze"]>>;

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

interface AriaEaseConfigAudit {
    urls?: [];
    rules?: object;
    output?: object;
    timeout?: number;
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
}

type ContractLevel = 'required' | 'recommended' | 'optional';

interface AriaEaseConfigTest {
    components?: AriaEaseConfigTestComponent[];
    strictness?: StrictnessMode;
    disableTimeouts?: boolean;
    actionTimeoutMs?: number;
    assertionTimeoutMs?: number;
    navigationTimeoutMs?: number;
    componentReadyTimeoutMs?: number;
}

interface AriaEaseConfigTestComponent {
    name: string;
    contractPath?: string;
    strategyPath?: string;
    strictness?: StrictnessMode;
    disableTimeouts?: boolean;
    actionTimeoutMs?: number;
    assertionTimeoutMs?: number;
    navigationTimeoutMs?: number;
    componentReadyTimeoutMs?: number;
}

interface AriaEaseConfigContractSource {
    src: string;
    out?: string;
}

interface AriaEaseConfig {
    audit?: AriaEaseConfigAudit;
    test?: AriaEaseConfigTest;
    contracts?: AriaEaseConfigContractSource[];
}

interface JestAxeResult {
    violations: unknown[];
    raw: unknown;
    contract: unknown;
}

/**
 * Selector interface with standard fields and extensibility for custom selectors.
 * Teams can add custom selector fields beyond the standard baseline set.
 */
interface Selector extends Record<string, string | undefined> {
    // Standard baseline selectors (all optional)
    main: string;
    trigger?: string;
    menu?: string;
    items?: string;
    leafItem?: string;
    relative?: string;
    container?: string;
    submenuTrigger?: string;
    submenu?: string;
    submenuItems?: string;
    input?: string;
    listbox?: string;
    button?: string;
    popup?: string;
    panel?: string;
    tablist?: string;
    tab?: string;
    // Teams can add custom selector fields as needed
}

interface ComponentContract {
    meta?: {
        id?: string;
        version?: string;
        description?: string;
        source?: {
            apg?: string;
            wcag?: string[];
        };
        W3CName?: string;
    };
    selectors: Selector;
    relationships?: Array<
        | {
            type: 'aria-reference';
            from: string;
            attribute: string;
            to: string;
            level?: ContractLevel;
            setup: Array<{
                type: string;
                target: string;
                key?: string;
                value?: string;
                relativeTarget?: string | number;
            }>;
        }
        | {
            type: 'contains';
            parent: string;
            child: string;
            level?: ContractLevel;
            setup: Array<{
                type: string;
                target: string;
                key?: string;
                value?: string;
                relativeTarget?: string | number;
            }>;
        }
    >;
    states?: Array<{
        name?: string;
        requires?: string[];
    }>;
    static: Array<{
        target: string;
        attribute: string;
        expectedValue: string | { ref: string, attribute?: string, property: string, relativeTarget?: string | number };
        failureMessage: string;
        level?: ContractLevel;
        setup: Array<{
            type: string;
            target: string;
            key?: string;
            value?: string;
            relativeTarget?: string | number;
        }>;
    }>;
    dynamic: Array<{
        description: string;
        level?: ContractLevel;
        isMultiple?: boolean;
        orientation?: string;
        given?: string;
        setup: Array<{
            type: string;
            target: string;
            key?: string;
            value?: string;
            relativeTarget?: string | number;
        }>;
        action: Array<{
            type: string;
            target: string;
            key?: string;
            value?: string;
            relativeTarget?: string | number;
        }>;
        assertions: Array<{
            target: string;
            assertion: string;
            attribute?: string;
            expectedValue?: string | { ref: string, attribute?: string, property: string, relativeTarget?: string | number };
            controlledBy? : { target: string, relativeTarget?: string | number, attribute?: string };
            failureMessage?: string;
            relativeTarget?: string | number;
            level?: ContractLevel;
            interpretation?: InterpretationMode;
            confidence?: ContractConfidence;
            rationale?: string;
            note?: string;
        }>;
    }>;
}

interface Contract {
    [key: string]: {
        path: string;
        component: string;
    }
}

interface FailureReport {
  severity: 'critical' | 'major' | 'minor';
  message: string;
  expected: string;
  actual: string;
  recommendation?: string;
  wcagReference?: string;
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

interface RadioConfig {
  radioGroupId: string;
  radiosClass: string;
  defaultSelectedIndex?: number;
  callback?: RadioCallback;
}

interface RadioCallback {
    onCheck?: (index: number) => void;
}

interface CheckboxConfig {
  checkboxGroupId: string;
  checkboxesClass: string;
  callback?: CheckboxCallback;
}

interface CheckboxCallback {
    onCheck?: (index: number, checked: boolean) => void;
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
interface ContractTestResult {
  passes: string[];
  failures: string[];
  skipped: string[];
    warnings?: string[];
}

type DynamicTest = ComponentContract['dynamic'][number];

interface ComponentStrategy {
  resetState(page: Page): Promise<void>;
  shouldSkipTest(test: DynamicTest, page: Page): Promise<boolean>;
  getMainSelector(): string; 
}

export {
    AccordionStates,
    CheckboxStates,
    RadioStates,
    ToggleStates,
    AriaEaseConfig,
    AxeResult,
    JestAxeResult,
    Contract,
    ComponentContract,
    Selector,
    FailureReport,
    AccessibilityInstance,
    CheckboxConfig,
    ComboboxConfig,
    ContractTestResult,
    AccordionConfig,
    MenuConfig,
    RadioConfig,
    TabsConfig,
    TabsCallback,
    ComponentStrategy,
    DynamicTest,
    StrictnessMode,
    ContractLevel,
    InterpretationMode,
    ContractConfidence,
};

export type NodeListOfHTMLElement<T extends Element = HTMLElement> = NodeListOf<T>;