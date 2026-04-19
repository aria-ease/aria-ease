export const COMBOBOX_STATES = {
  "popup.open": {
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
  "popup.closed": {
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
    assertion: [...isComboboxClosed(), ...isActiveDescendantEmpty()]
  },
  "main.focused": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "focus", target: "main" }
        ]
      }
    ],
    assertion: isMainFocused
  },
  "main.notFocused": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [ //what to do here?
          
        ]
      }
    ],
    assertion: isMainNotFocused
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
  "input.notFilled": {
    setup: [
      {
        when: ["keyboard", "textInput"],
        steps: () => [
          { type: "type", target: "input", value: "" }
        ]
      }
    ],
    assertion: isInputNotFilled
  },
  "activeOption.first": {
    requires: ["popup.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "input", key: "ArrowDown" }
        ]
      }
    ],
    assertion: isActiveDescendantFirst
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
    assertion: isActiveDescendantLast
  },
  "activeDescendant.notEmpty": {
    requires: [],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          
        ]
      }
    ],
    assertion: isActiveDescendantNotEmpty
  },
  "activeDescendant.Empty": {
    requires: [],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          
        ]
      }
    ],
    assertion: isActiveDescendantEmpty
  },
  "selectedOption.first": {
    requires: ["popup.open"],
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
    requires: ["popup.open"],
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

function isActiveDescendantFirst() {
  return [
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-activedescendant",
      expectedValue: { ref: "relative", relativeTarget: "first", property: "id"},
      failureMessage: "Expected aria-activedescendant on main to match the id of the first option."
    }
  ]
}

function isActiveDescendantLast() {
  return [
    {
      target: "main",
      assertion: "toHaveAttribute",
      attribute: "aria-activedescendant",
      expectedValue: { ref: "relative", relativeTarget: "last", property: "id"}, 
      failureMessage: "Expected aria-activedescendant on main to match the id of the last option."
    }
  ]
}

function isActiveDescendantNotEmpty() {
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

function isActiveDescendantEmpty() {
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

function isAriaSelected(index: "first" | "last" | "second" | "next" | "previous") {
  return [
    {
      target: "relative",
      relativeTarget: index,
      assertion: "toHaveAttribute",
      attribute: "aria-selected",
      expectedValue: "true",
      failureMessage: `Expected ${index} option to have aria-selected='true'.`,
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

function isMainNotFocused() {
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

function isInputNotFilled() {
  return [
    {
      target: "input",
      assertion: "toHaveValue",
      expectedValue: "",
      failureMessage: "Expected input to have the value ''.",
    }
  ]
}