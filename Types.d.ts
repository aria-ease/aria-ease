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
    trigger: string;
    menu: string;
    items: string;
    relative: string;
    container: string;
    items: string;
    focusable: string;
    submenuTrigger: string;
    submenu: string;
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
        }>;
        assertions: Array<{
            target: string;
            assertion: string;
            attribute?: string;
            expectedValue?: string;
            failureMessage?: string;
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
    AccessibilityInstance
};

export type NodeListOfHTMLElement<T extends Element = HTMLElement> = NodeListOf<T>;