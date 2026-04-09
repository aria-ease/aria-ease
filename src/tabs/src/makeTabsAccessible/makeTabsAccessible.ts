/**
 * Makes tabs accessible by managing ARIA attributes, keyboard interaction, and state.
 * Implements WAI-ARIA tabs pattern with full keyboard support and ARIA properties.
 * @param {string} tabListId - The id of the tab list container.
 * @param {string} tabsClass - The shared class of all tab buttons.
 * @param {string} tabPanelsClass - The shared class of all tab panels.
 * @param {('horizontal' | 'vertical')} orientation - Tab list orientation (default: 'horizontal').
 * @param {boolean} activateOnFocus - Whether tabs activate automatically on focus (default: true).
 * @param {TabsCallback} callback - Configuration options for callbacks.
 */

import { AccessibilityInstance, TabsConfig } from "Types";

export function makeTabsAccessible({ tabListId, tabsClass, tabPanelsClass, orientation = "horizontal", activateOnFocus = true, callback }: TabsConfig): AccessibilityInstance {
  if (tabListId === "") {
    console.error(`[aria-ease] 'tabListId' should not be an empty string. Provide an id to the tab list container element that exists before calling makeTabsAccessible.`);
    return { cleanup: () => {} };
  }
  const tabList = document.querySelector(`#${tabListId}`) as HTMLElement;
  if (!tabList) {
    console.error(`[aria-ease] Element with id="${tabListId}" not found. Make sure the tab list container exists before calling makeTabsAccessible.`);
    return { cleanup: () => {} };
  }

  if(tabsClass === "") {
    console.error(`[aria-ease] 'tabsClass' should not be an empty string. Provide a class name that exists on the tab button elements before calling makeTabsAccessible.`);
    return { cleanup: () => {} };
  }

  const tabs = Array.from(tabList.querySelectorAll(`.${tabsClass}`)) as HTMLElement[];
  if (tabs.length === 0) {
    console.error(`[aria-ease] No elements with class="${tabsClass}" found. Make sure tab buttons exist before calling makeTabsAccessible.`);
    return { cleanup: () => {} };
  }

  if(tabPanelsClass === "") {
    console.error(`[aria-ease] 'tabPanelsClass' should not be an empty string. Provide a class name that exists on the tab panel elements before calling makeTabsAccessible.`);
    return { cleanup: () => {} };
  }

  const tabPanels = Array.from(document.querySelectorAll(`.${tabPanelsClass}`)) as HTMLElement[];
  if (tabPanels.length === 0) {
    console.error(`[aria-ease] No elements with class="${tabPanelsClass}" found. Make sure tab panels exist before calling makeTabsAccessible.`);
    return { cleanup: () => {} };
  }

  if (tabs.length !== tabPanels.length) {
    console.error(`[aria-ease] Tab/panel mismatch: found ${tabs.length} tabs but ${tabPanels.length} panels.`);
    return { cleanup: () => {} };
  }

  const handlerMap = new WeakMap<HTMLElement, (event: KeyboardEvent) => void>();
  const clickHandlerMap = new WeakMap<HTMLElement, () => void>();
  const contextMenuHandlerMap = new WeakMap<HTMLElement, (event: MouseEvent) => void>();

  let activeTabIndex = 0;

  // Initialize ARIA attributes
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

  function activateTab(index: number, shouldFocus = true) {
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

  function moveFocus(direction: "first" | "last" | "next" | "prev") {
    const currentFocusedIndex = tabs.findIndex(tab => tab === document.activeElement);
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

  function handleTabClick(index: number) {
    return () => {
      activateTab(index);
    };
  }

  function handleTabKeydown(index: number) {
    return (event: KeyboardEvent) => {
      const { key } = event;
      let handled = false;

      if (orientation === "horizontal") {
        switch (key) {
          case "ArrowLeft":
            event.preventDefault();
            moveFocus("prev");
            handled = true;
            break;
          case "ArrowRight":
            event.preventDefault();
            moveFocus("next");
            handled = true;
            break;
        }
      } else {
        switch (key) {
          case "ArrowUp":
            event.preventDefault();
            moveFocus("prev");
            handled = true;
            break;
          case "ArrowDown":
            event.preventDefault();
            moveFocus("next");
            handled = true;
            break;
        }
      }

      if (!handled) {
        switch (key) {
          case "Home":
            event.preventDefault();
            moveFocus("first");
            break;
          case "End":
            event.preventDefault();
            moveFocus("last");
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

  function handleTabContextMenu(index: number) {
    return (event: MouseEvent) => {
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
    tabs.forEach((tab: HTMLElement, index: number) => {
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
    tabs.forEach((tab: HTMLElement) => {
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

    const newTabs = Array.from(tabList.querySelectorAll(`.${tabsClass}`)) as HTMLElement[];
    const newPanels = Array.from(document.querySelectorAll(`.${tabPanelsClass}`)) as HTMLElement[];

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