# Aria-Ease

Out of the box accessibility utility package to develop production ready applications.

## Install

`npm i aria-ease`

## Usage

```
import { makeMenuAccessible } from "aria-ease"

const App = () => {
  const toggleMenuDisplay = () => {
    const menu: HTMLElement = document.querySelector('#custom-menu') as HTMLElement
    if(getComputedStyle(menu).display === 'none') {
      menu.style.display = 'block'
      makeMenuAccessible('custom-menu', 'profile-menu-item');
    } else {
      menu.style.display = 'none'
    }
  }

  return (
    <div>
      <button onClick={toggleMenuDisplay}>Display</button>
      <div id="custom-menu" role="menu">
        <button role="menuitem" className="profile-menu-item">One</button>
        <button role="menuitem" className="profile-menu-item">Two</button>
        <button role="menuitem" className="profile-menu-item">Three</button>
      </div>
    </div>
  )
}

export default App
```
