import { NodeListOfHTMLElement } from "../../../Types";
/**
 * Checks if an element is a native button element.
 * @param {HTMLElement} el The element to check.
 * @returns {boolean} True if the element is a semantic button or input with button type.
 */
export declare function isNativeButton(el: HTMLElement): boolean;
/**
 * Checks if an element is a link (anchor tag).
 * @param {HTMLElement} el The element to check.
 * @returns {boolean} True if the element is an anchor tag.
 */
export declare function isLink(el: HTMLElement): boolean;
/**
 * Handles keyboard press events for accessible navigation within interactive elements.
 * Supports arrow key navigation, Enter/Space activation, and menu-specific behaviors.
 * @param {KeyboardEvent} event The keyboard event.
 * @param {NodeListOfHTMLElement} elementItems List of interactive elements to navigate.
 * @param {number} elementItemIndex The index of the currently focused element.
 * @param {HTMLElement} [menuElementDiv] Optional menu container element.
 * @param {HTMLElement} [triggerButton] Optional menu trigger button.
 * @param {Function} [openSubmenu] Optional callback to open a submenu.
 * @param {Function} [closeSubmenu] Optional callback to close a submenu.
 */
export declare function handleKeyPress(event: KeyboardEvent, elementItems: NodeListOfHTMLElement, elementItemIndex: number, menuElementDiv?: HTMLElement, triggerButton?: HTMLElement, openSubmenu?: (submenuId: string) => void, closeSubmenu?: () => void): void;
//# sourceMappingURL=handleKeyPress.d.ts.map