# Aria-Ease

Out of the box accessibility utility package to develop production ready applications.

[![npm version](https://img.shields.io/npm/v/aria-ease.svg)](https://www.npmjs.com/package/aria-ease)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/aria-ease)](https://bundlephobia.com/package/aria-ease)
[![npm downloads](https://img.shields.io/npm/dm/aria-ease.svg)](https://www.npmjs.com/package/aria-ease)

## ✨ Features

- 🎯 **Tree-shakable** - Import only what you need (1.4KB - 3.7KB per component)
- ♿ **WCAG Compliant** - Follows WAI-ARIA best practices
- ⌨️ **Keyboard Navigation** - Full keyboard support out of the box
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

---

## 📚 Component API

### 🍔 Menu (Dropdowns)

Creates accessible menus with focus trapping and keyboard navigation. Works for dropdowns that toggles display with interactive items.

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
<button
  id="menu-button"
  aria-expanded="false"
  aria-controls="dropdown-menu"
  aria-haspopup="true"
>
  Menu
</button>
<div
  id="dropdown-menu"
  style="display: none;"
  aria-labelledby="menu-button"
  role="menu"
>
  <a role="menuitem" href="#" class="menu-item">Item 1</a>
  <a role="menuitem" href="#" class="menu-item">Item 2</a>
  <button role="menuitem" class="menu-item">Item 3</button>
</div>
```

## 🎮 Live Demo

- [Menu Component](https://codesandbox.io/p/sandbox/szsclq) - Dropdown with keyboard navigation

---

### 🪗 Accordion

Creates accessible accordions with keyboard navigation and automatic state management.

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
    allowMultiple: false, // Only one panel open at a time (default)
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
  allowMultiple: false, // Only one panel open at a time
});
```

</details>

---

### ✅ Checkbox

Creates accessible checkbox groups with keyboard navigation and state management.

**Features:**

- Arrow key navigation
- Space to toggle
- Independent state tracking
- Home/End key support
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

Creates accessible radio groups with keyboard navigation and automatic selection management.

**Features:**

- Arrow key navigation (all directions)
- Automatic unchecking of other radios
- Space to select
- Home/End key support
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
- Arrow key navigation (groups)
- Home/End support (groups)
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
import { testUiComponent } from "aria-ease/test";

// In your test file (Vitest, Jest, etc.)
test("combobox is accessible", async () => {
  const { container } = render(<Combobox />);

  // Runs axe-core + contract tests
  const result = await testUiComponent(
    "combobox",
    container,
    "http://localhost:3000", // Optional: full E2E with Playwright
  );

  expect(result.violations).toHaveLength(0);
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

Aria-Ease handles ARIA attributes and keyboard navigation, but **you must provide visible focus styles**:

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
