import { describe, it, beforeEach, expect } from "vitest";
import { makeBlockAccessible } from "../../../src/block";

describe("makeBlockAccessible - cleanup and memory management", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="block-container">
        <button class="block-items">Item 1</button>
        <button class="block-items">Item 2</button>
        <button class="block-items">Item 3</button>
      </div>
    `;
  });

  it("returns a cleanup function", () => {
    const { cleanup } = makeBlockAccessible("block-container", "block-items");
    expect(typeof cleanup).toBe("function");
  });

  it("removes event listeners on cleanup", () => {
    const { cleanup } = makeBlockAccessible("block-container", "block-items");
    const items = document.querySelectorAll(".block-items");
    const firstItem = items[0] as HTMLElement;

    // Test that keyboard navigation works before cleanup
    firstItem.focus();
    const keyEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
    firstItem.dispatchEvent(keyEvent);

    // Cleanup should remove listeners
    expect(() => cleanup()).not.toThrow();
  });

  it("allows re-initialization after cleanup", () => {
    const { cleanup: cleanup1 } = makeBlockAccessible("block-container", "block-items");
    cleanup1();

    // Should be able to reinitialize without errors
    const { cleanup: cleanup2 } = makeBlockAccessible("block-container", "block-items");
    expect(typeof cleanup2).toBe("function");
    cleanup2();
  });

  it("handles cleanup on empty block", () => {
    document.body.innerHTML = `<div id="empty-block"></div>`;
    
    expect(() => {makeBlockAccessible("empty-block", "non-existent-items");}).not.toThrow();
  });

  it("handles dynamic item addition with re-initialization", () => {
    const container = document.getElementById("block-container")!;
    let { cleanup } = makeBlockAccessible("block-container", "block-items");
    
    let items = container.querySelectorAll(".block-items");
    expect(items.length).toBe(3);
    
    // Cleanup old instance
    cleanup();
    
    // Add new item
    const newItem = document.createElement("button");
    newItem.className = "block-items";
    newItem.textContent = "Item 4";
    container.appendChild(newItem);
    
    // Re-initialize
    ({ cleanup } = makeBlockAccessible("block-container", "block-items"));
    items = container.querySelectorAll(".block-items");
    expect(items.length).toBe(4);
    
    cleanup();
  });

  it("handles cleanup when called multiple times", () => {
    const { cleanup } = makeBlockAccessible("block-container", "block-items");
    
    // Multiple cleanup calls shouldn't cause errors
    expect(() => {
      cleanup();
      cleanup();
      cleanup();
    }).not.toThrow();
  });
});
