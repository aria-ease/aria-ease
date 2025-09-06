import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import { handleKeyPress, isLink, isNativeButton } from "../../../src/utils/handleKeyPress/handleKeyPress";

describe("handleKeyPress - buttons and anchor key interaction and navigation", () => {
  let items: HTMLElement[];
  let nodeList: NodeListOf<HTMLElement>;
  let focusMock: ReturnType<typeof vi.fn>;
  let clickMock: ReturnType<typeof vi.fn>;
  let event: Partial<KeyboardEvent>;

  beforeEach(() => {
    // Create 3 mock elements and append to DOM
    items = Array.from({ length: 3 }, (_, i) => {
      const el = document.createElement("a");
      el.textContent = `A ${i}`;
      el.href = "#"; //for anchor tag
      el.tabIndex = 0; //for anchor tag
      document.body.appendChild(el);
      return el;
    });
    // Patch focus and click
    focusMock = vi.fn(function() {
      HTMLElement.prototype.focus.call(this);
    });
    clickMock = vi.fn();
    items.forEach((el) => {
      el.focus = focusMock;
      el.click = clickMock;
    });
    // Patch NodeListOf
    nodeList = {
      length: items.length,
      item: (i: number) => items[i],
      [Symbol.iterator]: function* () { yield* items; }
    } as unknown as NodeListOf<HTMLElement>;
  });

  afterEach(() => {
    items.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  });

  it("moves focus to previous item on ArrowUp", () => {
    nodeList.item(1).focus();
    event = { key: "ArrowUp", preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).toHaveBeenCalled();
    expect(document.activeElement).toBe(nodeList.item(0));
  });

  it("moves focus to previous item on ArrowLeft", () => {
    nodeList.item(2).focus();
    event = { key: "ArrowLeft", preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 2);
    expect(focusMock).toHaveBeenCalled();
    expect(document.activeElement).toBe(nodeList.item(1));
  });

  it("moves focus to next item on ArrowDown", () => {
    nodeList.item(0).focus();
    event = { key: "ArrowDown", preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 0);
    expect(focusMock).toHaveBeenCalled();
    expect(document.activeElement).toBe(nodeList.item(1));
  });

  it("moves focus to next item on ArrowRight", () => {
    nodeList.item(1).focus();
    event = { key: "ArrowRight", preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).toHaveBeenCalled();
    expect(document.activeElement).toBe(nodeList.item(2));
  });

  it("Enter key interaction", () => {
    event = { key: "Enter", preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 0);
    if(isLink(nodeList.item(0)) || isNativeButton(nodeList.item(0))) {
      expect(clickMock).not.toHaveBeenCalled();
    } else {
      expect(clickMock).toHaveBeenCalled();
    }
  });

  it("Space key interaction", () => {
    event = { key: " ", preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 2);
    if(isLink(nodeList.item(0)) || isNativeButton(nodeList.item(0))) {
      expect(clickMock).not.toHaveBeenCalled();
    } else {
      expect(clickMock).toHaveBeenCalled();
    }
  });

  it("does nothing for unhandled keys", () => {
    event = { key: "Tab", preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).not.toHaveBeenCalled();
    expect(clickMock).not.toHaveBeenCalled();
  });
});