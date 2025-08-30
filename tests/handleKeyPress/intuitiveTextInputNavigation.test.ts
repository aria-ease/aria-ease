import { describe, it, beforeEach, expect, vi } from 'vitest';
import { handleKeyPress } from '../../src/utils/handleKeyPress/handleKeyPress';

describe('handleKeyPress - text input key interaction and navigation', () => {
  let items: HTMLElement[];
  let nodeList: NodeListOf<HTMLElement>;
  let focusMock: ReturnType<typeof vi.fn>;
  let input: HTMLInputElement;
  let event: Partial<KeyboardEvent>;

  beforeEach(() => {
    // Create a button, input, and another button
    items = [
      document.createElement('button'),
      document.createElement('input'),
      document.createElement('button')
    ];
    items[0].textContent = 'Prev';
    input = items[1] as HTMLInputElement;
    input.type = 'text';
    items[2].textContent = 'Next';

    focusMock = vi.fn();
    items[0].focus = focusMock;
    items[1].focus = focusMock;
    items[2].focus = focusMock;

    nodeList = {
      length: items.length,
      item: (i: number) => items[i],
      [Symbol.iterator]: function* () { yield* items; }
    } as unknown as NodeListOf<HTMLElement>;
  });

  it('ArrowLeft moves cursor left if not at start', () => {
    input.value = 'hello';
    input.selectionStart = 2;
    event = { key: 'ArrowLeft', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).not.toHaveBeenCalled();
  });

  it('ArrowLeft moves focus to previous if at start', () => {
    input.value = 'hello';
    input.selectionStart = 0;
    event = { key: 'ArrowLeft', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).toHaveBeenCalled();
  });

  it('ArrowUp moves cursor left if not at start', () => {
    input.value = 'hello';
    input.selectionStart = 2;
    event = { key: 'ArrowUp', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).not.toHaveBeenCalled();
  });

  it('ArrowUp moves focus to previous if at start', () => {
    input.value = 'hello';
    input.selectionStart = 0;
    event = { key: 'ArrowUp', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).toHaveBeenCalled();
  });

  it('ArrowRight moves cursor right if not at end', () => {
    input.value = 'hello';
    input.selectionStart = 2;
    event = { key: 'ArrowRight', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).not.toHaveBeenCalled();
  });

  it('ArrowRight moves focus to next if at end', () => {
    input.value = 'hello';
    input.selectionStart = 5;
    event = { key: 'ArrowRight', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).toHaveBeenCalled();
  });

  it('ArrowDown moves cursor right if not at end', () => {
    input.value = 'hello';
    input.selectionStart = 2;
    event = { key: 'ArrowDown', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).not.toHaveBeenCalled();
  });

  it('ArrowDown moves focus to next if at end', () => {
    input.value = 'hello';
    input.selectionStart = 5;
    event = { key: 'ArrowDown', preventDefault: vi.fn() };
    handleKeyPress(event as KeyboardEvent, nodeList, 1);
    expect(focusMock).toHaveBeenCalled();
  });
});