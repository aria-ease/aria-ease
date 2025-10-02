import { AxeResults } from "Types";

export function formatResults(allResults: { url: string; result?: AxeResults }[], format: string): string {
  switch (format) {
    case 'json':
      return JSON.stringify(
        allResults.flatMap(({ url, result }) =>
          result
            ? result.violations.flatMap(v =>
                v.nodes.map(n => ({
                  URL: url,
                  Rule: v.id,
                  Impact: v.impact,
                  Description: v.description,
                  Target: n.target,
                  FailureSummary: n.failureSummary
                }))
              )
            : []
        ),
        null,
        2
      );
    case 'csv':
      return toCSV(allResults);
    default:
      return '';
  }
}

function toCSV(allResults: { url: string, result?: AxeResults }[]) {
  const rows = ['URL,Rule,Impact,Description,Target,FailureSummary'];
  allResults.forEach(({ url, result }: { url: string, result?: AxeResults }) => {
    if(result) {
      result.violations.forEach(v => {
        v.nodes.forEach(n => {
          rows.push(`"${url}","${v.id}","${v.impact}","${v.description}","${n.target}","${n.failureSummary}"`);
        });
      });
    }
  });
  return rows.join('\n');
}