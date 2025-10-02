export function formatResults(allResults, format) {
    switch (format) {
        case 'json':
            return JSON.stringify(allResults.flatMap(function (_a) {
                var url = _a.url, result = _a.result;
                return result
                    ? result.violations.flatMap(function (v) {
                        return v.nodes.map(function (n) { return ({
                            URL: url,
                            Rule: v.id,
                            Impact: v.impact,
                            Description: v.description,
                            Target: n.target,
                            FailureSummary: n.failureSummary
                        }); });
                    })
                    : [];
            }), null, 2);
        case 'csv':
            return toCSV(allResults);
        default:
            return '';
    }
}
function toCSV(allResults) {
    var rows = ['URL,Rule,Impact,Description,Target,FailureSummary'];
    allResults.forEach(function (_a) {
        var url = _a.url, result = _a.result;
        if (result) {
            result.violations.forEach(function (v) {
                v.nodes.forEach(function (n) {
                    rows.push("\"".concat(url, "\",\"").concat(v.id, "\",\"").concat(v.impact, "\",\"").concat(v.description, "\",\"").concat(n.target, "\",\"").concat(n.failureSummary, "\""));
                });
            });
        }
    });
    return rows.join('\n');
}
