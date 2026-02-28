import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { makeTabsAccessible } from "../../../src/tabs";

describe("makeTabsAccessible", () => {
  let tabList: HTMLElement;
  let tabsInstance: ReturnType<typeof makeTabsAccessible>;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-tabs" aria-label="Test Tabs">
        <button class="tab">Tab 1</button>
        <button class="tab">Tab 2</button>
        <button class="tab">Tab 3</button>
        <button class="tab">Tab 4</button>
      </div>
      <div class="panel">Panel 1</div>
      <div class="panel">Panel 2</div>
      <div class="panel">Panel 3</div>
      <div class="panel">Panel 4</div>
    `;
    tabList = document.getElementById("test-tabs")!;
  });

  afterEach(() => {
    if (tabsInstance) {
      tabsInstance.cleanup();
    }
  });

  describe("initialization", () => {
    it("sets ARIA attributes on tablist", () => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });

      expect(tabList.getAttribute("role")).toBe("tablist");
      expect(tabList.getAttribute("aria-orientation")).toBe("horizontal");
    });

    it("sets vertical orientation when specified", () => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel",
        orientation: "vertical"
      });

      expect(tabList.getAttribute("aria-orientation")).toBe("vertical");
    });

    it("sets ARIA attributes on tabs and panels", () => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });

      const tabs = document.querySelectorAll(".tab");
      const panels = document.querySelectorAll(".panel");

      tabs.forEach((tab, index) => {
        expect(tab.getAttribute("role")).toBe("tab");
        expect(tab.getAttribute("aria-controls")).toBe(panels[index].id);
        expect(tab.id).toBeTruthy();

        const panel = panels[index] as HTMLElement;
        expect(panel.getAttribute("role")).toBe("tabpanel");
        expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
      });
    });

    it("activates first tab by default", () => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });

      const tabs = document.querySelectorAll(".tab");
      const panels = document.querySelectorAll(".panel");

      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(tabs[0].getAttribute("tabindex")).toBe("0");
      expect((panels[0] as HTMLElement).hidden).toBe(false);

      // Other tabs should be inactive
      expect(tabs[1].getAttribute("aria-selected")).toBe("false");
      expect(tabs[1].getAttribute("tabindex")).toBe("-1");
      expect((panels[1] as HTMLElement).hidden).toBe(true);
    });

    it("generates IDs if missing", () => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });

      const tabs = document.querySelectorAll(".tab");
      const panels = document.querySelectorAll(".panel");

      tabs.forEach((tab, index) => {
        expect(tab.id).toMatch(/test-tabs-tab-\d+/);
        expect(panels[index].id).toMatch(/test-tabs-panel-\d+/);
      });
    });

    it("adds tabindex to panels without focusable content", () => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });

      const panels = document.querySelectorAll(".panel");

      panels.forEach((panel) => {
        expect(panel.getAttribute("tabindex")).toBe("0");
      });
    });

    it("does not add tabindex to panels with focusable content", () => {
      document.querySelector(".panel")!.innerHTML = '<button>Focusable</button>';

      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });

      const firstPanel = document.querySelectorAll(".panel")[0];
      expect(firstPanel.getAttribute("tabindex")).toBeNull();
    });

    it("returns cleanup function when tablist not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      tabsInstance = makeTabsAccessible({
        tabListId: "non-existent",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Element with id="non-existent" not found')
      );
      expect(typeof tabsInstance.cleanup).toBe("function");

      consoleErrorSpy.mockRestore();
    });

    it("returns cleanup function when tabs not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "non-existent",
        tabPanelsClass: "panel"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('No elements with class="non-existent" found')
      );

      consoleErrorSpy.mockRestore();
    });

    it("returns cleanup function when panels not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "non-existent"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('No elements with class="non-existent" found')
      );

      consoleErrorSpy.mockRestore();
    });

    it("returns cleanup function when tab/panel count mismatch", () => {
      document.body.innerHTML = `
        <div id="test-tabs">
          <button class="tab">Tab 1</button>
          <button class="tab">Tab 2</button>
        </div>
        <div class="panel">Panel 1</div>
      `;

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Tab/panel mismatch")
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("activateTab", () => {
    beforeEach(() => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });
    });

    it("activates the specified tab", () => {
      tabsInstance.activateTab!(1);

      const tabs = document.querySelectorAll(".tab");
      const panels = document.querySelectorAll(".panel");

      expect(tabs[1].getAttribute("aria-selected")).toBe("true");
      expect(tabs[1].getAttribute("tabindex")).toBe("0");
      expect((panels[1] as HTMLElement).hidden).toBe(false);
    });

    it("deactivates previously active tab", () => {
      tabsInstance.activateTab!(2);

      const tabs = document.querySelectorAll(".tab");
      const panels = document.querySelectorAll(".panel");

      expect(tabs[0].getAttribute("aria-selected")).toBe("false");
      expect(tabs[0].getAttribute("tabindex")).toBe("-1");
      expect((panels[0] as HTMLElement).hidden).toBe(true);
    });

    it("focuses tab when shouldFocus is true (default)", () => {
      tabsInstance.activateTab!(1);

      const tabs = document.querySelectorAll(".tab");
      expect(document.activeElement).toBe(tabs[1]);
    });

    it("does not focus tab when shouldFocus is false", () => {
      tabsInstance.activateTab!(1, false);

      const tabs = document.querySelectorAll(".tab");
      expect(document.activeElement).not.toBe(tabs[1]);
    });

    it("handles invalid index gracefully", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      tabsInstance.activateTab!(-1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Invalid tab index")
      );

      tabsInstance.activateTab!(999);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Invalid tab index")
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("keyboard navigation - horizontal", () => {
    beforeEach(() => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel",
        orientation: "horizontal"
      });
    });

    it("moves to next tab on ArrowRight", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      expect(tabs[1].getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(tabs[1]);
    });

    it("wraps to first tab on ArrowRight from last tab", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[3].focus();
      
      // Manually set activeTab to last tab for this test
      tabsInstance.activateTab!(3, false);
      
      tabs[3].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(tabs[0]);
    });

    it("moves to previous tab on ArrowLeft", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      
      tabsInstance.activateTab!(1, false);
      tabs[1].focus();
      tabs[1].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));

      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(tabs[0]);
    });

    it("wraps to last tab on ArrowLeft from first tab", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));

      expect(tabs[3].getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(tabs[3]);
    });

    it("does not respond to ArrowUp/ArrowDown in horizontal mode", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      // Should still be on first tab
      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    });
  });

  describe("keyboard navigation - vertical", () => {
    beforeEach(() => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel",
        orientation: "vertical"
      });
    });

    it("moves to next tab on ArrowDown", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      expect(tabs[1].getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(tabs[1]);
    });

    it("wraps to first tab on ArrowDown from last tab", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[3].focus();
      
      tabsInstance.activateTab!(3, false);
      
      tabs[3].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(tabs[0]);
    });

    it("moves to previous tab on ArrowUp", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      
      tabsInstance.activateTab!(1, false);
      tabs[1].focus();
      tabs[1].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(tabs[0]);
    });

    it("wraps to last tab on ArrowUp from first tab", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      expect(tabs[3].getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(tabs[3]);
    });

    it("does not respond to ArrowLeft/ArrowRight in vertical mode", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      // Should still be on first tab
      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    });
  });

  describe("keyboard navigation - common keys", () => {
    beforeEach(() => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });
    });

    it("moves to first tab on Home", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      
      tabsInstance.activateTab!(2, false);
      tabs[2].focus();
      tabs[2].dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));

      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(tabs[0]);
    });

    it("moves to last tab on End", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));

      expect(tabs[3].getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(tabs[3]);
    });

    it("activates tab on Enter in automatic activation mode", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

      // In automatic mode, Enter doesn't do anything special (already activated)
      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    });

    it("activates tab on Space in automatic activation mode", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    });
  });

  describe("manual activation mode", () => {
    beforeEach(() => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel",
        activateOnFocus: false
      });
    });

    it("does not activate tab on arrow key navigation", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      // Focus should move but tab should not be activated
      expect(document.activeElement).toBe(tabs[1]);
      expect(tabs[0].getAttribute("aria-selected")).toBe("true"); // First tab still active
      expect(tabs[1].getAttribute("aria-selected")).toBe("false");
    });

    it("activates tab on Enter", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
      tabs[1].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

      expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    });

    it("activates tab on Space", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
      tabs[1].dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

      expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    });
  });

  describe("click interaction", () => {
    beforeEach(() => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });
    });

    it("activates tab on click", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[2].click();

      expect(tabs[2].getAttribute("aria-selected")).toBe("true");
      expect(tabs[2].getAttribute("tabindex")).toBe("0");
    });

    it("deactivates other tabs on click", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[2].click();

      expect(tabs[0].getAttribute("aria-selected")).toBe("false");
      expect(tabs[1].getAttribute("aria-selected")).toBe("false");
      expect(tabs[3].getAttribute("aria-selected")).toBe("false");
    });
  });

  describe("callbacks", () => {
    it("calls onTabChange callback when tab changes", () => {
      const onTabChange = vi.fn();

      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel",
        callback: { onTabChange }
      });

      // First initialization doesn't trigger callback (previousIndex === activeIndex)
      expect(onTabChange).not.toHaveBeenCalled();

      tabsInstance.activateTab!(1);

      expect(onTabChange).toHaveBeenCalledWith(1, 0);
    });

    it("does not call onTabChange when same tab is activated", () => {
      const onTabChange = vi.fn();

      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel",
        callback: { onTabChange }
      });

      tabsInstance.activateTab!(0);

      expect(onTabChange).not.toHaveBeenCalled();
    });

    it("calls onContextMenu callback on Shift+F10", () => {
      const onContextMenu = vi.fn();

      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel",
        callback: { onContextMenu }
      });

      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      const event = new KeyboardEvent("keydown", { key: "F10", shiftKey: true, bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");
      
      tabs[1].dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(onContextMenu).toHaveBeenCalledWith(1, tabs[1]);
    });

    it("calls onContextMenu callback on contextmenu event (right-click)", () => {
      const onContextMenu = vi.fn();

      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel",
        callback: { onContextMenu }
      });

      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      const event = new MouseEvent("contextmenu", { bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");
      
      tabs[2].dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(onContextMenu).toHaveBeenCalledWith(2, tabs[2]);
    });

    it("does not add contextmenu listener if callback not provided", () => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });

      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      const event = new MouseEvent("contextmenu", { bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");
      
      tabs[2].dispatchEvent(event);

      // Should not prevent default if no callback
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it("handles errors in onTabChange callback gracefully", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const onTabChange = vi.fn(() => { throw new Error("Test error"); });

      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel",
        callback: { onTabChange }
      });

      tabsInstance.activateTab!(1);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error in tabs onTabChange callback"),
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("handles errors in onContextMenu callback gracefully", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const onContextMenu = vi.fn(() => { throw new Error("Test error"); });

      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel",
        callback: { onContextMenu }
      });

      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      tabs[0].dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error in tabs onContextMenu callback"),
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("cleanup", () => {
    beforeEach(() => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });
    });

    it("removes ARIA attributes from tablist", () => {
      tabsInstance.cleanup();

      expect(tabList.getAttribute("role")).toBeNull();
      expect(tabList.getAttribute("aria-orientation")).toBeNull();
    });

    it("removes ARIA attributes from tabs", () => {
      tabsInstance.cleanup();

      const tabs = document.querySelectorAll(".tab");

      tabs.forEach((tab) => {
        expect(tab.getAttribute("role")).toBeNull();
        expect(tab.getAttribute("aria-selected")).toBeNull();
        expect(tab.getAttribute("aria-controls")).toBeNull();
        expect(tab.getAttribute("tabindex")).toBeNull();
      });
    });

    it("removes ARIA attributes from panels", () => {
      tabsInstance.cleanup();

      const panels = document.querySelectorAll(".panel");

      panels.forEach((panel) => {
        expect(panel.getAttribute("role")).toBeNull();
        expect(panel.getAttribute("aria-labelledby")).toBeNull();
        expect(panel.getAttribute("tabindex")).toBeNull();
        expect((panel as HTMLElement).hidden).toBe(false);
      });
    });

    it("removes event listeners", () => {
      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      
      tabsInstance.cleanup();

      // Try triggering events - they should not work
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
      tabs[1].click();

      expect(tabs[0].getAttribute("aria-selected")).toBeNull();
    });
  });

  describe("refresh", () => {
    it("re-initializes with dynamically added tabs", () => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });

      // Add new tab and panel
      tabList.insertAdjacentHTML("beforeend", '<button class="tab">Tab 5</button>');
      document.body.insertAdjacentHTML("beforeend", '<div class="panel">Panel 5</div>');

      tabsInstance.refresh!();

      const tabs = document.querySelectorAll(".tab");
      const panels = document.querySelectorAll(".panel");

      expect(tabs).toHaveLength(5);
      expect(panels).toHaveLength(5);

      // New tab should have ARIA attributes
      expect(tabs[4].getAttribute("role")).toBe("tab");
      expect(panels[4].getAttribute("role")).toBe("tabpanel");
    });

    it("removes listeners from old tabs before re-initializing", () => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });

      const oldTab = document.querySelectorAll(".tab")[0] as HTMLElement;

      tabsInstance.refresh!();

      // Old event should still work after refresh (new listener added)
      oldTab.click();
      expect(oldTab.getAttribute("aria-selected")).toBe("true");
    });
  });

  describe("focus management from arrow navigation", () => {
    it("uses document.activeElement to determine current tab for navigation", () => {
      tabsInstance = makeTabsAccessible({
        tabListId: "test-tabs",
        tabsClass: "tab",
        tabPanelsClass: "panel"
      });

      const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLElement>;
      
      // Manually focus third tab without activating
      tabs[2].focus();
      tabs[2].setAttribute("tabindex", "0");
      tabs[0].setAttribute("tabindex", "-1");

      // Press ArrowRight - should move from tab 2 to tab 3
      tabs[2].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      expect(document.activeElement).toBe(tabs[3]);
      expect(tabs[3].getAttribute("aria-selected")).toBe("true");
    });
  });
});
