import { describe, it, beforeEach, expect, vi } from "vitest";
import { makeComboboxAccessible } from "../../../src/combobox";

describe("makeComboboxAccessible - initialization and ARIA attributes", () => {
  let input: HTMLInputElement;
  let listbox: HTMLElement;
  let button: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="combo-input" />
      <button id="combo-button">Toggle</button>
      <ul id="combo-listbox">
        <li class="combo-option">Apple</li>
        <li class="combo-option">Banana</li>
        <li class="combo-option">Cherry</li>
      </ul>
    `;
    input = document.getElementById("combo-input") as HTMLInputElement;
    listbox = document.getElementById("combo-listbox")!;
    button = document.getElementById("combo-button")!;
    
    // Mock scrollIntoView for jsdom
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("sets correct ARIA attributes on combobox input", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("aria-controls")).toBe("combo-listbox");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(input.getAttribute("aria-haspopup")).toBe("listbox");
  });

  it("sets role=listbox on listbox element", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    expect(listbox.getAttribute("role")).toBe("listbox");
  });

  it("sets role=option and aria-selected=false on all options", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    const options = listbox.querySelectorAll(".combo-option");
    options.forEach((option) => {
      expect(option.getAttribute("role")).toBe("option");
      expect(option.getAttribute("aria-selected")).toBe("false");
      expect(option.id).toBeTruthy();
    });
  });

  it("sets attributes on toggle button if provided", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      comboboxButtonId: "combo-button",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    expect(button.getAttribute("tabindex")).toBe("-1");
    expect(button.getAttribute("aria-label")).toBe("Toggle options");
  });

  it("returns cleanup function", () => {
    const { cleanup } = makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    expect(typeof cleanup).toBe("function");
  });

  it("returns refresh function", () => {
    const { refresh } = makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    expect(typeof refresh).toBe("function");
  });

  it("handles missing combobox input gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    const { cleanup } = makeComboboxAccessible({
      comboboxInputId: "nonexistent-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Element with id=\"nonexistent-input\" not found")
    );
    expect(typeof cleanup).toBe("function");
    
    consoleSpy.mockRestore();
  });

  it("handles missing listbox gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    const { cleanup } = makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "nonexistent-listbox",
      listBoxItemsClass: "combo-option"
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Element with id=\"nonexistent-listbox\" not found")
    );
    expect(typeof cleanup).toBe("function");
    
    consoleSpy.mockRestore();
  });
});

describe("makeComboboxAccessible - keyboard navigation", () => {
  let input: HTMLInputElement;
  let listbox: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="combo-input" />
      <ul id="combo-listbox">
        <li class="combo-option">Apple</li>
        <li class="combo-option">Banana</li>
        <li class="combo-option">Cherry</li>
      </ul>
    `;
    input = document.getElementById("combo-input") as HTMLInputElement;
    listbox = document.getElementById("combo-listbox")!;
    
    // Mock scrollIntoView for jsdom
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("opens listbox on ArrowDown without selecting first item", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(input.getAttribute("aria-expanded")).toBe("true");
    // When just opened, active descendant should be empty (not set to first item)
    const activedescendant = input.getAttribute("aria-activedescendant");
    expect(activedescendant === "" || activedescendant === null).toBe(true);
  });

  it("navigates to first item on second ArrowDown", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // First press opens
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    
    // Second press selects first item
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));

    const firstOption = listbox.querySelector(".combo-option") as HTMLElement;
    expect(input.getAttribute("aria-activedescendant")).toBe(firstOption.id);
    expect(firstOption.getAttribute("aria-selected")).toBe("true");
  });

  it("does not open listbox on ArrowUp when closed", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));

    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("navigates up when listbox is open", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Open and move to first item
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));

    // Navigate up should wrap to last item
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));

    const options = listbox.querySelectorAll(".combo-option");
    const lastOption = options[options.length - 1] as HTMLElement;
    expect(input.getAttribute("aria-activedescendant")).toBe(lastOption.id);
  });

  it("wraps navigation from last to first item on ArrowDown", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Open and navigate to last item
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "End" }));

    // Arrow down should wrap to first
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));

    const firstOption = listbox.querySelector(".combo-option") as HTMLElement;
    expect(input.getAttribute("aria-activedescendant")).toBe(firstOption.id);
  });

  it("navigates to first item on Home key", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Open and navigate to last item
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "End" }));

    // Home should go to first
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Home" }));

    const firstOption = listbox.querySelector(".combo-option") as HTMLElement;
    expect(input.getAttribute("aria-activedescendant")).toBe(firstOption.id);
  });

  it("navigates to last item on End key", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Open listbox
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    
    // End should go to last item
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "End" }));

    const options = listbox.querySelectorAll(".combo-option");
    const lastOption = options[options.length - 1] as HTMLElement;
    expect(input.getAttribute("aria-activedescendant")).toBe(lastOption.id);
  });

  it("selects active option on Enter key", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Open and select first item
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    
    // Verify item is selected before pressing Enter
    const firstOption = listbox.querySelector(".combo-option") as HTMLElement;
    expect(input.getAttribute("aria-activedescendant")).toBe(firstOption.id);
    
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(input.value).toBe("Apple");
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes listbox on Escape key", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Open listbox
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    expect(input.getAttribute("aria-expanded")).toBe("true");

    // Close with Escape
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("clears input on Escape when listbox is closed", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    input.value = "Test";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(input.value).toBe("");
  });

  it("closes listbox on Tab key", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Open listbox
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    
    // Tab should close
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("makeComboboxAccessible - mouse interactions", () => {
  let input: HTMLInputElement;
  let listbox: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="combo-input" />
      <ul id="combo-listbox">
        <li class="combo-option">Apple</li>
        <li class="combo-option">Banana</li>
        <li class="combo-option">Cherry</li>
      </ul>
    `;
    input = document.getElementById("combo-input") as HTMLInputElement;
    listbox = document.getElementById("combo-listbox")!;
    
    // Mock scrollIntoView for jsdom
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("sets active descendant on mouse move", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Open listbox first
    input.setAttribute("aria-expanded", "true");

    const secondOption = listbox.querySelectorAll(".combo-option")[1] as HTMLElement;
    secondOption.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));

    expect(input.getAttribute("aria-activedescendant")).toBe(secondOption.id);
    expect(secondOption.getAttribute("aria-selected")).toBe("true");
  });

  it("selects option on mousedown", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Open listbox
    input.setAttribute("aria-expanded", "true");

    const firstOption = listbox.querySelector(".combo-option") as HTMLElement;
    firstOption.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    expect(input.value).toBe("Apple");
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes listbox on outside click", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Open listbox
    input.setAttribute("aria-expanded", "true");

    // Click outside
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("does not close on click inside listbox", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Open listbox
    input.setAttribute("aria-expanded", "true");

    // Click on listbox itself (not an option)
    listbox.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    expect(input.getAttribute("aria-expanded")).toBe("true");
  });
});

describe("makeComboboxAccessible - toggle button", () => {
  let input: HTMLInputElement;
  let button: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="combo-input" />
      <button id="combo-button">Toggle</button>
      <ul id="combo-listbox">
        <li class="combo-option">Apple</li>
        <li class="combo-option">Banana</li>
      </ul>
    `;
    input = document.getElementById("combo-input") as HTMLInputElement;
    button = document.getElementById("combo-button")!;
  });

  it("toggles listbox on button click", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      comboboxButtonId: "combo-button",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    button.click();
    expect(input.getAttribute("aria-expanded")).toBe("true");

    button.click();
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("focuses input when opening via button", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      comboboxButtonId: "combo-button",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    button.click();
    expect(document.activeElement).toBe(input);
  });

  it("handles Enter key on button", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      comboboxButtonId: "combo-button",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(input.getAttribute("aria-expanded")).toBe("true");
  });

  it("handles Space key on button", () => {
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      comboboxButtonId: "combo-button",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    button.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    expect(input.getAttribute("aria-expanded")).toBe("true");
  });
});

