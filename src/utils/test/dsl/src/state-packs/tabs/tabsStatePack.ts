export const TABS_STATES = {
    "tab.active": {
        setup: [
            {
                when: ["keyboard"],
                steps: (arg: { relativeTarget?: string | number } = {}) => [
                    { type: "keypress", target: "relative", relativeTarget: arg.relativeTarget, key: "ArrowLeft" }
                ]
            },
            {
                when: ["pointer"],
                steps: (arg: { relativeTarget?: string | number } = {}) => [
                    { type: "click", target: "relative", relativeTarget: arg.relativeTarget }
                ]
            }
        ],
        assertion: (arg: { relativeTarget?: string | number } = {}) => isTabActive(arg.relativeTarget as string | number)
    },
    "tab.focused": {
        setup: [
            {
                when: ["keyboard", "pointer"],
                steps: (arg: { relativeTarget?: string | number } = {}) => [
                    { type: "focus", target: "relative", relativeTarget: arg.relativeTarget }
                ]
            }
        ],
        assertion: (arg: { relativeTarget?: string | number } = {}) => isTabFocused(arg.relativeTarget as string | number)
    }
}

function isTabFocused(relativeTarget: string | number) {
    return  [
        {
            target: "relative",
            assertion: "toHaveFocus",
            relativeTarget,
            failureMessage: "Expected first tab to have focus."
        }
    ]
}

function hasActiveTabIndex(relativeTarget: string | number) {
    return  [
        {
            target: "relative",
            assertion: "toHaveAttribute",
            attribute: "aria-selected",
            expectedValue: "true",
            relativeTarget,
            failureMessage: `Expected ${relativeTarget} tab to have tabindex='0'.`    
        }
    ]
}

function isTabActive(relativeTarget: string | number) {
    return  [
        {
            target: "relative",
            assertion: "toHaveAttribute",
            attribute: "aria-selected",
            expectedValue: "true",
            relativeTarget,
            failureMessage: `Expected ${relativeTarget} tab to have aria-selected='true'.`    
        },
        {
            target: "panel",
            assertion: "toBeVisible",
            controlledBy: { target: "relative", relativeTarget: relativeTarget },
            failureMessage: `Expected panel controlled by the ${relativeTarget} tab to be visible.`
        },
        hasActiveTabIndex(relativeTarget)
    ]
}