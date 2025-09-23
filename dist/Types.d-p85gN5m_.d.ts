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

export type { AccordionStates as A, CheckboxStates as C, RadioStates as R, ToggleStates as T };
