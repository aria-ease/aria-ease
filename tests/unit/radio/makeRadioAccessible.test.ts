import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { makeRadioAccessible } from "../../../src/radio";

describe("makeRadioAccessible", () => {
  let radioGroup: HTMLElement;
  let radioInstance: ReturnType<typeof makeRadioAccessible>;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-radio-group">
        <div class="radio-button">Option 1</div>
        <div class="radio-button">Option 2</div>
        <div class="radio-button">Option 3</div>
      </div>
    `;
    radioGroup = document.getElementById("test-radio-group")!;
  });

  afterEach(() => {
    if (radioInstance) {
      radioInstance.cleanup();
    }
  });

  describe("initialization", () => {
    it("sets ARIA attributes on radio group and radios", () => {
      radioInstance = makeRadioAccessible({
        radioGroupId: "test-radio-group",
        radiosClass: "radio-button"
      });

      expect(radioGroup.getAttribute("role")).toBe("radiogroup");

      const radios = radioGroup.querySelectorAll(".radio-button");
      radios.forEach((radio, index) => {
        expect(radio.getAttribute("role")).toBe("radio");
        expect(radio.getAttribute("aria-checked")).toBe(index === 0 ? "true" : "false");
        expect(radio.getAttribute("tabindex")).toBe(index === 0 ? "0" : "-1");
      });
    });

    it("respects defaultSelectedIndex", () => {
      radioInstance = makeRadioAccessible({
        radioGroupId: "test-radio-group",
        radiosClass: "radio-button",
        defaultSelectedIndex: 2
      });

      const radios = radioGroup.querySelectorAll(".radio-button");
      expect(radios[0].getAttribute("aria-checked")).toBe("false");
      expect(radios[1].getAttribute("aria-checked")).toBe("false");
      expect(radios[2].getAttribute("aria-checked")).toBe("true");
      expect(radios[2].getAttribute("tabindex")).toBe("0");
    });

    it("does not override existing role on group", () => {
      radioGroup.setAttribute("role", "group");

      radioInstance = makeRadioAccessible({
        radioGroupId: "test-radio-group",
        radiosClass: "radio-button"
      });

      expect(radioGroup.getAttribute("role")).toBe("group");
    });

    it("returns cleanup function when group not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      radioInstance = makeRadioAccessible({
        radioGroupId: "non-existent",
        radiosClass: "radio-button"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Element with id=\"non-existent\" not found")
      );
      expect(typeof radioInstance.cleanup).toBe("function");

      consoleErrorSpy.mockRestore();
    });

    it("returns cleanup function when radios not found", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      radioInstance = makeRadioAccessible({
        radioGroupId: "test-radio-group",
        radiosClass: "non-existent"
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("No elements with class=\"non-existent\" found")
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("selectRadio", () => {
    beforeEach(() => {
      radioInstance = makeRadioAccessible({
        radioGroupId: "test-radio-group",
        radiosClass: "radio-button"
      });
    });

    it("selects the specified radio button", () => {
      radioInstance.selectRadio!(1);

      const radios = radioGroup.querySelectorAll(".radio-button");
      expect(radios[0].getAttribute("aria-checked")).toBe("false");
      expect(radios[0].getAttribute("tabindex")).toBe("-1");
      expect(radios[1].getAttribute("aria-checked")).toBe("true");
      expect(radios[1].getAttribute("tabindex")).toBe("0");
      expect(document.activeElement).toBe(radios[1]);
    });

    it("unselects previously selected radio", () => {
      radioInstance.selectRadio!(1);
      radioInstance.selectRadio!(2);

      const radios = radioGroup.querySelectorAll(".radio-button");
      expect(radios[1].getAttribute("aria-checked")).toBe("false");
      expect(radios[2].getAttribute("aria-checked")).toBe("true");
    });

    it("handles invalid index gracefully", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      radioInstance.selectRadio!(-1);
      radioInstance.selectRadio!(999);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      consoleErrorSpy.mockRestore();
    });
  });

  describe("getSelectedIndex", () => {
    beforeEach(() => {
      radioInstance = makeRadioAccessible({
        radioGroupId: "test-radio-group",
        radiosClass: "radio-button",
        defaultSelectedIndex: 1
      });
    });

    it("returns the currently selected index", () => {
      expect(radioInstance.getSelectedIndex!()).toBe(1);

      radioInstance.selectRadio!(2);
      expect(radioInstance.getSelectedIndex!()).toBe(2);
    });
  });

  describe("keyboard navigation", () => {
    beforeEach(() => {
      radioInstance = makeRadioAccessible({
        radioGroupId: "test-radio-group",
        radiosClass: "radio-button"
      });
    });

    it("selects next radio on ArrowDown", () => {
      const radio0 = radioGroup.querySelectorAll(".radio-button")[0] as HTMLElement;
      radio0.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      const radios = radioGroup.querySelectorAll(".radio-button");
      expect(radios[1].getAttribute("aria-checked")).toBe("true");
      expect(document.activeElement).toBe(radios[1]);
    });

    it("selects next radio on ArrowRight", () => {
      const radio0 = radioGroup.querySelectorAll(".radio-button")[0] as HTMLElement;
      radio0.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      const radios = radioGroup.querySelectorAll(".radio-button");
      expect(radios[1].getAttribute("aria-checked")).toBe("true");
    });

    it("selects previous radio on ArrowUp", () => {
      radioInstance.selectRadio!(1);
      const radio1 = radioGroup.querySelectorAll(".radio-button")[1] as HTMLElement;
      radio1.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      const radios = radioGroup.querySelectorAll(".radio-button");
      expect(radios[0].getAttribute("aria-checked")).toBe("true");
      expect(document.activeElement).toBe(radios[0]);
    });

    it("selects previous radio on ArrowLeft", () => {
      radioInstance.selectRadio!(1);
      const radio1 = radioGroup.querySelectorAll(".radio-button")[1] as HTMLElement;
      radio1.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));

      const radios = radioGroup.querySelectorAll(".radio-button");
      expect(radios[0].getAttribute("aria-checked")).toBe("true");
    });

    it("selects current radio on Space", () => {
      radioInstance.selectRadio!(1);
      const radio1 = radioGroup.querySelectorAll(".radio-button")[1] as HTMLElement;
      radio1.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

      expect(radio1.getAttribute("aria-checked")).toBe("true");
    });

    it("selects first radio on Home", () => {
      radioInstance.selectRadio!(2);
      const radio2 = radioGroup.querySelectorAll(".radio-button")[2] as HTMLElement;
      radio2.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));

      const radios = radioGroup.querySelectorAll(".radio-button");
      expect(radios[0].getAttribute("aria-checked")).toBe("true");
      expect(document.activeElement).toBe(radios[0]);
    });

    it("selects last radio on End", () => {
      const radio0 = radioGroup.querySelectorAll(".radio-button")[0] as HTMLElement;
      radio0.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));

      const radios = radioGroup.querySelectorAll(".radio-button");
      expect(radios[2].getAttribute("aria-checked")).toBe("true");
      expect(document.activeElement).toBe(radios[2]);
    });

    it("wraps around from last to first on ArrowDown", () => {
      radioInstance.selectRadio!(2);
      const radio2 = radioGroup.querySelectorAll(".radio-button")[2] as HTMLElement;
      radio2.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      const radios = radioGroup.querySelectorAll(".radio-button");
      expect(radios[0].getAttribute("aria-checked")).toBe("true");
    });

    it("wraps around from first to last on ArrowUp", () => {
      const radio0 = radioGroup.querySelectorAll(".radio-button")[0] as HTMLElement;
      radio0.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      const radios = radioGroup.querySelectorAll(".radio-button");
      expect(radios[2].getAttribute("aria-checked")).toBe("true");
    });
  });

  describe("click interactions", () => {
    beforeEach(() => {
      radioInstance = makeRadioAccessible({
        radioGroupId: "test-radio-group",
        radiosClass: "radio-button"
      });
    });

    it("selects radio on click", () => {
      const radio1 = radioGroup.querySelectorAll(".radio-button")[1] as HTMLElement;
      radio1.click();

      expect(radio1.getAttribute("aria-checked")).toBe("true");
      expect(radioInstance.getSelectedIndex!()).toBe(1);
    });
  });

  describe("cleanup", () => {
    it("removes event listeners", () => {
      radioInstance = makeRadioAccessible({
        radioGroupId: "test-radio-group",
        radiosClass: "radio-button"
      });

      const radio0 = radioGroup.querySelectorAll(".radio-button")[0] as HTMLElement;
      
      radioInstance.cleanup();

      // After cleanup, keyboard events should not change selection
      const initialChecked = radio0.getAttribute("aria-checked");
      radio0.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      
      // Selection should not have changed
      expect(radio0.getAttribute("aria-checked")).toBe(initialChecked);
    });
  });
});
