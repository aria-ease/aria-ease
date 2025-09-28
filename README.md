# Aria-Ease

Out of the box accessibility utility package to develop production ready applications.

## Install

`npm i aria-ease`

`yarn add aria-ease`

## Features

Don't spend hours wrestling with accessibility code. Aria-Ease provides pre-built functions that help you integrate accessibility seamlessly into your development workflow. It simplifies the process of adding essential accessibility features (e.g. assistive capability, keyboard navigation, focus management) to common UI components like menus, accordions, checkboxes, e.t.c. This allows you to focus on building great user experiences for everyone.

The package currently has support for 6 components: accordions, blocks, checkboxes, menus, radios, toggle butttons.

Add accessibility to menu: menu can be a dropdown, combo box, slide navigation menu, e.t.c. Basically any component that toggles display and has a list of interactive children items. The function creates a focus trap within the menu and focus can be navigated using the arrow keys. The escape key also closes the menu and returns the focus back to the trigger.

#### Usage

```javascript
import * as Menu from "aria-ease/menu";

useEffect(() => {
  menuRef.current = Menu.makeMenuAccessible({
    menuId: "menu-div",
    menuElementsClass: "profile-menu-items",
    triggerId: "display-button",
  });
}, []);

const toggleMenuDisplay = () => {
  const menuDiv = document.querySelector("#menu-div");
  if (getComputedStyle(menuDiv).display === "none") {
    menuRef.current.openMenu();
  } else {
    menuRef.current.closeMenu();
  }
};
```

[Check out more features/functionality in the docs](https://ariaease.web.app/docs)

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
