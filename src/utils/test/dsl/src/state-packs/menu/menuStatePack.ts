export const MENU_STATES = {
  "popup.open": {
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
  "popup.closed": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [ // component resets after each test so popup is closed
         
        ]
      },
      {
        when: ["pointer"],
        steps: () => [
          
        ]
      }
    ],
    assertion: isMenuPopupClosed
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

  "activeItem.first": {
    requires: ["popup.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          // By default, the first item should be active when the menu opens, so no action is needed to set this state
        ]
      }
    ],
    assertion: isActiveItemFirst
  },
  "activeItem.last": {
    requires: ["popup.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "main", key: "ArrowUp" }
        ]
      }
    ],
    assertion: isActiveItemLast
  }, 
  "submenu.open": {
    requires: ["popup.open"],
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
  "submenu.closed": {
    requires: ["submenu.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "keypress", target: "submenuTrigger", key: "ArrowLeft" }
        ]
      },
      {
        when: ["pointer"],
        steps: () => [
          { type: "click", target: "submenuTrigger" }
        ]
      }
    ],
    assertion: isSubmenuPopupClosed 
  },
  "submenuTrigger.focused": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          { type: "focus", target: "submenuTrigger" }
        ]
      }
    ],
    assertion: isSubmenuTriggerFocused
  },
  "submenuTrigger.notFocused": {
    setup: [
      {
        when: ["keyboard"],
        steps: () => [ //what to do here?
          
        ]
      }
    ],
    assertion: isSubmenuTriggerNotFocused
  },
  "submenuActiveItem.first": {
    requires: ["submenu.open"],
    setup: [
      {
        when: ["keyboard"],
        steps: () => [
          // By default, the first item should be active when the submenu opens, so no action is needed to set this state
        ]
      },
      {
        when: ["pointer"],
        steps: () => [
          
        ]
      }
    ],
    assertion: isSubmenuActiveItemFirst
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
    failureMessage: "Expect menu main to have aria-expanded='true'."
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
    failureMessage: "Expect menu main to have aria-expanded='false'."
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

function isMainNotFocused() {
  return [
    {
      target: "main",
      assertion: "notToHaveFocus",
      failureMessage: "Expected menu main to not have focused.",
    }
  ]
}

function isActiveItemFirst() {
  return [
    {
      target: "relative",
      assertion: "toHaveFocus",
      expectedValue: "first",
      failureMessage: "First menu item should have focus."
    }
  ]
}

function isActiveItemLast() {
  return [
    {
      target: "relative",
      assertion: "toHaveFocus",
      expectedValue: "last",
      failureMessage: "Last menu item should have focus."
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
    failureMessage: "Expect submenu trigger to have aria-expanded='true'."
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
    failureMessage: "Expect submenu trigger to have aria-expanded='false'."
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

function isSubmenuTriggerNotFocused() {
  return [
    {
      target: "submenuTrigger",
      assertion: "notToHaveFocus",
      failureMessage: "Expected submenu trigger to not have focused.",
    }
   ]
}

function isSubmenuActiveItemFirst() {
  return [
    {
      target: "submenuItems",
      assertion: "toHaveFocus",
      failureMessage: "First interactive item in the submenu should have focus after Right Arrow open the submenu."
    }
  ]
}