# Aria-Ease

Out of the box accessibility utility package to develop production ready applications.

## Install

`npm i aria-ease`

`yarn add aria-ease`

## Features

The package currently has support for 5 components: accordions, blocks, checkboxes, menus, radio buttons

Add accessibility to menu: menu can be a dropdown, side menu, slide navigation e.t.c. Basically any component that toggles display and has a list of interactive children items. The function creates a focus trap within the menu and focus can be navigated using the arrow keys. The escape key also closes the menu and returns the focus back to the trigger.

The makeMenuAccessible function takes two string arguments; the id of the menu, the class name of the children item of the menu. And should only be invoked after the menu has become visible or added to the DOM. When the menu is visible the first item of the menu is in focus and focus can be navigated using the arrow keys

The updateMenuTriggerAriaAttributes function take two string arguments; the id of the menu trigger, and the aria-label that will replace the current one in the DOM. Behind the scene the aria-expanded and aria-attributes are also updated based on the visibility of the menu.

#### Usage

```
import { makeMenuAccessible, updateMenuTriggerAriaAttributes, cleanUpMenuEventListeners } from 'aria-ease'

const MenuExample = () => {
  const toggleMenuDisplay = (event) => {
    if (event.type === 'mousedown' || (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' '))) {
      event.preventDefault();
      const menu = document.querySelector('#custom-menu');
      if (getComputedStyle(menu).display === 'none') {
        menu.style.display = 'block';
        makeMenuAccessible('custom-menu', 'profile-menu-item');
        updateMenuTriggerAriaAttributes('display-button', 'Close profile menu');
      } else {
        cleanUpMenuEventListeners('custom-menu', 'profile-menu-item');
        menu.style.display = 'none';
        updateMenuTriggerAriaAttributes('display-button', 'Close profile menu');
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
        aria-controls="custom-menu"
        aria-label="Display profile menu"
        className='menu-example-trigger-button block-interactive'
        onKeyDown={toggleMenuDisplay}
      >
        Display Example Menu
      </button>
      <div id="custom-menu" role="menu" aria-labelledby="display-button" style={{display: 'none', marginTop: '5px'}}>
        <button role="menuitem" className="profile-menu-item" onClick={() => alert('Button clicked')}>One</button>
        <button role="menuitem" className="profile-menu-item" onClick={() => alert('Button clicked')}>Two</button>
        <button role="menuitem" className="profile-menu-item" onClick={() => alert('Button clicked')}>Three</button>
      </div>
    </div>
  )
}

export default MenuExample
```

Add accessibility to block: block can be entire web page body, tabs, interactive sliders and carousels e.t.c. Basically any component that is permanently displayed and has a list of related interractive children items. The function creates a focus trap within the block and the focus can be navigated using the arrow keys.

The makeBlockAccessible function takes two string arguments; the id of the block main div, and the class name of the children item of the div. The function should be called on page render, so the event listeners get activated. On click of a button, the clicked button gets focused and the focus can be navigated using the arrow keys.

#### Usage

```
import { useEffect } from 'react'
import { makeBlockAccessible } from "aria-ease"

const BlockExample = () => {
  useEffect(() => {
    const accessibleBlock = makeBlockAccessible('custom-tab', 'custom-tab-item');
    return accessibleBlock;
  },[])

  return (
    <div>
      <div id="custom-tab">
        <button className="custom-tab-item">One</button>
        <button className="custom-tab-item">Two</button>
        <button className="custom-tab-item">Three</button>
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
