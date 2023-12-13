# Aria-Ease

Out of the box accessibility utility package to develop production ready packages.

## Install

`npm i aria-ease`

## Features

Add accessibility to menu: menu can be a dropdown, side menu, slide navigation e.t.c. Basically any component that toggles display and has a list of interactive children items. The function creates a focus trap within the menu and focus can be navigated using the arrow keys. The escape key also closes the menu and returns the focus back to the trigger.

The `makeMenuAccessible` function takes two string arguments; the id of the menu, and the class name of the children item of the menu. And should only be invoked after the menu has become visible or added to the DOM. When the menu is visible the first item of the menu is in focus and focus can be navigated using the arrow keys

The `updateMenuTriggerAriaAttributes` function take two string arguments; the id of the menu trigger, and the aria-label that will replace the current one in the DOM. Behind the scene the aria-expanded and aria-attributes are also updated based on the visibility of the menu.

### Usage

```tsx
import { makeMenuAccessible, updateMenuTriggerAriaAttributes } from "aria-ease"

const App = () => {
  const toggleMenuDisplay = (): void => {
    const menu: HTMLElement = document.querySelector('#custom-menu') as HTMLElement
    if(getComputedStyle(menu).display === 'none') {
      menu.style.display = 'block'
      makeMenuAccessible('custom-menu', 'profile-menu-item');
      updateMenuTriggerAriaAttributes('display-button', 'Hide profile menu')
    } else {
      menu.style.display = 'none'
      updateMenuTriggerAriaAttributes('display-button', 'Display profile menu')
    }
  }

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
      >
        Display
      </button>
      <div id="custom-menu" role="menu" aria-labelledby="display-button" style={{display: 'none', marginTop: '5px'}}>
        <button role="menuitem" className="profile-menu-item">One</button>
        <button role="menuitem" className="profile-menu-item">Two</button>
        <button role="menuitem" className="profile-menu-item">Three</button>
      </div>
    </div>
  )
}

export default App
```

Add accessibility to tab: tab can be tabs, interactive sliders and carousels e.t.c. Basically any component that is permanently displayed and has a list of related interractive children items. The function creates a focus trap within the tab and the focus can be navigated using the arrow keys.

The makeTabAccessible function takes two string arguments; the id of the tab main div, and the class name of the children item of the div. The function should be called on page render, so the event listeners get activated. On click of a button, the clicked button gets focused and the focus can be navigated using the arrow keys.

### Usage

```tsx
import { useEffect } from 'react'
import { makeTabAccessible } from "aria-ease"

const App = () => {
  useEffect(() => {
    makeTabAccessible('custom-tab', 'custom-tab-item')
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
