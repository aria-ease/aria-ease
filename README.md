# Aria-Ease

Out of the box accessibility utility package to develop production ready applications.

## Install

`npm i aria-ease`

## Features

Add accessibility to menu: menu can be dropdown, side menu, slide navigation. Basically any component that toggles display and has a list of children items. The function creates a focus trap within the menu and the focus can be navigated using the arrow keys. The escape key also closes the menu and returns the focus back to the trigger.

The makeMenuAccessible function takes two string arguments; the id of the menu, and the class name of the children item of the menu. And should only be invoked after the menu has become visible or added to the DOM.

The updateMenuTriggerAriaAttributes function take two string arguments; the id of the menu trigger, and the aria-label that will replace the current one in the DOM. Behind the scene the aria-expanded and aria-attributes are also updated based on the visibility of the menu.

#### Usage

```
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
      <div id="custom-menu" role="menu" aria-labelledby="display-button">
        <button role="menuitem" className="profile-menu-item">One</button>
        <button role="menuitem" className="profile-menu-item">Two</button>
        <button role="menuitem" className="profile-menu-item">Three</button>
      </div>
    </div>
  )
}

export default App
```

Add accessibility to tab: tab can be tabs, interactive sliders and carousels. Basically any component that is permanently displayed and has a list of interractive children items. The function creates a focus trap within the tab and the focus can be navigated using the arrow keys.

The makeTabAccessible function takes two string arguments; the id of the tab main div, and the class name of the children item of the div. The function should be called when any of the interractive children item (e.g button) of the tab is clicked. The clicked button gets focused and the focus can be navigated using the arrow keys.

#### Usage

```
import { makeTabAccessible } from "aria-ease"

const App = () => {
  const handleTabButtonClick = (): void => {
    makeTabAccessible('custom-tab', 'custom-tab-item')
  }

  return (
    <div>
      <div id="custom-tab">
        <button className="custom-tab-item" onClick={handleTabButtonClick}>One</button>
        <button className="custom-tab-item" onClick={handleTabButtonClick}>Two</button>
        <button className="custom-tab-item" onClick={handleTabButtonClick}>Three</button>
      </div>
    </div>
  )
}

export default App
```