import { describe, it, beforeEach, expect, vi } from 'vitest';
import { handleKeyPress, isLink, isNativeButton } from '../../../src/utils/handleKeyPress/handleKeyPress';

describe('handleKeyPress - buttons and anchor key interaction and navigation', () => {
  let items: HTMLElement[];
  let nodeList: NodeListOf<HTMLElement>;
  let focusMock: ReturnType<typeof vi.fn>;
  let clickMock: ReturnType<typeof vi.fn>;
  let event: Partial<KeyboardEvent>;

  beforeEach(() => {
    // Create 3 mock elements
    items = Array.from({ length: 3 }, (_, i) => {
      const el = document.createElement('a');
      el.textContent = `A ${i}`;
      return el;
    });
    // Patch focus and click
    focusMock = vi.fn();
    clickMock = vi.fn();
    items.forEach((el) => {
      el.focus = focusMock;
      el.click = clickMock;
    });
    // Patch NodeListOf
    nodeList = {
      length: items.length,
      item: (i: number) => items[i],
      [Symbol.iterator]: function* () { yield* items; }
    } as unknown as NodeListOf<HTMLElement>;
  });

  it('moves focus to previous item on ArrowUp', () => {
    event = { key: 'ArrowUp', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).toHaveBeenCalled();
  });

  it('moves focus to previous item on ArrowLeft', () => {
    event = { key: 'ArrowLeft', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 2);
    expect(focusMock).toHaveBeenCalled();
  });

  it('moves focus to next item on ArrowDown', () => {
    event = { key: 'ArrowDown', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 0);
    expect(focusMock).toHaveBeenCalled();
  });

  it('moves focus to next item on ArrowRight', () => {
    event = { key: 'ArrowRight', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).toHaveBeenCalled();
  });

  it('activates button/link on Enter', () => {
    event = { key: 'Enter', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 0);
    if(isLink(nodeList.item(0)) || isNativeButton(nodeList.item(0))) {
      expect(clickMock).not.toHaveBeenCalled();
    } else {
      expect(clickMock).toHaveBeenCalled();
    }
  });

  it('activates button/link on Space', () => {
    event = { key: ' ', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 2);
    if(isLink(nodeList.item(0)) || isNativeButton(nodeList.item(0))) {
      expect(clickMock).not.toHaveBeenCalled();
    } else {
      expect(clickMock).toHaveBeenCalled();
    }
  });

  it('does nothing for unhandled keys', () => {
    event = { key: 'Tab', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).not.toHaveBeenCalled();
    expect(clickMock).not.toHaveBeenCalled();
  });
});