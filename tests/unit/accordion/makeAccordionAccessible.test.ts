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

    it("closes other items when allowMultiple is false", () => {
      accordionInstance.expandItem!(0);
      accordionInstance.toggleItem!(1);

      const trigger0 = accordionContainer.querySelectorAll(".accordion-trigger")[0] as HTMLElement;
      const trigger1 = accordionContainer.querySelectorAll(".accordion-trigger")[1] as HTMLElement;

      expect(trigger0.getAttribute("aria-expanded")).toBe("false");
      expect(trigger1.getAttribute("aria-expanded")).toBe("true");
    });

    it("keeps other items open when allowMultiple is true", () => {
      accordionInstance.cleanup();
      accordionInstance = makeAccordionAccessible({
        accordionId: "test-accordion",
        triggersClass: "accordion-trigger",
        panelsClass: "accordion-panel",
        allowMultiple: true
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
});
