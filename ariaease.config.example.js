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
  },

  // Contract test configuration
  test: {
    // Global fallback strictness: minimal | balanced | strict | paranoid
    strictness: 'balanced',

    // Timeout controls for Playwright contract runner
    // Set true to disable Playwright timeouts for actions/assertions/navigation/readiness
    disableTimeouts: false,
    // Or tune specific timeout buckets in milliseconds
    // actionTimeoutMs: 1000,
    // assertionTimeoutMs: 2000,
    // navigationTimeoutMs: 30000,
    // componentReadyTimeoutMs: 5000,

    // Optional per-component overrides
    components: [
      {
        name: 'menu',
        strictness: 'strict',
        // Menus/submenus are more timing-sensitive in slower environments.
        actionTimeoutMs: 1200,
        assertionTimeoutMs: 2500,
        componentReadyTimeoutMs: 8000
      },
      {
        name: 'accordion',
        strictness: 'minimal'
      }
    ]
  }
};
