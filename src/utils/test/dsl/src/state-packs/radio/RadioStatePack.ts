import describeRelativeTarget from "../DescribeRelativeTarget"

export const RADIO_STATES = {
    "radio.checked": {
        setup: [
            {
                when: ["keyboard"],
                steps: (arg: { relativeTarget?: string | number }) => [
                    { type: "keypress", target: "relative", relativeTarget: arg.relativeTarget, key: "Space" }
                ]
            },
            {
                when: ["pointer"],
                steps: (arg: { relativeTarget?: string | number }) => [
                    { type: "click", target: "relative", relativeTarget: arg.relativeTarget, }
                ]
            }
        ],
        assertion: (arg: { relativeTarget?: string | number } = {}) => isRadioChecked(arg.relativeTarget as string | number)
    },
    "radio.unchecked": {
        setup: [
            {
                when: ["keyboard", "pointer"],
                steps: () => []
            }
        ],
        assertion: (arg: { relativeTarget?: string | number } = {}) => isRadioUnChecked(arg.relativeTarget as string | number)
    },
    "radio.focused": {
        setup: [
            {
                when: ["keyboard", "pointer"],
                steps: (arg: { relativeTarget?: string | number }) => [
                    { type: "focus", target: "relative", relativeTarget: arg.relativeTarget }
                ]
            }
        ],
        assertion: (arg: { relativeTarget?: string | number } = {}) => isRadioFocused(arg.relativeTarget as string | number)
    }
}

function isRadioChecked(relativeTarget: string | number) {
    return [
        {
            target: "relative",
            relativeTarget,
            assertion: "toHaveAttribute",
            attribute: "aria-checked",
            expectedValue: "true",
            failureMessage: "Expected radio to have aria-checked='true' when checked."
        }
    ]
}

function isRadioUnChecked(relativeTarget: string | number) {
    return [
        {
            target: "relative",
            relativeTarget,
            assertion: "toHaveAttribute",
            attribute: "aria-checked",
            expectedValue: "false",
            failureMessage: "Expected radio to have aria-checked='false' when unchecked."
        }
    ]  
}

function isRadioFocused(relativeTarget: string | number) {
    return  [
        {
            target: "relative",
            assertion: "toHaveFocus",
            relativeTarget,
            failureMessage: `Expected ${describeRelativeTarget("radio", relativeTarget)} to have focus.`
        }
    ]
}