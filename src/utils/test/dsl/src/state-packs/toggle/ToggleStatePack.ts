import describeRelativeTarget from "../DescribeRelativeTarget"

export const TOGGLE_STATES = {
    "toggle.pressed": {
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
        assertion: (arg: { relativeTarget?: string | number } = {}) => isTogglePressed(arg.relativeTarget as string | number)
    },
    "toggle.unpressed": {
        setup: [
            {
                when: ["keyboard", "pointer"],
                steps: () => []
            }
        ],
        assertion: (arg: { relativeTarget?: string | number } = {}) => isToggleUnpressed(arg.relativeTarget as string | number)
    },
    "toggle.focused": {
        setup: [
            {
                when: ["keyboard", "pointer"],
                steps: (arg: { relativeTarget?: string | number }) => [
                    { type: "focus", target: "relative", relativeTarget: arg.relativeTarget }
                ]
            }
        ],
        assertion: (arg: { relativeTarget?: string | number } = {}) => isToggleFocused(arg.relativeTarget as string | number)
    }
}

function isTogglePressed(relativeTarget: string | number) {
    return [
        {
            target: "relative",
            relativeTarget,
            assertion: "toHaveAttribute",
            attribute: "aria-pressed",
            expectedValue: "true",
            failureMessage: "Expected toggle to have aria-pressed='true' when pressed."
        }
    ]
}

function isToggleUnpressed(relativeTarget: string | number) {
    return [
        {
            target: "relative",
            relativeTarget,
            assertion: "toHaveAttribute",
            attribute: "aria-pressed",
            expectedValue: "false",
            failureMessage: "Expected toggle to have aria-pressed='false' when unpressed."
        }
    ]  
}

function isToggleFocused(relativeTarget: string | number) {
    return  [
        {
            target: "relative",
            assertion: "toHaveFocus",
            relativeTarget,
            failureMessage: `Expected ${describeRelativeTarget("toggle", relativeTarget)} to have focus.`
        }
    ]
}