/**
 * Example AriaEase configuration file
 * 
 * Save this as ariaease.config.js (or .mjs, .cjs, .json, .ts) in your project root
 */

export default {
  // Audit configuration for accessibility testing
  audit: {
    // URLs to audit
    urls: [
      'http://localhost:3000',
      'http://localhost:3000/about',
      'http://localhost:3000/contact',
    ],

    // Output configuration
    output: {
      // Format: 'json' | 'csv' | 'html' | 'all'
      format: 'all',
      
      // Output directory
      out: './accessibility-reports/audit'
    },

    // Optional: Custom axe-core rules (advanced)
    // rules: {
    //   'color-contrast': { enabled: true },
    //   'valid-lang': { enabled: true }
    // }
  },

  // Test configuration for component testing (future feature)
  // test: {
  //   components: [
  //     { name: 'MyButton', path: './src/components/MyButton' },
  //     { name: 'MyMenu', path: './src/components/MyMenu' }
  //   ]
  // }
};
