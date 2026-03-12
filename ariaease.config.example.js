/**
 * Example AriaEase configuration file
 * 
 * Save this as ariaease.config.js (or .mjs, .cjs, .json, .ts) in your project root
 */

export default {
  // Audit configuration for accessibility testing
  audit: {
    urls: [
      'http://localhost:5173/'
    ],
    output: {
      format: 'html',
      out: './accessibility-reports/audit'
    }
  }
};