describe("makeComboboxAccessible - callbacks", () => {
  let input: HTMLInputElement;
  let listbox: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="combo-input" />
      <ul id="combo-listbox">
        <li class="combo-option">Apple</li>
        <li class="combo-option">Banana</li>
      </ul>
    `;
    input = document.getElementById("combo-input") as HTMLInputElement;
    listbox = document.getElementById("combo-listbox")!;
    
    // Mock scrollIntoView for jsdom
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("calls onOpenChange callback when opening", () => {
    const onOpenChange = vi.fn();
    
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option",
      config: { onOpenChange }
    });

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange callback when closing", () => {
    const onOpenChange = vi.fn();
    
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option",
      config: { onOpenChange }
    });

    // Open then close
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onSelect callback when option is selected", () => {
    const onSelect = vi.fn();
    
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option",
      config: { onSelect }
    });

    // Open, select first item
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    
    // Verify selection before Enter
    const firstOption = listbox.querySelector(".combo-option") as HTMLElement;
    expect(input.getAttribute("aria-activedescendant")).toBe(firstOption.id);
    
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(onSelect).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      "Apple"
    );
  });

  it("calls onActiveDescendantChange callback when navigating", () => {
    const onActiveDescendantChange = vi.fn();
    
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option",
      config: { onActiveDescendantChange }
    });

    // Open listbox (first ArrowDown just opens, doesn't select)
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    
    // Second ArrowDown should navigate and trigger callback
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(onActiveDescendantChange).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(HTMLElement)
    );
  });

  it("calls onClear callback when clearing input", () => {
    const onClear = vi.fn();
    
    makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option",
      config: { onClear }
    });

    input.value = "Test";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(onClear).toHaveBeenCalled();
  });
});

describe("makeComboboxAccessible - refresh and filtering", () => {
  let input: HTMLInputElement;
  let listbox: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="combo-input" />
      <ul id="combo-listbox">
        <li class="combo-option">Apple</li>
        <li class="combo-option">Banana</li>
        <li class="combo-option">Cherry</li>
      </ul>
    `;
    input = document.getElementById("combo-input") as HTMLInputElement;
    listbox = document.getElementById("combo-listbox")!;
    
    // Mock scrollIntoView for jsdom
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("refreshes visible items cache", () => {
    const { refresh } = makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Open and navigate
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));

    const firstOption = listbox.querySelector(".combo-option") as HTMLElement;
    expect(firstOption.getAttribute("aria-selected")).toBe("true");

    // Refresh should clear selection
    refresh();

    expect(input.getAttribute("aria-activedescendant")).toBe("");
    expect(firstOption.getAttribute("aria-selected")).toBe("false");
  });

  it("skips hidden items in navigation", () => {
    const { refresh } = makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Hide second option (Banana)
    const options = listbox.querySelectorAll(".combo-option") as NodeListOf<HTMLElement>;
    options[1].hidden = true;
    refresh();

    // Open (first ArrowDown)
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    // Select first visible item (Apple - index 0)
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0].id);
    
    // Navigate to next visible item (should skip hidden Banana and go to Cherry)
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    expect(input.getAttribute("aria-activedescendant")).toBe(options[2].id);
  });

  it("handles empty filtered results", () => {
    const { refresh } = makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Hide all options
    const options = listbox.querySelectorAll(".combo-option") as NodeListOf<HTMLElement>;
    options.forEach(opt => opt.hidden = true);
    refresh();

    // Try to navigate - should not error
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(input.getAttribute("aria-activedescendant")).toBe("");
  });

  it("re-initializes options on refresh", () => {
    const { refresh } = makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    // Add new option dynamically
    const newOption = document.createElement("li");
    newOption.className = "combo-option";
    newOption.textContent = "Date";
    listbox.appendChild(newOption);

    refresh();

    // New option should have proper attributes
    expect(newOption.getAttribute("role")).toBe("option");
    expect(newOption.getAttribute("aria-selected")).toBe("false");
    expect(newOption.id).toBeTruthy();
  });
});

