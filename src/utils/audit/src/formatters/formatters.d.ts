import type { AxeResult } from "Types";
/**
 * Formats audit results into the specified output format.
 * @param {Array} allResults Array of audit results containing URL and axe results.
 * @param {string} format Output format: 'json', 'csv', or 'html'.
 * @returns {string} Formatted results as a string.
 */
export declare function formatResults(allResults: {
    url: string;
    result?: AxeResult;
}[], format: string): string;
//# sourceMappingURL=formatters.d.ts.map