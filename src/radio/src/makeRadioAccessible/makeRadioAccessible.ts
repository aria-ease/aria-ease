/**
 * Makes a radio group accessible by managing ARIA attributes, keyboard interaction, and state.
 * Handles radio button selection with proper focus management and keyboard interactions.
 * @param {string} radioGroupId - The id of the radio group container.
 * @param {string} radiosClass - The shared class of all radio buttons.
 * @param {number} defaultSelectedIndex - The index of the initially selected radio (default: 0).
 * @param {RadioCallback} callback - Configuration options for callbacks.
 */

import { AccessibilityInstance, RadioConfig } from "Types";

export function makeRadioAccessible({ radioGroupId, radiosClass, defaultSelectedIndex, callback }: RadioConfig): AccessibilityInstance {
  if (radioGroupId === "") {
    console.error(`[aria-ease] 'radioGroupId' should not be an empty string. Provide an id to the radio group container element that exists before calling makeRadioAccessible.`);
    return { cleanup: () => {} };
  }
  const radioGroup = document.querySelector(`#${radioGroupId}`) as HTMLElement;
  if (!radioGroup) {
    console.error(`[aria-ease] Element with id="${radioGroupId}" not found. Make sure the radio group container exists before calling makeRadioAccessible.`);
    return { cleanup: () => {} };
  }

  if (radiosClass === "") {
    console.error(`[aria-ease] 'radiosClass' should not be an empty string. Provide a class name that exists on the radio button elements before calling makeRadioAccessible.`);
    return { cleanup: () => {} };
  }

  const radios = Array.from(radioGroup.querySelectorAll(`.${radiosClass}`)) as HTMLElement[];
  if (radios.length === 0) {
    console.error(`[aria-ease] No elements with class="${radiosClass}" found. Make sure radio buttons exist before calling makeRadioAccessible.`);
    return { cleanup: () => {} };
  }

  const handlerMap = new WeakMap<HTMLElement, (event: KeyboardEvent) => void>();
  const clickHandlerMap = new WeakMap<HTMLElement, () => void>();

  let currentSelectedIndex: number;

  if(defaultSelectedIndex) {
    currentSelectedIndex = defaultSelectedIndex;
  }

  // Initialize ARIA attributes
  function initialize() {
    // Set role on container if not already set
    if (!radioGroup.getAttribute("role")) {
      radioGroup.setAttribute("role", "radiogroup");
    }

    radios.forEach((radio, index) => {
      radio.setAttribute("role", "radio");

      radio.setAttribute("tabindex", "0");

      // Set initial checked state
      if (index === currentSelectedIndex) {
        radio.setAttribute("aria-checked", "true");
      } else {
        radio.setAttribute("aria-checked", "false");
      }
    });
  }

  function selectRadio(index: number) {
    if (index < 0 || index >= radios.length) {
      console.error(`[aria-ease] Invalid radio index: ${index}`);
      return;
    }

    // Uncheck previous radio
    if (currentSelectedIndex >= 0 && currentSelectedIndex < radios.length) {
      radios[currentSelectedIndex].setAttribute("aria-checked", "false");
    }

    // Check new radio and move focus
    radios[index].setAttribute("aria-checked", "true");
    radios[index].focus();
    if(callback?.onCheck) {
      try {
        callback.onCheck(index);
      } catch(error) {
        console.error("[aria-ease] Error in radio onCheck callback:", error);
      }
    }
    currentSelectedIndex = index;
  }

  function handleRadioClick(index: number) {
    return () => {
      selectRadio(index);
    };
  }

  function handleRadioKeydown(index: number) {
    return (event: KeyboardEvent) => {
      const { key } = event;
      let nextIndex: number = index;

      switch (key) {
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          nextIndex = (index + 1) % radios.length;
          selectRadio(nextIndex);
          break;

        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          nextIndex = (index - 1 + radios.length) % radios.length;
          selectRadio(nextIndex);
          break;

        case " ":
        case "Enter":
          event.preventDefault();
          selectRadio(index);
          break;
      }
    };
  }

  function addListeners() {
    radios.forEach((radio: HTMLElement, index: number) => {
      const clickHandler = handleRadioClick(index);
      const keydownHandler = handleRadioKeydown(index);

      radio.addEventListener("click", clickHandler);
      radio.addEventListener("keydown", keydownHandler);

      handlerMap.set(radio, keydownHandler);
      clickHandlerMap.set(radio, clickHandler);
    });
  }

  function removeListeners() {
    radios.forEach((radio: HTMLElement) => {
      const keydownHandler = handlerMap.get(radio);
      const clickHandler = clickHandlerMap.get(radio);

      if (keydownHandler) {
        radio.removeEventListener("keydown", keydownHandler);
        handlerMap.delete(radio);
      }
      if (clickHandler) {
        radio.removeEventListener("click", clickHandler);
        clickHandlerMap.delete(radio);
      }
    });
  }

  function cleanup() {
    removeListeners();
  }

  function getSelectedIndex(): number {
    return currentSelectedIndex;
  }

  // Initialize the radio group
  initialize();
  addListeners();

  return {
    selectRadio,
    getSelectedIndex,
    cleanup
  };
}
