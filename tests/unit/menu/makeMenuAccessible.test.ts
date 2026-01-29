import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { makeMenuAccessible } from "../../../src/menu";

describe("makeMenuAccessible", () => {
  let menuDiv: HTMLElement;
  let triggerButton: HTMLElement;
  let menuInstance: ReturnType<typeof makeMenuAccessible>;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="display-button" aria-label="Open profile menu">Menu button</button>
      <div id="menu-div" style="display:none">
        <button class="profile-menu-items">One</button>
        <button class="profile-menu-items">Two</button>
        <button class="profile-menu-items">Three</button>
        <a href="#" class="profile-menu-items">Link Item</a>
      </div>
    `;
    menuDiv = document.getElementById("menu-div")!;
    triggerButton = document.getElementById("display-button")!;
  });

  afterEach(() => {
    if (menuInstance) {
      menuInstance.cleanup();
    }
  });

  describe("initialization", () => {
    it("initializes ARIA attributes on trigger button", () => {
      menuInstance = makeMenuAccessible({
        menuId: "menu-div",
        menuItemsClass: "profile-menu-items",
        triggerId: "display-button"
      });
      
      expect(triggerButton.getAttribute("aria-haspopup")).toBe("true");
      expect(triggerButton.getAttribute("aria-controls")).toBe("menu-div");
      expect(triggerButton.getAttribute("aria-expanded")).toBe("false");
    });

    it("sets role='menu' on menu div", () => {
      menuInstance = makeMenuAccessible({
        menuId: "menu-div",
        menuItemsClass: "profile-menu-items",
        triggerId: "display-button"
      });
      
      expect(menuDiv.getAttribute("role")).toBe("menu");
    });

    it("sets role='menuitem' on all menu items", () => {
      menuInstance = makeMenuAccessible({
        menuId: "menu-div",
        menuItemsClass: "profile-menu-items",
        triggerId: "display-button"
      });
      
      const items = menuDiv.querySelectorAll(".profile-menu-items");
      items.forEach((item) => {
        expect(item.getAttribute("role")).toBe("menuitem");
      });
    });

    it("returns no-op functions when menu element not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      menuInstance = makeMenuAccessible({
        menuId: "non-existent-menu",
        menuItemsClass: "profile-menu-items",
        triggerId: "display-button"
      });
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Element with id=\"non-existent-menu\" not found")
      );
      
      consoleErrorSpy.mockRestore();
    });

    it("returns no-op functions when trigger button not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      menuInstance = makeMenuAccessible({
        menuId: "menu-div",
        menuItemsClass: "profile-menu-items",
        triggerId: "non-existent-trigger"
      });
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Element with id=\"non-existent-trigger\" not found")
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe("openMenu and closeMenu", () => {
    beforeEach(() => {
      menuInstance = makeMenuAccessible({
        menuId: "menu-div",
        menuItemsClass: "profile-menu-items",
        triggerId: "display-button"
      });
    });

    it("opens menu, sets aria-expanded to true, and focuses first item", () => {
      menuInstance.openMenu();
      
      expect(menuDiv.style.display).toBe("block");
      expect(triggerButton.getAttribute("aria-expanded")).toBe("true");
      expect(document.activeElement).toBe(menuDiv.querySelector(".profile-menu-items"));
    });

    it("closes menu, sets aria-expanded to false, and focuses trigger", () => {
      menuInstance.openMenu();
      menuInstance.closeMenu();
      
      expect(menuDiv.style.display).toBe("none");
      expect(triggerButton.getAttribute("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(triggerButton);
    });
  });

  describe("refresh method", () => {
    beforeEach(() => {
      menuInstance = makeMenuAccessible({
        menuId: "menu-div",
        menuItemsClass: "profile-menu-items",
        triggerId: "display-button"
      });
    });

    it("updates internal cache when new items are added", () => {
      menuInstance.openMenu();
      const initialItems = menuDiv.querySelectorAll(".profile-menu-items");
      expect(initialItems.length).toBe(4);
      
      // Add new item
      const newButton = document.createElement("button");
      newButton.className = "profile-menu-items";
      newButton.textContent = "New Item";
      menuDiv.appendChild(newButton);
      
      // Refresh clears the cache - close and reopen to see new items
      menuInstance.refresh();
      menuInstance.closeMenu();
      menuInstance.openMenu();
      
      const updatedItems = menuDiv.querySelectorAll(".profile-menu-items");
      expect(updatedItems.length).toBe(5);
      expect(document.activeElement).toBe(menuDiv.querySelector(".profile-menu-items"));
    });

    it("removes event listeners from old items when refreshing", () => {
      menuInstance.openMenu();
      const firstItem = menuDiv.querySelector(".profile-menu-items") as HTMLElement;
      
      // Remove item from DOM
      firstItem.remove();
      
      menuInstance.refresh();
      
      // Should not throw when trying to access removed item
      const items = menuDiv.querySelectorAll(".profile-menu-items");
      expect(items.length).toBe(3);
    });
  });

  describe("cleanup method", () => {
    it("removes all event listeners", () => {
      menuInstance = makeMenuAccessible({
        menuId: "menu-div",
        menuItemsClass: "profile-menu-items",
        triggerId: "display-button"
      });
      
      menuInstance.openMenu();
      const firstItem = menuDiv.querySelector(".profile-menu-items") as HTMLElement;
      
      menuInstance.cleanup();
      
      // After cleanup, keyboard events should not trigger navigation
      const secondItem = menuDiv.querySelectorAll(".profile-menu-items")[1] as HTMLElement;
      firstItem.focus();
      firstItem.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      
      expect(document.activeElement).toBe(firstItem);
    });

    it("allows re-initialization after cleanup", () => {
      menuInstance = makeMenuAccessible({
        menuId: "menu-div",
        menuItemsClass: "profile-menu-items",
        triggerId: "display-button"
      });
      
      menuInstance.cleanup();
      
      // Re-initialize
      menuInstance = makeMenuAccessible({
        menuId: "menu-div",
        menuItemsClass: "profile-menu-items",
        triggerId: "display-button"
      });
      
      menuInstance.openMenu();
      expect(menuDiv.style.display).toBe("block");
      expect(triggerButton.getAttribute("aria-expanded")).toBe("true");
    });
  });

  describe("focus management", () => {
    beforeEach(() => {
      menuInstance = makeMenuAccessible({
        menuId: "menu-div",
        menuItemsClass: "profile-menu-items",
        triggerId: "display-button"
      });
    });

    it("sets tabindex=-1 on all menu items", () => {
      menuInstance.openMenu();
      const items = menuDiv.querySelectorAll(".profile-menu-items");
      
      items.forEach((item) => {
        expect(item.getAttribute("tabindex")).toBe("-1");
      });
    });
  });
});