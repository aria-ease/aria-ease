/**
 * Makes a toggle button accessible by managing ARIA attributes and keyboard interactions.
 * Handles toggle button state with proper focus management.
 * @param {string} toggleId - The id of the toggle button or toggle button container.
 * @param {string} togglesClass - The shared class of toggle buttons (for groups).
 * @param {boolean} isSingleToggle - Whether this is a single toggle button (default: true).
 */

import { AccessibilityInstance } from "Types";

interface ToggleConfig {
  toggleId: string;
  togglesClass?: string;
  isSingleToggle?: boolean;
}

export function makeToggleAccessible({ toggleId, togglesClass, isSingleToggle = true }: ToggleConfig): AccessibilityInstance {
  const toggleContainer = document.querySelector(`#${toggleId}`) as HTMLElement;
  if (!toggleContainer) {
    console.error(`[aria-ease] Element with id="${toggleId}" not found. Make sure the toggle element exists before calling makeToggleAccessible.`);
    return { cleanup: () => {} };
  }

  let toggles: HTMLElement[];

  if (isSingleToggle) {
    // The container itself is the toggle button
    toggles = [toggleContainer];
  } else {
    // Find all toggle buttons within the container
    if (!togglesClass) {
      console.error(`[aria-ease] togglesClass is required when isSingleToggle is false.`);
      return { cleanup: () => {} };
    }
    toggles = Array.from(toggleContainer.querySelectorAll(`.${togglesClass}`)) as HTMLElement[];
    if (toggles.length === 0) {
      console.error(`[aria-ease] No elements with class="${togglesClass}" found. Make sure toggle buttons exist before calling makeToggleAccessible.`);
      return { cleanup: () => {} };
    }
  }

  const handlerMap = new WeakMap<HTMLElement, (event: KeyboardEvent) => void>();
  const clickHandlerMap = new WeakMap<HTMLElement, () => void>();

  // Initialize ARIA attributes
  function initialize() {
    toggles.forEach((toggle) => {
      // Ensure it's a button or has button role
      if (toggle.tagName.toLowerCase() !== "button" && !toggle.getAttribute("role")) {
        toggle.setAttribute("role", "button");
      }

      // Set initial pressed state if not already set
      if (!toggle.hasAttribute("aria-pressed")) {
        toggle.setAttribute("aria-pressed", "false");
      }

      // Make focusable
      if (!toggle.hasAttribute("tabindex")) {
        toggle.setAttribute("tabindex", "0");
      }
    });
  }

  function toggleButton(index: number) {
    if (index < 0 || index >= toggles.length) {
      console.error(`[aria-ease] Invalid toggle index: ${index}`);
      return;
    }

    const toggle = toggles[index];
    const isPressed = toggle.getAttribute("aria-pressed") === "true";
    toggle.setAttribute("aria-pressed", isPressed ? "false" : "true");
  }

  function setPressed(index: number, pressed: boolean) {
    if (index < 0 || index >= toggles.length) {
      console.error(`[aria-ease] Invalid toggle index: ${index}`);
      return;
    }

    toggles[index].setAttribute("aria-pressed", pressed ? "true" : "false");
  }

  function handleToggleClick(index: number) {
    return () => {
      toggleButton(index);
    };
  }

  function handleToggleKeydown(index: number) {
    return (event: KeyboardEvent) => {
      const { key } = event;

      switch (key) {
        case "Enter":
        case " ":
          event.preventDefault();
          toggleButton(index);
          break;

        case "ArrowDown":
        case "ArrowRight":
          if (!isSingleToggle && toggles.length > 1) {
            event.preventDefault();
            const nextIndex = (index + 1) % toggles.length;
            toggles[nextIndex].focus();
          }
          break;

        case "ArrowUp":
        case "ArrowLeft":
          if (!isSingleToggle && toggles.length > 1) {
            event.preventDefault();
            const prevIndex = (index - 1 + toggles.length) % toggles.length;
            toggles[prevIndex].focus();
          }
          break;

        case "Home":
          if (!isSingleToggle && toggles.length > 1) {
            event.preventDefault();
            toggles[0].focus();
          }
          break;

        case "End":
          if (!isSingleToggle && toggles.length > 1) {
            event.preventDefault();
            toggles[toggles.length - 1].focus();
          }
          break;
      }
    };
  }

  function addListeners() {
    toggles.forEach((toggle: HTMLElement, index: number) => {
      const clickHandler = handleToggleClick(index);
      const keydownHandler = handleToggleKeydown(index);

      toggle.addEventListener("click", clickHandler);
      toggle.addEventListener("keydown", keydownHandler);

      handlerMap.set(toggle, keydownHandler);
      clickHandlerMap.set(toggle, clickHandler);
    });
  }

  function removeListeners() {
    toggles.forEach((toggle: HTMLElement) => {
      const keydownHandler = handlerMap.get(toggle);
      const clickHandler = clickHandlerMap.get(toggle);

      if (keydownHandler) {
        toggle.removeEventListener("keydown", keydownHandler);
        handlerMap.delete(toggle);
      }
      if (clickHandler) {
        toggle.removeEventListener("click", clickHandler);
        clickHandlerMap.delete(toggle);
      }
    });
  }

  function cleanup() {
    removeListeners();
  }

  function getPressedStates(): boolean[] {
    return toggles.map(toggle => toggle.getAttribute("aria-pressed") === "true");
  }

  function getPressedIndices(): number[] {
    return toggles
      .map((toggle, index) => toggle.getAttribute("aria-pressed") === "true" ? index : -1)
      .filter(index => index !== -1);
  }

  // Initialize the toggle(s)
  initialize();
  addListeners();

  return {
    toggleButton,
    setPressed,
    getPressedStates,
    getPressedIndices,
    cleanup
  };
}
