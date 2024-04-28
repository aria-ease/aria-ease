declare global {
    type HTMLElement = Element;
    type NodeListOf<HTMLElement> = Iterable<HTMLElement>;
}

interface AccordionStates {
    display: boolean;
    openedAriaLabel: string;
    closedAriaLabel: string;
}

interface CheckboxStates {
    checked: boolean;
    checkedAriaLabel: string;
    uncheckedAriaLabel: string;
}
  
interface RadioStates {
    checked: boolean;
    checkedAriaLabel: string;
    uncheckedAriaLabel: string;
}
  
interface ToggleStates {
    pressed: boolean;
    pressedAriaLabel: string;
    unpressedAriaLabel: string;
}

export {
    HTMLElement,
    NodeListOfHTMLElement,
    AccordionStates,
    CheckboxStates,
    RadioStates,
    ToggleStates
};