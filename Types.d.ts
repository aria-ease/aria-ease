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
    pressed: boolean;
    checkedAriaLabel: string;
    uncheckedAriaLabel: string;
}
  
  
export {
    HTMLElement,
    NodeListOfHTMLElement,
    AccordionStates,
    CheckboxStates
};