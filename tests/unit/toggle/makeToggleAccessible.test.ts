import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { makeToggleAccessible } from "../../../src/toggle";

describe("makeToggleAccessible", () => {
  let toggleInstance: ReturnType<typeof makeToggleAccessible>;

  afterEach(() => {
    if (toggleInstance) {
      toggleInstance.cleanup();
    }
  });

  describe("single toggle", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <button id="test-toggle">Toggle Me</button>
      `;
    });

    it("initializes ARIA attributes on single toggle", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle"
      });

      const toggle = document.getElementById("test-toggle")!;
      expect(toggle.getAttribute("aria-pressed")).toBe("false");
      expect(toggle.getAttribute("tabindex")).toBe("0");
    });

    it("toggles button state", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle"
      });

      toggleInstance.toggleButton!(0);
      const toggle = document.getElementById("test-toggle")!;
      expect(toggle.getAttribute("aria-pressed")).toBe("true");

      toggleInstance.toggleButton!(0);
      expect(toggle.getAttribute("aria-pressed")).toBe("false");
    });

    it("sets pressed state explicitly", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle"
      });

      const toggle = document.getElementById("test-toggle")!;

      toggleInstance.setPressed!(0, true);
      expect(toggle.getAttribute("aria-pressed")).toBe("true");

      toggleInstance.setPressed!(0, false);
      expect(toggle.getAttribute("aria-pressed")).toBe("false");
    });

    it("toggles on Enter key", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle"
      });

      const toggle = document.getElementById("test-toggle")!;
      toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

      expect(toggle.getAttribute("aria-pressed")).toBe("true");
    });

    it("toggles on Space key", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle"
      });

      const toggle = document.getElementById("test-toggle")!;
      toggle.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

      expect(toggle.getAttribute("aria-pressed")).toBe("true");
    });

    it("toggles on click", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle"
      });

      const toggle = document.getElementById("test-toggle")!;
      toggle.click();

      expect(toggle.getAttribute("aria-pressed")).toBe("true");
    });

    it("does not navigate on arrow keys for single toggle", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle"
      });

      const toggle = document.getElementById("test-toggle")!;
      toggle.focus();
      
      // Arrow keys should not affect single toggle
      toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      expect(document.activeElement).toBe(toggle);
    });
  });

  describe("toggle group", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="test-toggle-group">
          <button class="toggle-button">Bold</button>
          <button class="toggle-button">Italic</button>
          <button class="toggle-button">Underline</button>
        </div>
      `;
    });

    it("initializes ARIA attributes on all toggles", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      const toggles = document.querySelectorAll(".toggle-button");
      toggles.forEach((toggle) => {
        expect(toggle.getAttribute("aria-pressed")).toBe("false");
        expect(toggle.getAttribute("tabindex")).toBe("0");
      });
    });

    it("sets role=button on non-button elements", () => {
      document.body.innerHTML = `
        <div id="test-toggle-group">
          <div class="toggle-button">Bold</div>
          <div class="toggle-button">Italic</div>
        </div>
      `;

      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      const toggles = document.querySelectorAll(".toggle-button");
      toggles.forEach((toggle) => {
        expect(toggle.getAttribute("role")).toBe("button");
      });
    });

    it("does not override button elements", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      const toggle = document.querySelectorAll(".toggle-button")[0];
      expect(toggle.getAttribute("role")).toBeNull();
    });

    it("toggles individual buttons independently", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      toggleInstance.toggleButton!(0);
      toggleInstance.toggleButton!(2);

      const toggles = document.querySelectorAll(".toggle-button");
      expect(toggles[0].getAttribute("aria-pressed")).toBe("true");
      expect(toggles[1].getAttribute("aria-pressed")).toBe("false");
      expect(toggles[2].getAttribute("aria-pressed")).toBe("true");
    });

    it("returns pressed states", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      expect(toggleInstance.getPressedStates!()).toEqual([false, false, false]);

      toggleInstance.toggleButton!(1);
      expect(toggleInstance.getPressedStates!()).toEqual([false, true, false]);
    });

    it("returns pressed indices", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      expect(toggleInstance.getPressedIndices!()).toEqual([]);

      toggleInstance.toggleButton!(0);
      toggleInstance.toggleButton!(2);
      expect(toggleInstance.getPressedIndices!()).toEqual([0, 2]);
    });

    it("navigates with ArrowDown", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      const toggles = document.querySelectorAll(".toggle-button");
      const toggle0 = toggles[0] as HTMLElement;
      const toggle1 = toggles[1] as HTMLElement;

      toggle0.focus();
      toggle0.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      expect(document.activeElement).toBe(toggle1);
    });

    it("navigates with ArrowRight", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      const toggles = document.querySelectorAll(".toggle-button");
      const toggle0 = toggles[0] as HTMLElement;
      const toggle1 = toggles[1] as HTMLElement;

      toggle0.focus();
      toggle0.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      expect(document.activeElement).toBe(toggle1);
    });

    it("navigates with ArrowUp", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      const toggles = document.querySelectorAll(".toggle-button");
      const toggle0 = toggles[0] as HTMLElement;
      const toggle1 = toggles[1] as HTMLElement;

      toggle1.focus();
      toggle1.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      expect(document.activeElement).toBe(toggle0);
    });

    it("navigates with ArrowLeft", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      const toggles = document.querySelectorAll(".toggle-button");
      const toggle0 = toggles[0] as HTMLElement;
      const toggle1 = toggles[1] as HTMLElement;

      toggle1.focus();
      toggle1.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));

      expect(document.activeElement).toBe(toggle0);
    });

    it("focuses first toggle on Home", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      const toggles = document.querySelectorAll(".toggle-button");
      const toggle0 = toggles[0] as HTMLElement;
      const toggle2 = toggles[2] as HTMLElement;

      toggle2.focus();
      toggle2.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));

      expect(document.activeElement).toBe(toggle0);
    });

    it("focuses last toggle on End", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      const toggles = document.querySelectorAll(".toggle-button");
      const toggle0 = toggles[0] as HTMLElement;
      const toggle2 = toggles[2] as HTMLElement;

      toggle0.focus();
      toggle0.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));

      expect(document.activeElement).toBe(toggle2);
    });

    it("wraps around from last to first", () => {
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      const toggles = document.querySelectorAll(".toggle-button");
      const toggle0 = toggles[0] as HTMLElement;
      const toggle2 = toggles[2] as HTMLElement;

      toggle2.focus();
      toggle2.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      expect(document.activeElement).toBe(toggle0);
    });
  });

  describe("error handling", () => {
    it("returns cleanup function when container not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      toggleInstance = makeToggleAccessible({
        toggleId: "non-existent"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Element with id=\"non-existent\" not found")
      );
      expect(typeof toggleInstance.cleanup).toBe("function");

      consoleErrorSpy.mockRestore();
    });

    it("returns cleanup function when togglesClass missing for group", () => {
      document.body.innerHTML = `<div id="test-group"></div>`;
      
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      toggleInstance = makeToggleAccessible({
        toggleId: "test-group",
        isSingleToggle: false
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("togglesClass is required when isSingleToggle is false")
      );

      consoleErrorSpy.mockRestore();
    });

    it("returns cleanup function when toggles not found in group", () => {
      document.body.innerHTML = `<div id="test-group"></div>`;
      
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      toggleInstance = makeToggleAccessible({
        toggleId: "test-group",
        togglesClass: "non-existent",
        isSingleToggle: false
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("No elements with class=\"non-existent\" found")
      );

      consoleErrorSpy.mockRestore();
    });

    it("handles invalid index gracefully", () => {
      document.body.innerHTML = `<button id="test-toggle">Toggle</button>`;
      
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle"
      });

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      toggleInstance.toggleButton!(-1);
      toggleInstance.toggleButton!(999);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      consoleErrorSpy.mockRestore();
    });
  });

  describe("cleanup", () => {
    it("removes event listeners from single toggle", () => {
      document.body.innerHTML = `<button id="test-toggle">Toggle</button>`;
      
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle"
      });

      const toggle = document.getElementById("test-toggle")!;
      
      toggleInstance.cleanup();

      const initialPressed = toggle.getAttribute("aria-pressed");
      toggle.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
      
      expect(toggle.getAttribute("aria-pressed")).toBe(initialPressed);
    });

    it("removes event listeners from toggle group", () => {
      document.body.innerHTML = `
        <div id="test-toggle-group">
          <button class="toggle-button">Bold</button>
          <button class="toggle-button">Italic</button>
        </div>
      `;
      
      toggleInstance = makeToggleAccessible({
        toggleId: "test-toggle-group",
        togglesClass: "toggle-button",
        isSingleToggle: false
      });

      toggleInstance.cleanup();

      const toggle = document.querySelectorAll(".toggle-button")[0] as HTMLElement;
      const initialPressed = toggle.getAttribute("aria-pressed");
      toggle.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
      
      expect(toggle.getAttribute("aria-pressed")).toBe(initialPressed);
    });
  });
});
