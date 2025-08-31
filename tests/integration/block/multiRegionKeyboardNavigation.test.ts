import { describe, it, beforeEach, expect, afterEach } from 'vitest';
import { makeBlockAccessible } from '../../../src/block/src/makeBlockAccessible/makeBlockAccessible';
import { HTMLElement, NodeListOfHTMLElement } from '../../../Types';
import { handleKeyPress } from '../../../src/utils/handleKeyPress/handleKeyPress';


describe('makeBlockAccessible - multi region keyboard navigation', () => {
  let cleanup: () => void;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="body">
        <header>
          <button class="shared-class" id="header-interactive-element-1">Header 1</button>
          <a href="#" tabindex="0" class="shared-class" id="header-interactive-element-2">Header 2</a>
          <input type="text" class="shared-class" id="header-input" value="hello"></input>
        </header>
        <main>
          <button class="shared-class" id="main-interactive-element-1">Main 1</button>
          <a href="#" tabindex="0" class="shared-class" id="main-interactive-element-1">Main 2</a>
          <input type="checkbox" class="shared-class" id="main-input"></input>
        </main>
        <footer>
          <button class="shared-class" id="footer-interactive-element-1">Footer 1</button>
          <a href="#" tabindex="0" class="shared-class" id="footer-interactive-element-2">Footer 2</a>
          <input type="text" class="shared-class" id="footer-input"></input>
        </footer>
      </div>
    `;
    cleanup = makeBlockAccessible('body', 'shared-class');
  });

  it('navigates through all shared-class elements in all regions with ArrowDown', () => {
    const allInteractiveElements = Array.from(document.querySelectorAll('.shared-class')) as NodeListOfHTMLElement;
    const elementItems = document.querySelectorAll('.shared-class') as NodeListOfHTMLElement<HTMLElement>;

    // Focus the first interactive element
    allInteractiveElements[0].focus();
    // Simulate ArrowDown key presses and check focus moves in order
    for (let i = 0; i < allInteractiveElements.length; i++) {
        const current = allInteractiveElements[i];
        const next = allInteractiveElements[(i + 1) % allInteractiveElements.length];
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        
        if(current.tagName === 'INPUT' && (current as HTMLInputElement).type === 'text' && current.id === 'header-input') {
            // Case 1: Caret NOT at end, ArrowDown should NOT move focus
            current.selectionStart = 2; // Not at end
            handleKeyPress(event as KeyboardEvent, elementItems, i);
            expect(document.activeElement).toBe(current);

            // Case 2: Caret AT end, ArrowDown should move focus to next element
            current.selectionStart = current.value.length; // At end 
            handleKeyPress(event as KeyboardEvent, elementItems, i);
            const next = allInteractiveElements[(i + 1) % allInteractiveElements.length];
            expect(document.activeElement).toBe(next);
        } else {
            handleKeyPress(event as KeyboardEvent, elementItems, i);
            expect(document.activeElement).toBe(next);
        }
    }
  });

  it('navigates through all shared-class elements in all regions with ArrowRight', () => {
    const allInteractiveElements = Array.from(document.querySelectorAll('.shared-class')) as NodeListOfHTMLElement;
    const elementItems = document.querySelectorAll('.shared-class') as NodeListOfHTMLElement<HTMLElement>;

    // Focus the first interactive element
    allInteractiveElements[0].focus();
    // Simulate ArrowRight key presses and check focus moves in order
    for (let i = 0; i < allInteractiveElements.length; i++) {
        const current = allInteractiveElements[i];
        const next = allInteractiveElements[(i + 1) % allInteractiveElements.length];
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });

        if(current.tagName === 'INPUT' && (current as HTMLInputElement).type === 'text' && current.id === 'header-input') {
            // Case 1: Caret NOT at end, ArrowRight should NOT move focus
            current.selectionStart = 2; // Not at end
            handleKeyPress(event as KeyboardEvent, elementItems, i);
            expect(document.activeElement).toBe(current);

            // Case 2: Caret AT end, ArrowRight should move focus to next element
            current.selectionStart = current.value.length; // At end
            handleKeyPress(event as KeyboardEvent, elementItems, i);
            expect(document.activeElement).toBe(next);
        } else {
            handleKeyPress(event as KeyboardEvent, elementItems, i);
            expect(document.activeElement).toBe(next);
        }
    }
  });

  it('navigates through all shared-class elements in all regions with ArrowUp', () => {
    const allInteractiveElements = Array.from(document.querySelectorAll('.shared-class')) as NodeListOfHTMLElement;
    const elementItems = document.querySelectorAll('.shared-class') as NodeListOfHTMLElement<HTMLElement>;

    // Focus the last interactive element
    allInteractiveElements[allInteractiveElements.length - 1].focus();
    // Simulate ArrowUp key presses and check focus moves in reverse order
    for (let i = allInteractiveElements.length - 1; i >= 0; i--) {
        const current = allInteractiveElements[i];
        const prev = allInteractiveElements[(i - 1 + allInteractiveElements.length) % allInteractiveElements.length];
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });

        
        if(current.tagName === 'INPUT' && (current as HTMLInputElement).type === 'text' && current.id === 'header-input') {
            // Case 1: Caret NOT at end, ArrowUp should NOT move focus
            current.selectionStart = 2; // Not at end
            handleKeyPress(event as KeyboardEvent, elementItems, i);
            expect(document.activeElement).toBe(current);

            // Case 2: Caret AT start, ArrowUp should move focus to prev element
            current.selectionStart = 0; // At start
            handleKeyPress(event as KeyboardEvent, elementItems, i);
            expect(document.activeElement).toBe(prev);
        } else {
            handleKeyPress(event as KeyboardEvent, elementItems, i);
            expect(document.activeElement).toBe(prev);
        }
    }
  });

  it('navigates through all shared-class elements in all regions with ArrowLeft', () => {
    const allInteractiveElements = Array.from(document.querySelectorAll('.shared-class')) as NodeListOfHTMLElement;
    const elementItems = document.querySelectorAll('.shared-class') as NodeListOfHTMLElement<HTMLElement>;

    // Focus the last interactive element
    allInteractiveElements[allInteractiveElements.length - 1].focus();
    // Simulate ArrowLeft key presses and check focus moves in reverse order
    for (let i = allInteractiveElements.length - 1; i >= 0; i--) {
        const current = allInteractiveElements[i];
        const prev = allInteractiveElements[(i - 1 + allInteractiveElements.length) % allInteractiveElements.length];
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
        
        if(current.tagName === 'INPUT' && (current as HTMLInputElement).type === 'text' && current.id === 'header-input') {
            // Case 1: Caret NOT at end, ArrowLeft should NOT move focus
            current.selectionStart = 2; // Not at end
            handleKeyPress(event as KeyboardEvent, elementItems, i);
            expect(document.activeElement).toBe(current);

            // Case 2: Caret AT start, ArrowLeft should move focus to prev element
            current.selectionStart = 0; // At start
            handleKeyPress(event as KeyboardEvent, elementItems, i);
            expect(document.activeElement).toBe(prev);
        } else {
            handleKeyPress(event as KeyboardEvent, elementItems, i);
            expect(document.activeElement).toBe(prev);
        }
    }
  });


  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });
});