describe("makeComboboxAccessible - cleanup", () => {
  let input: HTMLInputElement;
  let listbox: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="combo-input" />
      <button id="combo-button">Toggle</button>
      <ul id="combo-listbox">
        <li class="combo-option">Apple</li>
        <li class="combo-option">Banana</li>
      </ul>
    `;
    input = document.getElementById("combo-input") as HTMLInputElement;
    listbox = document.getElementById("combo-listbox")!;
  });

  it("removes event listeners on cleanup", () => {
    const { cleanup } = makeComboboxAccessible({
      comboboxInputId: "combo-input",
      comboboxButtonId: "combo-button",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    cleanup();

    // After cleanup, keyboard events should not work
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("allows re-initialization after cleanup", () => {
    const { cleanup: cleanup1 } = makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    cleanup1();

    const { cleanup: cleanup2 } = makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    expect(typeof cleanup2).toBe("function");
    cleanup2();
  });

  it("handles multiple cleanup calls gracefully", () => {
    const { cleanup } = makeComboboxAccessible({
      comboboxInputId: "combo-input",
      listBoxId: "combo-listbox",
      listBoxItemsClass: "combo-option"
    });

    expect(() => {
      cleanup();
      cleanup();
      cleanup();
    }).not.toThrow();
  });
});