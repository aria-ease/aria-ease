type Level = "required" | "recommended" | "optional";

type ContractMeta = {
  id?: string;
  version?: string;
  description?: string;
  source?: {
    apg?: string;
    wcag?: string[];
  };
  W3CName?: string;
};

type SelectorsMap = Record<string, string>;

type RelationshipInvariant =
  | {
      type: "aria-reference";
      from: string;
      attribute: string;
      to: string;
      level?: Level;
    }
  | {
      type: "contains";
      parent: string;
      child: string;
      level?: Level;
    };

type StaticAssertion = {
  target: string;
  attribute: string;
  expectedValue?: string;
  failureMessage: string;
  level: Level;
};

type DynamicAction = {
  type: "focus" | "type" | "click" | "keypress" | "hover";
  target: string;
  key?: string;
  value?: string;
  relativeTarget?: string;
};

type DynamicAssertion = {
  target: string;
  assertion: "toBeVisible" | "notToBeVisible" | "toHaveAttribute" | "toHaveValue" | "toHaveFocus" | "toHaveRole";
  attribute?: string;
  expectedValue?: string;
  failureMessage?: string;
  relativeTarget?: string;
  level?: Level;
};

type DynamicTest = {
  description: string;
  level?: Level;
  action: DynamicAction[];
  assertions: DynamicAssertion[];
};

type JsonContract = {
  meta?: ContractMeta;
  selectors: SelectorsMap;
  relationships?: RelationshipInvariant[];
  static: Array<{ assertions: StaticAssertion[] }>;
  dynamic: DynamicTest[];
};

class FluentContract {
  constructor(private readonly jsonContract: JsonContract) {}

  toJSON(): JsonContract {
    return this.jsonContract;
  }
}

class StaticTargetBuilder {
  constructor(
    private readonly targetName: string,
    private readonly sink: StaticAssertion[]
  ) {}

  has(attribute: string, expectedValue?: string): { required: () => void; recommended: () => void; optional: () => void } {
    const create = (level: Level) => {
      this.sink.push({
        target: this.targetName,
        attribute,
        expectedValue,
        failureMessage: `Expected ${this.targetName} to have ${attribute}${expectedValue !== undefined ? `=${expectedValue}` : ""}.`,
        level,
      });
    };

    return {
      required: () => create("required"),
      recommended: () => create("recommended"),
      optional: () => create("optional"),
    };
  }
}

class StaticBuilder {
  constructor(private readonly sink: StaticAssertion[]) {}

  target(targetName: string): StaticTargetBuilder {
    return new StaticTargetBuilder(targetName, this.sink);
  }
}

class DynamicChain {
  private selectorTarget = "";
  private readonly actions: DynamicAction[] = [];
  private readonly assertions: DynamicAssertion[] = [];
  private explicitDescription = "";

  constructor(
    private readonly key: string,
    private readonly testsSink: DynamicTest[],
    private readonly selectors: SelectorsMap
  ) {}

  on(target: string): this {
    this.selectorTarget = target;
    this.actions.push({ type: "keypress", target, key: this.key });
    return this;
  }

  describe(description: string): this {
    this.explicitDescription = description;
    return this;
  }

  focus(targetExpression: string): this {
    const parsed = this.parseRelativeExpression(targetExpression);

    if (parsed) {
      if (!this.selectors[parsed.selectorKey]) {
        const availableSelectors = Object.keys(this.selectors).sort().join(", ") || "(none)";
        throw new Error(
          `Invalid focus target expression "${targetExpression}": selector "${parsed.selectorKey}" is not defined. ` +
            `Available selectors: ${availableSelectors}`
        );
      }

      // Ensure relative selector is available for resolver-based assertions.
      if (!this.selectors.relative && this.selectors[parsed.selectorKey]) {
        this.selectors.relative = this.selectors[parsed.selectorKey];
      }

      this.assertions.push({
        target: "relative",
        assertion: "toHaveFocus",
        relativeTarget: parsed.relativeTarget,
      });
    } else {
      this.assertions.push({
        target: targetExpression,
        assertion: "toHaveFocus",
      });
    }

    return this;
  }

