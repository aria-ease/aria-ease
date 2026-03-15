import {
  ContractReporter,
  closeSharedBrowser,
  contract_default
} from "./chunk-AUJAN4RK.js";
import "./chunk-I2KLQ2HA.js";

// src/accordion/src/makeAccordionAccessible/makeAccordionAccessible.ts
function makeAccordionAccessible({ accordionId, triggersClass, panelsClass, allowMultipleOpen = false, callback }) {
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
      if (!allowMultipleOpen || triggers.length <= 6) {
        panel.setAttribute("role", "region");
      }
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
    if (callback?.onExpand) {
      try {
        callback.onExpand(index);
      } catch (error) {
        console.error("[aria-ease] Error in accordion onExpand callback:", error);
      }
    }
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
    if (callback?.onCollapse) {
      try {
        callback.onCollapse(index);
      } catch (error) {
        console.error("[aria-ease] Error in accordion onCollapse callback:", error);
      }
    }
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
  function refresh() {
    removeListeners();
    const newTriggers = Array.from(accordionContainer.querySelectorAll(`.${triggersClass}`));
    const newPanels = Array.from(accordionContainer.querySelectorAll(`.${panelsClass}`));
    triggers.length = 0;
    triggers.push(...newTriggers);
    panels.length = 0;
    panels.push(...newPanels);
    initialize();
    addListeners();
  }
  initialize();
  addListeners();
  return { expandItem, collapseItem, toggleItem, cleanup, refresh };
}

// src/utils/handleKeyPress/handleKeyPress.ts
function isTextInput(el) {
  if (el.tagName !== "INPUT") return false;
  const type = el.type;
  return ["text", "email", "password", "tel", "number"].includes(type);
}
function isTextArea(el) {
  return el.tagName === "TEXTAREA";
}
function isNativeButton(el) {
  return el.tagName === "BUTTON" || el.tagName === "INPUT" && ["button", "submit", "reset"].includes(el.type);
}
function isLink(el) {
  return el.tagName === "A";
}
function moveFocus(elementItems, currentIndex, direction) {
  const len = elementItems.length;
  const nextIndex = (currentIndex + direction + len) % len;
  elementItems.item(nextIndex).focus();
}
function isClickableButNotSemantic(el) {
  return el.getAttribute("data-custom-click") !== null && el.getAttribute("data-custom-click") !== void 0;
}
function handleKeyPress(event, elementItems, elementItemIndex) {
  const currentEl = elementItems.item(elementItemIndex);
  switch (event.key) {
    case "ArrowUp":
    case "ArrowLeft": {
      if (!isTextInput(currentEl) && !isTextArea(currentEl)) {
        event.preventDefault();
        moveFocus(elementItems, elementItemIndex, -1);
      } else if (isTextInput(currentEl) || isTextArea(currentEl)) {
        const cursorStart = currentEl.selectionStart;
        if (cursorStart === 0) {
          event.preventDefault();
          moveFocus(elementItems, elementItemIndex, -1);
        }
      }
      break;
    }
    case "ArrowDown":
    case "ArrowRight": {
      if (!isTextInput(currentEl) && !isTextArea(currentEl)) {
        event.preventDefault();
        moveFocus(elementItems, elementItemIndex, 1);
      } else if (isTextInput(currentEl) || isTextArea(currentEl)) {
        const value = currentEl.value;
        const cursorEnd = currentEl.selectionStart;
        if (cursorEnd === value.length) {
          event.preventDefault();
          moveFocus(elementItems, elementItemIndex, 1);
        }
      }
      break;
    }
    case "Escape": {
      event.preventDefault();
      break;
    }
    case "Enter":
    case " ": {
      if (!isNativeButton(currentEl) && !isLink(currentEl) && isClickableButNotSemantic(currentEl)) {
        event.preventDefault();
        currentEl.click();
      } else if (isNativeButton(currentEl)) {
        event.preventDefault();
        currentEl.click();
      }
      break;
    }
    case "Tab": {
      break;
    }
    default:
      break;
  }
}

// src/block/src/makeBlockAccessible/makeBlockAccessible.ts
function makeBlockAccessible({ blockId, blockItemsClass }) {
  const blockDiv = document.querySelector(`#${blockId}`);
  if (!blockDiv) {
    console.error(`[aria-ease] Element with id="${blockId}" not found. Make sure the block element exists before calling makeBlockAccessible.`);
    return { cleanup: () => {
    } };
  }
  let cachedItems = null;
  function getItems() {
    if (!cachedItems) {
      cachedItems = blockDiv.querySelectorAll(`.${blockItemsClass}`);
    }
    return cachedItems;
  }
  const blockItems = getItems();
  if (!blockItems || blockItems.length === 0) {
    console.error(`[aria-ease] Element with class="${blockItemsClass}" not found. Make sure the block items exist before calling makeBlockAccessible.`);
    return { cleanup: () => {
    } };
  }
  const eventListenersMap = /* @__PURE__ */ new Map();
  blockItems.forEach((blockItem) => {
    if (!eventListenersMap.has(blockItem)) {
      const handler = (event) => {
        const items = blockDiv.querySelectorAll(`.${blockItemsClass}`);
        const index = Array.prototype.indexOf.call(items, blockItem);
        handleKeyPress(event, items, index);
      };
      blockItem.addEventListener("keydown", handler);
      eventListenersMap.set(blockItem, handler);
    }
  });
  function cleanup() {
    blockItems.forEach((blockItem) => {
      const handler = eventListenersMap.get(blockItem);
      if (handler) {
        blockItem.removeEventListener("keydown", handler);
        eventListenersMap.delete(blockItem);
      }
    });
  }
  function refresh() {
    cachedItems = null;
  }
  return { cleanup, refresh };
}

