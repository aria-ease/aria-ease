# Aria-Ease

Out of the box accessibility utility package to develop production ready applications.

## Install

`npm i aria-ease`

`yarn add aria-ease`

## Features

The package currently has support for 5 components: accordions, blocks, checkboxes, menus, radio buttons

Add accessibility to menu: menu can be a dropdown, side menu, slide navigation e.t.c. Basically any component that toggles display and has a list of interactive children items. The function creates a focus trap within the menu and focus can be navigated using the arrow keys. The escape key also closes the menu and returns the focus back to the trigger.

The makeMenuAccessible function takes two string arguments; the id of the menu, the class name of the children items of the menu. And should only be invoked after the menu has become visible or added to the DOM. When the menu is visible the first item of the menu is in focus and focus can be navigated using the Arrow keys. The Space and Enter keys clicks the menu item if they are buttons or links element. The Escape key closes the menu, and returns the focus back to the button that toggles the menu. The Tab key exits the trap.

The updateMenuTriggerAriaAttributes function take two string arguments; the id of the menu trigger, and the aria-label that will replace the current one in the DOM. Behind the scene the aria-expanded and aria-attributes are also updated based on the visibility of the menu.

#### Usage

```
import { makeMenuAccessible, updateMenuTriggerAriaAttributes, cleanUpMenuEventListeners } from 'aria-ease'

const MenuExample = () => {
  const toggleMenuDisplay = (event) => {
    if (event.type === 'mousedown' || (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' '))) {
      event.preventDefault();
      const menu = document.querySelector('#menu-div');
      if (getComputedStyle(menu).display === 'none') {
        menu.style.display = 'block';
        makeMenuAccessible('menu-div', 'menu-interactive-items');
        updateMenuTriggerAriaAttributes('display-button', 'Close profile menu');
      } else {
        cleanUpMenuEventListeners('menu-div', 'menu-interactive-items');
        menu.style.display = 'none';
        updateMenuTriggerAriaAttributes('display-button', 'Open profile menu');
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
        className='menu-example-trigger-button'
        onKeyDown={toggleMenuDisplay}
      >
        Display Example Menu
      </button>
      <div id="menu-div" role="menu" aria-labelledby="display-button" style={{display: 'none', marginTop: '5px'}}>
        <button role="menuitem" className="menu-interactive-items" onClick={() => alert('Button clicked')}>One</button>
        <button role="menuitem" className="menu-interactive-items" onClick={() => alert('Button clicked')}>Two</button>
        <button role="menuitem" className="menu-interactive-items" onClick={() => alert('Button clicked')}>Three</button>
      </div>
    </div>
  )
}

export default MenuExample
```

Add accessibility to block: block can be entire web page body, tabs, interactive sliders and carousels e.t.c. Basically any component that is permanently displayed and has a list of related interractive children items. The function creates a focus trap within the block and the focus can be navigated using the arrow keys.

The makeBlockAccessible function takes two string arguments; the id of the block main div, and the class name of the children items of the div. The function should be called on page render, so the event listeners get activated. On click of a button, the clicked button gets focused and the focus can be navigated using the arrow keys.

#### Usage

```
import { useEffect } from 'react'
import { makeBlockAccessible } from "aria-ease"

const BlockExample = () => {
  useEffect(() => {
    const accessibleBlock = makeBlockAccessible('block-div', 'block-div-interactive-items');
    return accessibleBlock;
  },[])

  return (
    <div>
      <div id="block-div">
        <button className="block-div-interactive-items">One</button>
        <button className="block-div-interactive-items">Two</button>
        <button className="block-div-interactive-items">Three</button>
      </div>
    </div>
  )
}

export default BlockExample
```

[Check out more features/functionality in the docs](https://aria-ease.vercel.app/docs)

[Start contributing on GitHub](https://github.com/aria-ease/aria-ease)

Find a bug? Head on over to [issue page](https://github.com/aria-ease/aria-ease/issues) and open one. We're excited to receive pull requests.

Aria-ease is open-source software by [Isaac Victor](https://isaacvictordev.web.app/)

### P.S.

Make sure to add elements focus styling in css otherwise visibility might be impacted.
