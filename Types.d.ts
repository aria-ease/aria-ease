declare global {
    type HTMLElement = Element;
    type NodeListOf<HTMLElement> = Iterable<HTMLElement>;
}

interface AccordionStates {
    id: string;
    display: boolean;
    openedAriaLabel: string;
    closedAriaLabel: string;
}
  
  
export {
    HTMLElement,
    NodeListOfHTMLElement,
    AccordionStates
};