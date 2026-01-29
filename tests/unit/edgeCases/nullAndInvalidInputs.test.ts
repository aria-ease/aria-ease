import { describe, it, beforeEach, expect, vi } from "vitest";
import { makeMenuAccessible } from "../../../src/menu";
import { makeBlockAccessible } from "../../../src/block";
import { makeCheckboxAccessible } from "../../../src/checkbox";
import { makeRadioAccessible } from "../../../src/radio";
import { makeToggleAccessible } from "../../../src/toggle";
import { makeAccordionAccessible } from "../../../src/accordion";

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
        makeBlockAccessible({ blockId: "non-existent-block", blockItemsClass: "items" });
      }).not.toThrow();
    });

    it("handles non-existent block items", () => {
      document.body.innerHTML = `<div id="block"></div>`;
      
      expect(() => {
        makeBlockAccessible({ blockId: "block", blockItemsClass: "non-existent-items" });
      }).not.toThrow();
    });

    it("handles empty block (no items)", () => {
      document.body.innerHTML = `<div id="block"></div>`;
      
      expect(() => {
        makeBlockAccessible({ blockId: "block", blockItemsClass: "items" });
      }).not.toThrow();
    });
  });

  describe("makeCheckboxAccessible", () => {
    it("handles non-existent container", () => {
      const result = makeCheckboxAccessible({ checkboxGroupId: "non-existent", checkboxesClass: "checkbox" });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Element with id="non-existent" not found')
      );
      expect(result.cleanup).toBeDefined();
    });

    it("handles no checkboxes in container", () => {
      document.body.innerHTML = `
        <div id="container"></div>
      `;
      const result = makeCheckboxAccessible({ checkboxGroupId: "container", checkboxesClass: "checkbox" });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('No elements with class="checkbox" found')
      );
      expect(result.cleanup).toBeDefined();
    });

    it("handles out of bounds index", () => {
      document.body.innerHTML = `
        <div id="container">
          <button class="checkbox" aria-checked="false">Check</button>
        </div>
      `;
      const group = makeCheckboxAccessible({ checkboxGroupId: "container", checkboxesClass: "checkbox" });
      group.setCheckboxState(5, true);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Invalid checkbox index: 5')
      );
    });

    it("handles negative index", () => {
      document.body.innerHTML = `
        <div id="container">
          <button class="checkbox" aria-checked="false">Check</button>
        </div>
      `;
      const group = makeCheckboxAccessible({ checkboxGroupId: "container", checkboxesClass: "checkbox" });
      group.setCheckboxState(-1, true);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Invalid checkbox index: -1')
      );
    });
  });

  describe("makeRadioAccessible", () => {
    it("handles non-existent container", () => {
      const result = makeRadioAccessible({ radioGroupId: "non-existent", radiosClass: "radio" });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Element with id="non-existent" not found')
      );
      expect(result.cleanup).toBeDefined();
    });

    it("handles no radios in container", () => {
      document.body.innerHTML = `<div id="container"></div>`;
      const result = makeRadioAccessible({ radioGroupId: "container", radiosClass: "radio" });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('No elements with class="radio" found')
      );
      expect(result.cleanup).toBeDefined();
    });
  });

  describe("makeToggleAccessible", () => {
    it("handles non-existent container", () => {
      const result = makeToggleAccessible({ toggleId: "non-existent", togglesClass: "toggle", isSingleToggle: false });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Element with id="non-existent" not found')
      );
      expect(result.cleanup).toBeDefined();
    });

    it("handles no toggles in container", () => {
      document.body.innerHTML = `<div id="container"></div>`;
      const result = makeToggleAccessible({ toggleId: "container", togglesClass: "toggle", isSingleToggle: false });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('No elements with class="toggle" found')
      );
      expect(result.cleanup).toBeDefined();
    });

    it("handles out of bounds index", () => {
      document.body.innerHTML = `
        <div id="container">
          <button class="toggle" aria-pressed="false">Toggle 1</button>
        </div>
      `;
      const group = makeToggleAccessible({ toggleId: "container", togglesClass: "toggle", isSingleToggle: false });
      group.setPressed(5, true);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Invalid toggle index: 5')
      );
    });
  });

  describe("makeAccordionAccessible", () => {
    it("handles non-existent container", () => {
      const result = makeAccordionAccessible({ accordionId: "non-existent", triggersClass: "trigger", panelsClass: "panel" });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Element with id="non-existent" not found')
      );
      expect(result.cleanup).toBeDefined();
    });

    it("handles no triggers in container", () => {
      document.body.innerHTML = `<div id="container"></div>`;
      const result = makeAccordionAccessible({ accordionId: "container", triggersClass: "trigger", panelsClass: "panel" });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('No elements with class="trigger" found')
      );
      expect(result.cleanup).toBeDefined();
    });

    it("handles no panels in container", () => {
      document.body.innerHTML = `<div id="container"><button class="trigger"></button></div>`;
      const result = makeAccordionAccessible({ accordionId: "container", triggersClass: "trigger", panelsClass: "panel" });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('No elements with class="panel" found')
      );
      expect(result.cleanup).toBeDefined();
    });

    it("handles trigger/panel count mismatch", () => {
      document.body.innerHTML = `<div id="container"><button class="trigger"></button><div class="panel"></div><div class="panel"></div></div>`;
      const result = makeAccordionAccessible({ accordionId: "container", triggersClass: "trigger", panelsClass: "panel" });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Accordion trigger/panel mismatch')
      );
      expect(result.cleanup).toBeDefined();
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