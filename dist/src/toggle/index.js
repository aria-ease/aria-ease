// src/toggle/src/updateToggleAriaAttribute/updateToggleAriaAttribute.ts
function updateToggleAriaAttribute(toggleId, togglesClass, toggleStates, currentPressedToggleIndex) {
  const toggleDiv = document.querySelector(`#${toggleId}`);
  if (!toggleDiv) {
    console.error(`[aria-ease] Element with id="${toggleId}" not found. Make sure the toggle element exists before calling updateToggleAriaAttribute.`);
    return;
  }
  const toggleItems = Array.from(toggleDiv.querySelectorAll(`.${togglesClass}`));
  if (toggleItems.length === 0) {
    console.error(`[aria-ease] Element with class="${togglesClass}" not found. Make sure the toggle items exist before calling updateToggleAriaAttribute.`);
    return;
  }
  if (toggleItems.length !== toggleStates.length) {
    console.error(`[aria-ease] Toggle state/DOM length mismatch: found ${toggleItems.length} triggers, but got ${toggleStates.length} state objects.'`);
    return;
  }
  toggleItems.forEach((toggle, index) => {
    if (index === currentPressedToggleIndex) {
      const pressed = toggle.getAttribute("aria-pressed");
      const shouldBePressed = toggleStates[index].pressed ? "true" : "false";
      if (pressed && pressed !== shouldBePressed) {
        toggle.setAttribute("aria-pressed", shouldBePressed);
      }
    }
  });
}

// src/toggle/src/makeTogggleAccessible/makeToggleAccessible.ts
function makeToggleAccessible({ toggleId, togglesClass, isSingleToggle = true }) {
  const toggleContainer = document.querySelector(`#${toggleId}`);
  if (!toggleContainer) {
    console.error(`[aria-ease] Element with id="${toggleId}" not found. Make sure the toggle element exists before calling makeToggleAccessible.`);
    return { cleanup: () => {
    } };
  }
  let toggles;
  if (isSingleToggle) {
    toggles = [toggleContainer];
  } else {
    if (!togglesClass) {
      console.error(`[aria-ease] togglesClass is required when isSingleToggle is false.`);
      return { cleanup: () => {
      } };
    }
    toggles = Array.from(toggleContainer.querySelectorAll(`.${togglesClass}`));
    if (toggles.length === 0) {
      console.error(`[aria-ease] No elements with class="${togglesClass}" found. Make sure toggle buttons exist before calling makeToggleAccessible.`);
      return { cleanup: () => {
      } };
    }
  }
  const handlerMap = /* @__PURE__ */ new WeakMap();
  const clickHandlerMap = /* @__PURE__ */ new WeakMap();
  function initialize() {
    toggles.forEach((toggle) => {
      if (toggle.tagName.toLowerCase() !== "button" && !toggle.getAttribute("role")) {
        toggle.setAttribute("role", "button");
      }
      if (!toggle.hasAttribute("aria-pressed")) {
        toggle.setAttribute("aria-pressed", "false");
      }
      if (!toggle.hasAttribute("tabindex")) {
        toggle.setAttribute("tabindex", "0");
      }
    });
  }
  function toggleButton(index) {
    if (index < 0 || index >= toggles.length) {
      console.error(`[aria-ease] Invalid toggle index: ${index}`);
      return;
    }
    const toggle = toggles[index];
    const isPressed = toggle.getAttribute("aria-pressed") === "true";
    toggle.setAttribute("aria-pressed", isPressed ? "false" : "true");
  }
  function setPressed(index, pressed) {
    if (index < 0 || index >= toggles.length) {
      console.error(`[aria-ease] Invalid toggle index: ${index}`);
      return;
    }
    toggles[index].setAttribute("aria-pressed", pressed ? "true" : "false");
  }
  function handleToggleClick(index) {
    return () => {
      toggleButton(index);
    };
  }
  function handleToggleKeydown(index) {
    return (event) => {
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
    toggles.forEach((toggle, index) => {
      const clickHandler = handleToggleClick(index);
      const keydownHandler = handleToggleKeydown(index);
      toggle.addEventListener("click", clickHandler);
      toggle.addEventListener("keydown", keydownHandler);
      handlerMap.set(toggle, keydownHandler);
      clickHandlerMap.set(toggle, clickHandler);
    });
  }
  function removeListeners() {
    toggles.forEach((toggle) => {
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
  function getPressedStates() {
    return toggles.map((toggle) => toggle.getAttribute("aria-pressed") === "true");
  }
  function getPressedIndices() {
    return toggles.map((toggle, index) => toggle.getAttribute("aria-pressed") === "true" ? index : -1).filter((index) => index !== -1);
  }
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

export { makeToggleAccessible, updateToggleAriaAttribute };
