# Aria-Ease

Out of the box accessibility utility package to develop production ready applications.

## Install

`npm i aria-ease`

`yarn add aria-ease`

## Features

Don't spend hours wrestling with accessibility code. Aria-Ease provides pre-built functions that help you integrate accessibility seamlessly into your development workflow. It simplifies the process of adding essential accessibility features (e.g. assistive capability, keyboard navigation, focus management) to common UI components like menus, accordions, checkboxes, e.t.c. This allows you to focus on building great user experiences for everyone.

The package currently has support for 5 components: accordions, blocks, checkboxes, menus, radios, toggle butttons.

Add accessibility to menu: menu can be a dropdown, combo box, slide navigation menu, e.t.c. Basically any component that toggles display and has a list of interactive children items. The function creates a focus trap within the menu and focus can be navigated using the arrow keys. The escape key also closes the menu and returns the focus back to the trigger.

The makeMenuAccessible function takes two string arguments; the id of the menu, the class name of the children items of the menu. And should only be invoked after the menu has become visible or added to the DOM. When the menu is visible the first item of the menu is in focus and focus can be navigated using the Arrow keys. The Space and Enter keys clicks the menu item if they are buttons or links element. The Escape key closes the menu, and returns the focus back to the button that toggles the menu. The Tab key exits the trap.

The updateMenuTriggerAriaAttributes function take two string arguments; the id of the menu trigger, and the aria-label that will replace the current one in the DOM. Behind the scene the aria-expanded and aria-attributes are also updated based on the visibility of the menu.

#### Usage

```javascript
import {
  makeMenuAccessible,
  updateMenuTriggerAriaAttributes,
  cleanUpMenuEventListeners,
} from "aria-ease";

const MenuExample = () => {
  const toggleMenuDisplay = (event) => {
    if (
      event.type === "mousedown" ||
      (event.type === "keydown" && (event.key === "Enter" || event.key === " "))
    ) {
      event.preventDefault();
      const menu = document.querySelector("#menu-div");
      if (getComputedStyle(menu).display === "none") {
        menu.style.display = "block";
        makeMenuAccessible("menu-div", "menu-interactive-items");
        updateMenuTriggerAriaAttributes("display-button", "Close profile menu");
      } else {
        cleanUpMenuEventListeners("menu-div", "menu-interactive-items");
        menu.style.display = "none";
        updateMenuTriggerAriaAttributes("display-button", "Open profile menu");
      }
    }
  };

  return (
    <div>
      <button
        id="display-button"
        onMouseDown={toggleMenuDisplay}
        aria-haspopup={true}
        role="button"
        aria-expanded={false}
        aria-controls="menu-div"
        aria-label="Display profile menu"
        className="menu-example-trigger-button"
        onKeyDown={toggleMenuDisplay}
      >
        Display Example Menu
      </button>
      <div
        id="menu-div"
        role="menu"
        aria-labelledby="display-button"
        style={{ display: "none", marginTop: "5px" }}
      >
        <button
          role="menuitem"
          className="menu-interactive-items"
          onClick={() => alert("Button clicked")}
        >
          One
        </button>
        <button
          role="menuitem"
          className="menu-interactive-items"
          onClick={() => alert("Button clicked")}
        >
          Two
        </button>
        <button
          role="menuitem"
          className="menu-interactive-items"
          onClick={() => alert("Button clicked")}
        >
          Three
        </button>
      </div>
    </div>
  );
};

export default MenuExample;
```

Add accessibility to block: block can be tabs, entire web page body, interactive sliders and carousels e.t.c. Basically any 'block' component that is permanently displayed and has a list of related interactive children items. The function creates a focus trap within the block and the focus can be navigated using the arrow keys. Using the entire page as a block, the page serves as a focus trap, and the page can be navigated from one interactive item to another from the top of the page to the bottom and cycles back to the top.

The makeBlockAccessible function takes two string arguments; the id of the block main div, and the class name of the children items of the div. The function should be called on page render, so the event listeners get activated. On click of a button, the clicked button gets focused and the focus can be navigated using the arrow keys.

#### Usage

```javascript
import { useEffect } from "react";
import { makeBlockAccessible } from "aria-ease";

const BlockExample = () => {
  useEffect(() => {
    const accessibleBlock = makeBlockAccessible(
      "block-div",
      "block-div-interactive-items"
    );
    return accessibleBlock;
  }, []);

  return (
    <div>
      <div id="block-div">
        <button className="block-div-interactive-items">One</button>
        <button className="block-div-interactive-items">Two</button>
        <button className="block-div-interactive-items">Three</button>
      </div>
    </div>
  );
};

export default BlockExample;
```

[Check out more features/functionality in the docs](https://ariaease.xyz/docs)

[Start contributing on GitHub](https://github.com/aria-ease/aria-ease)

Find a bug? Head on over to [issue page](https://github.com/aria-ease/aria-ease/issues) and open one. We're excited to receive pull requests.

Aria-ease is open-source software by [Isaac Victor](https://isaacvictordev.web.app/)

### P.S. Don't Forget About Focus Styling!

While Aria-Ease significantly aids in making your web applications more accessible, it's essential to remember that visual cues play a crucial role in accessibility. This is especially true for keyboard navigation, where focus styling indicates which element is currently selectable or active.

Without clear focus styling, users who rely on keyboard navigation may find it challenging to determine which part of the page they are interacting with. Therefore, we strongly encourage you to implement distinct focus styles for interactive elements on your web pages.

Here's a simple CSS example to enhance focus visibility:

```css
:focus {
  outline: 2px solid rgba(0, 91, 211, 1); /* Blue outline for high contrast */
  outline-offset: 1px;
}
```
