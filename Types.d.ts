import AxeBuilder from "@axe-core/playwright";

type AxeResults = Awaited<ReturnType<AxeBuilder["analyze"]>>;

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

interface AriaEaseConfigAudit {
    urls?: [],
    rules?: object,
    output?: object
}

interface AriaEaseConfig {
    audit?: AriaEaseConfigAudit,
    test?: unknown //change to correct type later
}


export {
    HTMLElement,
    NodeListOfHTMLElement,
    AccordionStates,
    CheckboxStates,
    RadioStates,
    ToggleStates,
    AriaEaseConfig,
    AxeResults
};