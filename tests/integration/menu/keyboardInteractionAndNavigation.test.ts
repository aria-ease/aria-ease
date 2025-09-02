import { describe, it, beforeEach, expect } from "vitest";
import { makeMenuAccessible } from "../../../src/menu";
import { NodeListOfHTMLElement } from "../../../Types";
import { handleKeyPress } from "../../../src/utils/handleKeyPress/handleKeyPress";

describe("makeMenuAccessible - menu accessibility integration. keyboard interaction and navigation", () => {
  let menu: ReturnType<typeof makeMenuAccessible>;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="display-button" aria-label="Open profile menu" aria-expanded="false"></button>
      <div id="menu-div" style="display:none">
        <button class="profile-menu-items">One</button>
        <button class="profile-menu-items">Two</button>
        <button class="profile-menu-items">Three</button>
      </div>
    `;
    menu = makeMenuAccessible({
      menuId: "menu-div",
      menuItemsClass: "profile-menu-items",
      triggerId: "display-button",
      openLabel: "Open profile menu",
      closeLabel: "Close profile menu"
    });
  });

  it("navigates with ArrowDown", () => {
    menu.openMenu();
    const elementItems = document.querySelectorAll(".profile-menu-items") as NodeListOfHTMLElement<HTMLElement>;
    elementItems.item(0).focus();
    const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true });
    handleKeyPress(event as KeyboardEvent, elementItems, 0);
    expect(document.activeElement).toBe(elementItems.item(1));
  });
});