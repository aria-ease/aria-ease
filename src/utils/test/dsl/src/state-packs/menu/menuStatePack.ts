export const MENU_STATES = {
  "menupopup.open": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "main", key: "Enter" }
        ]
      },
      {
        when: ["pointer"],
        steps: () => [
          { type: "click", target: "main" }
        ]
      }
    ],
    assertion: isMenuPopupOpen
  },
  "menupopup.closed": {
    setup: [
      {
        when: ["keyboard", "pointer"],
        steps: () => []
      }
    ],
    assertion: isMenuPopupClosed
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
  "menuitem.focused": {
    requires: ["menupopup.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: (arg: { relativeTarget?: string | number } = {}) => [
          { type: "focus", target: "relative", relativeTarget: arg.relativeTarget }
        ]
      }
    ],
    assertion: (arg: { relativeTarget?: string | number } = {}) => isItemFocused(arg.relativeTarget as string | number)
  }, 
  "submenupopup.open": {
    requires: ["menupopup.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "submenuTrigger", key: "ArrowRight" }
        ]
      },
      {
        when: ["pointer"],
        steps: () => [
          { type: "click", target: "submenuTrigger" }
        ]
      }
    ],
    assertion: isSubmenuPopupOpen
  },
  "submenupopup.closed": {
    setup: [
      {
        when: ["keyboard", "pointer"],
        steps: () => []
      }
    ],
    assertion: isSubmenuPopupClosed 
  },
  "submenutrigger.focused": {
    setup: [
      {
        when: ["keyboard", "pointer"],
        steps: () => [
          { type: "focus", target: "submenuTrigger" }
        ]
      }
    ],
    assertion: isSubmenuTriggerFocused
  },
  "submenutrigger.blurred": {
    setup: [
      {
        when: ["keyboard", "pointer"],
        steps: () => []
      }
    ],
    assertion: isSubmenuTriggerBlurred
  },
  "submenuitem.focused": {
    requires: ["submenupopup.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: (arg: { relativeTarget?: string | number } = {}) => {
          // Focus trigger, ArrowRight to open, then ArrowDown N times
          let steps = [
            { type: "focus", target: "submenuTrigger" },
            { type: "keypress", target: "submenuTrigger", key: "ArrowRight" }
          ];
          if (typeof arg.relativeTarget === "number") {
            steps = steps.concat(
              Array.from({ length: arg.relativeTarget }, () => ({
                type: "keypress",
                target: "submenuItems",
                key: "ArrowDown"
              }))
            );
          }
          if (arg.relativeTarget === "first") {
            steps = steps.concat({ type: "keypress", target: "submenuItems", key: "ArrowDown" })
          }
          if (arg.relativeTarget === "last") {
            steps = steps.concat({ type: "keypress", target: "submenuItems", key: "ArrowUp" })
          }
          return steps;
        }
      },
      {
        when: ["pointer"],
        steps: (arg: { relativeTarget?: string | number } = {}) => [
          { type: "click", target: "submenuTrigger" },
          { type: "click", target: "relative", relativeTarget: arg.relativeTarget }
        ]
      }
    ],
    assertion: (arg: { relativeTarget?: string | number } = {}) => isSubmenuItemFocused(arg.relativeTarget as string | number)
  }
}


function isMenuPopupOpen() {
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
    failureMessage: "Expected menu main to have aria-expanded='true'."
    }
  ]
}

function isMenuPopupClosed() {
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
    failureMessage: "Expected menu main to have aria-expanded='false'."
    }
  ];
}

function isMainFocused() {
  return [
    {
      target: "main",
      assertion: "toHaveFocus",
      failureMessage: "Expected menu main to be focused.",
    }
  ]
}

function isMainBlurred() {
  return [
    {
      target: "main",
      assertion: "notToHaveFocus",
      failureMessage: "Expected menu main to not have focused.",
    }
  ]
}

function isItemFocused(relativeTarget: string | number) {
  return [
    {
      target: "relative",
      assertion: "toHaveFocus",
      expectedValue: relativeTarget,
      failureMessage: `${relativeTarget} menu item should have focus.`
    }
  ]
}

function isSubmenuPopupOpen() {
  return [
    {
      target: "submenu",
      assertion: "toBeVisible",
      failureMessage: "Expected submenu to be visible",
    },
    {
    target: "submenuTrigger",
    assertion: "toHaveAttribute",
    attribute: "aria-expanded",
    expectedValue: "true",
    failureMessage: "Expected submenu trigger to have aria-expanded='true'."
    }
  ];
}

function isSubmenuPopupClosed() {
  return [
    {
      target: "submenu",
      assertion: "notToBeVisible",
      failureMessage: "Expected submenu to be closed",
    },
    {
    target: "submenuTrigger",
    assertion: "toHaveAttribute",
    attribute: "aria-expanded",
    expectedValue: "false",
    failureMessage: "Expected submenu trigger to have aria-expanded='false'."
    }
  ];
}

function isSubmenuTriggerFocused() {
  return [
    {
      target: "submenuTrigger",
      assertion: "toHaveFocus",
      failureMessage: "Expected submenu trigger to be focused.",
    }
  ]
}

function isSubmenuTriggerBlurred() {
  return [
    {
      target: "submenuTrigger",
      assertion: "notToHaveFocus",
      failureMessage: "Expected submenu trigger to not have focused.",
    }
   ]
}

function isSubmenuItemFocused(relativeTarget: string | number) {
  return [
    {
      target: "relative",
      relativeTarget,
      assertion: "toHaveFocus",
      failureMessage: `Expected submenu item ${relativeTarget} to have focus.`
    }
  ]
}