export const COMBOBOX_STATES = {
  "comboboxpopup.open": {
    setup: [
      {
        when: ["keyboard", "textInput", "pointer"],
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
  "comboboxpopup.closed": {
    setup: [
      {
        when: ["keyboard", "pointer"],
        steps: () => []
      }
    ],
    assertion: [...isComboboxClosed(), ...isActiveDescendantUnset()]
  },
  "main.focused": {
    setup: [
      {
        when: ["keyboard", "pointer"],
        steps: () => [
          { type: "focus", target: "main" }
        ]
      }
    ],
    assertion: isMainFocused
  },
  "main.blurred": {
    setup: [
      {
        when: ["keyboard", "pointer"],
        steps: () => []
      }
    ],
    assertion: isMainBlurred
  },
  "input.filled": {
    setup: [
      {
        when: ["keyboard", "textInput", "pointer"],
        steps: () => [
          { type: "type", target: "input", value: "test" }
        ]
      }
    ],
    assertion: isInputFilled
  },
  "input.empty": {
    setup: [
      {
        when: ["keyboard", "textInput", "pointer"],
        steps: () => [
          { type: "type", target: "input", value: "" }
        ]
      }
    ],
    assertion: isInputEmpty
  },
  "option.active": {
    requires: ["comboboxpopup.open"],
    setup: [
      {
        when: ["keyboard", "pointer"],
        steps: (arg: { relativeTarget?: string | number } = {}) => {
          // Start at first, then ArrowDown N-1 times to reach index N
          if (typeof arg.relativeTarget === "number") {
            return Array.from({ length: arg.relativeTarget }, () => ({
              type: "keypress",
              target: "main",
              key: "ArrowDown"
            }));
          }
          if (arg.relativeTarget === "first") {
            return [{ type: "keypress", target: "main", key: "ArrowDown" }];
          }
          if (arg.relativeTarget === "last") {
            return [
              { type: "keypress", target: "main", key: "ArrowDown" },
              { type: "keypress", target: "main", key: "ArrowUp" }
            ]
          };
          return [];
        }
      }
    ],
    assertion: (arg: { relativeTarget?: string | number } = {}) => isActiveDescendant(arg.relativeTarget as string | number)
  },
  "activedescendant.set": {
    setup: [
      {
        when: ["keyboard", "pointer"],
        steps: () => []
      }
    ],
    assertion: isActiveDescendantSet
  },
  "activedescendant.unset": {
    setup: [
      {
        when: ["keyboard", "pointer"],
        steps: () => []
      }
    ],
    assertion: isActiveDescendantUnset
  },
  "option.selected": {
    requires: ["comboboxpopup.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: (arg: { relativeTarget?: string | number } = {}) => [
          { type: "keypress", target: "relative", key: "Enter", relativeTarget: arg.relativeTarget }
        ]
      },
      {
        when: ["pointer"],
        steps: (arg: { relativeTarget?: string | number } = {}) => [
          { type: "click", target: "relative", relativeTarget: arg.relativeTarget }
        ]
      }
    ],
    assertion: (arg: { relativeTarget?: string | number } = {}) => isAriaSelected(arg.relativeTarget as string | number)
  }
};


function isComboboxOpen() {
  return [
    {
      target: "popup",
      assertion: "toBeVisible",
      failureMessage: "Expected popup to be visible",
    },
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-expanded",
      expectedValue: "true",
      failureMessage: "Expected combobox main to have aria-expanded='true'."
    }
  ];
}

function isComboboxClosed() {
  return [
    {
      target: "popup",
      assertion: "notToBeVisible",
      failureMessage: "Expected popup to be closed",
    },
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-expanded",
      expectedValue: "false",
      failureMessage: "Expected combobox main to have aria-expanded='false'."
    }
  ];
}

function isActiveDescendant(relativeTarget: string | number) {
  return [
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-activedescendant",
      expectedValue: { ref: "relative", relativeTarget, property: "id"},
      failureMessage: "Expected aria-activedescendant on main to match the id of the first relative item."
    }
  ]
}

function isActiveDescendantSet() {
  return [
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-activedescendant",
      expectedValue: "!empty",
      failureMessage: "Expected aria-activedescendant on main to not be empty."
    }
  ]
}

function isActiveDescendantUnset() {
  return [
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-activedescendant",
      expectedValue: "",
      failureMessage: "Expected aria-activedescendant on main to be empty."
    }
  ]
}

function isAriaSelected(relativeTarget: string | number) {
  return [
    {
      target: "relative",
      relativeTarget,
      assertion: "toHaveAttribute",
      attribute: "aria-selected",
      expectedValue: "true",
      failureMessage: `Expected ${relativeTarget} item to have aria-selected='true'.`,
    }
  ]
}

function isMainFocused() {
  return [
    {
      target: "main",
      assertion: "toHaveFocus",
      failureMessage: "Expected main to be focused.",
    }
  ]
}

function isMainBlurred() {
  return [
    {
      target: "main",
      assertion: "notToHaveFocus",
      failureMessage: "Expected main to not have focused.",
    }
  ]
}

function isInputFilled() {
  return [
    {
      target: "input",
      assertion: "toHaveValue",
      expectedValue: "test",
      failureMessage: "Expected input to have the value 'test'.",
    }
  ]
}

function isInputEmpty() {
  return [
    {
      target: "input",
      assertion: "toHaveValue",
      expectedValue: "",
      failureMessage: "Expected input to have the value ''.",
    }
  ]
}