// src/checkbox/src/makeCheckboxAccessible/makeCheckboxAccessible.ts
function makeCheckboxAccessible({ checkboxGroupId, checkboxesClass }) {
  const checkboxGroup = document.querySelector(`#${checkboxGroupId}`);
  if (!checkboxGroup) {
    console.error(`[aria-ease] Element with id="${checkboxGroupId}" not found. Make sure the checkbox group container exists before calling makeCheckboxAccessible.`);
    return { cleanup: () => {
    } };
  }
  const checkboxes = Array.from(checkboxGroup.querySelectorAll(`.${checkboxesClass}`));
  if (checkboxes.length === 0) {
    console.error(`[aria-ease] No elements with class="${checkboxesClass}" found. Make sure checkboxes exist before calling makeCheckboxAccessible.`);
    return { cleanup: () => {
    } };
  }
  const handlerMap = /* @__PURE__ */ new WeakMap();
  const clickHandlerMap = /* @__PURE__ */ new WeakMap();
  function initialize() {
    if (!checkboxGroup.getAttribute("role")) {
      checkboxGroup.setAttribute("role", "group");
    }
    checkboxes.forEach((checkbox) => {
      checkbox.setAttribute("role", "checkbox");
      if (!checkbox.hasAttribute("aria-checked")) {
        checkbox.setAttribute("aria-checked", "false");
      }
      if (!checkbox.hasAttribute("tabindex")) {
        checkbox.setAttribute("tabindex", "0");
      }
    });
  }
  function toggleCheckbox(index) {
    if (index < 0 || index >= checkboxes.length) {
      console.error(`[aria-ease] Invalid checkbox index: ${index}`);
      return;
    }
    const checkbox = checkboxes[index];
    const isChecked = checkbox.getAttribute("aria-checked") === "true";
    checkbox.setAttribute("aria-checked", isChecked ? "false" : "true");
  }
  function setCheckboxState(index, checked) {
    if (index < 0 || index >= checkboxes.length) {
      console.error(`[aria-ease] Invalid checkbox index: ${index}`);
      return;
    }
    checkboxes[index].setAttribute("aria-checked", checked ? "true" : "false");
  }
  function handleCheckboxClick(index) {
    return () => {
      toggleCheckbox(index);
    };
  }
  function handleCheckboxKeydown(index) {
    return (event) => {
      const { key } = event;
      switch (key) {
        case " ":
          event.preventDefault();
          toggleCheckbox(index);
          break;
      }
    };
  }
  function addListeners() {
    checkboxes.forEach((checkbox, index) => {
      const clickHandler = handleCheckboxClick(index);
      const keydownHandler = handleCheckboxKeydown(index);
      checkbox.addEventListener("click", clickHandler);
      checkbox.addEventListener("keydown", keydownHandler);
      handlerMap.set(checkbox, keydownHandler);
      clickHandlerMap.set(checkbox, clickHandler);
    });
  }
  function removeListeners() {
    checkboxes.forEach((checkbox) => {
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
  function getCheckedStates() {
    return checkboxes.map((checkbox) => checkbox.getAttribute("aria-checked") === "true");
  }
  function getCheckedIndices() {
    return checkboxes.map((checkbox, index) => checkbox.getAttribute("aria-checked") === "true" ? index : -1).filter((index) => index !== -1);
  }
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

// src/menu/src/makeMenuAccessible/makeMenuAccessible.ts
function makeMenuAccessible({ menuId, menuItemsClass, triggerId, callback }) {
  const menuDiv = document.querySelector(`#${menuId}`);
  if (!menuDiv) {
    console.error(`[aria-ease] Element with id="${menuId}" not found. Make sure the menu element exists before calling makeMenuAccessible.`);
    return { openMenu: () => {
    }, closeMenu: () => {
    }, cleanup: () => {
    } };
  }
  const triggerButton = document.querySelector(`#${triggerId}`);
  if (!triggerButton) {
    console.error(`[aria-ease] Element with id="${triggerId}" not found. Make sure the trigger button element exists before calling makeMenuAccessible.`);
    return { openMenu: () => {
    }, closeMenu: () => {
    }, cleanup: () => {
    } };
  }
  if (!/^[\w-]+$/.test(menuId)) {
    console.error("[aria-ease] Invalid menuId: must be alphanumeric");
    return { openMenu: () => {
    }, closeMenu: () => {
    }, cleanup: () => {
    } };
  }
  triggerButton.setAttribute("aria-haspopup", "true");
  triggerButton.setAttribute("aria-controls", menuId);
  triggerButton.setAttribute("aria-expanded", "false");
  menuDiv.setAttribute("role", "menu");
  menuDiv.setAttribute("aria-labelledby", triggerId);
  const handlerMap = /* @__PURE__ */ new WeakMap();
  const submenuInstances = /* @__PURE__ */ new Map();
  let cachedItems = null;
  let filteredItems = null;
  function getItems() {
    if (!cachedItems) {
      cachedItems = menuDiv.querySelectorAll(`.${menuItemsClass}`);
    }
    return cachedItems;
  }
  function getFilteredItems() {
    if (!filteredItems) {
      const allItems = getItems();
      filteredItems = [];
      for (let i = 0; i < allItems.length; i++) {
        const item = allItems.item(i);
        const isNested = isItemInNestedSubmenu(item);
        if (!isNested) {
          if (!item.hasAttribute("tabindex")) {
            item.setAttribute("tabindex", "-1");
          }
          filteredItems.push(item);
        }
      }
    }
    return filteredItems;
  }
  function toNodeListLike(items) {
    const nodeListLike = {
      length: items.length,
      item: (index) => items[index],
      forEach: (callback2) => {
        items.forEach(callback2);
      },
      [Symbol.iterator]: function* () {
        for (const item of items) {
          yield item;
        }
      }
    };
    return nodeListLike;
  }
  function intializeMenuItems() {
    const items = getItems();
    items.forEach((item) => {
      item.setAttribute("role", "menuitem");
      if (item.hasAttribute("data-submenu-id")) {
        item.setAttribute("aria-haspopup", "menu");
        item.setAttribute("aria-controls", item.getAttribute("data-submenu-id"));
      }
    });
  }
  function moveFocus2(elementItems, currentIndex, direction) {
    const len = elementItems.length;
    const nextIndex = (currentIndex + direction + len) % len;
    elementItems.item(nextIndex).focus();
  }
  function hasSubmenu(menuItem) {
    return menuItem.hasAttribute("aria-controls") && menuItem.hasAttribute("aria-haspopup") && menuItem.getAttribute("role") === "menuitem";
  }
  intializeMenuItems();
  function handleItemsKeydown(event, menuItem, menuItemIndex) {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowLeft": {
        if (event.key === "ArrowLeft" && triggerButton.getAttribute("role") === "menuitem") {
          event.preventDefault();
          closeMenu();
          return;
        }
        event.preventDefault();
        moveFocus2(toNodeListLike(getFilteredItems()), menuItemIndex, -1);
        break;
      }
      case "ArrowDown":
      case "ArrowRight": {
        if (event.key === "ArrowRight" && hasSubmenu(menuItem)) {
          event.preventDefault();
          const submenuId = menuItem.getAttribute("aria-controls");
          if (submenuId) {
            openSubmenu(submenuId);
            return;
          }
        }
        event.preventDefault();
        moveFocus2(toNodeListLike(getFilteredItems()), menuItemIndex, 1);
        break;
      }
      case "Escape": {
        event.preventDefault();
        closeMenu();
        triggerButton.focus();
        if (onOpenChange) {
          onOpenChange(false);
        }
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        menuItem.click();
        break;
      }
      case "Tab": {
        if (!event.shiftKey || event.shiftKey) {
          closeMenu();
          if (onOpenChange) {
            onOpenChange(false);
          }
        }
        break;
      }
      default:
        break;
    }
  }
  function isItemInNestedSubmenu(item) {
    let parent = item.parentElement;
    while (parent && parent !== menuDiv) {
      if (parent.getAttribute("role") === "menu") {
        return true;
      }
      if (parent.id) {
        const parentMenuTrigger = menuDiv.querySelector(`[aria-controls="${parent.id}"]`);
        if (parentMenuTrigger) {
          return true;
        }
      }
      parent = parent.parentElement;
    }
    return false;
  }
  function setAria(isOpen) {
    triggerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
  function openSubmenu(submenuId) {
    let submenuInstance = submenuInstances.get(submenuId);
    if (!submenuInstance) {
      const submenuTrigger = menuDiv.querySelector(`[aria-controls="${submenuId}"]`);
      if (!submenuTrigger) {
        console.error(`[aria-ease] Submenu trigger with aria-controls="${submenuId}" not found in menu "${menuId}".`);
        return;
      }
      if (!submenuTrigger.id) {
        const generatedId = `trigger-${submenuId}`;
        submenuTrigger.id = generatedId;
        console.warn(`[aria-ease] Submenu trigger for "${submenuId}" had no ID. Auto-generated ID: "${generatedId}".`);
      }
      const submenuElement = document.querySelector(`#${submenuId}`);
      if (!submenuElement) {
        console.error(`[aria-ease] Submenu element with id="${submenuId}" not found. Cannot create submenu instance.`);
        return;
      }
      submenuInstance = makeMenuAccessible({
        menuId: submenuId,
        menuItemsClass,
        triggerId: submenuTrigger.id,
        callback
      });
      submenuInstances.set(submenuId, submenuInstance);
    }
    submenuInstance.openMenu();
  }
  function onOpenChange(isOpen) {
    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(isOpen);
      } catch (error) {
        console.error("[aria-ease] Error in menu onOpenChange callback:", error);
      }
    }
  }
  function addListeners() {
    const items = getFilteredItems();
    items.forEach((menuItem, index) => {
      if (!handlerMap.has(menuItem)) {
        const handler = (event) => handleItemsKeydown(event, menuItem, index);
        menuItem.addEventListener("keydown", handler);
        handlerMap.set(menuItem, handler);
      }
    });
  }
  function removeListeners() {
    const items = getFilteredItems();
    items.forEach((menuItem) => {
      const handler = handlerMap.get(menuItem);
      if (handler) {
        menuItem.removeEventListener("keydown", handler);
        handlerMap.delete(menuItem);
      }
    });
  }
  function openMenu() {
    setAria(true);
    menuDiv.style.display = "block";
    const items = getFilteredItems();
    addListeners();
    if (items && items.length > 0) {
      items[0].focus();
    }
    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(true);
      } catch (error) {
        console.error("[aria-ease] Error in menu onOpenChange callback:", error);
      }
    }
  }
  function closeMenu() {
    setAria(false);
    menuDiv.style.display = "none";
    removeListeners();
    triggerButton.focus();
    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(false);
      } catch (error) {
        console.error("[aria-ease] Error in menu onOpenChange callback:", error);
      }
    }
  }
  function handleTriggerClick() {
    const isOpen = triggerButton.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }
  function handleClickOutside(event) {
    const isMenuOpen = triggerButton.getAttribute("aria-expanded") === "true";
    if (!isMenuOpen) return;
    const clickedTrigger = triggerButton.contains(event.target);
    const clickedMenu = menuDiv.contains(event.target);
    if (!clickedTrigger && !clickedMenu) {
      closeMenu();
    }
  }
  triggerButton.addEventListener("click", handleTriggerClick);
  document.addEventListener("click", handleClickOutside);
  function cleanup() {
    removeListeners();
    triggerButton.removeEventListener("click", handleTriggerClick);
    document.removeEventListener("click", handleClickOutside);
    menuDiv.style.display = "none";
    setAria(false);
    submenuInstances.forEach((instance) => instance.cleanup());
    submenuInstances.clear();
  }
  function refresh() {
    cachedItems = null;
    filteredItems = null;
  }
  return { openMenu, closeMenu, cleanup, refresh };
}

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
        case "Enter":
          event.preventDefault();
          selectRadio(index);
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

