import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { makeCheckboxAccessible } from "../../../src/checkbox";

describe("makeCheckboxAccessible", () => {
  let checkboxGroup: HTMLElement;
  let checkboxInstance: ReturnType<typeof makeCheckboxAccessible>;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-checkbox-group">
        <div class="checkbox-item">Option 1</div>
        <div class="checkbox-item">Option 2</div>
        <div class="checkbox-item">Option 3</div>
      </div>
    `;
    checkboxGroup = document.getElementById("test-checkbox-group")!;
  });

  afterEach(() => {
    if (checkboxInstance) {
      checkboxInstance.cleanup();
    }
  });

  describe("initialization", () => {
    it("sets ARIA attributes on checkbox group and checkboxes", () => {
      checkboxInstance = makeCheckboxAccessible({
        checkboxGroupId: "test-checkbox-group",
        checkboxesClass: "checkbox-item"
      });

      expect(checkboxGroup.getAttribute("role")).toBe("group");

      const checkboxes = checkboxGroup.querySelectorAll(".checkbox-item");
      checkboxes.forEach((checkbox) => {
        expect(checkbox.getAttribute("role")).toBe("checkbox");
        expect(checkbox.getAttribute("aria-checked")).toBe("false");
        expect(checkbox.getAttribute("tabindex")).toBe("0");
      });
    });

    it("does not override existing role on group", () => {
      checkboxGroup.setAttribute("role", "list");

      checkboxInstance = makeCheckboxAccessible({
        checkboxGroupId: "test-checkbox-group",
        checkboxesClass: "checkbox-item"
      });

      expect(checkboxGroup.getAttribute("role")).toBe("list");
    });

    it("preserves existing aria-checked attributes", () => {
      const checkbox = checkboxGroup.querySelector(".checkbox-item")!;
      checkbox.setAttribute("aria-checked", "true");

      checkboxInstance = makeCheckboxAccessible({
        checkboxGroupId: "test-checkbox-group",
        checkboxesClass: "checkbox-item"
      });

      expect(checkbox.getAttribute("aria-checked")).toBe("true");
    });

    it("returns cleanup function when group not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      checkboxInstance = makeCheckboxAccessible({
        checkboxGroupId: "non-existent",
        checkboxesClass: "checkbox-item"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Element with id=\"non-existent\" not found")
      );
      expect(typeof checkboxInstance.cleanup).toBe("function");

      consoleErrorSpy.mockRestore();
    });

    it("returns cleanup function when checkboxes not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      checkboxInstance = makeCheckboxAccessible({
        checkboxGroupId: "test-checkbox-group",
        checkboxesClass: "non-existent"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("No elements with class=\"non-existent\" found")
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("toggleCheckbox", () => {
    beforeEach(() => {
      checkboxInstance = makeCheckboxAccessible({
        checkboxGroupId: "test-checkbox-group",
        checkboxesClass: "checkbox-item"
      });
    });

    it("toggles checkbox from unchecked to checked", () => {
      checkboxInstance.toggleCheckbox!(0);

      const checkbox = checkboxGroup.querySelectorAll(".checkbox-item")[0];
      expect(checkbox.getAttribute("aria-checked")).toBe("true");
    });

    it("toggles checkbox from checked to unchecked", () => {
      checkboxInstance.toggleCheckbox!(0);
      checkboxInstance.toggleCheckbox!(0);

      const checkbox = checkboxGroup.querySelectorAll(".checkbox-item")[0];
      expect(checkbox.getAttribute("aria-checked")).toBe("false");
    });

    it("does not affect other checkboxes", () => {
      checkboxInstance.toggleCheckbox!(1);

      const checkboxes = checkboxGroup.querySelectorAll(".checkbox-item");
      expect(checkboxes[0].getAttribute("aria-checked")).toBe("false");
      expect(checkboxes[1].getAttribute("aria-checked")).toBe("true");
      expect(checkboxes[2].getAttribute("aria-checked")).toBe("false");
    });

    it("handles invalid index gracefully", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      checkboxInstance.toggleCheckbox!(-1);
      checkboxInstance.toggleCheckbox!(999);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      consoleErrorSpy.mockRestore();
    });
  });

  describe("setCheckboxState", () => {
    beforeEach(() => {
      checkboxInstance = makeCheckboxAccessible({
        checkboxGroupId: "test-checkbox-group",
        checkboxesClass: "checkbox-item"
      });
    });

    it("sets checkbox to checked", () => {
      checkboxInstance.setCheckboxState!(1, true);

      const checkbox = checkboxGroup.querySelectorAll(".checkbox-item")[1];
      expect(checkbox.getAttribute("aria-checked")).toBe("true");
    });

    it("sets checkbox to unchecked", () => {
      checkboxInstance.toggleCheckbox!(1);
      checkboxInstance.setCheckboxState!(1, false);

      const checkbox = checkboxGroup.querySelectorAll(".checkbox-item")[1];
      expect(checkbox.getAttribute("aria-checked")).toBe("false");
    });

    it("handles invalid index gracefully", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      checkboxInstance.setCheckboxState!(-1, true);
      checkboxInstance.setCheckboxState!(999, true);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      consoleErrorSpy.mockRestore();
    });
  });

  describe("getCheckedStates", () => {
    beforeEach(() => {
      checkboxInstance = makeCheckboxAccessible({
        checkboxGroupId: "test-checkbox-group",
        checkboxesClass: "checkbox-item"
      });
    });

    it("returns array of boolean states", () => {
      expect(checkboxInstance.getCheckedStates!()).toEqual([false, false, false]);

      checkboxInstance.toggleCheckbox!(0);
      checkboxInstance.toggleCheckbox!(2);

      expect(checkboxInstance.getCheckedStates!()).toEqual([true, false, true]);
    });
  });

  describe("getCheckedIndices", () => {
    beforeEach(() => {
      checkboxInstance = makeCheckboxAccessible({
        checkboxGroupId: "test-checkbox-group",
        checkboxesClass: "checkbox-item"
      });
    });

    it("returns array of checked indices", () => {
      expect(checkboxInstance.getCheckedIndices!()).toEqual([]);

      checkboxInstance.toggleCheckbox!(0);
      expect(checkboxInstance.getCheckedIndices!()).toEqual([0]);

      checkboxInstance.toggleCheckbox!(2);
      expect(checkboxInstance.getCheckedIndices!()).toEqual([0, 2]);

      checkboxInstance.toggleCheckbox!(1);
      expect(checkboxInstance.getCheckedIndices!()).toEqual([0, 1, 2]);
    });
  });

  describe("keyboard navigation", () => {
    beforeEach(() => {
      checkboxInstance = makeCheckboxAccessible({
        checkboxGroupId: "test-checkbox-group",
        checkboxesClass: "checkbox-item"
      });
    });

    it("toggles on Space key", () => {
      const checkbox = checkboxGroup.querySelectorAll(".checkbox-item")[0] as HTMLElement;
      checkbox.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

      expect(checkbox.getAttribute("aria-checked")).toBe("true");
    });

    it("focuses next checkbox on ArrowDown", () => {
      const checkbox0 = checkboxGroup.querySelectorAll(".checkbox-item")[0] as HTMLElement;
      const checkbox1 = checkboxGroup.querySelectorAll(".checkbox-item")[1] as HTMLElement;

      checkbox0.focus();
      checkbox0.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      expect(document.activeElement).toBe(checkbox1);
    });

    it("focuses previous checkbox on ArrowUp", () => {
      const checkbox0 = checkboxGroup.querySelectorAll(".checkbox-item")[0] as HTMLElement;
      const checkbox1 = checkboxGroup.querySelectorAll(".checkbox-item")[1] as HTMLElement;

      checkbox1.focus();
      checkbox1.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      expect(document.activeElement).toBe(checkbox0);
    });

    it("focuses first checkbox on Home", () => {
      const checkbox0 = checkboxGroup.querySelectorAll(".checkbox-item")[0] as HTMLElement;
      const checkbox2 = checkboxGroup.querySelectorAll(".checkbox-item")[2] as HTMLElement;

      checkbox2.focus();
      checkbox2.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));

      expect(document.activeElement).toBe(checkbox0);
    });

    it("focuses last checkbox on End", () => {
      const checkbox0 = checkboxGroup.querySelectorAll(".checkbox-item")[0] as HTMLElement;
      const checkbox2 = checkboxGroup.querySelectorAll(".checkbox-item")[2] as HTMLElement;

      checkbox0.focus();
      checkbox0.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));

      expect(document.activeElement).toBe(checkbox2);
    });

    it("wraps around from last to first on ArrowDown", () => {
      const checkbox0 = checkboxGroup.querySelectorAll(".checkbox-item")[0] as HTMLElement;
      const checkbox2 = checkboxGroup.querySelectorAll(".checkbox-item")[2] as HTMLElement;

      checkbox2.focus();
      checkbox2.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      expect(document.activeElement).toBe(checkbox0);
    });

    it("wraps around from first to last on ArrowUp", () => {
      const checkbox0 = checkboxGroup.querySelectorAll(".checkbox-item")[0] as HTMLElement;
      const checkbox2 = checkboxGroup.querySelectorAll(".checkbox-item")[2] as HTMLElement;

      checkbox0.focus();
      checkbox0.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      expect(document.activeElement).toBe(checkbox2);
    });
  });

  describe("click interactions", () => {
    beforeEach(() => {
      checkboxInstance = makeCheckboxAccessible({
        checkboxGroupId: "test-checkbox-group",
        checkboxesClass: "checkbox-item"
      });
    });

    it("toggles checkbox on click", () => {
      const checkbox = checkboxGroup.querySelectorAll(".checkbox-item")[0] as HTMLElement;
      
      checkbox.click();
      expect(checkbox.getAttribute("aria-checked")).toBe("true");

      checkbox.click();
      expect(checkbox.getAttribute("aria-checked")).toBe("false");
    });

    it("allows multiple checkboxes to be checked", () => {
      const checkbox0 = checkboxGroup.querySelectorAll(".checkbox-item")[0] as HTMLElement;
      const checkbox1 = checkboxGroup.querySelectorAll(".checkbox-item")[1] as HTMLElement;
      const checkbox2 = checkboxGroup.querySelectorAll(".checkbox-item")[2] as HTMLElement;

      checkbox0.click();
      checkbox1.click();
      checkbox2.click();

      expect(checkboxInstance.getCheckedIndices!()).toEqual([0, 1, 2]);
    });
  });

  describe("cleanup", () => {
    it("removes event listeners", () => {
      checkboxInstance = makeCheckboxAccessible({
        checkboxGroupId: "test-checkbox-group",
        checkboxesClass: "checkbox-item"
      });

      const checkbox = checkboxGroup.querySelectorAll(".checkbox-item")[0] as HTMLElement;
      
      checkboxInstance.cleanup();

      // After cleanup, events should not change state
      const initialChecked = checkbox.getAttribute("aria-checked");
      checkbox.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
      
      expect(checkbox.getAttribute("aria-checked")).toBe(initialChecked);
    });
  });
});
