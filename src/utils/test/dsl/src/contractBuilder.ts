import { COMBOBOX_STATES } from "./state-packs/combobox/comboboxStatePack";
import { MENU_STATES } from "./state-packs/menu/menuStatePack";
import { TABS_STATES } from "./state-packs/tabs/tabsStatePack";
import { ACCORDION_STATES } from "./state-packs/accordion/accordionStatePack";
import { resolveSetup, CapabilityContext } from "./state-packs/Capability";

type StatePack = Record<string, {
  setup?: Array<{
    when: string[];
    steps: ((arg?: { relativeTarget?: string | number }) => DynamicAction[]) | DynamicAction[];
  }>;
  assertion?: ((arg?: { relativeTarget?: string | number }) => DynamicAssertion[] | DynamicAssertion) | DynamicAssertion[] | DynamicAssertion;
  requires?: string[];
}>;

type RelativeState = {
  type: string;
  ref: string | number
}

const STATE_PACKS: Record<string, unknown> = {
  "combobox": COMBOBOX_STATES,
  "menu":  MENU_STATES,
  "tabs": TABS_STATES,
  "accordion": ACCORDION_STATES
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
      requires?: string;
      setup?: DynamicAction[];
    }
  | {
      type: "contains";
      parent: string;
      child: string;
      level?: Level;
      requires?: string;
      setup?: DynamicAction[];
    };

type StaticAssertion = {
  target: string;
  assertion: "toBeVisible" | "notToBeVisible" | "toHaveAttribute" | "toHaveValue" | "toHaveFocus" | "notToHaveFocus" | "toHaveRole";
  attribute: string;
  expectedValue?: string;
  failureMessage?: string;
  level: Level;
  requires?: string;
  setup?: DynamicAction[];
};

type DynamicAssertion = {
  target: string;
  assertion: "toBeVisible" | "notToBeVisible" | "toHaveAttribute" | "toHaveValue" | "toHaveFocus" | "notToHaveFocus" | "toHaveRole";
  attribute?: string;
  expectedValue?: string;
  failureMessage?: string;
  relativeTarget?: string | number;
  virtualId?: string;
  selectorKey?: string;
  level?: Level;
};

type DynamicAction =
  | {
      type: "focus";
      target: string;
      relativeTarget?: "first" | "last" | "next" | "previous" | number;
      virtualId?: string;
    }
  | {
      type: "click" | "keypress" | "type" | "hover" | "focus";
      target: string;
      key?: string;
      value?: string;
      relativeTarget?: string | number;
    };

type DynamicTest = {
  description: string;
  orientation?: "vertical" | "horizontal";
  level?: Level;
  action: DynamicAction[];
  assertions: DynamicAssertion[];
};


type JsonContract = {
  meta?: ContractMeta;
  selectors: SelectorsMap;
  relationships?: RelationshipInvariant[];
  static: StaticAssertion[];
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
      requires: (state: string) => {
        required: () => void;
        optional: () => void;
        recommended: () => void;
      };
      required: () => void;
      optional: () => void;
      recommended: () => void;
    };
    contains: (parent: string, child: string) => {
      requires: (state: string) => {
        required: () => void;
        optional: () => void;
        recommended: () => void;
      };
      required: () => void;
      optional: () => void;
      recommended: () => void;
    };
  }) => void) {
    const statePack = this.statePack;
    const ctx: CapabilityContext = { capabilities: ["keyboard"] };
    const resolveAllSetups = (stateName: string, visited = new Set<string>()): DynamicAction[] => {
      if (visited.has(stateName)) return [];
      visited.add(stateName);
      const s = statePack[stateName];
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
    const api = {
      ariaReference: (from: string, attribute: string, to: string) => {
        return {
          requires: (state: string) => {
            const setupActions = resolveAllSetups(state, new Set());
            return {
              required: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "required", setup: setupActions }),
              optional: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "optional", setup: setupActions }),
              recommended: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "recommended", setup: setupActions }),
            };
          },
          required: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "required" }),
          optional: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "optional" }),
          recommended: () => this.relationshipInvariants.push({ type: "aria-reference", from, attribute, to, level: "recommended" })
        };
      },
      contains: (parent: string, child: string) => {
        return {
          requires: (state: string) => {
            const setupActions = resolveAllSetups(state, new Set());
            return {
              required: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "required", setup: setupActions }),
              optional: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "optional", setup: setupActions }),
              recommended: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "recommended", setup: setupActions }),
            };
          },
          required: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "required" }),
          optional: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "optional" }),
          recommended: () => this.relationshipInvariants.push({ type: "contains", parent, child, level: "recommended" })
        };
      }
    };
    fn(api);
    return this;
  }

  static(fn: (s: {
    target: (target: string) => {
      has: (attribute: string, expectedValue: string) => {
        requires: (state: string) => {
          required: () => void;
          optional: () => void;
          recommended: () => void;
        };
        required: () => void;
        optional: () => void;
        recommended: () => void;
      }
    };
  }) => void) {
    const api = {
      target: (target: string) => {
        const getSetupActions = (state: string): DynamicAction[] => {
          const statePack = this.statePack;
          const ctx: CapabilityContext = { capabilities: ["keyboard"] };
          const resolveAllSetups = (stateName: string, visited = new Set<string>()): DynamicAction[] => {
            if (visited.has(stateName)) return [];
            visited.add(stateName);
            const s = statePack[stateName];
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
          return resolveAllSetups(state, new Set());
        };

        // Helper to infer assertion type from attribute
        const inferAssertionType = (attribute: string): StaticAssertion["assertion"] => {
          if (attribute === "role") return "toHaveRole";
          return "toHaveAttribute";
        };

        const createFinalizers = (attribute: string, expectedValue: string, setupActions?: DynamicAction[]) => {
          const assertion = inferAssertionType(attribute);
          return {
            required: () => this.staticAssertions.push({ target, assertion, attribute, expectedValue, failureMessage: '', level: "required", setup: setupActions }),
            optional: () => this.staticAssertions.push({ target, assertion, attribute, expectedValue, failureMessage: '', level: "optional", setup: setupActions }),
            recommended: () => this.staticAssertions.push({ target, assertion, attribute, expectedValue, failureMessage: '', level: "recommended", setup: setupActions }),
          };
        };

        return {
          has: (attribute: string, expectedValue: string) => {
            const base = createFinalizers(attribute, expectedValue);
            return {
              ...base,
              requires: (state: string) => {
                const setupActions = getSetupActions(state);
                return createFinalizers(attribute, expectedValue, setupActions);
              }
            };
          }
        };
      }
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
      static: this.staticAssertions.length ? this.staticAssertions : [],
      dynamic: this.dynamicTests,
    };
  }
}

