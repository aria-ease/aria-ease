import { describe, it, beforeEach, expect } from "vitest";
import { makeMenuAccessible } from "../../../src/menu";

describe("makeMenuAccessible - open/close menu, focuses first interactive item on open", () => {
  let menuDiv: HTMLElement;
  let triggerButton: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="display-button" aria-label="Open profile menu" aria-expanded="false">Menu button</button>
      <div id="menu-div" style="display:none">
        <button class="profile-menu-items">One</button>
        <button class="profile-menu-items">Two</button>
      </div>
    `;
    menuDiv = document.getElementById("menu-div")!;
    triggerButton = document.getElementById("display-button")!;
  });

  it("opens menu, sets aria, and focuses first item", () => {
    const menu = makeMenuAccessible({
      menuId: "menu-div",
      menuItemsClass: "profile-menu-items",
      triggerId: "display-button",
      openLabel: "Open profile menu",
      closeLabel: "Close profile menu"
    });
    menu.openMenu();
    expect(menuDiv.style.display).toBe("block");
    expect(triggerButton.getAttribute("aria-expanded")).toBe("true");
    expect(triggerButton.getAttribute("aria-label")).toBe("Close profile menu");
    expect(document.activeElement).toBe(menuDiv.querySelector(".profile-menu-items"));
  });

  it("closes menu, sets aria, and focuses trigger", () => {
    const menu = makeMenuAccessible({
      menuId: "menu-div",
      menuItemsClass: "profile-menu-items",
      triggerId: "display-button",
      openLabel: "Open profile menu",
      closeLabel: "Close profile menu"
    });
    menu.openMenu();
    menu.closeMenu();
    expect(menuDiv.style.display).toBe("none");
    expect(triggerButton.getAttribute("aria-expanded")).toBe("false");
    expect(triggerButton.getAttribute("aria-label")).toBe("Open profile menu");
    expect(document.activeElement).toBe(triggerButton);
  });
});