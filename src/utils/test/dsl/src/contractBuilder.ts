

import { COMBOBOX_STATES, resolveSetup, CapabilityContext } from "./state-packs/comboboxStatePack";

type StatePack = Record<string, {
  setup?: DynamicAction[];
  assertion?: DynamicAssertion[] | DynamicAssertion;
  requires?: string[];
}>;

const STATE_PACKS: Record<string, unknown> = {
  "combobox.listbox": COMBOBOX_STATES,
  // Add more mappings as needed
};

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

type DynamicAssertion = {
  target: string;
  assertion: "toBeVisible" | "notToBeVisible" | "toHaveAttribute" | "toHaveValue" | "toHaveFocus" | "toHaveRole";
  attribute?: string;
  expectedValue?: string;
  failureMessage?: string;
  relativeTarget?: string;
  virtualId?: string;
  selectorKey?: string;
  level?: Level;
};

type DynamicAction =
  | {
      type: "focus";
      target: string;
      relativeTarget?: "first" | "last" | "next" | "previous";
      virtualId?: string;
    }
  | {
      type: "click" | "keypress" | "type" | "hover";
      target: string;
      key?: string;
      value?: string;
      relativeTarget?: string;
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

class ContractBuilder {
  private metaValue: ContractMeta = {};
  private selectorsValue: SelectorsMap = {};
  private readonly relationshipInvariants: RelationshipInvariant[] = [];
  private readonly staticAssertions: StaticAssertion[] = [];
  private readonly dynamicTests: DynamicTest[] = [];
  private statePack: StatePack;

  constructor(private readonly componentName: string) {
    // Auto-register state pack based on componentName
    this.statePack = STATE_PACKS[componentName] as StatePack || {};
  }

  meta(meta: ContractMeta) {
    this.metaValue = meta;
    return this;
  }

  selectors(selectors: SelectorsMap) {
    this.selectorsValue = selectors;
    return this;
  }

  relationships(fn: (r: {
    ariaReference: (from: string, attribute: string, to: string) => {
      required: () => void;
      optional: () => void;
    };
    contains: (parent: string, child: string) => {
      required: () => void;
      optional: () => void;
    };
  }) => void) {
    const api = {
      ariaReference: (from: string, attribute: string, to: string) => ({
        required: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "required" }),
        optional: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "optional" }),
      }),
      contains: (parent: string, child: string) => ({
        required: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "required" }),
        optional: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "optional" }),
      })
    };
    fn(api);
    return this;
  }

  static(fn: (s: {
    target: (target: string) => {
      has: (attribute: string, expectedValue: string) => {
        required: () => void;
        optional: () => void;
      };
    };
  }) => void) {
    const api = {
      target: (target: string) => ({
        has: (attribute: string, expectedValue: string) => ({
          required: () => this.staticAssertions.push({ target, attribute, expectedValue, failureMessage: '', level: "required" }),
          optional: () => this.staticAssertions.push({ target, attribute, expectedValue, failureMessage: '', level: "optional" }),
        })
      })
    };
    fn(api);
    return this;
  }

  when(event: string) {
    return new DynamicTestBuilder(this, this.statePack, event);
  }

  addDynamicTest(test: DynamicTest) {
    this.dynamicTests.push(test);
  }

  build(): JsonContract {
    return {
      meta: this.metaValue,
      selectors: this.selectorsValue,
      relationships: this.relationshipInvariants.length ? this.relationshipInvariants : undefined,
      static: this.staticAssertions.length ? [{ assertions: this.staticAssertions }] : [],
      dynamic: this.dynamicTests,
    };
  }
}

class DynamicTestBuilder {
  private _as: string | undefined;
  private _on: string | undefined;
  private _given: string[] = [];
  private _then: string[] = [];
  private _desc: string = '';
  private _level: Level = "required";

  constructor(
    private parent: ContractBuilder,
    private statePack: StatePack,
    private event: string
  ) {}

  as(actionType: string) {
    this._as = actionType;
    return this;
  }

  on(target: string) {
    this._on = target;
    return this;
  }

  given(states: string | string[]) {
    this._given = Array.isArray(states) ? states : [states];
    return this;
  }

  then(states: string | string[]) {
    this._then = Array.isArray(states) ? states : [states];
    return this;
  }

  describe(desc: string) {
    this._desc = desc;
    return this;
  }

  required() {
    this._level = "required";
    this._finalize();
    return this.parent;
  }
  optional() {
    this._level = "optional";
    this._finalize();
    return this.parent;
  }
  recommended() {
    this._level = "recommended";
    this._finalize();
    return this.parent;
  }

  private _finalize() {
    // Map action types to capability names for robust capability-based setup resolution
    const capabilityMap: Record<string, string> = {
      keypress: "keyboard",
      click: "pointer",
      type: "textInput",
      focus: "keyboard",
      hover: "pointer",
      // add more mappings as needed
    };
    const capability = capabilityMap[this._as || "keyboard"] || (this._as || "keyboard");
    const ctx: CapabilityContext = { capabilities: [capability] };
    const resolveAllSetups = (stateName: string, visited = new Set<string>()): DynamicAction[] => {
      if (visited.has(stateName)) return [];
      visited.add(stateName);
      const s = this.statePack[stateName];
      if (!s) return [];
      let actions: DynamicAction[] = [];
      if (Array.isArray(s.requires)) {
        for (const req of s.requires) {
          actions = actions.concat(resolveAllSetups(req, visited));
        }
      }
      if (s.setup) actions = actions.concat(resolveSetup(s.setup, ctx) as DynamicAction[]);
      return actions;
    };

    // Build setup from .given (recursively)
    const setup: DynamicAction[] = [];
    for (const state of this._given) {
      setup.push(...resolveAllSetups(state));
    }

    // Build assertions from .then
    const assertions: DynamicAssertion[] = [];
    for (const state of this._then) {
      const s = this.statePack[state];
      if (s && s.assertion !== undefined) {
        let value: unknown = s.assertion;
        if (typeof value === "function") {
          // Type guard: only call if function has zero arguments
          try {
            value = (value as (() => unknown))();
          } catch (e) {
            throw new Error(`Error calling assertion function for state '${state}': ${(e as Error).message}`);
          }
        }
        if (Array.isArray(value)) assertions.push(...value);
        else assertions.push(value as DynamicAssertion);
      }
    }
    // Action from .when/.as/.on
    const action: DynamicAction[] = [
      {
        type: this._as as DynamicAction["type"],
        target: this._on as string,
        key: this._as === "keypress" ? this.event : undefined,
      }
    ];
    this.parent.addDynamicTest({
      description: this._desc || '',
      level: this._level,
      action,
      assertions,
      ...(setup.length ? { setup } : {}),
    });
  }
}

export function createContract(componentName: string, define: (c: ContractBuilder) => void): FluentContract {
  const builder = new ContractBuilder(componentName);
  define(builder);
  return new FluentContract(builder.build());
}