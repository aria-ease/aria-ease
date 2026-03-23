// --- Capability-based helpers ---
export type CapabilityContext = { capabilities: string[] };
export type SetupStrategy = { when: string[]; steps: (ctx?: CapabilityContext) => unknown[] };

export function hasCapabilities(ctx: CapabilityContext, requiredCaps: string[]): boolean {
  return requiredCaps.some(cap => ctx.capabilities.includes(cap));
}

export function resolveSetup(
  setup: SetupStrategy[] | unknown[],
  ctx: CapabilityContext
): unknown[] {
  // Backward compatibility: if setup is a plain array, treat as default strategy
  if (Array.isArray(setup) && setup.length && !(setup[0] as SetupStrategy).when) {
    setup = [{ when: ["keyboard"], steps: () => setup }];
  }
  for (const strat of setup as SetupStrategy[]) {
    if (hasCapabilities(ctx, strat.when)) {
      return strat.steps(ctx);
    }
  }
  throw new Error(
    `No setup strategy matches capabilities: ${ctx.capabilities.join(", ")}`
  );
}

export const COMBOBOX_STATES = {
  "listbox.open": {
    setup: [
      {
        when: ["keyboard", "textInput"],
        steps: () => [
          { type: "keypress", target: "input", key: "ArrowDown" }
        ]
      },
      {
        when: ["pointer"],
        steps: () => [
          { type: "click", target: "button" }
        ]
      }
    ],
    assertion: isComboboxOpen
  },
  "listbox.closed": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          /* { type: "keypress", target: "input", key: "Escape" } */
        ]
      },
      {
        when: ["pointer"],
        steps: () => [
          /* { type: "click", target: "button" } */
        ]
      }
    ],
    assertion: isComboboxClosed
  },
  "input.focused": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "focus", target: "input" }
        ]
      }
    ],
    assertion: isInputFocused
  },
  "input.filled": {
    setup: [
      {
        when: ["keyboard", "textInput"],
        steps: () => [
          { type: "type", target: "input", value: "test" }
        ]
      }
    ],
    assertion: isInputFilled
  },
  "activeOption.first": {
    requires: ["listbox.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "input", key: "ArrowDown" }
        ]
      }
    ],
    assertion: isActiveDescendantNotEmpty
  },
  "activeOption.last": {
    requires: ["activeOption.first"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "input", key: "ArrowUp" }
        ]
      }
    ],
    assertion: isActiveDescendantNotEmpty
  },
  "selectedOption.first": {
    requires: ["listbox.open"],
    setup: [
      {
        when: ["pointer"],
        steps: () => [
          { type: "click", target: "relative", relativeTarget: "first" }
        ]
      }
    ],
    assertion: () => isAriaSelected("first")
  },
  "selectedOption.last": {
    requires: ["listbox.open"],
    setup: [
      {
        when: ["pointer"],
        steps: () => [
          { type: "click", target: "relative", relativeTarget: "last" }
        ]
      }
    ],
    assertion: () => isAriaSelected("last")
  },
};


function isComboboxOpen() {
  return [
    {
      target: "listbox",
      assertion: "toBeVisible",
      failureMessage: "Expected listbox to be visible",
    },
    {
    target: "input",
    assertion: "toHaveAttribute",
    attribute: "aria-expanded",
    expectedValue: "true",
    failureMessage: "Expect combobox input to have aria-expanded='true'"
    }
  ];
}

function isComboboxClosed() {
  return [
    {
      target: "listbox",
      assertion: "notToBeVisible",
      failureMessage: "Expected listbox to be closed",
    },
    {
    target: "input",
    assertion: "toHaveAttribute",
    attribute: "aria-expanded",
    expectedValue: "false",
    failureMessage: "Expect combobox input to have aria-expanded='false'"
    }
  ];
}

function isActiveDescendantNotEmpty() {
  return [
    {
      target: "input",
      assertion: "toHaveAttribute",
      attribute: "aria-activedescendant",
      expectedValue: "!empty",
      failureMessage: "Expected aria-activedescendant to not be empty"
    }
  ]
}

function isAriaSelected(index: "first" | "last") {
  return [
    {
      target: "relative",
      relativeTarget: index,
      assertion: "toHaveAttribute",
      attribute: "aria-selected",
      expectedValue: "true",
      failureMessage: `Expected ${index} option to have aria-selected='true'`,
    }
  ]
}

function isInputFocused() {
  return [
    {
      target: "input",
      assertion: "toHaveFocus",
      failureMessage: "Expected input to be focused",
    }
  ]
}

function isInputFilled() {
  return [
    {
      target: "input",
      assertion: "toHaveValue",
      expectedValue: "test",
      failureMessage: "Expected input to have the value 'test'",
    }
  ]
}