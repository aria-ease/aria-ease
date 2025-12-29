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

Updates `aria-expanded` attributes for accordion panels.

```javascript
import { updateAccordionTriggerAriaAttributes } from "aria-ease/accordion";

const accordionStates = [
  { expanded: true },
  { expanded: false },
  { expanded: false },
];

// Call when accordion state changes
updateAccordionTriggerAriaAttributes(
  "accordion-container", // Container ID
  "accordion-trigger", // Shared class for triggers
  accordionStates, // State array
  0 // Index of trigger that changed
);
```

**HTML structure:**

```html
<div id="accordion-container">
  <button
    class="accordion-trigger"
    aria-expanded="false"
    aria-controls="panel-1"
  >
    Section 1
  </button>
  <div id="panel-1">Content 1</div>

  <button
    class="accordion-trigger"
    aria-expanded="false"
    aria-controls="panel-2"
  >
    Section 2
  </button>
  <div id="panel-2">Content 2</div>
</div>
```

---

### ✅ Checkbox

Updates `aria-checked` attributes for custom checkboxes.

```javascript
import { updateCheckboxAriaAttributes } from "aria-ease/checkbox";

const checkboxStates = [
  { checked: true },
  { checked: false },
  { checked: true },
];

// Call when checkbox is toggled
function handleCheckboxClick(index) {
  checkboxStates[index].checked = !checkboxStates[index].checked;

  updateCheckboxAriaAttributes(
    "checkbox-group",
    "custom-checkbox",
    checkboxStates,
    index
  );
}
```

**HTML structure:**

```html
<div id="checkbox-group">
  <div
    class="custom-checkbox"
    role="checkbox"
    aria-checked="false"
    aria-label="Option 1"
  ></div>
  <div
    class="custom-checkbox"
    role="checkbox"
    aria-checked="false"
    aria-label="Option 2"
  ></div>
</div>
```

---

### 🔘 Radio Button

Updates `aria-checked` attributes for custom radio buttons.

```javascript
import { updateRadioAriaAttributes } from "aria-ease/radio";

const radioStates = [{ checked: true }, { checked: false }, { checked: false }];

function handleRadioSelect(index) {
  // Uncheck all, check selected
  radioStates.forEach((state, i) => {
    state.checked = i === index;
  });

  updateRadioAriaAttributes("radio-group", "custom-radio", radioStates);
}
```

---

### 🔀 Toggle Button

Updates `aria-pressed` attributes for toggle buttons.

```javascript
import { updateToggleAriaAttribute } from "aria-ease/toggle";

const toggleStates = [{ pressed: false }, { pressed: true }];

function handleToggle(index) {
  toggleStates[index].pressed = !toggleStates[index].pressed;

  updateToggleAriaAttribute("toggle-container", "toggle-btn", toggleStates);
}
```

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
test("menu is accessible", async () => {
  const { container } = render(<MyMenu />);

  // Runs axe-core + contract tests
  const result = await testUiComponent(
    "menu",
    container,
    "http://localhost:3000" // Optional: full E2E with Playwright
  );

  expect(result.violations).toHaveLength(0);
});
```

---

## 📦 Bundle Size

Aria-Ease is designed to be lightweight and tree-shakable:

| Import                       | Size (ESM)            |
| ---------------------------- | --------------------- |
| `aria-ease/accordion`        | ~1.5KB                |
| `aria-ease/checkbox`         | ~1.6KB                |
| `aria-ease/radio`            | ~1.6KB                |
| `aria-ease/toggle`           | ~1.4KB                |
| `aria-ease/menu`             | ~3.7KB                |
| `aria-ease/block`            | ~1.7KB                |
| Full bundle (all components) | ~416KB (uncompressed) |

**💡 Tip:** Always import individual components for optimal bundle size:

```javascript
// ✅ Good - only imports menu code (~3.7KB)
import { makeMenuAccessible } from "aria-ease/menu";
//or
import * as Block from "aria-ease/block";

// ❌ Avoid - imports everything (~416KB)
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