// src/combobox/src/makeComboBoxAccessible/makeComboBoxAccessible.ts
function makeComboboxAccessible({ comboboxInputId, comboboxButtonId, listBoxId, listBoxItemsClass, callback }) {
  const comboboxInput = document.getElementById(`${comboboxInputId}`);
  if (!comboboxInput) {
    console.error(`[aria-ease] Element with id="${comboboxInputId}" not found. Make sure the combobox input element exists before calling makeComboboxAccessible.`);
    return { cleanup: () => {
    } };
  }
  const listBox = document.getElementById(`${listBoxId}`);
  if (!listBox) {
    console.error(`[aria-ease] Element with id="${listBoxId}" not found. Make sure the combobox listbox element exists before calling makeComboboxAccessible.`);
    return { cleanup: () => {
    } };
  }
  const listButton = comboboxButtonId ? document.getElementById(`${comboboxButtonId}`) : null;
  let activeIndex = -1;
  comboboxInput.setAttribute("role", "combobox");
  comboboxInput.setAttribute("aria-autocomplete", "list");
  comboboxInput.setAttribute("aria-controls", listBoxId);
  comboboxInput.setAttribute("aria-expanded", "false");
  comboboxInput.setAttribute("aria-haspopup", "listbox");
  listBox.setAttribute("role", "listbox");
  let cachedItems = null;
  function getVisibleItems() {
    if (!cachedItems) {
      cachedItems = listBox.querySelectorAll(`.${listBoxItemsClass}`);
    }
    return Array.from(cachedItems).filter((item) => !item.hidden && item.style.display !== "none");
  }
  function isListboxOpen() {
    return comboboxInput.getAttribute("aria-expanded") === "true";
  }
  function setActiveDescendant(index) {
    const visibleItems = getVisibleItems();
    visibleItems.forEach((item) => {
      item.setAttribute("aria-selected", "false");
    });
    if (index >= 0 && index < visibleItems.length) {
      const activeItem = visibleItems[index];
      const itemId = activeItem.id || `${listBoxId}-option-${index}`;
      if (!activeItem.id) {
        activeItem.id = itemId;
      }
      activeItem.setAttribute("aria-selected", "true");
      comboboxInput.setAttribute("aria-activedescendant", itemId);
      if (typeof activeItem.scrollIntoView === "function") {
        activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      if (callback?.onActiveDescendantChange) {
        try {
          callback.onActiveDescendantChange(itemId, activeItem);
        } catch (error) {
          console.error("[aria-ease] Error in combobox onActiveDescendantChange callback:", error);
        }
      }
    } else {
      comboboxInput.setAttribute("aria-activedescendant", "");
    }
    activeIndex = index;
  }
  function openListbox() {
    comboboxInput.setAttribute("aria-expanded", "true");
    listBox.style.display = "block";
    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(true);
      } catch (error) {
        console.error("[aria-ease] Error in combobox onOpenChange callback:", error);
      }
    }
  }
  function closeListbox() {
    comboboxInput.setAttribute("aria-expanded", "false");
    comboboxInput.setAttribute("aria-activedescendant", "");
    listBox.style.display = "none";
    activeIndex = -1;
    const visibleItems = getVisibleItems();
    visibleItems.forEach((item) => item.setAttribute("aria-selected", "false"));
    if (callback?.onOpenChange) {
      try {
        callback.onOpenChange(false);
      } catch (error) {
        console.error("[aria-ease] Error in combobox onOpenChange callback:", error);
      }
    }
  }
  function selectOption(item) {
    const value = item.textContent?.trim() || "";
    comboboxInput.value = value;
    closeListbox();
    if (callback?.onSelect) {
      try {
        callback.onSelect(item);
      } catch (error) {
        console.error("[aria-ease] Error in combobox onSelect callback:", error);
      }
    }
  }
  function handleInputKeyDown(event) {
    const visibleItems = getVisibleItems();
    const isOpen = isListboxOpen();
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          openListbox();
          return;
        }
        if (visibleItems.length === 0) return;
        {
          const newIndex = activeIndex >= visibleItems.length - 1 ? 0 : activeIndex + 1;
          setActiveDescendant(newIndex);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) return;
        if (visibleItems.length > 0) {
          const newIndex = activeIndex <= 0 ? visibleItems.length - 1 : activeIndex - 1;
          setActiveDescendant(newIndex);
        }
        break;
      case "Enter":
        if (isOpen && activeIndex >= 0 && activeIndex < visibleItems.length) {
          event.preventDefault();
          selectOption(visibleItems[activeIndex]);
        }
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          closeListbox();
        } else if (comboboxInput.value) {
          event.preventDefault();
          comboboxInput.value = "";
          if (callback?.onClear) {
            try {
              callback.onClear();
            } catch (error) {
              console.error("[aria-ease] Error in combobox onClear callback:", error);
            }
          }
        }
        break;
      case "Home":
        if (isOpen && visibleItems.length > 0) {
          event.preventDefault();
          setActiveDescendant(0);
        }
        break;
      case "End":
        if (isOpen && visibleItems.length > 0) {
          event.preventDefault();
          setActiveDescendant(visibleItems.length - 1);
        }
        break;
      case "Tab":
        if (isOpen) {
          closeListbox();
        }
        break;
    }
  }
  function handleMouseMove(event) {
    const target = event.target;
    if (target.classList.contains(listBoxItemsClass)) {
      const visibleItems = getVisibleItems();
      const index = visibleItems.indexOf(target);
      if (index >= 0) {
        setActiveDescendant(index);
      }
    }
  }
  function handleMouseDown(event) {
    const target = event.target;
    if (target.classList.contains(listBoxItemsClass)) {
      event.preventDefault();
      selectOption(target);
    }
  }
  function handleClickOutside(event) {
    const target = event.target;
    if (!comboboxInput.contains(target) && !listBox.contains(target) && (!listButton || !listButton.contains(target))) {
      closeListbox();
    }
  }
  function handleListButtonClick() {
    if (isListboxOpen()) {
      closeListbox();
    } else {
      openListbox();
      comboboxInput.focus();
    }
  }
  function handleListButtonKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleListButtonClick();
    }
  }
  comboboxInput.addEventListener("keydown", handleInputKeyDown);
  listBox.addEventListener("mousemove", handleMouseMove);
  listBox.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousedown", handleClickOutside);
  if (listButton) {
    listButton.setAttribute("tabindex", "-1");
    listButton.setAttribute("aria-label", "Toggle options");
    listButton.addEventListener("click", handleListButtonClick);
    listButton.addEventListener("keydown", handleListButtonKeyDown);
  }
  function initializeOptions() {
    const items = listBox.querySelectorAll(`.${listBoxItemsClass}`);
    if (items.length === 0) return;
    items.forEach((item, index) => {
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", "false");
      const currentId = item.getAttribute("id");
      if (!currentId || currentId === "") {
        const itemId = `${listBoxId}-option-${index}`;
        item.id = itemId;
        item.setAttribute("id", itemId);
      }
    });
  }
  initializeOptions();
  function cleanup() {
    comboboxInput.removeEventListener("keydown", handleInputKeyDown);
    listBox.removeEventListener("mousemove", handleMouseMove);
    listBox.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousedown", handleClickOutside);
    if (listButton) {
      listButton.removeEventListener("click", handleListButtonClick);
      listButton.removeEventListener("keydown", handleListButtonKeyDown);
    }
  }
  function refresh() {
    cachedItems = null;
    initializeOptions();
    activeIndex = -1;
    setActiveDescendant(-1);
  }
  return { cleanup, refresh, openListbox, closeListbox };
}

