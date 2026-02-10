/**
 * Makes an accordion accessible by managing ARIA attributes, keyboard navigation, and state.
 * Handles multiple accordion items with proper focus management and keyboard interactions.
 * @param {string} accordionId - The id of the accordion container.
 * @param {string} triggersClass - The shared class of all accordion trigger buttons.
 * @param {string} panelsClass - The shared class of all accordion panels.
 * @param {boolean} allowMultipleOpen - Whether multiple panels can be open simultaneously (default: false).
 */

import { AccessibilityInstance } from "Types";

interface AccordionConfig {
  accordionId: string;
  triggersClass: string;
  panelsClass: string;
  allowMultipleOpen?: boolean;
}

export function makeAccordionAccessible({ accordionId, triggersClass, panelsClass, allowMultipleOpen = false }: AccordionConfig): AccessibilityInstance {
  const accordionContainer = document.querySelector(`#${accordionId}`) as HTMLElement;
  if (!accordionContainer) {
    console.error(`[aria-ease] Element with id="${accordionId}" not found. Make sure the accordion container exists before calling makeAccordionAccessible.`);
    return { cleanup: () => {} };
  }

  const triggers = Array.from(accordionContainer.querySelectorAll(`.${triggersClass}`)) as HTMLElement[];
  if (triggers.length === 0) {
    console.error(`[aria-ease] No elements with class="${triggersClass}" found. Make sure accordion triggers exist before calling makeAccordionAccessible.`);
    return { cleanup: () => {} };
  }

  const panels = Array.from(accordionContainer.querySelectorAll(`.${panelsClass}`)) as HTMLElement[];
  if (panels.length === 0) {
    console.error(`[aria-ease] No elements with class="${panelsClass}" found. Make sure accordion panels exist before calling makeAccordionAccessible.`);
    return { cleanup: () => {} };
  }

  if (triggers.length !== panels.length) {
    console.error(`[aria-ease] Accordion trigger/panel mismatch: found ${triggers.length} triggers but ${panels.length} panels.`);
    return { cleanup: () => {} };
  }

  const handlerMap = new WeakMap<HTMLElement, (event: KeyboardEvent) => void>();
  const clickHandlerMap = new WeakMap<HTMLElement, () => void>();

  // Initialize ARIA attributes
  function initialize() {
    triggers.forEach((trigger, index) => {
      const panel = panels[index];

      // Generate IDs if missing
      if (!trigger.id) {
        trigger.id = `${accordionId}-trigger-${index}`;
      }
      if (!panel.id) {
        panel.id = `${accordionId}-panel-${index}`;
      }

      // Set ARIA attributes on trigger
      trigger.setAttribute("aria-controls", panel.id);
      trigger.setAttribute("aria-expanded", "false");

      // Set ARIA attributes on panel
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", trigger.id);
      panel.style.display = "none";
    });
  }

  function expandItem(index: number) {
    if (index < 0 || index >= triggers.length) {
      console.error(`[aria-ease] Invalid accordion index: ${index}`);
      return;
    }

    const trigger = triggers[index];
    const panel = panels[index];

    trigger.setAttribute("aria-expanded", "true");
    panel.style.display = "block";
  }

  function collapseItem(index: number) {
    if (index < 0 || index >= triggers.length) {
      console.error(`[aria-ease] Invalid accordion index: ${index}`);
      return;
    }

    const trigger = triggers[index];
    const panel = panels[index];

    trigger.setAttribute("aria-expanded", "false");
    panel.style.display = "none";
  }

  function toggleItem(index: number) {
    const trigger = triggers[index];
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      collapseItem(index);
    } else {
      // If not allowing multiple, close all others first
      if (!allowMultipleOpen) {
        triggers.forEach((_, i) => {
          if (i !== index) {
            collapseItem(i);
          }
        });
      }
      expandItem(index);
    }
  }

  function handleTriggerClick(index: number) {
    return () => {
      toggleItem(index);
    };
  }

  function handleTriggerKeydown(index: number) {
    return (event: KeyboardEvent) => {
      const { key } = event;

      switch (key) {
        case "Enter":
        case " ":
          event.preventDefault();
          toggleItem(index);
          break;

        case "ArrowDown":
          event.preventDefault();
          {
            const nextIndex = (index + 1) % triggers.length;
            triggers[nextIndex].focus();
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          {
            const prevIndex = (index - 1 + triggers.length) % triggers.length;
            triggers[prevIndex].focus();
          }
          break;

        case "Home":
          event.preventDefault();
          triggers[0].focus();
          break;

        case "End":
          event.preventDefault();
          triggers[triggers.length - 1].focus();
          break;
      }
    };
  }

  function addListeners() {
    triggers.forEach((trigger: HTMLElement, index: number) => {
      const clickHandler = handleTriggerClick(index);
      const keydownHandler = handleTriggerKeydown(index);

      trigger.addEventListener("click", clickHandler);
      trigger.addEventListener("keydown", keydownHandler);

      // Store both handlers
      handlerMap.set(trigger, keydownHandler);
      clickHandlerMap.set(trigger, clickHandler);
    });
  }

  function removeListeners() {
    triggers.forEach((trigger: HTMLElement) => {
      const keydownHandler = handlerMap.get(trigger);
      const clickHandler = clickHandlerMap.get(trigger);

      if (keydownHandler) {
        trigger.removeEventListener("keydown", keydownHandler);
        handlerMap.delete(trigger);
      }
      if (clickHandler) {
        trigger.removeEventListener("click", clickHandler);
        clickHandlerMap.delete(trigger);
      }
    });
  }

  function cleanup() {
    removeListeners();
    // Reset all panels to closed state
    triggers.forEach((_, index) => {
      collapseItem(index);
    });
  }

  // Initialize the accordion
  initialize();
  addListeners();

  return {
    expandItem,
    collapseItem,
    toggleItem,
    cleanup
  };
}
