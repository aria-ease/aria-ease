//Users describe intent, library encodes mechanics
/* User writes:
.then("activeOption.last")
Library knows:
activeOption.last
  requires → listbox.open
  implies → aria-expanded=true
  implies → correct aria-activedescendant
 */

  /* So what should .given() / .then() support?
Final answer:
✅ YES — allow arrays

But only for composing independent states:

.given(["input.focused", "listbox.open"])
.then(["selectedOption.first", "listbox.closed"]) 


Every state must be complete and self-contained

The next evolution is:

mark states as derived vs primitive
auto-detect redundant states in arrays
warn if user passes unnecessary combinations

That’s how this becomes a real system, not just a DSL.
*/


export const COMBOBOX_STATES = {
  "listbox.open": {
    setup: openCombobox(),
    assertion: isComboboxOpen(),
  },

  "listbox.closed": {
    setup: closeCombobox(),
    assertion: isComboboxClosed(),
  },

  "input.focused": {
    setup: focusInput(),
    assertion: [
      ...isInputFocused()
    ]
  },

  "input.filled": {
    setup: fillInput(),
    assertion: [
      ...isInputFilled()
    ],
  },

  "activeOption.first": {
    requires: ["listbox.open"],
    setup: [
      { type: "keypress", target: "input", key: "ArrowDown" },
    ],
    assertion: [
      ...isActiveDescendantNotEmpty()
    ],
  },

  "activeOption.last": {
    requires: ["activeOption.first"],
    setup: [
      { type: "keypress", target: "input", key: "ArrowUp" },
    ],
    assertion: [
      ...isActiveDescendantNotEmpty()
    ],
  },

  "selectedOption.first": {
    requires: ["listbox.open"],
    setup: [
      { type: "click", target: "relative", relativeTarget: "first" },
    ],
    assertion: [
      ...isAriaSelected("first")
    ]
  },

  "selectedOption.last": {
    requires: ["listbox.open"],
    setup: [
      { type: "click", target: "relative", relativeTarget: "last" },
    ],
    assertion: [
      ...isAriaSelected("first")
    ]
  },
};

function openCombobox() {
  return [
    { type: "keypress", target: "input", key: "ArrowDown" },
  ];
}

function closeCombobox() {
  return [
    { type: "keypress", target: "input", key: "Escape" },
  ];
}

function focusInput() {
  return [
    { type: "focus", target: "input" },
  ];
}

function fillInput() {
  return [
    { type: "type", target: "input", value: "test" },
  ];
}

function isComboboxOpen() {
  return [
    {
      target: "listbox",
      assertion: "toBeVisible",
      failureMessage: "Expected listbox to be visible",
    },
  ];
}

function isComboboxClosed() {
  return [
    {
      target: "listbox",
      assertion: "notToBeVisible",
      failureMessage: "Expected listbox to be closed",
    },
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
      failureMessage: `Expected aria-selected on ${index} option to be true`,
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