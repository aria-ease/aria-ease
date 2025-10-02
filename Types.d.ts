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

interface AriaEaseConfig {
    urls?: [],
    rules?: object,
    output?: object
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