// src/tabs/src/makeTabsAccessible/makeTabsAccessible.ts
function makeTabsAccessible({ tabListId, tabsClass, tabPanelsClass, orientation = "horizontal", activateOnFocus = true, callback }) {
  const tabList = document.querySelector(`#${tabListId}`);
  if (!tabList) {
    console.error(`[aria-ease] Element with id="${tabListId}" not found. Make sure the tab list container exists before calling makeTabsAccessible.`);
    return { cleanup: () => {
    } };
  }
  const tabs = Array.from(tabList.querySelectorAll(`.${tabsClass}`));
  if (tabs.length === 0) {
    console.error(`[aria-ease] No elements with class="${tabsClass}" found. Make sure tab buttons exist before calling makeTabsAccessible.`);
    return { cleanup: () => {
    } };
  }
  const tabPanels = Array.from(document.querySelectorAll(`.${tabPanelsClass}`));
  if (tabPanels.length === 0) {
    console.error(`[aria-ease] No elements with class="${tabPanelsClass}" found. Make sure tab panels exist before calling makeTabsAccessible.`);
    return { cleanup: () => {
    } };
  }
  if (tabs.length !== tabPanels.length) {
    console.error(`[aria-ease] Tab/panel mismatch: found ${tabs.length} tabs but ${tabPanels.length} panels.`);
    return { cleanup: () => {
    } };
  }
  const handlerMap = /* @__PURE__ */ new WeakMap();
  const clickHandlerMap = /* @__PURE__ */ new WeakMap();
  const contextMenuHandlerMap = /* @__PURE__ */ new WeakMap();
  let activeTabIndex = 0;
  function initialize() {
    tabList.setAttribute("role", "tablist");
    tabList.setAttribute("aria-orientation", orientation);
    tabs.forEach((tab, index) => {
      const panel = tabPanels[index];
      if (!tab.id) {
        tab.id = `${tabListId}-tab-${index}`;
      }
      if (!panel.id) {
        panel.id = `${tabListId}-panel-${index}`;
      }
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panel.id);
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tab.id);
      panel.hidden = true;
      const hasFocusableContent = panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!hasFocusableContent) {
        panel.setAttribute("tabindex", "0");
      }
    });
    activateTab(0, false);
  }
  function activateTab(index, shouldFocus = true) {
    if (index < 0 || index >= tabs.length) {
      console.error(`[aria-ease] Invalid tab index: ${index}`);
      return;
    }
    const previousIndex = activeTabIndex;
    tabs.forEach((tab, i) => {
      const panel = tabPanels[i];
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
      panel.hidden = true;
    });
    const activeTab = tabs[index];
    const activePanel = tabPanels[index];
    activeTab.setAttribute("aria-selected", "true");
    activeTab.setAttribute("tabindex", "0");
    activePanel.hidden = false;
    if (shouldFocus) {
      activeTab.focus();
    }
    activeTabIndex = index;
    if (callback?.onTabChange && previousIndex !== index) {
      try {
        callback.onTabChange(index, previousIndex);
      } catch (error) {
        console.error("[aria-ease] Error in tabs onTabChange callback:", error);
      }
    }
  }
  function moveFocus2(direction) {
    const currentFocusedIndex = tabs.findIndex((tab) => tab === document.activeElement);
    const currentIndex = currentFocusedIndex !== -1 ? currentFocusedIndex : activeTabIndex;
    let newIndex = currentIndex;
    switch (direction) {
      case "first":
        newIndex = 0;
        break;
      case "last":
        newIndex = tabs.length - 1;
        break;
      case "next":
        newIndex = (currentIndex + 1) % tabs.length;
        break;
      case "prev":
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
    }
    tabs[newIndex].focus();
    tabs[newIndex].setAttribute("tabindex", "0");
    tabs[activeTabIndex].setAttribute("tabindex", "-1");
    if (activateOnFocus) {
      activateTab(newIndex, false);
    } else {
      const currentActive = activeTabIndex;
      tabs.forEach((tab, i) => {
        if (i === newIndex) {
          tab.setAttribute("tabindex", "0");
        } else if (i !== currentActive) {
          tab.setAttribute("tabindex", "-1");
        }
      });
    }
  }
  function handleTabClick(index) {
    return () => {
      activateTab(index);
    };
  }
  function handleTabKeydown(index) {
    return (event) => {
      const { key } = event;
      let handled = false;
      if (orientation === "horizontal") {
        switch (key) {
          case "ArrowLeft":
            event.preventDefault();
            moveFocus2("prev");
            handled = true;
            break;
          case "ArrowRight":
            event.preventDefault();
            moveFocus2("next");
            handled = true;
            break;
        }
      } else {
        switch (key) {
          case "ArrowUp":
            event.preventDefault();
            moveFocus2("prev");
            handled = true;
            break;
          case "ArrowDown":
            event.preventDefault();
            moveFocus2("next");
            handled = true;
            break;
        }
      }
      if (!handled) {
        switch (key) {
          case "Home":
            event.preventDefault();
            moveFocus2("first");
            break;
          case "End":
            event.preventDefault();
            moveFocus2("last");
            break;
          case " ":
          case "Enter":
            if (!activateOnFocus) {
              event.preventDefault();
              activateTab(index);
            }
            break;
          case "F10":
            if (event.shiftKey && callback?.onContextMenu) {
              event.preventDefault();
              try {
                callback.onContextMenu(index, tabs[index]);
              } catch (error) {
                console.error("[aria-ease] Error in tabs onContextMenu callback:", error);
              }
            }
            break;
        }
      }
    };
  }
  function handleTabContextMenu(index) {
    return (event) => {
      if (callback?.onContextMenu) {
        event.preventDefault();
        try {
          callback.onContextMenu(index, tabs[index]);
        } catch (error) {
          console.error("[aria-ease] Error in tabs onContextMenu callback:", error);
        }
      }
    };
  }
  function addListeners() {
    tabs.forEach((tab, index) => {
      const clickHandler = handleTabClick(index);
      const keydownHandler = handleTabKeydown(index);
      const contextMenuHandler = handleTabContextMenu(index);
      tab.addEventListener("click", clickHandler);
      tab.addEventListener("keydown", keydownHandler);
      if (callback?.onContextMenu) {
        tab.addEventListener("contextmenu", contextMenuHandler);
        contextMenuHandlerMap.set(tab, contextMenuHandler);
      }
      handlerMap.set(tab, keydownHandler);
      clickHandlerMap.set(tab, clickHandler);
    });
  }
  function removeListeners() {
    tabs.forEach((tab) => {
      const keydownHandler = handlerMap.get(tab);
      const clickHandler = clickHandlerMap.get(tab);
      const contextMenuHandler = contextMenuHandlerMap.get(tab);
      if (keydownHandler) {
        tab.removeEventListener("keydown", keydownHandler);
        handlerMap.delete(tab);
      }
      if (clickHandler) {
        tab.removeEventListener("click", clickHandler);
        clickHandlerMap.delete(tab);
      }
      if (contextMenuHandler) {
        tab.removeEventListener("contextmenu", contextMenuHandler);
        contextMenuHandlerMap.delete(tab);
      }
    });
  }
  function cleanup() {
    removeListeners();
    tabs.forEach((tab, index) => {
      const panel = tabPanels[index];
      tab.removeAttribute("role");
      tab.removeAttribute("aria-selected");
      tab.removeAttribute("aria-controls");
      tab.removeAttribute("tabindex");
      panel.removeAttribute("role");
      panel.removeAttribute("aria-labelledby");
      panel.removeAttribute("tabindex");
      panel.hidden = false;
    });
    tabList.removeAttribute("role");
    tabList.removeAttribute("aria-orientation");
  }
  function refresh() {
    removeListeners();
    const newTabs = Array.from(tabList.querySelectorAll(`.${tabsClass}`));
    const newPanels = Array.from(document.querySelectorAll(`.${tabPanelsClass}`));
    tabs.length = 0;
    tabs.push(...newTabs);
    tabPanels.length = 0;
    tabPanels.push(...newPanels);
    initialize();
    addListeners();
  }
  initialize();
  addListeners();
  return { activateTab, cleanup, refresh };
}