class DynamicTestBuilder {
  private _as: string | undefined;
  private _onTarget: string | undefined;
  private _onRelativeTarget: string | number | undefined;
  private _given: (string | RelativeState)[] = [];
  private _then: (string | RelativeState)[] = [];
  private _desc: string = '';
  private _level: Level = "required";
  private _orientation: "vertical" | "horizontal" | undefined;

  constructor(
    private parent: ContractBuilder,
    private statePack: StatePack,
    private event: string
  ) {}

  as(actionType: string) {
    this._as = actionType;
    return this;
  }

  on(target: string, relativeTarget?: string | number) {
    this._onTarget = target;
    this._onRelativeTarget = relativeTarget;
    return this;
  }

  given(states: string | string[] | RelativeState | RelativeState[]) {
    this._given = this._normalizeStates(states);
    return this;
  }

  then(states: string | string[] | RelativeState | RelativeState[]) {
    this._then = this._normalizeStates(states);
    return this;
  }

  orientation(orientation: "vertical" | "horizontal") {
    this._orientation = orientation;
    return this;
  }

  /**
   * Normalize states to an array of string or resolved state keys from relative state objects.
   */
  private _normalizeStates(states: string | string[] | RelativeState | RelativeState[]): (string | RelativeState)[] {
    const arr = Array.isArray(states) ? states : [states];
    return arr.flatMap((s): (string | RelativeState)[] => {
      if (typeof s === "string") return [s];
      if (typeof s === "object" && s !== null && "type" in s && "ref" in s) {
        // Only include if the key exists in the state pack
        const key = this._findStateKeyByTypeAndRef(s.type);
        if (key) return [{ type: s.type, ref: s.ref }];
        return [];
      }
      return [s];
    });
  }

  /**
   * Find a generic state key in the state pack by type.
   */
  private _findStateKeyByTypeAndRef(type: string): string | undefined {
    const candidates = Object.keys(this.statePack);
    if (candidates.includes(type)) return type;
    return undefined;
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

    // Build setup from .given (recursively) and deduplicate
    let setup: DynamicAction[] = [];
    for (const state of this._given) {
      if (typeof state === "string") {
        setup.push(...resolveAllSetups(state));
      } else if (typeof state === "object" && state !== null && "type" in state && "ref" in state) {
        const key = this._findStateKeyByTypeAndRef(state.type);
        if (key) {
          const s = this.statePack[key];
          if (s && s.setup) {
            for (const setupItem of s.setup) {
              if (typeof setupItem.steps === "function") {
                setup.push(...setupItem.steps({ relativeTarget: state.ref }));
              } else if (Array.isArray(setupItem.steps)) {
                setup.push(...setupItem.steps);
              }
            }
          }
        }
      }
    }
    
    const seen = new Set<string>();
    setup = setup.filter(action => {
      const key = JSON.stringify(action);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Build assertions from .then
    const assertions: DynamicAssertion[] = [];
    for (const state of this._then) {
      if (typeof state === "string") {
        const s = this.statePack[state];
        if (s && s.assertion !== undefined) {
          let value: unknown = s.assertion;
          if (typeof value === "function") {
            try {
              value = (value as (() => unknown))();
            } catch (e) {
              throw new Error(`Error calling assertion function for state '${state}': ${(e as Error).message}`);
            }
          }
          if (Array.isArray(value)) assertions.push(...value);
          else assertions.push(value as DynamicAssertion);
        }
      } else if (typeof state === "object" && state !== null && "type" in state && "ref" in state) {
        const key = this._findStateKeyByTypeAndRef(state.type);
        if (key) {
          const s = this.statePack[key];
          if (s && s.assertion !== undefined) {
            let value: unknown = s.assertion;
            if (typeof value === "function") {
              try {
                value = (value as (arg: { relativeTarget?: string | number }) => unknown)({ relativeTarget: state.ref });
              } catch (e) {
                throw new Error(`Error calling assertion function for state '${key}': ${(e as Error).message}`);
              }
            }
            if (Array.isArray(value)) assertions.push(...value);
            else assertions.push(value as DynamicAssertion);
          }
        }
      }
    }
    // Action from .when/.as/.on
    const action: DynamicAction[] = [
      {
        type: this._as as DynamicAction["type"],
        target: this._onTarget as string,
        key: this._as === "keypress" ? this.event : undefined,
        relativeTarget: this._onRelativeTarget,
      }
    ];
    this.parent.addDynamicTest({
      description: this._desc || '',
      level: this._level,
      orientation: this._orientation || "horizontal", //it's setting orientation for all components
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