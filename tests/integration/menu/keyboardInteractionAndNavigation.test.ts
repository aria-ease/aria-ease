import { describe, it, beforeEach, expect, vi } from "vitest";
import { makeMenuAccessible } from "../../../src/menu";
import { NodeListOfHTMLElement } from "../../../Types";
import { handleKeyPress } from "../../../src/utils/handleKeyPress/handleKeyPress";

describe("makeMenuAccessible - menu accessibility integration. keyboard interaction and navigation", () => {
  let menu: ReturnType<typeof makeMenuAccessible>;
  let triggerButton: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="display-button" aria-label="Profile menu" aria-expanded="false"></button>
      <div id="menu-div" style="display:none">
        <button class="profile-menu-items">One</button>
        <button class="profile-menu-items">Two</button>
        <button class="profile-menu-items">Three</button>
      </div>
    `;
    menu = makeMenuAccessible({
      menuId: "menu-div",
      menuItemsClass: "profile-menu-items",
      triggerId: "display-button"
    });
    triggerButton = document.getElementById("display-button")!;
  });

  it("navigates with ArrowDown", () => {
    menu.openMenu();
    const elementItems = document.querySelectorAll(".profile-menu-items") as NodeListOfHTMLElement<HTMLElement>;
    elementItems.item(0).focus();
    const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true });
    handleKeyPress(event as KeyboardEvent, elementItems, 0);
    expect(document.activeElement).toBe(elementItems.item(1));
  });

  it("moves focus to next item with ArrowDown", () => {
    menu.openMenu();
    const menuDiv = document.getElementById("menu-div")!;
    const firstItem = menuDiv.querySelector(".profile-menu-items") as HTMLElement;
    const secondItem = menuDiv.querySelectorAll(".profile-menu-items")[1] as HTMLElement;
      
    firstItem.focus();
    firstItem.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
      
    expect(document.activeElement).toBe(secondItem);
  });

  it("moves focus to previous item with ArrowUp", () => {
    menu.openMenu();
    const menuDiv = document.getElementById("menu-div")!;
    const items = menuDiv.querySelectorAll(".profile-menu-items");
    const secondItem = items[1] as HTMLElement;
    const firstItem = items[0] as HTMLElement;
      
    secondItem.focus();
    secondItem.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));
      
    expect(document.activeElement).toBe(firstItem);
  });

  it("wraps to last item when pressing ArrowUp on first item", () => {
    menu.openMenu();
    const menuDiv = document.getElementById("menu-div")!;
    const items = menuDiv.querySelectorAll(".profile-menu-items");
    const firstItem = items[0] as HTMLElement;
    const lastItem = items[items.length - 1] as HTMLElement;
      
    firstItem.focus();
    firstItem.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));
      
    expect(document.activeElement).toBe(lastItem);
  });

    it("wraps to first item when pressing ArrowDown on last item", () => {
      menu.openMenu();
      const menuDiv = document.getElementById("menu-div")!;
      const items = menuDiv.querySelectorAll(".profile-menu-items");
      const lastItem = items[items.length - 1] as HTMLElement;
      const firstItem = items[0] as HTMLElement;
      
      lastItem.focus();
      lastItem.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
      
      expect(document.activeElement).toBe(firstItem);
    });

    // Note: Home and End key support not yet implemented in menu utility
    it.skip("moves focus to first item with Home key", () => {
      menu.openMenu();
      const menuDiv = document.getElementById("menu-div")!;
      const items = menuDiv.querySelectorAll(".profile-menu-items");
      const lastItem = items[items.length - 1] as HTMLElement;
      const firstItem = items[0] as HTMLElement;
      
      lastItem.focus();
      lastItem.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
      
      expect(document.activeElement).toBe(firstItem);
    });

    it.skip("moves focus to last item with End key", () => {
      menu.openMenu();
      const menuDiv = document.getElementById("menu-div")!;
      const items = menuDiv.querySelectorAll(".profile-menu-items");
      const firstItem = items[0] as HTMLElement;
      const lastItem = items[items.length - 1] as HTMLElement;
      
      firstItem.focus();
      firstItem.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
      
      expect(document.activeElement).toBe(lastItem);
    });

    it("closes menu and returns focus to trigger with Escape key", () => {
      menu.openMenu();
      const menuDiv = document.getElementById("menu-div")!;
      const firstItem = menuDiv.querySelector(".profile-menu-items") as HTMLElement;
      
      firstItem.focus();
      firstItem.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      
      expect(menuDiv.style.display).toBe("none");
      expect(document.activeElement).toBe(triggerButton);
    });

    it("triggers click on button item with Enter key", () => {
      menu.openMenu();
      const menuDiv = document.getElementById("menu-div")!;
      const firstItem = menuDiv.querySelector(".profile-menu-items") as HTMLElement;
      const clickSpy = vi.fn();
      firstItem.addEventListener("click", clickSpy);
      
      firstItem.focus();
      firstItem.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      
      expect(clickSpy).toHaveBeenCalled();
    });

    it("triggers click on button item with Space key", () => {
      menu.openMenu();
      const menuDiv = document.getElementById("menu-div")!;
      const firstItem = menuDiv.querySelector(".profile-menu-items") as HTMLElement;
      const clickSpy = vi.fn();
      firstItem.addEventListener("click", clickSpy);
      
      firstItem.focus();
      firstItem.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
      
      expect(clickSpy).toHaveBeenCalled();
    });
});