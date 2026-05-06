import describeRelativeTarget from "../DescribeRelativeTarget"

export const ACCORDION_STATES = {
    "panel.expanded": {
        setup: [
        {
            when: ["keyboard"],
            steps: (arg: { relativeTarget?: string | number }) => [
                { type: "keypress", target: "relative", relativeTarget: arg.relativeTarget, key: "Enter" }
            ]
        },
        {
            when: ["pointer"],
            steps: (arg: { relativeTarget?: string | number }) => [
                { type: "click", target: "relative", relativeTarget: arg.relativeTarget, }
            ]
        }
        ],
        assertion: (arg: { relativeTarget?: string | number } = {}) => isPanelExpanded(arg.relativeTarget as string | number)
    },
    "panel.collapsed": {
        setup: [
            {
                when: ["keyboard", "pointer"],
                steps: () => []
            }
        ],
        assertion: (arg: { relativeTarget?: string | number } = {}) => isPanelCollapsed(arg.relativeTarget as string | number)
    },
    "trigger.focused": {
        setup: [
            {
                when: ["keyboard", "pointer"],
                steps: (arg: { relativeTarget?: string | number }) => [
                    { type: "focus", target: "relative", relativeTarget: arg.relativeTarget }
                ]
            }
        ],
        assertion: (arg: { relativeTarget?: string | number } = {}) => isTriggerFocused(arg.relativeTarget as string | number)
    },
    "trigger.blurred": {
        setup: [
            {
                when: ["keyboard", "pointer"],
                steps: () => []
            }
        ],
        assertion: (arg: { relativeTarget?: string | number } = {}) => isTriggerBlurred(arg.relativeTarget as string | number)
    }
}

function isPanelExpanded(relativeTarget: string | number) {
    return [
        {
            target: "panel",
            assertion: "toBeVisible",
            controlledBy: { target: "relative", relativeTarget },
            failureMessage: `Expected panel controlled by the ${relativeTarget} trigger to be visible.`
        },
        {
            target: "relative",
            relativeTarget,
            assertion: "toHaveAttribute",
            attribute: "aria-expanded",
            expectedValue: "true",
            failureMessage: "Expected trigger to have aria-expanded='true' when panel expands."
        }
    ]
}

function isPanelCollapsed(relativeTarget: string | number) {
    return [
        {
            target: "panel",
            assertion: "notToBeVisible",
            controlledBy: { target: "relative", relativeTarget },
            failureMessage: `Expected panel controlled by the ${relativeTarget} trigger not to be visible.`
        },
        {
            target: "relative",
            relativeTarget,
            assertion: "toHaveAttribute",
            attribute: "aria-expanded",
            expectedValue: "false",
            failureMessage: "Expected trigger to have aria-expanded='false' when panel collapses."
        }
    ]
}

function isTriggerFocused(relativeTarget: string | number) {
    return  [
        {
            target: "relative",
            assertion: "toHaveFocus",
            relativeTarget,
            failureMessage: `Expected ${describeRelativeTarget("trigger", relativeTarget)} to have focus.`
        }
    ]
}

function isTriggerBlurred(relativeTarget: string | number) {
    return  [
        {
            target: "relative",
            assertion: "toHaveFocus",
            relativeTarget,
            failureMessage: `Expected ${describeRelativeTarget("trigger", relativeTarget)} not to have focus.`
        }
    ]
}