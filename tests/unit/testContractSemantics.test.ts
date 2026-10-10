import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import Ajv from "ajv";
import { afterAll, describe, expect, it } from "vitest";
import { RelativeTargetResolver } from "../../src/utils/test/src/RelativeTargetResolver";
import { validateContractSchema } from "../../src/utils/test/dsl/src/contractValidator";
import { runContractTestsPlaywright } from "../../src/utils/test/src/contractTestRunnerPlaywright";
import { closeSharedBrowser } from "../../src/utils/test/src/playwrightTestHarness";

const contractPath = resolve(
  import.meta.dirname,
  "../../../exprmnts/tests/contracts/combobox.listbox.contract.json"
);
const schemaPath = resolve(
  import.meta.dirname,
  "../../src/utils/test/contract/contract.schema.json"
);
const compiledContract = JSON.parse(readFileSync(contractPath, "utf8"));
const compiledContractsDirectory = resolve(
  import.meta.dirname,
  "../../../exprmnts/tests/contracts"
);
const standaloneSchema = JSON.parse(readFileSync(schemaPath, "utf8"));

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

  it("accepts all supplied compiled contract structures", () => {
    const validate = createAjvValidator();
    const contractFiles = readdirSync(compiledContractsDirectory)
      .filter(file => file.endsWith(".json"));

    expect(contractFiles.length).toBeGreaterThan(1);

    for (const file of contractFiles) {
      const contract = JSON.parse(
        readFileSync(resolve(compiledContractsDirectory, file), "utf8")
      );

      expect(validateContractSchema(contract).valid, file).toBe(true);
      expect(validate(contract), file).toBe(true);
    }
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
    malformedReference.dynamic[3].assertions[1].expectedValue = {
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
