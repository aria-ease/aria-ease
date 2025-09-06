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

export {
    HTMLElement,
    NodeListOfHTMLElement,
    AccordionStates,
    CheckboxStates,
    RadioStates,
    ToggleStates
};