// src/utils/test/src/test.ts
import { axe } from "jest-axe";

// src/utils/test/src/contractTestRunner.ts
import fs from "fs/promises";
async function runContractTests(componentName, component) {
  const reporter = new ContractReporter(false);
  const contractTyped = contract_default;
  const contractPath = contractTyped[componentName]?.path;
  if (!contractPath) {
    throw new Error(`No contract found for component: ${componentName}`);
  }
  const resolvedPath = new URL(contractPath, import.meta.url).pathname;
  const contractData = await fs.readFile(resolvedPath, "utf-8");
  const componentContract = JSON.parse(contractData);
  const totalTests = componentContract.static[0].assertions.length + componentContract.dynamic.length;
  reporter.start(componentName, totalTests);
  const failures = [];
  const passes = [];
  const skipped = [];
  const failuresBeforeStatic = failures.length;
  for (const test of componentContract.static[0].assertions) {
    if (test.target !== "relative") {
      const selector = componentContract.selectors[test.target];
      if (!selector) {
        failures.push(`Selector for target ${test.target} not found.`);
        reporter.reportStaticTest(`${test.target} has required ARIA attributes`, false, `Selector for target ${test.target} not found.`);
        continue;
      }
      const target = component.querySelector(selector);
      if (!target) {
        failures.push(`Target ${test.target} not found.`);
        reporter.reportStaticTest(`${test.target} has required ARIA attributes`, false, `Target ${test.target} not found.`);
        continue;
      }
      const attributeValue = target.getAttribute(test.attribute);
      if (!test.expectedValue) {
        const attributes = test.attribute.split(" | ");
        const hasAnyAttribute = attributes.some((attr) => target.hasAttribute(attr));
        if (!hasAnyAttribute) {
          failures.push(test.failureMessage + ` None of the attributes "${test.attribute}" are present.`);
          reporter.reportStaticTest(`${test.target} has ${test.attribute}`, false, test.failureMessage);
        } else {
          passes.push(`At least one of the attributes "${test.attribute}" exists on the element.`);
          reporter.reportStaticTest(`${test.target} has ${test.attribute}`, true);
        }
      } else if (!attributeValue || !test.expectedValue.split(" | ").includes(attributeValue)) {
        failures.push(test.failureMessage + ` Attribute value does not match expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
        reporter.reportStaticTest(`${test.target} has ${test.attribute}="${test.expectedValue}"`, false, test.failureMessage);
      } else {
        passes.push(`Attribute value matches expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
        reporter.reportStaticTest(`${test.target} has ${test.attribute}="${attributeValue}"`, true);
      }
    }
  }
  for (const dynamicTest of componentContract.dynamic) {
    skipped.push(dynamicTest.description);
    reporter.reportTest(dynamicTest, "skip");
  }
  const staticTotal = componentContract.static[0].assertions.length;
  const staticFailed = failures.length - failuresBeforeStatic;
  const staticPassed = Math.max(0, staticTotal - staticFailed);
  reporter.reportStatic(staticPassed, staticFailed);
  reporter.summary(failures);
  return { passes, failures, skipped };
}

// src/utils/test/src/test.ts
async function testUiComponent(componentName, component, url) {
  if (!componentName || typeof componentName !== "string") {
    throw new Error("\u274C testUiComponent requires a valid componentName (string)");
  }
  if (!url && (!component || !(component instanceof HTMLElement))) {
    throw new Error("\u274C testUiComponent requires either a valid component (HTMLElement) or a URL");
  }
  if (url && typeof url !== "string") {
    throw new Error("\u274C testUiComponent url parameter must be a string");
  }
  let results;
  if (component) {
    try {
      results = await axe(component);
    } catch (error) {
      throw new Error(
        `\u274C Axe accessibility scan failed
Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  } else {
    results = { violations: [] };
  }
  async function checkDevServer(url2) {
    try {
      const response = await fetch(url2, {
        method: "HEAD",
        signal: AbortSignal.timeout(1e3)
      });
      if (response.ok || response.status === 304) {
        return url2;
      }
    } catch {
      return null;
    }
    return null;
  }
  let contract;
  try {
    if (url) {
      const devServerUrl = await checkDevServer(url);
      if (devServerUrl) {
        console.log(`\u{1F3AD} Running Playwright tests on ${devServerUrl}`);
        const { runContractTestsPlaywright } = await import("./contractTestRunnerPlaywright-7F756CFB.js");
        contract = await runContractTestsPlaywright(componentName, devServerUrl);
      } else {
        throw new Error(
          `\u274C Dev server not running at ${url}
Please start your dev server and try again.`
        );
      }
    } else if (component) {
      console.log(`\u{1F3AD} Running component contract tests in JSDOM mode`);
      contract = await runContractTests(componentName, component);
    } else {
      throw new Error("\u274C Either component or URL must be provided");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`\u274C Contract test execution failed: ${String(error)}`);
  }
  const result = {
    violations: results.violations,
    raw: results,
    contract
  };
  if (contract.failures.length > 0 && url === "Playwright") {
    throw new Error(
      `
\u274C ${contract.failures.length} accessibility contract test${contract.failures.length > 1 ? "s" : ""} failed (Playwright mode)
\u2705 ${contract.passes.length} test${contract.passes.length > 1 ? "s" : ""} passed

\u{1F4CB} Review the detailed test report above for specific failures.
\u{1F4A1} Contract tests validate ARIA attributes and keyboard interactions per W3C APG guidelines.`
    );
  }
  if (results.violations.length > 0) {
    const violationCount = results.violations.length;
    const violationDetails = results.violations.map(
      (v) => `
  - ${v.id}: ${v.description}
    Impact: ${v.impact}
    Affected elements: ${v.nodes.length}
    Help: ${v.helpUrl}`
    ).join("\n");
    throw new Error(
      `
\u274C ${violationCount} axe accessibility violation${violationCount > 1 ? "s" : ""} detected
${violationDetails}

\u{1F4CB} Full details available in result.violations`
    );
  }
  return result;
}
var runTest = async () => {
  return {
    passes: [],
    failures: [],
    skipped: []
  };
};
if (typeof window === "undefined") {
  runTest = async () => {
    console.log(`\u{1F680} Running component accessibility tests...
`);
    const { exec } = await import("child_process");
    const chalk = (await import("chalk")).default;
    return new Promise((resolve, reject) => {
      exec(
        `npx vitest --run --reporter verbose`,
        async (error, stdout, stderr) => {
          console.log(stdout);
          if (stderr) console.error(stderr);
          const testsPassed = !error || error.code === 0;
          if (testsPassed) {
            try {
              const { displayBadgeInfo, promptAddBadge } = await import("./badgeHelper-RDOMCC6E.js");
              displayBadgeInfo("component");
              await promptAddBadge("component", process.cwd());
              console.log(chalk.dim("\n" + "\u2500".repeat(60)));
              console.log(chalk.cyan("\u{1F499} Found aria-ease helpful?"));
              console.log(chalk.white("   \u2022 Star us on GitHub: ") + chalk.blue.underline("https://github.com/aria-ease/aria-ease"));
              console.log(chalk.white("   \u2022 Share feedback: ") + chalk.blue.underline("https://github.com/aria-ease/aria-ease/discussions"));
              console.log(chalk.dim("\u2500".repeat(60) + "\n"));
            } catch (badgeError) {
              console.error("Warning: Could not display badge prompt:", badgeError);
            }
            resolve({ passes: [], failures: [], skipped: [] });
            process.exit(0);
          } else {
            const exitCode = error?.code || 1;
            reject(new Error(`Tests failed with code ${exitCode}`));
            process.exit(exitCode);
          }
        }
      );
    });
  };
}
async function cleanupTests() {
  await closeSharedBrowser();
}
export {
  cleanupTests,
  makeAccordionAccessible,
  makeBlockAccessible,
  makeCheckboxAccessible,
  makeComboboxAccessible,
  makeMenuAccessible,
  makeRadioAccessible,
  makeTabsAccessible,
  makeToggleAccessible,
  testUiComponent
};
