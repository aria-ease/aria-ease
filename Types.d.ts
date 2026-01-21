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

interface AriaEaseConfigTest {
    components: AriaEaseConfigTestComponent[];
}

interface AriaEaseConfigTestComponent {
    name: string;
    path: string;
}

interface AriaEaseConfig {
    audit?: AriaEaseConfigAudit;
    test?: AriaEaseConfigTest
}

interface JestAxeResult {
    violations: unknown[];
    raw: unknown;
    contract: unknown;
}

interface Selector {
    trigger?: string;
    menu?: string;
    items?: string;
    relative?: string;
    container?: string;
    focusable?: string;
    submenuTrigger?: string;
    submenu?: string;
    input?: string;
    listbox?: string;
    button?: string;
}

interface Prerequisite {
    type: string;
    target: string;
    state?: string;
    value?: string;
    attribute?: string;
    relative?: string;
}

interface ComponentContract {
    selectors: Selector;
    static: Array<{
        assertions: Array<{
            target: string;
            attribute: string;
            expectedValue: string;
            failureMessage: string;
        }>;
    }>;
    dynamic: Array<{
        description: string;
        requiresBrowser?: boolean;
        prerequisite: Array<Prerequisite>;
        action: Array<{
            type: string;
            target: string;
            key?: string;
            value?: string;
            relativeTarget?: string;
        }>;
        assertions: Array<{
            target: string;
            assertion: string;
            attribute?: string;
            expectedValue?: string;
            failureMessage?: string;
            relativeTarget?: string;
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

interface ComboboxConfig {
    comboboxInputId: string; 
    comboboxButtonId?: string; 
    listBoxId: string; 
    listBoxItemsClass: string;
    config?: config;
}

interface config {
    onSelect?: (item: HTMLElement, value: string) => void;
    onOpenChange?: (isOpen: boolean) => void;
    onActiveDescendantChange?: (optionId: string, item: HTMLElement) => void;
    onClear?: () => void;
}

interface ContractTestResult {
  passes: string[];
  failures: string[];
  skipped: string[];
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
    Prerequisite,
    FailureReport,
    AccessibilityInstance,
    ComboboxConfig,
    ContractTestResult
};

export type NodeListOfHTMLElement<T extends Element = HTMLElement> = NodeListOf<T>;