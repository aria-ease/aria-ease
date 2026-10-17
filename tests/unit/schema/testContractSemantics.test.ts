import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import Ajv from "ajv";
import { afterAll, describe, expect, it } from "vitest";
import { RelativeTargetResolver } from "../../../src/utils/test/src/RelativeTargetResolver";
import { validateContractSchema } from "../../../src/utils/test/dsl/src/contractValidator";
import { runContractTestsPlaywright } from "../../../src/utils/test/src/contractTestRunnerPlaywright";
import { closeSharedBrowser } from "../../../src/utils/test/src/playwrightTestHarness";
import schemaPath from "../../../src/utils/test/contract/contract.schema.json";
const standaloneSchema = schemaPath;
const compiledContract = {
  meta: {
    id: "aria-ease.contract.combobox",
    version: "1.0.0",
    description: "Representative compiled combobox contract",
    source: { apg: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" },
    W3CName: "Combobox"
  },
  selectors: {
    main: "[role=combobox]",
    relative: "[role=option]",
    popup: "[role=listbox]"
  },
  relationships: [
    {
      type: "aria-reference",
      from: "main",
      attribute: "aria-controls",
      to: "popup",
      level: "required"
    },
    {
      type: "contains",
      parent: "popup",
      child: "relative",
      level: "required"
    }
  ],
  static: [
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-expanded",
      expectedValue: "false",
      failureMessage: "",
      level: "required"
    }
  ],
  dynamic: [
    {
      description: "Open the listbox.",
      level: "required",
      action: [{ type: "click", target: "main" }],
      assertions: [
        {
          target: "popup",
          assertion: "toBeVisible",
          failureMessage: "Expected popup to be visible"
        },
        {
          target: "main",
          assertion: "toHaveAttribute",
          attribute: "aria-expanded",
          expectedValue: "true",
          failureMessage: "Expected combobox to be expanded"
        }
      ]
    }
  ]
};

function createAjvValidator() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const { $schema: _schemaReference, ...schemaForValidation } = standaloneSchema;
  return ajv.compile(schemaForValidation);
}

