/**
 * Formats audit results into the specified output format.
 * @param {Array} allResults Array of audit results containing URL and axe results.
 * @param {string} format Output format: 'json', 'csv', or 'html'.
 * @returns {string} Formatted results as a string.
 */
export function formatResults(allResults, format) {
    switch (format) {
        case 'json':
            return JSON.stringify(allResults.flatMap(({ url, result }) => result
                ? result.violations.flatMap(v => v.nodes.map(n => ({
                    URL: url,
                    Rule: v.id,
                    Impact: v.impact,
                    Description: v.description,
                    Target: n.target,
                    FailureSummary: n.failureSummary
                })))
                : []), null, 2);
        case 'csv':
            return toCSV(allResults);
        case 'html':
            return toHTML(allResults);
        default:
            return '';
    }
}
/**
 * Converts audit results to CSV format.
 * @param {Array} allResults Array of audit results.
 * @returns {string} CSV formatted string.
 */ function toCSV(allResults) {
    const rows = ['URL,Rule,Impact,Description,Target,FailureSummary'];
    allResults.forEach(({ url, result }) => {
        if (result) {
            result.violations.forEach(v => {
                v.nodes.forEach(n => {
                    rows.push(escapeCSV(url) + ',' +
                        escapeCSV(v.id) + ',' +
                        escapeCSV(v.impact) + ',' +
                        escapeCSV(v.description) + ',' +
                        escapeCSV(Array.isArray(n.target) ? n.target.join('; ') : String(n.target)) + ',' +
                        escapeCSV(n.failureSummary ?? ''));
                });
            });
        }
    });
    return rows.join('\n');
}
function escapeCSV(value) {
    const s = String(value ?? '');
    return `"${s.replace(/"/g, '""')}"`;
}
function toHTML(allResults) {
    const summary = {
        pagesAudited: 0,
        pagesWithViolations: 0,
        totalViolations: 0,
        distinctRules: new Set(),
        impactCounts: new Map()
    };
    allResults.forEach(({ result }) => {
        if (!result)
            return;
        summary.pagesAudited++;
        const pageViolations = result.violations.reduce((acc, v) => {
            const nodesCount = (v.nodes || []).length;
            if (nodesCount > 0) {
                summary.distinctRules.add(v.id);
                summary.totalViolations += nodesCount;
                acc += nodesCount;
                const impact = String(v.impact ?? 'unknown');
                summary.impactCounts.set(impact, (summary.impactCounts.get(impact) || 0) + nodesCount);
            }
            return acc;
        }, 0);
        if (pageViolations > 0)
            summary.pagesWithViolations++;
    });
    const rows = [];
    allResults.forEach(({ url, result }) => {
        if (!result)
            return;
        result.violations.forEach(v => {
            v.nodes.forEach(n => {
                const target = Array.isArray(n.target) ? n.target.join('; ') : String(n.target);
                rows.push(`
          <tr>
            <td class="nowrap">${escapeHTML(url)}</td>
            <td class="nowrap">${escapeHTML(v.id)}</td>
            <td class="impact ${escapeClass(String(v.impact ?? 'unknown'))}">${escapeHTML(String(v.impact ?? ''))}</td>
            <td class="desc">${escapeHTML(v.description ?? '')}</td>
            <td class="target"><code>${escapeHTML(target)}</code></td>
            <td class="fail">${escapeHTML(n.failureSummary ?? '').split(/\r?\n/).join('<br/>')}</td>
          </tr>
        `);
            });
        });
    });
    const impactSummary = Array.from(summary.impactCounts.entries()).map(([impact, count]) => `<li><strong class="impact ${escapeClass(impact)}">${escapeHTML(impact)}</strong>: ${count}</li>`).join('\n');
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const reportDateTime = `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const headerSummary = `
    <section class="summary">
      <h2>Report summary</h2>
      <ul>
        <li><strong>Date:</strong> ${reportDateTime}</li>
        <li><strong>Pages audited:</strong> ${summary.pagesAudited}</li>
        <li><strong>Pages with violations:</strong> ${summary.pagesWithViolations}</li>
        <li><strong>Total violations:</strong> ${summary.totalViolations}</li>
        <li><strong>Distinct rules:</strong> ${summary.distinctRules.size}</li>
      </ul>
      <div class="impact-summary">
        <h3>By impact</h3>
        <ul class="summary-list">
          ${impactSummary || '<li>None</li>'}
        </ul>
      </div>
    </section>
  `.trim();
    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <title>Aria-Ease Accessibility Audit Report</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          :root{
            --bg:#ffffff; --muted:#6b7280; --border:#e6e9ee;
            --impact-critical: red; --impact-moderate:#fff4dd; --impact-serious:rgb(255, 123, 0);
          }
          body{font-family:Inter,ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial; background:var(--bg); color:#111827; padding:24px; line-height:1.4}
          h1{margin:0 0 8px}
          .summary{background:#f8fafc;border:1px solid var(--border);padding:12px 16px;border-radius:8px;margin-bottom:18px}
          .summary ul{margin:6px 0 0 0;padding:0 18px}
          .impact-summary h3{margin:12px 0 6px}
          table{width:100%; border-collapse:collapse; margin-top:12px}
          th,td{border:1px solid var(--border); padding:10px; text-align:left; vertical-align:top}
          th{background:#f3f4f6; font-weight:600; position:sticky; top:0; z-index:1}
          .nowrap{white-space:nowrap}
          .target code{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace; white-space:pre-wrap}
          .desc{max-width:380px}
          tr:nth-child(even){background:#fbfbfb}
          td.fail{color:#7b1e1e}
          .impact.critical{background:var(--impact-critical); font-weight:600}
          .impact.moderate{background:var(--impact-moderate); font-weight:600}
          .impact.serious{background:var(--impact-serious); font-weight:600}
          @media (max-width:900px){
            .desc{max-width:200px}
            table, thead, tbody, th, td, tr{display:block}
            thead{display:none}
            tr{margin-bottom:10px; border: 1px solid var(--border);}
            td{border:1px solid var(--border); padding:6px}
            td::before{font-weight:600; display:inline-block; width:120px}
          }
          .summary-list strong,
          .summary-list li {
            padding: 2px 4px;
          }
        </style>
      </head>
      <body>
        <h1>Aria-Ease Accessibility Audit Report</h1>
        ${headerSummary}
        <table>
          <thead>
            <tr>
              <th>URL</th><th>Rule</th><th>Impact</th><th>Description</th><th>Target</th><th>FailureSummary</th>
            </tr>
          </thead>
          <tbody>
            ${rows.join('\n') || '<tr><td colspan="6"><em>No violations found.</em></td></tr>'}
          </tbody>
        </table>
      </body>
    </html>
  `.trim();
    return html;
}
function escapeHTML(str) {
    return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
function escapeClass(s) {
    return String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