  visible(target: string): this {
    this.assertions.push({ target, assertion: "toBeVisible" });
    return this;
  }

  hidden(target: string): this {
    this.assertions.push({ target, assertion: "notToBeVisible" });
    return this;
  }

  has(target: string, attribute: string, expectedValue?: string): this {
    this.assertions.push({
      target,
      assertion: "toHaveAttribute",
      attribute,
      expectedValue,
    });
    return this;
  }

  required(): void {
    this.finalize("required");
  }

  recommended(): void {
    this.finalize("recommended");
  }

  optional(): void {
    this.finalize("optional");
  }

  private finalize(level: Level): void {
    if (!this.selectorTarget) {
      throw new Error("Dynamic contract chain requires .on(<selectorKey>) before level terminator.");
    }

    const description =
      this.explicitDescription || `Pressing ${this.key} on ${this.selectorTarget} satisfies expected behavior.`;

    this.testsSink.push({
      description,
      level,
      action: this.actions,
      assertions: this.assertions.map((a) => ({ ...a, level })),
    });
  }

  private parseRelativeExpression(input: string): { relativeTarget: "next" | "previous" | "first" | "last"; selectorKey: string } | null {
    const match = input.match(/^(next|previous|first|last)\(([^)]+)\)$/);
    if (!match) return null;

    const relativeTarget = match[1] as "next" | "previous" | "first" | "last";
    const selectorKey = match[2].trim();
    return { relativeTarget, selectorKey };
  }
}

class ContractBuilder {
  private metaValue: ContractMeta = {};
  private selectorsValue: SelectorsMap = {};
  private readonly relationshipInvariants: RelationshipInvariant[] = [];
  private readonly staticAssertions: StaticAssertion[] = [];
  private readonly dynamicTests: DynamicTest[] = [];

  constructor(private readonly componentName: string) {}

  meta(meta: ContractMeta): this {
    this.metaValue = { ...this.metaValue, ...meta };
    return this;
  }

  selectors(selectors: SelectorsMap): this {
    this.selectorsValue = { ...this.selectorsValue, ...selectors };
    return this;
  }

  relationship(invariant: RelationshipInvariant): this {
    this.relationshipInvariants.push(invariant);
    return this;
  }

  relationships(builderFn: (r: {
    ariaReference: (from: string, attribute: string, to: string) => {
      required: () => void;
      recommended: () => void;
      optional: () => void;
    };
    contains: (parent: string, child: string) => {
      required: () => void;
      recommended: () => void;
      optional: () => void;
    };
  }) => void): this {
    builderFn({
      ariaReference: (from, attribute, to) => {
        const create = (level: Level) => {
          this.relationshipInvariants.push({
            type: "aria-reference",
            from,
            attribute,
            to,
            level,
          });
        };

        return {
          required: () => create("required"),
          recommended: () => create("recommended"),
          optional: () => create("optional"),
        };
      },
      contains: (parent, child) => {
        const create = (level: Level) => {
          this.relationshipInvariants.push({
            type: "contains",
            parent,
            child,
            level,
          });
        };

        return {
          required: () => create("required"),
          recommended: () => create("recommended"),
          optional: () => create("optional"),
        };
      },
    });
    return this;
  }

  static(builderFn: (s: StaticBuilder) => void): this {
    builderFn(new StaticBuilder(this.staticAssertions));
    return this;
  }

  when(key: string): DynamicChain {
    return new DynamicChain(key, this.dynamicTests, this.selectorsValue);
  }

