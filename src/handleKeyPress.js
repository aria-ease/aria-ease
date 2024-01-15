export function handleKeyPress(event, elementItems, elementItemIndex, elementDiv, triggerButton) {
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
            event.preventDefault();
            if (elementItemIndex === 0) {
                elementItems.item(elementItems.length - 1).focus();
            }
            else {
                elementItems.item(elementItemIndex - 1).focus();
            }
            break;
        case 'ArrowDown':
        case 'ArrowRight':
            event.preventDefault();
            if (elementItemIndex === elementItems.length - 1) {
                elementItems.item(0).focus();
            }
            else {
                elementItems.item(elementItemIndex + 1).focus();
            }
            break;
        case 'Escape':
            event.preventDefault();
            if (elementDiv && triggerButton) {
                (getComputedStyle(elementDiv).display === 'block') ?
                    elementDiv.style.display = 'none' :
                    null;
                triggerButton.focus();
            }
            break;
        case 'Enter':
        case ' ':
            event.preventDefault();
            if (elementItems.item(elementItemIndex).tagName === 'BUTTON') {
                elementItems.item(elementItemIndex).click();
                break;
            }
            else if (elementItems.item(elementItemIndex).tagName === 'A') {
                window.location.href = elementItems.item(elementItemIndex).href;
                break;
            }
            else if (elementItems.item(elementItemIndex).type === 'radio') {
                elementItems.item(elementItemIndex).checked = true;
                break;
            }
            else if (elementItems.item(elementItemIndex).type === 'checkbox') {
                elementItems.item(elementItemIndex).checked = !elementItems.item(elementItemIndex).checked;
                break;
            }
            break;
        default:
            break;
    }
}
