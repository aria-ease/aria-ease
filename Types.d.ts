declare global {
    type HTMLElement = Element;
    type NodeListOf<HTMLElement> = Iterable<HTMLElement>;
}
  
export {
    HTMLElement,
    NodeListOfHTMLElement,
};