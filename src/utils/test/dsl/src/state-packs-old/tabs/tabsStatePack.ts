export const TABS_STATES = {
    "activeTab.first": {
        setup: [
            {
                when: ["keyboard"],
                steps: () => [
                    { type: "keypress", target: "relative", relativeTarget: "second", key: "ArrowLeft" }
                ]
            },
            {
                when: ["pointer"],
                steps: () => [
                    { type: "click", target: "relative", relativeTarget: "first" }
                ]
            }
        ],
        assertion: isActiveTabFirst
    },
    "activeTab.second": {
        setup: [
            {
                when: ["keyboard"],
                steps: () => [
                    { type: "keypress", target: "relative", relativeTarget: "first", key: "ArrowRight" }
                ]
            },
            {
                when: ["pointer"],
                steps: () => [
                    { type: "click", target: "relative", relativeTarget: "second" }
                ]
            }
        ],
        assertion: isActiveTabSecond
    },
    "activeTab.last": {
        requires: ["activeTab.first"],
        setup: [
            {
                when: ["keyboard"],
                steps: () => [
                    { type: "keypress", target: "relative", relativeTarget: "first", key: "ArrowLeft" }
                ]
            },
            {
                when: ["pointer"],
                steps: () => [
                    { type: "click", target: "relative", relativeTarget: "last" }
                ]
            }
        ],
        assertion: isActiveTabLast
    },
    "focusTab.first": {
        setup: [
            {
                when: ["keyboard"],
                steps: () => [
                    { type: "focus", target: "relative", relativeTarget: "first" }
                ]
            },
            {
                when: ["pointer"],
                steps: () => [
                    { type: "focus", target: "relative", relativeTarget: "first" }
                ]
            }
        ],
        assertion: isFirstTabFocused
    },
    "focusTab.second": {
        setup: [
            {
                when: ["keyboard"],
                steps: () => [
                    { type: "focus", target: "relative", relativeTarget: "second" }
                ]
            },
            {
                when: ["pointer"],
                steps: () => [
                    { type: "focus", target: "relative", relativeTarget: "second" }
                ]
            }
        ],
        assertion: isSecondTabFocused
    },
    "focusTab.last": {
        setup: [
            {
                when: ["keyboard"],
                steps: () => [
                    { type: "focus", target: "relative", relativeTarget: "last" }
                ]
            },
            {
                when: ["pointer"],
                steps: () => [
                    { type: "focus", target: "relative", relativeTarget: "last" }
                ]
            }
        ],
        assertion: isLastTabFocused
    }
}

function isFirstTabFocused() {
    return  [
        {
            target: "relative",
            assertion: "toHaveFocus",
            relativeTarget: "first",
            failureMessage: "Expected first tab to have focus."
        }
    ]
}

function isSecondTabFocused() {
    return  [
        {
            target: "relative",
            assertion: "toHaveFocus",
            relativeTarget: "second",
            failureMessage: "Expected second tab to have focus."
        }
    ]
}

function isLastTabFocused() {
    return  [
        {
            target: "relative",
            assertion: "toHaveFocus",
            relativeTarget: "last",
            failureMessage: "Expected last tab to have focus."
        }
    ]
}

function hasActiveTabIndex(index: "first" | "last" | "second" | "next" | "previous") {
    return  [
        {
            target: "relative",
            assertion: "toHaveAttribute",
            attribute: "aria-selected",
            expectedValue: "true",
            relativeTarget: index,
            failureMessage: `Expected ${index} tab to have tabindex='0'.`    
        }
    ]
}

function isActiveTabFirst() {
    return  [
        {
            target: "relative",
            assertion: "toHaveAttribute",
            attribute: "aria-selected",
            expectedValue: "true",
            relativeTarget: "first",
            failureMessage: "Expected first tab to have aria-selected='true'."    
        },
        {
            target: "panel",
            assertion: "toBeVisible",
            controlledBy: { target: "relative", relativeTarget: "first" },
            failureMessage: "Expected panel controlled by the first tab to be visible."
        },
        hasActiveTabIndex("first")
    ]
}

function isActiveTabSecond() {
    return  [
        {
            target: "relative",
            assertion: "toHaveAttribute",
            attribute: "aria-selected",
            expectedValue: "true",
            relativeTarget: "second",
            failureMessage: "Expected second tab to have aria-selected='true'."    
        },
        {
            target: "panel",
            assertion: "toBeVisible",
            controlledBy: { target: "relative", relativeTarget: "second" },
            failureMessage: "Expected panel controlled by the second tab to be visible."
        },
        hasActiveTabIndex("second")
    ]
}

function isActiveTabLast() {
    return  [
        {
            target: "relative",
            assertion: "toHaveAttribute",
            attribute: "aria-selected",
            expectedValue: "true",
            relativeTarget: "last",
            failureMessage: "Expected last tab to have aria-selected='true'."    
        },
        {
            target: "panel",
            assertion: "toBeVisible",
            controlledBy: { target: "relative", relativeTarget: "last" },
            failureMessage: "Expected panel controlled by the last tab to be visible."
        },
        hasActiveTabIndex("last")
    ]
}