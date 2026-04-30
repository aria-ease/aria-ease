export default function describeRelativeTarget(component: string, relativeTarget: string | number) {
    if (relativeTarget === "first") return `first ${component}`;
    if (relativeTarget === "last") return `last ${component}`;
    if (relativeTarget === "next") return `next ${component}`;
    if (relativeTarget === "previous") return `previous ${component}`;
    if (typeof relativeTarget === "number") return `${component} at index ${relativeTarget}`;
    return `${relativeTarget} ${component}`;
}