  private validateRelationshipInvariants(): void {
    if (this.relationshipInvariants.length === 0) {
      return;
    }

    const selectorKeys = new Set(Object.keys(this.selectorsValue));
    const available = Object.keys(this.selectorsValue).sort().join(", ");
    const errors: string[] = [];

    this.relationshipInvariants.forEach((invariant, index) => {
      const prefix = `relationships[${index}] (${invariant.type})`;

      if (invariant.type === "aria-reference") {
        if (!selectorKeys.has(invariant.from)) {
          errors.push(`${prefix}: "from" references unknown selector "${invariant.from}"`);
        }
        if (!selectorKeys.has(invariant.to)) {
          errors.push(`${prefix}: "to" references unknown selector "${invariant.to}"`);
        }
      }

      if (invariant.type === "contains") {
        if (!selectorKeys.has(invariant.parent)) {
          errors.push(`${prefix}: "parent" references unknown selector "${invariant.parent}"`);
        }
        if (!selectorKeys.has(invariant.child)) {
          errors.push(`${prefix}: "child" references unknown selector "${invariant.child}"`);
        }
      }
    });

    if (errors.length > 0) {
      const availableSelectorsMessage = available.length > 0 ? available : "(none)";
      throw new Error(
        [
          `Contract invariant validation failed for component "${this.componentName}".`,
          ...errors.map((error) => `- ${error}`),
          `Available selectors: ${availableSelectorsMessage}`,
        ].join("\n")
      );
    }
  }

  private validateStaticTargets(): void {
    const selectorKeys = new Set(Object.keys(this.selectorsValue));
    const available = Object.keys(this.selectorsValue).sort().join(", ") || "(none)";
    const errors: string[] = [];

    this.staticAssertions.forEach((assertion, index) => {
      if (!selectorKeys.has(assertion.target)) {
        errors.push(`static.assertions[${index}]: target "${assertion.target}" is not defined in selectors`);
      }
    });

    if (errors.length > 0) {
      throw new Error(
        [
          `Contract static target validation failed for component "${this.componentName}".`,
          ...errors.map((error) => `- ${error}`),
          `Available selectors: ${available}`,
        ].join("\n")
      );
    }
  }

  private validateDynamicTargets(): void {
    const selectorKeys = new Set(Object.keys(this.selectorsValue));
    const available = Object.keys(this.selectorsValue).sort().join(", ") || "(none)";
    const errors: string[] = [];

    const isValidActionTarget = (target: string): boolean => {
      return selectorKeys.has(target) || target === "document" || target === "relative";
    };

    const isValidAssertionTarget = (target: string): boolean => {
      return selectorKeys.has(target) || target === "relative";
    };

    this.dynamicTests.forEach((test, testIndex) => {
      test.action.forEach((action, actionIndex) => {
        if (!isValidActionTarget(action.target)) {
          errors.push(
            `dynamic[${testIndex}].action[${actionIndex}]: target "${action.target}" is not defined in selectors`
          );
        }
      });

      test.assertions.forEach((assertion, assertionIndex) => {
        if (!isValidAssertionTarget(assertion.target)) {
          errors.push(
            `dynamic[${testIndex}].assertions[${assertionIndex}]: target "${assertion.target}" is not defined in selectors`
          );
        }

        if (assertion.target === "relative" && !this.selectorsValue.relative) {
          errors.push(
            `dynamic[${testIndex}].assertions[${assertionIndex}]: target "relative" requires selectors.relative to be defined`
          );
        }
      });
    });

    if (errors.length > 0) {
      throw new Error(
        [
          `Contract dynamic target validation failed for component "${this.componentName}".`,
          ...errors.map((error) => `- ${error}`),
          `Available selectors: ${available}`,
          `Allowed special targets: document, relative`,
        ].join("\n")
      );
    }
  }

  build(): JsonContract {
    this.validateRelationshipInvariants();
    this.validateStaticTargets();
    this.validateDynamicTargets();

    const fallbackId = this.metaValue.id || `aria-ease.contract.${this.componentName}`;

    return {
      meta: {
        id: fallbackId,
        version: this.metaValue.version || "1.0.0",
        description: this.metaValue.description || `Fluent contract for ${this.componentName}`,
        source: this.metaValue.source,
        W3CName: this.metaValue.W3CName,
      },
      selectors: this.selectorsValue,
      relationships: this.relationshipInvariants,
      static: [{ assertions: this.staticAssertions }],
      dynamic: this.dynamicTests,
    };
  }
}

export function createContract(componentName: string, define: (c: ContractBuilder) => void): FluentContract {
  const builder = new ContractBuilder(componentName);
  define(builder);
  return new FluentContract(builder.build());
}

export type { JsonContract, ContractBuilder, RelationshipInvariant };