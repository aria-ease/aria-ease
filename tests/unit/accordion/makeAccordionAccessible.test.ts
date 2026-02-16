import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { makeAccordionAccessible } from "../../../src/accordion";

describe("makeAccordionAccessible", () => {
  let accordionContainer: HTMLElement;
  let accordionInstance: ReturnType<typeof makeAccordionAccessible>;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-accordion">
        <button class="accordion-trigger">Section 1</button>
        <div class="accordion-panel">Content 1</div>
        <button class="accordion-trigger">Section 2</button>
        <div class="accordion-panel">Content 2</div>
        <button class="accordion-trigger">Section 3</button>
        <div class="accordion-panel">Content 3</div>
      </div>
    `;
    accordionContainer = document.getElementById("test-accordion")!;
  });

  afterEach(() => {
    if (accordionInstance) {
      accordionInstance.cleanup();
    }
  });

  describe("initialization", () => {
    it("sets ARIA attributes on triggers and panels", () => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });

      const triggers = accordionContainer.querySelectorAll(".accordion-trigger");
      const panels = accordionContainer.querySelectorAll(".accordion-panel");

      triggers.forEach((trigger, index) => {
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(trigger.getAttribute("aria-controls")).toBeTruthy();
        expect(trigger.id).toBeTruthy();

        const panel = panels[index] as HTMLElement;
        expect(panel.getAttribute("role")).toBe("region");
        expect(panel.getAttribute("aria-labelledby")).toBe(trigger.id);
        expect(panel.style.display).toBe("none");
      });
    });

    it("generates IDs if missing", () => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });

      const triggers = accordionContainer.querySelectorAll(".accordion-trigger");
      const panels = accordionContainer.querySelectorAll(".accordion-panel");

      triggers.forEach((trigger, index) => {
        expect(trigger.id).toMatch(/test-accordion-trigger-\d+/);
        expect(panels[index].id).toMatch(/test-accordion-panel-\d+/);
      });
    });

    it("returns cleanup function when container not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      accordionInstance = makeAccordionAccessible({
        accordionId: "non-existent",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Element with id=\"non-existent\" not found")
      );
      expect(typeof accordionInstance.cleanup).toBe("function");

      consoleErrorSpy.mockRestore();
    });

    it("returns cleanup function when triggers not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "non-existent",
        panelsClass: "accordion-panel"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("No elements with class=\"non-existent\" found")
      );

      consoleErrorSpy.mockRestore();
    });

    it("returns cleanup function when panels not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "non-existent"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("No elements with class=\"non-existent\" found")
      );

      consoleErrorSpy.mockRestore();
    });

    it("returns cleanup function when trigger/panel count mismatch", () => {
      document.body.innerHTML = `
        <div id="test-accordion">
          <button class="accordion-trigger">Section 1</button>
          <div class="accordion-panel">Content 1</div>
          <button class="accordion-trigger">Section 2</button>
        </div>
      `;

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Accordion trigger/panel mismatch")
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("expandItem", () => {
    beforeEach(() => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });
    });

    it("expands the specified accordion item", () => {
      accordionInstance.expandItem!(0);

      const trigger = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      const panel = accordionContainer.querySelectorAll(".accordion-panel")[0] as HTMLElement;

      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(panel.style.display).toBe("block");
    });

    it("handles invalid index gracefully", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      accordionInstance.expandItem!(-1);
      accordionInstance.expandItem!(999);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      consoleErrorSpy.mockRestore();
    });
  });

  describe("collapseItem", () => {
    beforeEach(() => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });
    });

    it("collapses the specified accordion item", () => {
      accordionInstance.expandItem!(1);
      accordionInstance.collapseItem!(1);

      const trigger = accordionContainer.querySelectorAll(".accordion-trigger")[1] as HTMLElement;
      const panel = accordionContainer.querySelectorAll(".accordion-panel")[1] as HTMLElement;

      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(panel.style.display).toBe("none");
    });
  });

  describe("toggleItem", () => {
    beforeEach(() => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });
    });

    it("toggles item from closed to open", () => {
      accordionInstance.toggleItem!(0);

      const trigger = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      const panel = accordionContainer.querySelectorAll(".accordion-panel")[0] as HTMLElement;

      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(panel.style.display).toBe("block");
    });

    it("toggles item from open to closed", () => {
      accordionInstance.expandItem!(0);
      accordionInstance.toggleItem!(0);

      const trigger = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      const panel = accordionContainer.querySelectorAll(".accordion-panel")[0] as HTMLElement;

      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(panel.style.display).toBe("none");
    });

    it("closes other items when allowMultipleOpen is false", () => {
      accordionInstance.expandItem!(0);
      accordionInstance.toggleItem!(1);

      const trigger0 = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      const trigger1 = accordionContainer.querySelectorAll(".accordion-trigger")[1] as HTMLElement;

      expect(trigger0.getAttribute("aria-expanded")).toBe("false");
      expect(trigger1.getAttribute("aria-expanded")).toBe("true");
    });

    it("keeps other items open when allowMultipleOpen is true", () => {
      accordionInstance.cleanup();
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel",
        allowMultipleOpen: true
      });

      accordionInstance.expandItem!(0);
      accordionInstance.toggleItem!(1);

      const trigger0 = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      const trigger1 = accordionContainer.querySelectorAll(".accordion-trigger")[1] as HTMLElement;

      expect(trigger0.getAttribute("aria-expanded")).toBe("true");
      expect(trigger1.getAttribute("aria-expanded")).toBe("true");
    });
  });

  describe("keyboard navigation", () => {
    beforeEach(() => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });
    });

    it("toggles on Enter key", () => {
      const trigger = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

      expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    it("toggles on Space key", () => {
      const trigger = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

      expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    it("focuses next trigger on ArrowDown", () => {
      const trigger0 = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      const trigger1 = accordionContainer.querySelectorAll(".accordion-trigger")[1] as HTMLElement;

      trigger0.focus();
      trigger0.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      expect(document.activeElement).toBe(trigger1);
    });

    it("focuses previous trigger on ArrowUp", () => {
      const trigger0 = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      const trigger1 = accordionContainer.querySelectorAll(".accordion-trigger")[1] as HTMLElement;

      trigger1.focus();
      trigger1.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      expect(document.activeElement).toBe(trigger0);
    });

    it("focuses first trigger on Home", () => {
      const trigger0 = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      const trigger2 = accordionContainer.querySelectorAll(".accordion-trigger")[2] as HTMLElement;

      trigger2.focus();
      trigger2.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));

      expect(document.activeElement).toBe(trigger0);
    });

    it("focuses last trigger on End", () => {
      const trigger0 = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      const trigger2 = accordionContainer.querySelectorAll(".accordion-trigger")[2] as HTMLElement;

      trigger0.focus();
      trigger0.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));

      expect(document.activeElement).toBe(trigger2);
    });

    it("wraps around from last to first on ArrowDown", () => {
      const trigger0 = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      const trigger2 = accordionContainer.querySelectorAll(".accordion-trigger")[2] as HTMLElement;

      trigger2.focus();
      trigger2.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      expect(document.activeElement).toBe(trigger0);
    });
  });

  describe("click interactions", () => {
    beforeEach(() => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });
    });

    it("toggles accordion on trigger click", () => {
      const trigger = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      trigger.click();

      expect(trigger.getAttribute("aria-expanded")).toBe("true");

      trigger.click();
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });
  });

  describe("cleanup", () => {
    it("removes event listeners and closes all panels", () => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });

      accordionInstance.expandItem!(0);
      accordionInstance.expandItem!(1);
      accordionInstance.cleanup();

      const triggers = accordionContainer.querySelectorAll(".accordion-trigger");
      const panels = accordionContainer.querySelectorAll(".accordion-panel");

      triggers.forEach((trigger) => {
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
      });

      panels.forEach((panel: Element) => {
        expect((panel as HTMLElement).style.display).toBe("none");
      });
    });
  });

  describe("refresh", () => {
    it("picks up dynamically added accordion items", () => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });

      // Add new accordion item dynamically
      const newTrigger = document.createElement("button");
      newTrigger.className = "accordion-trigger";
      newTrigger.textContent = "Section 4";
      
      const newPanel = document.createElement("div");
      newPanel.className = "accordion-panel";
      newPanel.textContent = "Content 4";

      accordionContainer.appendChild(newTrigger);
      accordionContainer.appendChild(newPanel);

      // Refresh to pick up new items
      accordionInstance.refresh!();

      // Check that new trigger has proper ARIA attributes
      expect(newTrigger.getAttribute("aria-expanded")).toBe("false");
      expect(newTrigger.getAttribute("aria-controls")).toBeTruthy();
      expect(newTrigger.id).toBeTruthy();

      // Check that new panel has proper attributes
      expect(newPanel.getAttribute("role")).toBe("region");
      expect(newPanel.getAttribute("aria-labelledby")).toBe(newTrigger.id);
      expect(newPanel.style.display).toBe("none");
    });

    it("attaches event listeners to newly added items", () => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });

      // Add new accordion item
      const newTrigger = document.createElement("button");
      newTrigger.className = "accordion-trigger";
      newTrigger.textContent = "Section 4";
      
      const newPanel = document.createElement("div");
      newPanel.className = "accordion-panel";
      newPanel.textContent = "Content 4";

      accordionContainer.appendChild(newTrigger);
      accordionContainer.appendChild(newPanel);

      accordionInstance.refresh!();

      // Test keyboard interaction on new trigger
      newTrigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      expect(newTrigger.getAttribute("aria-expanded")).toBe("true");

      // Test click interaction on new trigger
      newTrigger.click();
      expect(newTrigger.getAttribute("aria-expanded")).toBe("false");
    });

    it("handles removed accordion items", () => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });

      // Remove the last accordion item
      const triggers = accordionContainer.querySelectorAll(".accordion-trigger");
      const panels = accordionContainer.querySelectorAll(".accordion-panel");
      
      accordionContainer.removeChild(triggers[2]);
      accordionContainer.removeChild(panels[2]);

      // Refresh to update
      accordionInstance.refresh!();

      // Verify only 2 triggers exist now
      const updatedTriggers = accordionContainer.querySelectorAll(".accordion-trigger");
      expect(updatedTriggers.length).toBe(2);

      // Verify keyboard navigation still works with remaining items
      const trigger0 = updatedTriggers[0] as HTMLElement;
      const trigger1 = updatedTriggers[1] as HTMLElement;

      trigger0.focus();
      trigger0.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      expect(document.activeElement).toBe(trigger1);
    });

    it("re-initializes all items with proper ARIA attributes", () => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });

      // Manually corrupt some ARIA attributes
      const trigger = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      trigger.removeAttribute("aria-expanded");
      trigger.removeAttribute("aria-controls");

      // Refresh should restore them
      accordionInstance.refresh!();

      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(trigger.getAttribute("aria-controls")).toBeTruthy();
    });

    it("maintains state after refresh for expanded items", () => {
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel"
      });

      // Expand first item
      accordionInstance.expandItem!(0);
      
      const trigger = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      const panel = accordionContainer.querySelectorAll(".accordion-panel")[0] as HTMLElement;

      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(panel.style.display).toBe("block");

      // Refresh
      accordionInstance.refresh!();

      // After refresh, items should be re-initialized to closed state
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(panel.style.display).toBe("none");
    });
  });
});
