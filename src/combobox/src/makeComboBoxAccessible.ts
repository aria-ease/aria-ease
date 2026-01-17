/**
 * Makes a Combobox accessible by adding appropriate ARIA attributes, keyboard interactions and focus management.
 * @param {string} comboboxInputId - The id of the combobox input element.
 * @param {string} comboboxButtonId - The id of the button that toggles the listbox (optional).
 * @param {string} listBoxId - The id of the listbox element.
 * @param {string} listBoxItemsClass - The class of the items within the listbox.
 * @param {ComboboxConfig} config - Configuration options for callbacks.
 */

import { AccessibilityInstance, ComboboxConfig } from "Types";

export function makeComboboxAccessible({ comboboxInputId, comboboxButtonId, listBoxId, listBoxItemsClass, config }: ComboboxConfig): AccessibilityInstance {
    const comboboxInput = document.getElementById(`${comboboxInputId}`) as HTMLInputElement;
    if(!comboboxInput) {
        console.error(`[aria-ease] Element with id="${comboboxInputId}" not found. Make sure the combobox input element exists before calling makeComboboxAccessible.`);
        return { cleanup: () => {} };
    }

    const listBox = document.getElementById(`${listBoxId}`) as HTMLElement;
    if(!listBox) {
        console.error(`[aria-ease] Element with id="${listBoxId}" not found. Make sure the combobox listbox element exists before calling makeComboboxAccessible.`);
        return { cleanup: () => {} };
    }

    const listButton = comboboxButtonId ? document.getElementById(`${comboboxButtonId}`) as HTMLElement : null;

    let activeIndex = -1;

    comboboxInput.setAttribute("role", "combobox");
    comboboxInput.setAttribute("aria-autocomplete", "list");
    comboboxInput.setAttribute("aria-controls", listBoxId);
    comboboxInput.setAttribute("aria-expanded", "false");
    comboboxInput.setAttribute("aria-haspopup", "listbox");
    
    listBox.setAttribute("role", "listbox");
    
    let cachedItems: NodeListOf<HTMLElement> | null = null;

    function getVisibleItems(): HTMLElement[] {
        if(!cachedItems) {
            cachedItems = listBox.querySelectorAll(`.${listBoxItemsClass}`) as NodeListOf<HTMLElement>;
        }
        return Array.from(cachedItems).filter(item => !item.hidden && item.style.display !== "none");
    }

    function isListboxOpen(): boolean {
        return comboboxInput.getAttribute("aria-expanded") === "true";
    }

    function setActiveDescendant(index: number) {
        const visibleItems = getVisibleItems();
        
        visibleItems.forEach(item => {
            item.setAttribute("aria-selected", "false");
        });

        if (index >= 0 && index < visibleItems.length) {
            const activeItem = visibleItems[index];
            const itemId = activeItem.id || `${listBoxId}-option-${index}`;
            
            if (!activeItem.id) {
                activeItem.id = itemId;
            }
            
            activeItem.setAttribute("aria-selected", "true");
            comboboxInput.setAttribute("aria-activedescendant", itemId);
            
            activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
            
            if (config?.onActiveDescendantChange) {
                try {
                    config.onActiveDescendantChange(itemId, activeItem);
                } catch (error) {
                    console.error("[aria-ease] Error in onActiveDescendantChange callback:", error);
                }
            }
        } else {
            comboboxInput.setAttribute("aria-activedescendant", "");
        }
        
        activeIndex = index;
    }

    function openListbox() {
        comboboxInput.setAttribute("aria-expanded", "true");
        if (config?.onOpenChange) {
            try {
                config.onOpenChange(true);
            } catch (error) {
                console.error("[aria-ease] Error in onOpenChange callback:", error);
            }
        }
    }

    function closeListbox() {
        comboboxInput.setAttribute("aria-expanded", "false");
        comboboxInput.setAttribute("aria-activedescendant", "");
        activeIndex = -1;
        
        const visibleItems = getVisibleItems();
        visibleItems.forEach(item => item.setAttribute("aria-selected", "false"));
        
        if (config?.onOpenChange) {
            try {
                config.onOpenChange(false);
            } catch (error) {
                console.error("[aria-ease] Error in onOpenChange callback:", error);
            }
        }
    }

    function selectOption(item: HTMLElement) {
        const value = item.textContent?.trim() || "";
        comboboxInput.value = value;
        closeListbox();
        
        if (config?.onSelect) {
            try {
                config.onSelect(item, value);
            } catch (error) {
                console.error("[aria-ease] Error in onSelect callback:", error);
            }
        }
    }

    function handleInputKeyDown(event: KeyboardEvent) {
        const visibleItems = getVisibleItems();
        const isOpen = isListboxOpen();

        switch(event.key) {
            case "ArrowDown":
                event.preventDefault();
                if (!isOpen) {
                    openListbox();
                    return;
                }

                if (visibleItems.length === 0) return;
                
                {
                    const newIndex = activeIndex >= visibleItems.length - 1 ? 0 : activeIndex + 1;
                    setActiveDescendant(newIndex);
                }
                
                break;

            case "ArrowUp":
                event.preventDefault();
                if (!isOpen) return;
                
                if (visibleItems.length > 0) {
                    const newIndex = activeIndex <= 0 ? visibleItems.length - 1 : activeIndex - 1;
                    setActiveDescendant(newIndex);
                }
                break;

            case "Enter":
                if (isOpen && activeIndex >= 0 && activeIndex < visibleItems.length) {
                    event.preventDefault();
                    selectOption(visibleItems[activeIndex]);
                }
                break;

            case "Escape":
                if (isOpen) {
                    event.preventDefault();
                    closeListbox();
                } else if (comboboxInput.value) {
                    event.preventDefault();
                    comboboxInput.value = "";
                    if (config?.onClear) {
                        try {
                            config.onClear();
                        } catch (error) {
                            console.error("[aria-ease] Error in onClear callback:", error);
                        }
                    }
                }
                break;

            case "Home":
                if (isOpen && visibleItems.length > 0) {
                    event.preventDefault();
                    setActiveDescendant(0);
                }
                break;

            case "End":
                if (isOpen && visibleItems.length > 0) {
                    event.preventDefault();
                    setActiveDescendant(visibleItems.length - 1);
                }
                break;

            case "Tab":
                if (isOpen) {
                    closeListbox();
                }
                break;
        }
    }

    function handleMouseMove(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains(listBoxItemsClass)) {
            const visibleItems = getVisibleItems();
            const index = visibleItems.indexOf(target);
            if (index >= 0) {
                setActiveDescendant(index);
            }
        }
    }

    function handleMouseDown(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains(listBoxItemsClass)) {
            event.preventDefault(); // Prevent input blur
            selectOption(target);
        }
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!comboboxInput.contains(target) && !listBox.contains(target) && (!listButton || !listButton.contains(target))) {
            closeListbox();
        }
    }

    function handleListButtonClick() {
        if (isListboxOpen()) {
            closeListbox();
        } else {
            openListbox();
            comboboxInput.focus();
        }
    }

    function handleListButtonKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleListButtonClick();
        }
    }

    comboboxInput.addEventListener("keydown", handleInputKeyDown);
    listBox.addEventListener("mousemove", handleMouseMove);
    listBox.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousedown", handleClickOutside);

    if (listButton) {
        listButton.setAttribute("tabindex", "-1");
        listButton.setAttribute("aria-label", "Toggle options");
        listButton.addEventListener("click", handleListButtonClick);
        listButton.addEventListener("keydown", handleListButtonKeyDown);
    }

    function initializeOptions() {
        const items = listBox.querySelectorAll(`.${listBoxItemsClass}`) as NodeListOf<HTMLElement>;
        if (items.length === 0) return; // Early return if no items
        
        items.forEach((item, index) => {
            item.setAttribute("role", "option");
            item.setAttribute("aria-selected", "false");
            const currentId = item.getAttribute("id");
            if (!currentId || currentId === "") {
                const itemId = `${listBoxId}-option-${index}`;
                item.id = itemId; // Set property
                item.setAttribute("id", itemId); // Also set attribute
            }
        });
    }

    initializeOptions();

    function cleanup() {
        comboboxInput.removeEventListener("keydown", handleInputKeyDown);
        listBox.removeEventListener("mousemove", handleMouseMove);
        listBox.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mousedown", handleClickOutside);
        
        if (listButton) {
            listButton.removeEventListener("click", handleListButtonClick);
            listButton.removeEventListener("keydown", handleListButtonKeyDown);
        }
    }

    function refresh() {
        cachedItems = null;
        initializeOptions();
        activeIndex = -1;
        setActiveDescendant(-1);
    }

    return { cleanup, refresh }
}