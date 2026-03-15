# Aria-Ease

### Accessibility infrastructure for the entire frontend engineering lifecycle.

Stop treating accessibility as an afterthought. Aria-Ease engineers accessibility integrity into every phase of frontend development lifecycle — from local development to production monitoring — so accessibility violations never reach your users.

[![npm version](https://img.shields.io/npm/v/aria-ease.svg)](https://www.npmjs.com/package/aria-ease)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/aria-ease)](https://bundlephobia.com/package/aria-ease)
[![npm downloads](https://img.shields.io/npm/dm/aria-ease.svg)](https://www.npmjs.com/package/aria-ease)

## 🏗️ Infrastructure, Not Just Utilities

Aria-Ease isn't a utility library. **It's an accessibility infrastructure** that integrates into every phase of your frontend engineering lifecycle:

| Phase              | Feature                                       | Status       | Impact                                  |
| ------------------ | --------------------------------------------- | ------------ | --------------------------------------- |
| **🔧 Development** | Component utilities for accessible patterns   | ✅ Available | Build it right from the start           |
| **⚡ Linting**     | ESLint rules to enforce accessible coding     | 🚧 Roadmap   | Catch mistakes as you type              |
| **🔍 Pre-Deploy**  | Axe-core powered static accessibility audit   | ✅ Available | Verify before it ships                  |
| **🧪 Testing**     | WAI-ARIA APG contract testing with Playwright | ✅ Available | 26 combobox assertions in ~4 seconds    |
| **🚀 CI/CD**       | Accessibility as deployment gatekeeper        | ✅ Available | Block inaccessible code from production |
| **📊 Production**  | Real user signal monitoring and replay        | 🚧 Roadmap   | Understand how users actually interact  |
| **📈 Insights**    | Dashboard for reporting and analytics         | 🚧 Roadmap   | Visualize accessibility health          |

**The philosophy:** By the time your app reaches manual testing, there should only be minute, non-automatable aspects left to verify.

**The reality:** Code that fails accessibility checks cannot reach production. Period.

---

## 🎯 The Complete Lifecycle

### From Development to Production

**Traditional approach:** Build features → Manual testing → Find accessibility issues → Fix them → Manual testing again → Ship (maybe)

**Aria-Ease approach:** Build with accessible utilities → Automated audits catch issues → Contract tests verify behavior → CI/CD gates deployment → Ship with confidence

### What Makes This Different?

#### 1. **Component Utilities** (Available Now)

Reusable accessible interaction patterns that implement WAI-ARIA APG specifications. Tree-shakable, framework-agnostic, production-ready.

```javascript
// Instead of 50+ lines managing ARIA attributes and keyboard events...
import { makeMenuAccessible } from "aria-ease/menu";

const menu = makeMenuAccessible({
  menuId: "user-menu",
  triggerId: "profile-button",
  menuItemsClass: "menu-item",
}); // Arrow keys, Escape, focus management — all handled
```

#### 2. **Static Audit** (Available Now)

Axe-core powered CLI that scans your entire site and generates comprehensive reports. Run it locally or in CI/CD.

```bash
npx aria-ease audit --url https://yoursite.com
```

#### 3. **Contract Testing** (Available Now)

This is the game-changer. We encoded the WAI-ARIA APG into deterministic JSON "contracts" and built a custom Playwright runner with isolated test-harness architecture. Run it locally or in CI/CD.

**The result?** Component interaction testing that feels closer to unit testing than manual QA.

```bash
npx aria-ease test
# ✓ 26 assertions in ~4 seconds
# ✓ 26 assertions in ~1 second in CI
```

**Why this matters:** Before, verifying a combobox meant manual keyboard testing across browsers. Now, it's automated, fast, and repeatable. You can boast about executing 26 combobox interaction assertions in ~4 seconds.

#### 4. **CI/CD Integration** (Available Now)

Turn accessibility into a deployment invariant. Add audit and test commands to your pipeline — if they fail, deployment is blocked.

```yaml
# .github/workflows/deploy.yml
jobs:
  accessibility-gate:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      - run: npx aria-ease audit # Static checks
      - run: npx aria-ease test # Interaction tests
      # Only deploy if both pass ☝️
```

Real example from our docs site: Push to branch → Accessibility checks run → Green check mark → Deploys to Firebase. Red X → Deploy blocked.

**No one has any excuse to ship inaccessible code anymore.**

#### 5. **Linting** (Roadmap)

ESLint rules that enforce accessible coding patterns as you type. Catch issues before they compile.

#### 6. **Production Monitoring** (Roadmap)

Real user signal monitoring, interaction replay, and analytics. Understand how assistive technology users actually experience your app.

#### 7. **Insights Dashboard** (Roadmap)

Visualize accessibility health across your entire application. Track progress, identify patterns, generate reports.

---

## ✨ Features

- 🎯 **Tree-shakable** - Import only what you need (1.4KB - 3.7KB per component)
- ♿ **WCAG Compliant** - Follows WAI-ARIA best practices
- ⌨️ **Keyboard Interaction** - Full keyboard support out of the box
- 🧪 **Contract Testing** - Built-in accessibility testing framework
- 🎭 **Framework Agnostic** - Works with React, Vue, vanilla JS, etc.
- 🔍 **CLI Audit Tool** - Automated accessibility testing for your sites
- 📦 **TypeScript Support** - Full type definitions included

## 📦 Installation

```bash
npm i aria-ease
# or
yarn add aria-ease
# or
pnpm add aria-ease
```

## 🚀 Quick Start

### Automated Accessibility Audits (CLI)

Run automated accessibility audits on your website with one command:

```bash
npx aria-ease audit --url https://yoursite.com
```

This generates comprehensive reports in JSON, CSV, and HTML formats showing all accessibility violations detected by axe-core.

**Create a config file** for multiple pages and custom settings:

```javascript
// ariaease.config.js (or .mjs, .cjs, .json, .ts)
export default {
  audit: {
    urls: [
      "https://yoursite.com",
      "https://yoursite.com/about",
      "https://yoursite.com/contact",
    ],
    output: {
      format: "html", // 'json' | 'csv' | 'html' | 'all'
      out: "./accessibility-reports",
    },
  },
};
```

Then run:

```bash
npx aria-ease audit
```

**Supported config formats:**

- `ariaease.config.js` (ES modules)
- `ariaease.config.mjs` (ES modules explicit)
- `ariaease.config.cjs` (CommonJS)
- `ariaease.config.json` (JSON)
- `ariaease.config.ts` (TypeScript - experimental)

The CLI will automatically find and load your config file, with validation to catch errors early.

**Perfect for CI/CD pipelines** to catch accessibility issues before production!

#### 🏅 Show Your Accessibility Commitment

After auditing your project, show the world you care about accessibility! Add a badge to your README:

**For projects audited with aria-ease:**

[![Audited by aria-ease](https://cdn.jsdelivr.net/gh/aria-ease/aria-ease@main/badges/audited-by-aria-ease.svg)](https://github.com/aria-ease/aria-ease)

```markdown
[![Audited by aria-ease](https://cdn.jsdelivr.net/gh/aria-ease/aria-ease@main/badges/audited-by-aria-ease.svg)](https://github.com/aria-ease/aria-ease)
```

**For projects with tested components:**

[![Components tested: aria-ease](https://cdn.jsdelivr.net/gh/aria-ease/aria-ease@main/badges/components-tested-aria-ease.svg)](https://github.com/aria-ease/aria-ease)

```markdown
[![Components tested: aria-ease](https://cdn.jsdelivr.net/gh/aria-ease/aria-ease@main/badges/components-tested-aria-ease.svg)](https://github.com/aria-ease/aria-ease)
```

**For projects using both audits and component tests:**

[![Verified by aria-ease](https://cdn.jsdelivr.net/gh/aria-ease/aria-ease@main/badges/verified-by-aria-ease.svg)](https://github.com/aria-ease/aria-ease)

```markdown
[![Verified by aria-ease](https://cdn.jsdelivr.net/gh/aria-ease/aria-ease@main/badges/verified-by-aria-ease.svg)](https://github.com/aria-ease/aria-ease)
```

**Why add the badge?**

- ✅ Shows your commitment to accessibility
- 🔍 Helps us discover projects using aria-ease
- 🌟 Promotes accessibility best practices in the community
- 📈 Free marketing for both your project and aria-ease!

> **Tip:** The CLI will prompt you to add the appropriate badge automatically after running audits or tests!

---

## 📚 Component API

### 🍔 Menu (Dropdowns)

Creates accessible menus with aria attribute management, focus trapping, and keyboard interaction. Works for dropdowns that toggles display with interactive items.

**Features:**

- Arrow key navigation
- Escape key closes menu and restores focus
- Focus trap within menu
- Submenu support

```javascript
import * as Menu from "aria-ease/menu";

// React Example
useEffect(() => {
  menuRef.current = Menu.makeMenuAccessible({
    menuId: "menu-div",
    menuItemsClass: "profile-menu-items",
    triggerId: "display-button",
  });

  return () => menuRef.current.cleanup(); // Clean up on unmount
}, []);

// Programmatically control
menuRef.current.openMenu(); // Open the menu
menuRef.current.closeMenu(); // Close the menu
menuRef.current.refresh(); // Refresh the cache after dynamically adding/removing a menu item

// Vanilla JS Example
const menu = Menu.makeMenuAccessible({
  menuId: "dropdown-menu",
  menuItemsClass: "menu-item",
  triggerId: "menu-button",
});

// Programmatically control
menu.openMenu();
menu.closeMenu();

// If you dynamically add/remove menu items, refresh the cache
menu.refresh();
```

**Required HTML structure:**

```html
<button id="menu-button" aria-label="Home example menu">Menu</button>
<div id="dropdown-menu" style="display: none;">
  <a href="#" class="menu-item">Item 1</a>
  <a href="#" class="menu-item">Item 2</a>
  <button class="menu-item">Item 3</button>
</div>
```

## 🎮 Live Demo

- [Menu Component](https://codepen.io/aria-ease/pen/PwGqdzp) - Menu dropdown with keyboard interaction

---

### 🍔 Combobox (Listbox)

Creates accessible listbox combobox with aria attribute management, focus trapping, and keyboard interaction.

**Features:**

- Arrow key navigation
- Escape key closes listbox
- ARIA attribute management (aria-expanded, aria-activedescendant, aria-controls, roles)
- Focus management with aria-activedescendant pattern

```javascript
import * as Combobox from "aria-ease/combobox";

// React Example
useEffect(() => {
  comboboxRef.current = Combobox.makeComboboxAccessible({
    comboboxInputId: "search-input",
    listBoxId: "suggestions-list",
    listBoxItemsClass: "suggestion-item",
  });

  return () => {
    if (comboboxRef.current) {
      comboboxRef.current.cleanup();
    }
  };
}, []);

// Programmatically control
comboboxRef.current.openListbox(); // Open the listbox
comboboxRef.current.refresh(); // Refresh the cache after dynamically adding/removing a listbox option item

// Vanilla JS Example
const combobox = Combobox.makeComboboxAccessible({
  comboboxInputId: "fruit",
  comboboxButtonId: "show-list-button",
  listBoxId: "fruits-listbox",
  listBoxItemsClass: "list-option",
  callback: {
    onSelect: (option) => {
      input.value = option.textContent;
      // Show all options after selection
      options.forEach((opt) => (opt.hidden = false));
    },
    onOpenChange: (isOpen) => {
      console.log("Listbox is", isOpen ? "open" : "closed");
    },
  },
});

// Programmatically control
combobox.openListbox();
combobox.closeListbox();

// If you dynamically add/remove listbox option items, refresh the cache
combobox.refresh();
```

**Required HTML structure:**

```html
<div id="combo-wrapper">
  <label for="fruit">Select a fruit</label>
  <div class="input-wrapper">
    <input type="text" id="fruit" placeholder="Search fruits..." />
    <button id="show-list-button" tabindex="-1">▼</button>
  </div>

  <ul id="fruits-listbox">
    <li id="apple" class="list-option">Apple</li>
    <li id="mango" class="list-option">Mango</li>
    <li id="orange" class="list-option">Orange</li>
    <li id="banana" class="list-option">Banana</li>
  </ul>
</div>
```

## 🎮 Live Demo

- [Combobox Component](https://codepen.io/aria-ease/pen/ByLNqOE) - Listbox combobox with keyboard interaction

---

### 🪗 Accordion

Creates accessible accordions with keyboard interaction and automatic state management.

**Features:**

- Arrow key navigation between triggers
- Automatic ARIA attribute management
- Single or multiple panel expansion
- Enter/Space to toggle panels
- Home/End key support

```javascript
import { makeAccordionAccessible } from "aria-ease/accordion";

// React Example
useEffect(() => {
  const accordion = makeAccordionAccessible({
    accordionId: "accordion-container",
    triggersClass: "accordion-trigger",
    panelsClass: "accordion-panel",
    allowMultipleOpen: false, // Only one panel open at a time (default)
  });

  return () => accordion.cleanup();
}, []);

// Programmatic control
accordion.expandItem(0); // Expand first panel
accordion.collapseItem(1); // Collapse second panel
accordion.toggleItem(2); // Toggle third panel
```

**HTML structure:**

```html
<div id="accordion-container">
  <button class="accordion-trigger">Section 1</button>
  <div class="accordion-panel">Content 1</div>

  <button class="accordion-trigger">Section 2</button>
  <div class="accordion-panel">Content 2</div>

  <button class="accordion-trigger">Section 3</button>
  <div class="accordion-panel">Content 3</div>
</div>
```

<details>
<summary>📌 Legacy API deprecated</summary>

```javascript
import { makeAccordionAccessible } from "aria-ease/accordion";

const accordionStates = [{ display: true }, { display: false }];

makeAccordionAccessible({
  accordionId: "faq-div",
  triggersClass: "dropdown-button",
  panelsClass: "accordion-panel",
  allowMultipleOpen: false, // Only one panel open at a time
});
```

</details>

---

### ✅ Checkbox

Creates accessible checkbox groups with keyboard interaction and state management.

**Features:**

- Space to toggle
- Independent state tracking
- Query checked states

```javascript
import { makeCheckboxAccessible } from "aria-ease/checkbox";

// React Example
useEffect(() => {
  const checkboxGroup = makeCheckboxAccessible({
    checkboxGroupId: "checkbox-group",
    checkboxesClass: "custom-checkbox",
  });

  return () => checkboxGroup.cleanup();
}, []);

// Programmatic control
checkboxGroup.toggleCheckbox(0); // Toggle first checkbox
checkboxGroup.setCheckboxState(1, true); // Check second checkbox
const states = checkboxGroup.getCheckedStates(); // [true, false, true]
const indices = checkboxGroup.getCheckedIndices(); // [0, 2]
```

**HTML structure:**

```html
<div id="checkbox-group">
  <div class="custom-checkbox" aria-label="Option 1"></div>
  <div class="custom-checkbox" aria-label="Option 2"></div>
  <div class="custom-checkbox" aria-label="Option 3"></div>
</div>
```

<details>
<summary>📌 Legacy API deprecated</summary>

```javascript
import { makeCheckboxAccessible } from "aria-ease/checkbox";

makeCheckboxAccessible({
  checkboxGroupId: "checkbox-div",
  checkboxesClass: "course-checkbox",
});
```

</details>

---

### 🔘 Radio Button

Creates accessible radio groups with keyboard interaction and automatic selection management.

**Features:**

- Arrow key navigation (all directions)
- Automatic unchecking of other radios
- Space to select
- Single selection enforcement

```javascript
import { makeRadioAccessible } from "aria-ease/radio";

// React Example
useEffect(() => {
  const radioGroup = makeRadioAccessible({
    radioGroupId: "radio-group",
    radiosClass: "custom-radio",
    defaultSelectedIndex: 0, // Initially selected (optional)
  });

  return () => radioGroup.cleanup();
}, []);

// Programmatic control
radioGroup.selectRadio(2); // Select third radio
const selected = radioGroup.getSelectedIndex(); // Get current selection
```

**HTML structure:**

```html
<div id="radio-group">
  <div class="custom-radio" aria-label="Option 1"></div>
  <div class="custom-radio" aria-label="Option 2"></div>
  <div class="custom-radio" aria-label="Option 3"></div>
</div>
```

<details>
<summary>📌 Legacy API deprecated</summary>

```javascript
import { makeRadioAccessible } from "aria-ease/radio";

makeRadioAccessible({
  radioGroupId: "radio-div",
  radiosClass: "radio",
  defaultSelectedIndex: 0, // Optional: which radio is selected initially
});
```

</details>

---

### 🔀 Toggle Button

Creates accessible toggle buttons with keyboard interactions and state management.

**Features:**

- Enter/Space to toggle
- Single toggle or toggle groups
- Query pressed states

```javascript
import { makeToggleAccessible } from "aria-ease/toggle";

// Single toggle button
const toggle = makeToggleAccessible({
  toggleId: "mute-button",
  isSingleToggle: true,
});

// Toggle button group
const toggleGroup = makeToggleAccessible({
  toggleId: "toolbar",
  togglesClass: "toggle-btn",
  isSingleToggle: false,
});

// Programmatic control
toggle.toggleButton(0); // Toggle the button
toggle.setPressed(0, true); // Set pressed state
const states = toggleGroup.getPressedStates(); // [false, true, false]
const indices = toggleGroup.getPressedIndices(); // [1]

// Cleanup
toggle.cleanup();
```

**HTML structure:**

```html
<!-- Single toggle -->
<button id="mute-button">Mute</button>

<!-- Toggle group -->
<div id="toolbar">
  <button class="toggle-btn">Bold</button>
  <button class="toggle-btn">Italic</button>
  <button class="toggle-btn">Underline</button>
</div>
```

<details>
<summary>📌 Legacy API deprecated</summary>

```javascript
import { updateToggleAriaAttribute } from "aria-ease/toggle";

const toggleStates = [{ pressed: false }];

updateToggleAriaAttribute("toggle-container", "toggle-btn", toggleStates, 0);
```

</details>

---

### 🧱 Block (Generic Focusable Groups)

Makes groups of elements keyboard navigable with arrow keys. Perfect for custom controls, toolbars, or any grouped interactive elements.

```javascript
import { makeBlockAccessible } from "aria-ease/block";

const blockInstance = makeBlockAccessible({
  blockId: "toolbar",
  blockItemsClass: "tool-button",
});

// Clean up when done
blockInstance.current.cleanup();
```

---

## 🧪 Testing Your Components

Aria-Ease includes a built-in testing framework for automated accessibility validation:

```javascript
import { describe, test, afterAll } from "vitest";
import { testUiComponent, cleanupTests } from "aria-ease/test";
import { render } from "@testing-library/react";
import ShopifyUserMenu from "../src/components/menus/ShopifyUserMenu";

afterAll(async () => {
  await cleanupTests();
});

describe("Shopify User Menu Accessibility Test", () => {
  test("renders Shopify user menu without accessibility violation(s)", async () => {
    await testUiComponent(
      "menu",
      null,
      "http://localhost:5173/test-harness?component=menu",
    ); // For full component interaction test. Uses Playwright to test interaction and behaviors
  });
});

describe("Shopify User Menu Accessibility Test", () => {
  test("renders Shopify user menu without accessibility violation(s)", async () => {
    const { container } = render(<ShopifyUserMenu />);
    await testUiComponent("menu", container, null); // For fast limited static tests. Doesn't test for interaction and behaviors
  });
});
```

---

## 📦 Bundle Size

Aria-Ease is designed to be lightweight and tree-shakable:

| Import                       | Size (ESM)            |
| ---------------------------- | --------------------- |
| `aria-ease/accordion`        | ~6.5KB                |
| `aria-ease/checkbox`         | ~6.0KB                |
| `aria-ease/radio`            | ~5.5KB                |
| `aria-ease/toggle`           | ~6.0KB                |
| `aria-ease/menu`             | ~6.7KB                |
| `aria-ease/block`            | ~1.7KB                |
| `aria-ease/combobox`         | ~8.1KB                |
| Full bundle (all components) | ~459KB (uncompressed) |

**💡 Tip:** Always import individual components for optimal bundle size:

```javascript
// ✅ Good - only imports menu code (~6.7KB)
import { makeMenuAccessible } from "aria-ease/menu";
//or
import * as Block from "aria-ease/block";

// ❌ Avoid - imports everything (~459KB)
import { makeMenuAccessible } from "aria-ease";
```

---

## ⚠️ Important: React StrictMode

If using React StrictMode, be aware it intentionally calls effects twice in development. This can cause issues with imperative DOM manipulation. Either:

1. Remove `<React.StrictMode>` in development, or
2. Use proper cleanup functions:

```javascript
useEffect(() => {
  menuRef.current = Menu.makeMenuAccessible({...});
  return () => menuRef.current.cleanup(); // Prevents double-initialization
}, []);
```

---

## 🎨 Focus Styling

Aria-Ease handles ARIA attributes and keyboard interaction, but **you must provide visible focus styles**:

```css
:focus {
  outline: 2px solid rgba(0, 91, 211, 1);
  outline-offset: 2px;
}

/* Or custom styles */
.menu-item:focus {
  background: #e3f2fd;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
}
```

Without visible focus indicators, keyboard users cannot tell which element is active.

---

## 🌐 Browser Support

Aria-Ease supports all modern browsers:

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | Last 2 versions |
| Firefox | Last 2 versions |
| Safari  | Last 2 versions |
| Edge    | Last 2 versions |

**Not supported:** Internet Explorer 11 and below

**Requirements:**

- ES6+ support
- `querySelector` and `querySelectorAll`
- `addEventListener` and `removeEventListener`
- Modern event handling (`KeyboardEvent`, `FocusEvent`)

For older browser support, use a polyfill service or transpile with appropriate targets.

---

## 🚀 CI/CD Integration: Accessibility as a Deployment Gatekeeper

**The game-changer:** Turn accessibility into a deployment invariant. Code that fails accessibility checks cannot reach production.

### Why This Matters

Until now, accessibility testing often happened manually, late in the cycle, or not at all. Even with good intentions, inaccessible code slips through when testing is manual and optional.

**Aria-Ease changes the equation:**

- ✅ Automated = no human bottleneck
- ✅ Fast = ~6 seconds for 90 accessibility interaction assertions
- ✅ Deterministic = same results every time
- ✅ Blocking = deploy fails if tests fail

**Real example:** The aria-ease docs site has a pipeline that:

1. Runs `aria-ease audit` on every push
2. Runs `aria-ease test` for component interaction verification
3. Only deploys to Firebase if both pass
4. Blocks deployment if either fails

**Result:** Green check ✓ = live docs. Red X ✗ = deploy blocked. No exceptions.

### GitHub Actions Example

Here's a complete workflow that gates deployment on accessibility:

```yaml
name: Accessibility Gate + Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  accessibility-checks:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm install

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Build application
        run: npm run build

      - name: Start dev server
        run: |
          npm run dev &
          npx wait-on http://localhost:5173 -t 30000

      - name: Run accessibility audit
        run: npx aria-ease audit
        # ⬆️ If audit fails, workflow stops here

      - name: Run component contract tests
        run: |
          set -o pipefail
          npm run test 2>&1 | tee component-contract-test-output.txt
        # ⬆️ If interaction tests fail, workflow stops here

      - name: Upload audit reports
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: accessibility-reports
          path: accessibility-reports/
          retention-days: 30

      - name: Upload component contract tests report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: component-contract-test-output
          path: component-contract-test-output.txt
          retention-days: 30

  deploy:
    needs: accessibility-checks # ⬅️ This is the key
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm install

      - name: Build for production
        run: npm run build

      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}

      # Deployment only happens if accessibility-checks job passes ✅
```

### Configuration for CI/CD

Create `ariaease.config.js` in your project root:

```javascript
export default {
  audit: {
    urls: [
      "http://localhost:5173", // Homepage
      "http://localhost:5173/docs", // Docs
      "http://localhost:5173/examples", // Examples
    ],
    output: {
      format: "all", // Generate JSON, CSV, and HTML reports
      out: "./accessibility-reports",
    },
  },
};
```

Add to `package.json`:

```json
{
  "scripts": {
    "audit": "npx aria-ease audit -f html",
    "test:a11y": "npx aria-ease test",
    "ci": "npm run audit && npm run test:a11y"
  }
}
```

### Other CI Platforms

**GitLab CI:**

```yaml
accessibility:
  stage: test
  script:
    - npm install
    - npm run build
    - npm run dev &
    - npx wait-on http://localhost:5173
    - npx aria-ease audit
    - npx aria-ease test
  artifacts:
    paths:
      - accessibility-reports/
    when: always

deploy:
  stage: deploy
  needs: [accessibility] # Gates deployment
  script:
    - npm run deploy
  only:
    - main
```

**CircleCI:**

```yaml
version: 2.1

jobs:
  accessibility:
    docker:
      - image: mcr.microsoft.com/playwright:v1.40.0-focal
    steps:
      - checkout
      - run: npm install
      - run: npm run build
      - run: npm run dev &
      - run: npx wait-on http://localhost:5173
      - run: npx aria-ease audit
      - run: npx aria-ease test
      - store_artifacts:
          path: accessibility-reports

  deploy:
    docker:
      - image: node:20
    steps:
      - checkout
      - run: npm install
      - run: npm run deploy

workflows:
  build-test-deploy:
    jobs:
      - accessibility
      - deploy:
          requires:
            - accessibility # Gates deployment
          filters:
            branches:
              only: main
```

### Performance & Speed

One of the biggest blockers to adding accessibility testing to CI/CD is **speed**. Nobody wants pipelines that take 30 minutes.

**Aria-Ease contract testing is fast:**

```bash
npx aria-ease test
# ✓ 26 combobox interaction assertions in ~1 seconds in CI
# ✓ 90 accessibility interaction assertions in ~6 seconds in CI

```

**Why so fast?**

- Custom Playwright runner optimized for component testing
- Isolated test-harness architecture (no full app bootstrapping)
- Deterministic JSON contracts (no flaky selectors)
- Runs headless in CI

**Compare to manual testing:** Manually verifying keyboard interactions for a combobox (arrow keys, typing, Enter, Escape, Home/End, etc.) across browsers, verifying WAI-ARIA roles, states and properties = 20-30 minutes. Aria-Ease = 4 seconds.

### The Moment of Truth

The first time you see that green check mark in your CI/CD pipeline—knowing that both static accessibility violations AND interaction behavior have been verified automatically—that's when it clicks.

**No one has any excuse to ship inaccessible code anymore.**

You've shifted accessibility left (into development), automated the verification, and made it a deployment gatekeeper.

---

## 📖 More Resources

- [Full Documentation](https://ariaease.site/docs)
- [GitHub Repository](https://github.com/aria-ease/aria-ease)
- [Report Issues](https://github.com/aria-ease/aria-ease/issues)
- [Contributing Guide](https://github.com/aria-ease/aria-ease/blob/main/CONTRIBUTION-GUIDELINES.md)

---

## 🤝 Contributing

We welcome contributions! See our [contribution guidelines](CONTRIBUTION-GUIDELINES.md) to get started.

---

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

---

**Created by [Isaac Victor](https://github.com/Scriptkidd98)**
