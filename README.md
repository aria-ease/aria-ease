# Aria-Ease

Out of the box accessibility utility package to develop production ready applications.

## Install

`npm i aria-ease`

## Features

Add accessibility to menu: menu can be a dropdown, side menu, slide navigation e.t.c. Basically any component that toggles display and has a list of interactive children items. The function creates a focus trap within the menu and focus can be navigated using the arrow keys. The escape key also closes the menu and returns the focus back to the trigger.

The makeMenuAccessible function takes two string arguments; the id of the menu, and the class name of the children item of the menu. And should only be invoked after the menu has become visible or added to the DOM. When the menu is visible the first item of the menu is in focus and focus can be navigated using the arrow keys

The updateMenuTriggerAriaAttributes function take two string arguments; the id of the menu trigger, and the aria-label that will replace the current one in the DOM. Behind the scene the aria-expanded and aria-attributes are also updated based on the visibility of the menu.

#### Usage

```
import { makeMenuAccessible, updateMenuTriggerAriaAttributes, cleanUpMenuEventListeners } from 'aria-ease'

const HomeExampleMenu = () => {
  const toggleMenuDisplay = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const menu = document.querySelector('#custom-menu');
      if (getComputedStyle(menu).display === 'none') {
        menu.style.display = 'block';
        makeMenuAccessible('custom-menu', 'profile-menu-item');
        updateMenuTriggerAriaAttributes('display-button', 'Hide profile menu');
      } else {
        cleanUpMenuEventListeners('custom-menu', 'profile-menu-item');
        menu.style.display = 'none';
        updateMenuTriggerAriaAttributes('display-button', 'Display profile menu');
      }
    }
  };
  return (
    <div>
      <button
        id="display-button"
        onClick={toggleMenuDisplay}
        aria-haspopup={true}
        aria-pressed={false}
        aria-expanded={false}
        aria-controls="custom-menu"
        aria-label="Display profile menu"
        className='home-menu-example-trigger-button block-interactive'
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

export default HomeExampleMenu
```

Add accessibility to block: block can be entire web page body, tabs, interactive sliders and carousels e.t.c. Basically any component that is permanently displayed and has a list of related interractive children items. The function creates a focus trap within the block and the focus can be navigated using the arrow keys.

The makeBlockAccessible function takes two string arguments; the id of the block main div, and the class name of the children item of the div. The function should be called on page render, so the event listeners get activated. On click of a button, the clicked button gets focused and the focus can be navigated using the arrow keys.

#### Usage

```
import { useEffect } from 'react'
import { makeBlockAccessible } from "aria-ease"

const App = () => {
  useEffect(() => {
    const cleanUp = makeBlockAccessible('custom-tab', 'custom-tab-item')

    return cleanUp
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

export default App
```

### P.S.

Make sure to add element focus styling in css otherwise visibility might be impacted.
