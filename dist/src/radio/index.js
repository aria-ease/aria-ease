// src/radio/src/makeRadioAccessible/makeRadioAccessible.ts
function makeRadioAccessible({ radioGroupId, radiosClass, defaultSelectedIndex = 0 }) {
  const radioGroup = document.querySelector(`#${radioGroupId}`);
  if (!radioGroup) {
    console.error(`[aria-ease] Element with id="${radioGroupId}" not found. Make sure the radio group container exists before calling makeRadioAccessible.`);
    return { cleanup: () => {
    } };
  }
  const radios = Array.from(radioGroup.querySelectorAll(`.${radiosClass}`));
  if (radios.length === 0) {
    console.error(`[aria-ease] No elements with class="${radiosClass}" found. Make sure radio buttons exist before calling makeRadioAccessible.`);
    return { cleanup: () => {
    } };
  }
  const handlerMap = /* @__PURE__ */ new WeakMap();
  const clickHandlerMap = /* @__PURE__ */ new WeakMap();
  let currentSelectedIndex = defaultSelectedIndex;
  function initialize() {
    if (!radioGroup.getAttribute("role")) {
      radioGroup.setAttribute("role", "radiogroup");
    }
    radios.forEach((radio, index) => {
      radio.setAttribute("role", "radio");
      radio.setAttribute("tabindex", index === currentSelectedIndex ? "0" : "-1");
      if (index === currentSelectedIndex) {
        radio.setAttribute("aria-checked", "true");
      } else {
        radio.setAttribute("aria-checked", "false");
      }
    });
  }
  function selectRadio(index) {
    if (index < 0 || index >= radios.length) {
      console.error(`[aria-ease] Invalid radio index: ${index}`);
      return;
    }
    if (currentSelectedIndex >= 0 && currentSelectedIndex < radios.length) {
      radios[currentSelectedIndex].setAttribute("aria-checked", "false");
      radios[currentSelectedIndex].setAttribute("tabindex", "-1");
    }
    radios[index].setAttribute("aria-checked", "true");
    radios[index].setAttribute("tabindex", "0");
    radios[index].focus();
    currentSelectedIndex = index;
  }
  function handleRadioClick(index) {
    return () => {
      selectRadio(index);
    };
  }
  function handleRadioKeydown(index) {
    return (event) => {
      const { key } = event;
      let nextIndex = index;
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
          event.preventDefault();
          selectRadio(index);
          break;
        case "Home":
          event.preventDefault();
          selectRadio(0);
          break;
        case "End":
          event.preventDefault();
          selectRadio(radios.length - 1);
          break;
      }
    };
  }
  function addListeners() {
    radios.forEach((radio, index) => {
      const clickHandler = handleRadioClick(index);
      const keydownHandler = handleRadioKeydown(index);
      radio.addEventListener("click", clickHandler);
      radio.addEventListener("keydown", keydownHandler);
      handlerMap.set(radio, keydownHandler);
      clickHandlerMap.set(radio, clickHandler);
    });
  }
  function removeListeners() {
    radios.forEach((radio) => {
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
  function getSelectedIndex() {
    return currentSelectedIndex;
  }
  initialize();
  addListeners();
  return {
    selectRadio,
    getSelectedIndex,
    cleanup
  };
}

export { makeRadioAccessible };
