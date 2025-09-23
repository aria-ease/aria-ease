import { handleKeyPress } from './chunk-RT5IROW4.js';
// src/menu/src/makeMenuAccessible/makeMenuAccessible.ts
function makeMenuAccessible(param) {
    var menuId = param.menuId, menuElementsClass = param.menuElementsClass, triggerId = param.triggerId;
    var menuDiv = document.querySelector("#".concat(menuId));
    if (!menuDiv) throw new Error("Invalid menu div id provided");
    var triggerButton = document.querySelector("#".concat(triggerId));
    if (!triggerButton) throw new Error("Invalid trigger button id provided");
    var handlerMap = /* @__PURE__ */ new Map();
    function setAria(isOpen) {
        triggerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    function addListeners() {
        var menuItems = menuDiv.querySelectorAll(".".concat(menuElementsClass));
        menuItems.forEach(function(menuItem, index) {
            if (!handlerMap.has(menuItem)) {
                var handler = function(event) {
                    return handleKeyPress(event, menuItems, index, menuDiv, triggerButton);
                };
                menuItem.addEventListener("keydown", handler);
                handlerMap.set(menuItem, handler);
            }
        });
    }
    function removeListeners() {
        var menuItems = menuDiv.querySelectorAll(".".concat(menuElementsClass));
        menuItems.forEach(function(menuItem) {
            var handler = handlerMap.get(menuItem);
            if (handler) {
                menuItem.removeEventListener("keydown", handler);
                handlerMap.delete(menuItem);
            }
        });
    }
    function openMenu() {
        menuDiv.style.display = "block";
        setAria(true);
        addListeners();
        var menuItems = menuDiv.querySelectorAll(".".concat(menuElementsClass));
        if (menuItems.length > 0) menuItems[0].focus();
    }
    function closeMenu() {
        removeListeners();
        menuDiv.style.display = "none";
        setAria(false);
        triggerButton.focus();
    }
    function cleanup() {
        removeListeners();
    }
    return {
        openMenu: openMenu,
        closeMenu: closeMenu,
        cleanup: cleanup
    };
}
export { makeMenuAccessible }; //# sourceMappingURL=chunk-4WO5XJ5K.js.map
//# sourceMappingURL=chunk-4WO5XJ5K.js.map