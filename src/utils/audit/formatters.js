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
        case 'html':
            return toHTML(allResults);
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
                    var _a;
                    rows.push(escapeCSV(url) + ',' +
                        escapeCSV(v.id) + ',' +
                        escapeCSV(v.impact) + ',' +
                        escapeCSV(v.description) + ',' +
                        escapeCSV(Array.isArray(n.target) ? n.target.join('; ') : String(n.target)) + ',' +
                        escapeCSV((_a = n.failureSummary) !== null && _a !== void 0 ? _a : ''));
                });
            });
        }
    });
    return rows.join('\n');
}
function escapeCSV(value) {
    var s = String(value !== null && value !== void 0 ? value : '');
    return "\"".concat(s.replace(/"/g, '""'), "\"");
}
function toHTML(allResults) {
    var summary = {
        pagesAudited: 0,
        pagesWithViolations: 0,
        totalViolations: 0,
        distinctRules: new Set(),
        impactCounts: new Map()
    };
    allResults.forEach(function (_a) {
        var result = _a.result;
        if (!result)
            return;
        summary.pagesAudited++;
        var pageViolations = result.violations.reduce(function (acc, v) {
            var _a;
            var nodesCount = (v.nodes || []).length;
            if (nodesCount > 0) {
                summary.distinctRules.add(v.id);
                summary.totalViolations += nodesCount;
                acc += nodesCount;
                var impact = String((_a = v.impact) !== null && _a !== void 0 ? _a : 'unknown');
                summary.impactCounts.set(impact, (summary.impactCounts.get(impact) || 0) + nodesCount);
            }
            return acc;
        }, 0);
        if (pageViolations > 0)
            summary.pagesWithViolations++;
    });
    var rows = [];
    allResults.forEach(function (_a) {
        var url = _a.url, result = _a.result;
        if (!result)
            return;
        result.violations.forEach(function (v) {
            v.nodes.forEach(function (n) {
                var _a, _b, _c, _d;
                var target = Array.isArray(n.target) ? n.target.join('; ') : String(n.target);
                rows.push("\n          <tr>\n            <td class=\"nowrap\">".concat(escapeHTML(url), "</td>\n            <td class=\"nowrap\">").concat(escapeHTML(v.id), "</td>\n            <td class=\"impact ").concat(escapeClass(String((_a = v.impact) !== null && _a !== void 0 ? _a : 'unknown')), "\">").concat(escapeHTML(String((_b = v.impact) !== null && _b !== void 0 ? _b : '')), "</td>\n            <td class=\"desc\">").concat(escapeHTML((_c = v.description) !== null && _c !== void 0 ? _c : ''), "</td>\n            <td class=\"target\"><code>").concat(escapeHTML(target), "</code></td>\n            <td class=\"fail\">").concat(escapeHTML((_d = n.failureSummary) !== null && _d !== void 0 ? _d : '').split(/\r?\n/).join('<br/>'), "</td>\n          </tr>\n        "));
            });
        });
    });
    var impactSummary = Array.from(summary.impactCounts.entries()).map(function (_a) {
        var impact = _a[0], count = _a[1];
        return "<li><strong class=\"impact ".concat(escapeClass(impact), "\">").concat(escapeHTML(impact), "</strong>: ").concat(count, "</li>");
    }).join('\n');
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var reportDateTime = "".concat(pad(d.getDate()), "-").concat(pad(d.getMonth() + 1), "-").concat(d.getFullYear(), " ").concat(pad(d.getHours()), ":").concat(pad(d.getMinutes()), ":").concat(pad(d.getSeconds()));
    var headerSummary = "\n    <section class=\"summary\">\n      <h2>Report summary</h2>\n      <ul>\n        <li><strong>Date:</strong> ".concat(reportDateTime, "</li>\n        <li><strong>Pages audited:</strong> ").concat(summary.pagesAudited, "</li>\n        <li><strong>Pages with violations:</strong> ").concat(summary.pagesWithViolations, "</li>\n        <li><strong>Total violations:</strong> ").concat(summary.totalViolations, "</li>\n        <li><strong>Distinct rules:</strong> ").concat(summary.distinctRules.size, "</li>\n      </ul>\n      <div class=\"impact-summary\">\n        <h3>By impact</h3>\n        <ul class=\"summary-list\">\n          ").concat(impactSummary || '<li>None</li>', "\n        </ul>\n      </div>\n    </section>\n  ").trim();
    var html = "\n    <!DOCTYPE html>\n    <html lang=\"en\">\n      <head>\n        <meta charset=\"utf-8\"/>\n        <title>Aria-Ease Accessibility Audit Report</title>\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/>\n        <style>\n          :root{\n            --bg:#ffffff; --muted:#6b7280; --border:#e6e9ee;\n            --impact-critical: red; --impact-moderate:#fff4dd; --impact-serious:rgb(255, 123, 0);\n          }\n          body{font-family:Inter,ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial; background:var(--bg); color:#111827; padding:24px; line-height:1.4}\n          h1{margin:0 0 8px}\n          .summary{background:#f8fafc;border:1px solid var(--border);padding:12px 16px;border-radius:8px;margin-bottom:18px}\n          .summary ul{margin:6px 0 0 0;padding:0 18px}\n          .impact-summary h3{margin:12px 0 6px}\n          table{width:100%; border-collapse:collapse; margin-top:12px}\n          th,td{border:1px solid var(--border); padding:10px; text-align:left; vertical-align:top}\n          th{background:#f3f4f6; font-weight:600; position:sticky; top:0; z-index:1}\n          .nowrap{white-space:nowrap}\n          .target code{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, \"Roboto Mono\", \"Courier New\", monospace; white-space:pre-wrap}\n          .desc{max-width:380px}\n          tr:nth-child(even){background:#fbfbfb}\n          td.fail{color:#7b1e1e}\n          .impact.critical{background:var(--impact-critical); font-weight:600}\n          .impact.moderate{background:var(--impact-moderate); font-weight:600}\n          .impact.serious{background:var(--impact-serious); font-weight:600}\n          @media (max-width:900px){\n            .desc{max-width:200px}\n            table, thead, tbody, th, td, tr{display:block}\n            thead{display:none}\n            tr{margin-bottom:10px; border: 1px solid var(--border);}\n            td{border:1px solid var(--border); padding:6px}\n            td::before{font-weight:600; display:inline-block; width:120px}\n          }\n          .summary-list strong,\n          .summary-list li {\n            padding: 2px 4px;\n          }\n        </style>\n      </head>\n      <body>\n        <h1>Aria-Ease Accessibility Audit Report</h1>\n        ".concat(headerSummary, "\n        <table>\n          <thead>\n            <tr>\n              <th>URL</th><th>Rule</th><th>Impact</th><th>Description</th><th>Target</th><th>FailureSummary</th>\n            </tr>\n          </thead>\n          <tbody>\n            ").concat(rows.join('\n') || '<tr><td colspan="6"><em>No violations found.</em></td></tr>', "\n          </tbody>\n        </table>\n      </body>\n    </html>\n  ").trim();
    return html;
}
function escapeHTML(str) {
    return String(str !== null && str !== void 0 ? str : '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
function escapeClass(s) {
    return String(s !== null && s !== void 0 ? s : '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
