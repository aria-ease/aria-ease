# Aria-Ease

Out of the box accessibility utility package to develop production ready applications.

## Install

`npm i aria-ease`

## Usage

```
import { makeMenuAccessible, makeTabAccessible } from "aria-ease"

const App = () => {
  const toggleMenuDisplay = (): void => {
    const menu: HTMLElement = document.querySelector('#custom-menu') as HTMLElement
    if(getComputedStyle(menu).display === 'none') {
      menu.style.display = 'block'
      makeMenuAccessible('custom-menu', 'profile-menu-item');
    } else {
      menu.style.display = 'none'
    }
  }

  const handleTabButtonClick = (): void => {
    makeTabAccessible('custom-tab', 'custom-tab-item')
  }

  return (
    <div>
      <>
        <button id="display-button" onClick={toggleMenuDisplay}>Display</button>
        <div id="custom-menu" role="menu" aria-labelledby="display-button">
          <button role="menuitem" className="profile-menu-item">One</button>
          <button role="menuitem" className="profile-menu-item">Two</button>
          <button role="menuitem" className="profile-menu-item">Three</button>
        </div>
      </>

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
