'use strict';

// src/accordion/src/makeAccordionAccessible/makeAccordionAccessible.ts
function makeAccordionAccessible({ accordionId, triggersClass, panelsClass, allowMultipleOpen = false }) {
  const accordionContainer = document.querySelector(`#${accordionId}`);
  if (!accordionContainer) {
    console.error(`[aria-ease] Element with id="${accordionId}" not found. Make sure the accordion container exists before calling makeAccordionAccessible.`);
    return { cleanup: () => {
    } };
  }
  const triggers = Array.from(accordionContainer.querySelectorAll(`.${triggersClass}`));
  if (triggers.length === 0) {
    console.error(`[aria-ease] No elements with class="${triggersClass}" found. Make sure accordion triggers exist before calling makeAccordionAccessible.`);
    return { cleanup: () => {
    } };
  }
  const panels = Array.from(accordionContainer.querySelectorAll(`.${panelsClass}`));
  if (panels.length === 0) {
    console.error(`[aria-ease] No elements with class="${panelsClass}" found. Make sure accordion panels exist before calling makeAccordionAccessible.`);
    return { cleanup: () => {
    } };
  }
  if (triggers.length !== panels.length) {
    console.error(`[aria-ease] Accordion trigger/panel mismatch: found ${triggers.length} triggers but ${panels.length} panels.`);
    return { cleanup: () => {
    } };
  }
  const handlerMap = /* @__PURE__ */ new WeakMap();
  const clickHandlerMap = /* @__PURE__ */ new WeakMap();
  function initialize() {
    triggers.forEach((trigger, index) => {
      const panel = panels[index];
      if (!trigger.id) {
        trigger.id = `${accordionId}-trigger-${index}`;
      }
      if (!panel.id) {
        panel.id = `${accordionId}-panel-${index}`;
      }
      trigger.setAttribute("aria-controls", panel.id);
      trigger.setAttribute("aria-expanded", "false");
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", trigger.id);
      panel.style.display = "none";
    });
  }
  function expandItem(index) {
    if (index < 0 || index >= triggers.length) {
      console.error(`[aria-ease] Invalid accordion index: ${index}`);
      return;
    }
    const trigger = triggers[index];
    const panel = panels[index];
    trigger.setAttribute("aria-expanded", "true");
    panel.style.display = "block";
  }
  function collapseItem(index) {
    if (index < 0 || index >= triggers.length) {
      console.error(`[aria-ease] Invalid accordion index: ${index}`);
      return;
    }
    const trigger = triggers[index];
    const panel = panels[index];
    trigger.setAttribute("aria-expanded", "false");
    panel.style.display = "none";
  }
  function toggleItem(index) {
    const trigger = triggers[index];
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      collapseItem(index);
    } else {
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
  function handleTriggerClick(index) {
    return () => {
      toggleItem(index);
    };
  }
  function handleTriggerKeydown(index) {
    return (event) => {
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
    triggers.forEach((trigger, index) => {
      const clickHandler = handleTriggerClick(index);
      const keydownHandler = handleTriggerKeydown(index);
      trigger.addEventListener("click", clickHandler);
      trigger.addEventListener("keydown", keydownHandler);
      handlerMap.set(trigger, keydownHandler);
      clickHandlerMap.set(trigger, clickHandler);
    });
  }
  function removeListeners() {
    triggers.forEach((trigger) => {
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
    triggers.forEach((_, index) => {
      collapseItem(index);
    });
  }
  initialize();
  addListeners();
  return {
    expandItem,
    collapseItem,
    toggleItem,
    cleanup
  };
}

exports.makeAccordionAccessible = makeAccordionAccessible;
