import { describe, it, beforeEach, expect, vi } from "vitest";
import { makeMenuAccessible } from "../../../src/menu";
import { makeBlockAccessible } from "../../../src/block";
import { updateCheckboxAriaAttributes } from "../../../src/checkbox";
import { updateRadioAriaAttributes } from "../../../src/radio";
import { updateToggleAriaAttribute } from "../../../src/toggle";
import { updateAccordionTriggerAriaAttributes } from "../../../src/accordion";

describe("Edge Cases - Null and Invalid Inputs", () => {
  beforeEach(() => {
    // Clear all mocks and spy on console.error
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe("makeMenuAccessible", () => {
    it("handles non-existent menu element", () => {
      document.body.innerHTML = `<button id="trigger">Button</button>`;
      
      const result = makeMenuAccessible({
        menuId: "non-existent-menu",
        menuItemsClass: "items",
        triggerId: "trigger"
      });

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Element with id="non-existent-menu" not found')
      );
      expect(result.openMenu).toBeDefined();
      expect(result.closeMenu).toBeDefined();
      expect(result.cleanup).toBeDefined();
    });

    it("handles non-existent trigger element", () => {
      document.body.innerHTML = `<div id="menu"></div>`;
      
      const result = makeMenuAccessible({
        menuId: "menu",
        menuItemsClass: "items",
        triggerId: "non-existent-trigger"
      });

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Element with id="non-existent-trigger" not found')
      );
      expect(result).toBeDefined();
    });

    it("handles empty menu (no items)", () => {
      document.body.innerHTML = `
        <button id="trigger" aria-expanded="false">Menu</button>
        <div id="menu" style="display:none"></div>
      `;

      const menu = makeMenuAccessible({
        menuId: "menu",
        menuItemsClass: "items",
        triggerId: "trigger"
      });

      // Should not crash
      expect(() => menu.openMenu()).not.toThrow();
      expect(() => menu.closeMenu()).not.toThrow();
      expect(() => menu.cleanup()).not.toThrow();
    });

    it("handles submenu with non-existent trigger", () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      
      document.body.innerHTML = `
        <button id="trigger" aria-expanded="false">Menu</button>
        <div id="menu" style="display:none">
          <button class="items" aria-haspopup="true" aria-controls="submenu">Item</button>
        </div>
      `;

      const menu = makeMenuAccessible({
        menuId: "menu",
        menuItemsClass: "items",
        triggerId: "trigger"
      });

      menu.openMenu();
      
      const item = document.querySelector(".items") as HTMLElement;
      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
      item.dispatchEvent(event);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Submenu element with id="submenu" not found')
      );
    });

    it("handles submenu trigger without ID", () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      document.body.innerHTML = `
        <button id="trigger" aria-expanded="false">Menu</button>
        <div id="menu" style="display:none">
          <button class="items" aria-haspopup="true" aria-controls="submenu">Item</button>
        </div>
        <div id="submenu" style="display:none">
          <button class="items">Sub Item</button>
        </div>
      `;

      const menu = makeMenuAccessible({
        menuId: "menu",
        menuItemsClass: "items",
        triggerId: "trigger"
      });

      menu.openMenu();
      
      const item = document.querySelector(".items") as HTMLElement;
      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
      item.dispatchEvent(event);

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Auto-generated ID:')
      );
    });
  });

  describe("makeBlockAccessible", () => {
    it("handles non-existent block element", () => {
      expect(() => {
        makeBlockAccessible("non-existent-block", "items");
      }).not.toThrow();
    });

    it("handles non-existent block items", () => {
      document.body.innerHTML = `<div id="block"></div>`;
      
      expect(() => {
        makeBlockAccessible("block", "non-existent-items");
      }).not.toThrow();
    });

    it("handles empty block (no items)", () => {
      document.body.innerHTML = `<div id="block"></div>`;
      
      expect(() => {
        makeBlockAccessible("block", "items");
      }).not.toThrow();
    });
  });

  describe("updateCheckboxAriaAttributes", () => {
    it("handles non-existent container", () => {
      updateCheckboxAriaAttributes("non-existent", "checkbox", [], 0);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Invalid checkbox main div id provided')
      );
    });

    it("handles empty array of states", () => {
      document.body.innerHTML = `
        <div id="container">
          <button class="checkbox" aria-checked="false">Check</button>
        </div>
      `;

      // Should handle gracefully with error message
      updateCheckboxAriaAttributes("container", "checkbox", [], 0);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Checkbox states array is empty')
      );
    });

    it("handles out of bounds index", () => {
      document.body.innerHTML = `
        <div id="container">
          <button class="checkbox" aria-checked="false">Check</button>
        </div>
      `;

      updateCheckboxAriaAttributes("container", "checkbox", [{ checked: true }], 5);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Checkbox index 5 is out of bounds')
      );
    });

    it("handles negative index", () => {
      document.body.innerHTML = `
        <div id="container">
          <button class="checkbox" aria-checked="false">Check</button>
        </div>
      `;

      updateCheckboxAriaAttributes("container", "checkbox", [{ checked: true }], -1);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Checkbox index -1 is out of bounds')
      );
    });
  });

  describe("updateRadioAriaAttributes", () => {
    it("handles non-existent container", () => {
      updateRadioAriaAttributes("non-existent", "radio", [], 0);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Element with id="non-existent" not found')
      );
    });

    it("handles empty items", () => {
      document.body.innerHTML = `<div id="container"></div>`;
      
      updateRadioAriaAttributes("container", "radio", [], 0);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Element with class="radio" not found.')
      );
    });
  });

  describe("updateToggleAriaAttribute", () => {
    it("handles length mismatch between items and states", () => {
      document.body.innerHTML = `
        <div id="container">
          <button class="toggle" aria-pressed="false">Toggle 1</button>
          <button class="toggle" aria-pressed="false">Toggle 2</button>
        </div>
      `;

      updateToggleAriaAttribute(
        "container", 
        "toggle", 
        [{ pressed: true }],  // Only 1 state but 2 elements
        0
      );
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Toggle state/DOM length mismatch')
      );
    });
  });

  describe("updateAccordionTriggerAriaAttributes", () => {
    it("handles length mismatch between triggers and states", () => {
      document.body.innerHTML = `
        <div id="container">
          <button class="trigger" aria-expanded="false">Trigger 1</button>
          <button class="trigger" aria-expanded="false">Trigger 2</button>
        </div>
      `;

      updateAccordionTriggerAriaAttributes(
        "container",
        "trigger",
        [{ display: true }],  // Only 1 state but 2 triggers
        0
      );
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Accordion state/DOM length mismatch')
      );
    });

    it("handles non-existent container", () => {
      updateAccordionTriggerAriaAttributes("non-existent", "trigger", [], 0);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(' Element with id="non-existent" not found.')
      );
    });
  });

  describe("Special Characters in Selectors", () => {
    it("handles IDs with special characters (underscores and hyphens)", () => {
      document.body.innerHTML = `
        <button id="trigger_special-btn" aria-expanded="false">Menu</button>
        <div id="menu_special-div" style="display:none">
          <button class="items">Item</button>
        </div>
      `;

      // Test with valid CSS selector characters (underscores and hyphens)
      const result = makeMenuAccessible({
        menuId: "menu_special-div",
        menuItemsClass: "items",
        triggerId: "trigger_special-btn"
      });

      expect(result).toBeDefined();
      expect(result.openMenu).toBeDefined();
      expect(result.closeMenu).toBeDefined();
    });
  });

  describe("Concurrent Operations", () => {
    it("handles multiple rapid open/close calls", () => {
      document.body.innerHTML = `
        <button id="trigger" aria-expanded="false">Menu</button>
        <div id="menu" style="display:none">
          <button class="items">Item 1</button>
        </div>
      `;

      const menu = makeMenuAccessible({
        menuId: "menu",
        menuItemsClass: "items",
        triggerId: "trigger"
      });

      // Rapid operations shouldn't cause errors
      menu.openMenu();
      menu.closeMenu();
      menu.openMenu();
      menu.closeMenu();
      menu.openMenu();

      const menuDiv = document.getElementById("menu")!;
      expect(menuDiv.style.display).toBe("block");
    });
  });
});
