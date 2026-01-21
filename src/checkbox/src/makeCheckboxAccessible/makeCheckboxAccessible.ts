/**
 * Makes a checkbox group accessible by managing ARIA attributes and keyboard navigation.
 * Handles multiple independent checkboxes with proper focus management and keyboard interactions.
 * @param {string} checkboxGroupId - The id of the checkbox group container.
 * @param {string} checkboxesClass - The shared class of all checkboxes.
 */

import { AccessibilityInstance } from "Types";

interface CheckboxConfig {
  checkboxGroupId: string;
  checkboxesClass: string;
}

export function makeCheckboxAccessible({ checkboxGroupId, checkboxesClass }: CheckboxConfig): AccessibilityInstance {
  const checkboxGroup = document.querySelector(`#${checkboxGroupId}`) as HTMLElement;
  if (!checkboxGroup) {
    console.error(`[aria-ease] Element with id="${checkboxGroupId}" not found. Make sure the checkbox group container exists before calling makeCheckboxAccessible.`);
    return { cleanup: () => {} };
  }

  const checkboxes = Array.from(checkboxGroup.querySelectorAll(`.${checkboxesClass}`)) as HTMLElement[];
  if (checkboxes.length === 0) {
    console.error(`[aria-ease] No elements with class="${checkboxesClass}" found. Make sure checkboxes exist before calling makeCheckboxAccessible.`);
    return { cleanup: () => {} };
  }

  const handlerMap = new WeakMap<HTMLElement, (event: KeyboardEvent) => void>();
  const clickHandlerMap = new WeakMap<HTMLElement, () => void>();

  // Initialize ARIA attributes
  function initialize() {
    // Set role on container if needed (group is common for checkbox groups)
    if (!checkboxGroup.getAttribute("role")) {
      checkboxGroup.setAttribute("role", "group");
    }

    checkboxes.forEach((checkbox) => {
      checkbox.setAttribute("role", "checkbox");
      
      // Set initial checked state if not already set
      if (!checkbox.hasAttribute("aria-checked")) {
        checkbox.setAttribute("aria-checked", "false");
      }

      // Make focusable
      if (!checkbox.hasAttribute("tabindex")) {
        checkbox.setAttribute("tabindex", "0");
      }
    });
  }

  function toggleCheckbox(index: number) {
    if (index < 0 || index >= checkboxes.length) {
      console.error(`[aria-ease] Invalid checkbox index: ${index}`);
      return;
    }

    const checkbox = checkboxes[index];
    const isChecked = checkbox.getAttribute("aria-checked") === "true";
    checkbox.setAttribute("aria-checked", isChecked ? "false" : "true");
  }

  function setCheckboxState(index: number, checked: boolean) {
    if (index < 0 || index >= checkboxes.length) {
      console.error(`[aria-ease] Invalid checkbox index: ${index}`);
      return;
    }

    checkboxes[index].setAttribute("aria-checked", checked ? "true" : "false");
  }

  function handleCheckboxClick(index: number) {
    return () => {
      toggleCheckbox(index);
    };
  }

  function handleCheckboxKeydown(index: number) {
    return (event: KeyboardEvent) => {
      const { key } = event;

      switch (key) {
        case " ":
          event.preventDefault();
          toggleCheckbox(index);
          break;

        case "ArrowDown":
          event.preventDefault();
          {
            const nextIndex = (index + 1) % checkboxes.length;
            checkboxes[nextIndex].focus();
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          {
            const prevIndex = (index - 1 + checkboxes.length) % checkboxes.length;
            checkboxes[prevIndex].focus();
          }
          break;

        case "Home":
          event.preventDefault();
          checkboxes[0].focus();
          break;

        case "End":
          event.preventDefault();
          checkboxes[checkboxes.length - 1].focus();
          break;
      }
    };
  }

  function addListeners() {
    checkboxes.forEach((checkbox: HTMLElement, index: number) => {
      const clickHandler = handleCheckboxClick(index);
      const keydownHandler = handleCheckboxKeydown(index);

      checkbox.addEventListener("click", clickHandler);
      checkbox.addEventListener("keydown", keydownHandler);

      handlerMap.set(checkbox, keydownHandler);
      clickHandlerMap.set(checkbox, clickHandler);
    });
  }

  function removeListeners() {
    checkboxes.forEach((checkbox: HTMLElement) => {
      const keydownHandler = handlerMap.get(checkbox);
      const clickHandler = clickHandlerMap.get(checkbox);

      if (keydownHandler) {
        checkbox.removeEventListener("keydown", keydownHandler);
        handlerMap.delete(checkbox);
      }
      if (clickHandler) {
        checkbox.removeEventListener("click", clickHandler);
        clickHandlerMap.delete(checkbox);
      }
    });
  }

  function cleanup() {
    removeListeners();
  }

  function getCheckedStates(): boolean[] {
    return checkboxes.map(checkbox => checkbox.getAttribute("aria-checked") === "true");
  }

  function getCheckedIndices(): number[] {
    return checkboxes
      .map((checkbox, index) => checkbox.getAttribute("aria-checked") === "true" ? index : -1)
      .filter(index => index !== -1);
  }

  // Initialize the checkbox group
  initialize();
  addListeners();

  return {
    toggleCheckbox,
    setCheckboxState,
    getCheckedStates,
    getCheckedIndices,
    cleanup
  };
}