describe("contract schema and relative-target semantics", () => {
  afterAll(async () => {
    await closeSharedBrowser();
  });

  it("accepts the compiled direct-static shape in both validators", () => {
    const result = validateContractSchema(compiledContract);
    const validate = createAjvValidator();

    expect(result.valid).toBe(true);
    expect(compiledContract.static[0]).not.toHaveProperty("assertions");
    expect(validate(compiledContract)).toBe(true);
  });

  it("accepts a valid direct static assertion object", () => {
    const contract = structuredClone(compiledContract);
    contract.static = [
      {
        target: "main",
        assertion: "toHaveAttribute",
        attribute: "aria-expanded",
        expectedValue: "false",
        failureMessage: "",
        level: "required"
      }
    ];

    expect(validateContractSchema(contract).valid).toBe(true);
    expect(createAjvValidator()(contract)).toBe(true);
  });

  it("accepts the representative compiled contract structure", () => {
    const validate = createAjvValidator();

    expect(validateContractSchema(compiledContract).valid).toBe(true);
    expect(validate(compiledContract)).toBe(true);
  });

  it("rejects malformed static assertions and invalid assertion values", () => {
    const missingTarget = structuredClone(compiledContract);
    delete missingTarget.static[0].target;

    const invalidAssertion = structuredClone(compiledContract);
    invalidAssertion.static[0].assertion = "notAnAssertion";

    expect(validateContractSchema(missingTarget).valid).toBe(false);
    expect(createAjvValidator()(missingTarget)).toBe(false);
    expect(createAjvValidator()(invalidAssertion)).toBe(false);
  });

  it("rejects invalid levels, unsupported actions, and malformed references in AJV", () => {
    const invalidLevel = structuredClone(compiledContract);
    invalidLevel.static[0].level = "blocking";

    const invalidAction = structuredClone(compiledContract);
    invalidAction.dynamic[0].action[0].type = "drag";

    const malformedReference = structuredClone(compiledContract);
    malformedReference.dynamic[0].assertions[1].expectedValue = {
      ref: 42,
      property: "id"
    };

    expect(validateContractSchema(invalidLevel).valid).toBe(false);
    expect(validateContractSchema(invalidAction).valid).toBe(false);
    expect(validateContractSchema(malformedReference).valid).toBe(false);
    expect(createAjvValidator()(invalidLevel)).toBe(false);
    expect(createAjvValidator()(invalidAction)).toBe(false);
    expect(createAjvValidator()(malformedReference)).toBe(false);
  });

  it("rejects missing required fields", () => {
    const missingSelectors = structuredClone(compiledContract);
    delete missingSelectors.selectors;

    const missingDynamicDescription = structuredClone(compiledContract);
    delete missingDynamicDescription.dynamic[0].description;

    expect(validateContractSchema(missingSelectors).valid).toBe(false);
    expect(createAjvValidator()(missingSelectors)).toBe(false);
    expect(validateContractSchema(missingDynamicDescription).valid).toBe(false);
    expect(createAjvValidator()(missingDynamicDescription)).toBe(false);
  });

  it("resolves numeric relative targets as one-based positions", async () => {
    const first = { id: "first" };
    const second = { id: "second" };
    const page = {
      locator: () => ({
        all: async () => [first, second]
      })
    } as never;

    await expect(
      RelativeTargetResolver.resolve(page, "[role=option]", 1)
    ).resolves.toBe(first);
    await expect(
      RelativeTargetResolver.resolve(page, "[role=option]", 2)
    ).resolves.toBe(second);
  });

  it("resolves numeric expected-value references through the Playwright runner", async () => {
    const tempDirectory = mkdtempSync(resolve(tmpdir(), "aria-ease-contract-"));
    const contractFile = resolve(tempDirectory, "relative-reference.contract.json");
    const contract = {
      selectors: {
        main: "[role=combobox]",
        relative: "[role=option]"
      },
      relationships: [],
      static: [],
      dynamic: [
        {
          description: "Resolve the selected option id.",
          action: [],
          assertions: [
            {
              target: "main",
              assertion: "toHaveAttribute",
              attribute: "aria-describedby",
              expectedValue: {
                ref: "relative",
                relativeTarget: 2,
                property: "id"
              },
              failureMessage: "Expected the second option id."
            }
          ]
        }
      ]
    };
    writeFileSync(contractFile, JSON.stringify(contract));

    try {
      const result = await runContractTestsPlaywright(
        "combobox",
        "data:text/html," + encodeURIComponent(`
          <div role="combobox" aria-describedby="second-option"></div>
          <div role="option" id="first-option"></div>
          <div role="option" id="second-option"></div>
        `),
        undefined,
        {
          test: {
            components: [{ name: "combobox", contractPath: contractFile }],
            assertionTimeoutMs: 500,
            componentReadyTimeoutMs: 500
          }
        }
      );

      expect(result.failures).toEqual([]);
      expect(result.passes).toHaveLength(1);
    } finally {
      rmSync(tempDirectory, { recursive: true, force: true });
    }
  });

  it("preserves dynamic assertion metadata in structured findings", async () => {
    const tempDirectory = mkdtempSync(resolve(tmpdir(), "aria-ease-dynamic-findings-"));
    const contractFile = resolve(tempDirectory, "dynamic-findings.contract.json");
    writeFileSync(contractFile, JSON.stringify({
      selectors: {
        main: "[role=combobox]",
        input: "[role=combobox]"
      },
      relationships: [],
      static: [],
      dynamic: [
        {
          description: "Escape clears the combobox.",
          level: "required",
          action: [],
          assertions: [
            {
              target: "main",
              assertion: "toHaveAttribute",
              attribute: "aria-activedescendant",
              expectedValue: "apple",
              failureMessage: "Expected active option."
            }
          ]
        },
        {
          description: "Escape clears the active descendant.",
          level: "required",
          action: [],
          assertions: [
            {
              target: "main",
              assertion: "toHaveAttribute",
              attribute: "aria-activedescendant",
              expectedValue: "",
              failureMessage: "Expected no active option."
            }
          ]
        },
        {
          description: "Escape clears the input.",
          level: "required",
          action: [],
          assertions: [
            {
              target: "input",
              assertion: "toHaveValue",
              expectedValue: "",
              failureMessage: "Expected empty input."
            }
          ]
        },
        {
          description: "Arrow opens the combobox.",
          level: "required",
          action: [],
          assertions: [
            {
              target: "main",
              assertion: "toHaveAttribute",
              attribute: "aria-expanded",
              expectedValue: "true",
              failureMessage: "Expected expanded combobox."
            }
          ]
        },
        {
          description: "Enter selects the active option.",
          level: "required",
          action: [],
          assertions: [
            {
              target: "main",
              assertion: "toHaveAttribute",
              attribute: "aria-selected",
              expectedValue: "true",
              failureMessage: "Expected selected option."
            }
          ]
        }
      ]
    }));

    try {
      const result = await runContractTestsPlaywright(
        "combobox",
        "data:text/html," + encodeURIComponent(`
          <input role="combobox" aria-expanded="false" value="test">
        `),
        "strict",
        {
          test: {
            components: [{ name: "combobox", contractPath: contractFile }],
            assertionTimeoutMs: 300,
            componentReadyTimeoutMs: 300
          }
        }
      );

      const dynamicFindings = result.findings?.filter(({ phase }) => phase === "dynamic") ?? [];
      expect(dynamicFindings).toHaveLength(5);
      expect(dynamicFindings.map(({ scenario }) => scenario)).toEqual([
        "Escape clears the combobox.",
        "Escape clears the active descendant.",
        "Escape clears the input.",
        "Arrow opens the combobox.",
        "Enter selects the active option."
      ]);
      expect(dynamicFindings.map(({ expected }) => expected)).toEqual(["apple", "", "", "true", "true"]);
      expect(dynamicFindings.map(({ actual }) => actual)).toEqual([null, null, "test", "false", null]);
      expect(dynamicFindings.every(({ status, level, assertion }) =>
        status === "fail" && level === "required" && assertion
      )).toBe(true);
      expect(result.failures).toHaveLength(5);
    } finally {
      rmSync(tempDirectory, { recursive: true, force: true });
    }
  });

  it("scopes a targeted combobox to one instance and its aria-controls popup", async () => {
    const tempDirectory = mkdtempSync(resolve(tmpdir(), "aria-ease-targeted-"));
    const contractFile = resolve(tempDirectory, "targeted.contract.json");
    writeFileSync(contractFile, JSON.stringify({
      selectors: {
        main: "[role=combobox]",
        input: "[role=combobox]",
        button: "button[data-combo-button]",
        popup: "[role=listbox]",
        options: "[role=option]",
        relative: "[role=option]"
      },
      relationships: [{
        type: "aria-reference",
        from: "main",
        attribute: "aria-controls",
        to: "popup",
        level: "required"
      }, {
        type: "contains",
        parent: "popup",
        child: "options",
        level: "required"
      }],
      static: [{
        target: "main",
        assertion: "toHaveRole",
        attribute: "role",
        expectedValue: "combobox",
        level: "required"
      }],
      dynamic: [{
        description: "The selected combobox uses its own button and popup.",
        level: "required",
        setup: [{
          type: "type",
          target: "input",
          value: "second value"
        }],
        action: [{
          type: "click",
          target: "button"
        }],
        assertions: [{
          target: "input",
          assertion: "toHaveValue",
          expectedValue: "second value",
          failureMessage: "The selected input was not used."
        }, {
          target: "popup",
          assertion: "toBeVisible",
          failureMessage: "The selected popup was not opened."
        }, {
          target: "relative",
          selectorKey: "relative",
          relativeTarget: "first",
          assertion: "toHaveAttribute",
          attribute: "id",
          expectedValue: "second-option",
          failureMessage: "The selected popup options were not used."
        }]
      }]
    }));

    try {
      const result = await runContractTestsPlaywright(
        "combobox",
        "data:text/html," + encodeURIComponent(`
          <script>
            document.addEventListener("click", (event) => {
              const button = event.target.closest("button[data-combo-button]");
              if (!button) return;
              const input = button.parentElement.querySelector("[role=combobox]");
              const popup = document.getElementById(input.getAttribute("aria-controls"));
              popup.hidden = !popup.hidden;
            });
          </script>
          <div><input id="first" role="combobox" aria-controls="first-popup" aria-expanded="false">
            <button type="button" data-combo-button>First button</button></div>
          <ul id="first-popup" role="listbox" hidden><li id="first-option" role="option" aria-selected="false">First</li></ul>
          <div><input id="second" role="combobox" aria-controls="second-popup" aria-expanded="false">
            <button type="button" data-combo-button>Second button</button></div>
          <ul id="second-popup" role="listbox" hidden><li id="second-option" role="option" aria-selected="false">Second</li></ul>
        `),
        undefined,
        {
          test: {
            components: [{ name: "combobox", contractPath: contractFile }],
            assertionTimeoutMs: 500,
            componentReadyTimeoutMs: 500
          }
        },
        undefined,
        { targetSelector: "#second" }
      );

      expect(result.failures).toEqual([]);
      expect(result.passes.filter((pass) => pass.includes("The selected combobox uses its own button and popup.")).length).toBe(3);
    } finally {
      rmSync(tempDirectory, { recursive: true, force: true });
    }
  });

  it("rejects an ambiguous targeted combobox selector", async () => {
    await expect(runContractTestsPlaywright(
      "combobox",
      "data:text/html," + encodeURIComponent(`
        <input role="combobox" aria-controls="one"><ul id="one" role="listbox"></ul>
        <input role="combobox" aria-controls="two"><ul id="two" role="listbox"></ul>
      `),
      undefined,
      { test: { components: [{ name: "combobox", contractPath: resolve(import.meta.dirname, "./combobox.listbox.contract.json") }] } },
      undefined,
      { targetSelector: "[role=combobox]" }
    )).rejects.toThrow(/matched 2 elements/);
  });

  it("rejects a targeted selector that matches no elements", async () => {
    await expect(runContractTestsPlaywright(
      "combobox",
      "data:text/html,<input role=\"combobox\" aria-controls=\"popup\"><ul id=\"popup\" role=\"listbox\"></ul>",
      undefined,
      { test: { components: [{ name: "combobox", contractPath: resolve(import.meta.dirname, "./combobox.listbox.contract.json") }] } },
      undefined,
      { targetSelector: "#missing" }
    )).rejects.toThrow(/matched no elements/);
  });

  it("rejects a targeted element that is not a combobox", async () => {
    await expect(runContractTestsPlaywright(
      "combobox",
      "data:text/html,<button id=\"not-combobox\">Open</button>",
      undefined,
      { test: { components: [{ name: "combobox", contractPath: resolve(import.meta.dirname, "./combobox.listbox.contract.json") }] } },
      undefined,
      { targetSelector: "#not-combobox" }
    )).rejects.toThrow(/does not identify a valid combobox/);
  });

  it("rejects a targeted combobox with an invalid popup relationship", async () => {
    await expect(runContractTestsPlaywright(
      "combobox",
      "data:text/html,<input id=\"broken\" role=\"combobox\" aria-controls=\"missing-popup\">",
      undefined,
      { test: { components: [{ name: "combobox", contractPath: resolve(import.meta.dirname, "./combobox.listbox.contract.json") }] } },
      undefined,
      { targetSelector: "#broken" }
    )).rejects.toThrow(/missing or ambiguous popup/);
  });

  it.each([
    [0, "zero"],
    [3, "out of range"],
    ["not-a-number", "malformed"]
  ])("reports an invalid %s expected-value reference", async (relativeTarget, _label) => {
    const tempDirectory = mkdtempSync(resolve(tmpdir(), "aria-ease-contract-"));
    const contractFile = resolve(tempDirectory, "invalid-reference.contract.json");
    const contract = {
      selectors: {
        main: "[role=combobox]",
        relative: "[role=option]"
      },
      relationships: [],
      static: [],
      dynamic: [
        {
          description: "Reject an invalid option reference.",
          action: [],
          assertions: [
            {
              target: "main",
              assertion: "toHaveAttribute",
              attribute: "aria-describedby",
              expectedValue: {
                ref: "relative",
                relativeTarget,
                property: "id"
              },
              failureMessage: "Expected a valid option id."
            }
          ]
        }
      ]
    };
    writeFileSync(contractFile, JSON.stringify(contract));

    try {
      const result = await runContractTestsPlaywright(
        "combobox",
        "data:text/html," + encodeURIComponent(`
          <div role="combobox" aria-describedby="first-option"></div>
          <div role="option" id="first-option"></div>
          <div role="option" id="second-option"></div>
        `),
        undefined,
        {
          test: {
            components: [{ name: "combobox", contractPath: contractFile }],
            assertionTimeoutMs: 500,
            componentReadyTimeoutMs: 500
          }
        }
      );

      expect(result.failures).toHaveLength(1);
      expect(result.failures[0]).toContain("Expected a valid option id.");
    } finally {
      rmSync(tempDirectory, { recursive: true, force: true });
    }
  });
});
