import { describe, it, beforeEach, afterEach, expect } from "vitest";
import { makeMenuAccessible } from "../../../src/menu";

describe("makeMenuAccessible - cleanup and memory management", () => {
  let menuDiv: HTMLElement;
  let triggerButton: HTMLElement;
  let menuInstance: ReturnType<typeof makeMenuAccessible>;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="display-button" aria-label="Open menu" aria-expanded="false">Menu</button>
      <div id="menu-div" style="display:none">
        <button class="menu-items">Item 1</button>
        <button class="menu-items">Item 2</button>
        <button class="menu-items">Item 3</button>
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

  it("removes event listeners on cleanup", () => {
    menuInstance = makeMenuAccessible({
      menuId: "menu-div",
      menuItemsClass: "menu-items",
      triggerId: "display-button"
    });

    menuInstance.openMenu();
    const menuItems = menuDiv.querySelectorAll(".menu-items");
    const firstItem = menuItems[0] as HTMLElement;

    // Verify listeners are attached (focus should move on arrow down)
    firstItem.focus();
    const keydownEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
    firstItem.dispatchEvent(keydownEvent);
    
    // After cleanup, listeners should be removed
    menuInstance.cleanup();
    
    // Verify menu is closed and aria updated
    expect(menuDiv.style.display).toBe("none");
    expect(triggerButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("allows re-initialization after cleanup", () => {
    // First initialization
    menuInstance = makeMenuAccessible({
      menuId: "menu-div",
      menuItemsClass: "menu-items",
      triggerId: "display-button"
    });
    menuInstance.openMenu();
    expect(menuDiv.style.display).toBe("block");
    
    // Cleanup
    menuInstance.cleanup();
    expect(menuDiv.style.display).toBe("none");
    
    // Re-initialize - should work without memory leaks
    menuInstance = makeMenuAccessible({
      menuId: "menu-div",
      menuItemsClass: "menu-items",
      triggerId: "display-button"
    });
    menuInstance.openMenu();
    expect(menuDiv.style.display).toBe("block");
    expect(triggerButton.getAttribute("aria-expanded")).toBe("true");
  });

  it("handles dynamic menu item addition/removal with re-initialization", () => {
    menuInstance = makeMenuAccessible({
      menuId: "menu-div",
      menuItemsClass: "menu-items",
      triggerId: "display-button"
    });
    
    menuInstance.openMenu();
    let menuItems = menuDiv.querySelectorAll(".menu-items");
    expect(menuItems.length).toBe(3);
    
    // Clean up old instance
    menuInstance.cleanup();
    
    // Add new menu item
    const newItem = document.createElement("button");
    newItem.className = "menu-items";
    newItem.textContent = "Item 4";
    menuDiv.appendChild(newItem);
    
    // Re-initialize with new structure
    menuInstance = makeMenuAccessible({
      menuId: "menu-div",
      menuItemsClass: "menu-items",
      triggerId: "display-button"
    });
    
    menuInstance.openMenu();
    menuItems = menuDiv.querySelectorAll(".menu-items");
    expect(menuItems.length).toBe(4);
  });

  it("cleans up nested submenu instances", () => {
    document.body.innerHTML = `
      <button id="main-trigger" aria-expanded="false">Main Menu</button>
      <div id="main-menu" style="display:none">
        <button class="menu-items" aria-haspopup="true" aria-controls="submenu-1" id="sub-trigger-1">Submenu Trigger</button>
      </div>
      <div id="submenu-1" style="display:none">
        <button class="menu-items">Submenu Item 1</button>
      </div>
    `;

    menuInstance = makeMenuAccessible({
      menuId: "main-menu",
      menuItemsClass: "menu-items",
      triggerId: "main-trigger"
    });

    menuInstance.openMenu();
    
    // Open submenu
    const subTrigger = document.getElementById("sub-trigger-1") as HTMLElement;
    const rightArrowEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
    subTrigger.dispatchEvent(rightArrowEvent);

    // Cleanup should clean up both main menu and submenu
    menuInstance.cleanup();
    
    expect(document.getElementById("main-menu")!.style.display).toBe("none");
  });

  it("handles cleanup when menu is already closed", () => {
    menuInstance = makeMenuAccessible({
      menuId: "menu-div",
      menuItemsClass: "menu-items",
      triggerId: "display-button"
    });

    // Don't open the menu, just cleanup
    expect(() => menuInstance.cleanup()).not.toThrow();
    expect(menuDiv.style.display).toBe("none");
  });
});
