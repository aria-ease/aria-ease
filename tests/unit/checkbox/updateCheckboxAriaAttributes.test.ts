import { describe, it, expect, afterEach } from 'vitest';
import { updateCheckboxAriaAttributes } from '../../../src/checkbox/src/updateCheckboxAriaAttributes/updateCheckboxAriaAttributes';
import { CheckboxStates } from '../../../Types';

function createCheckboxDOM({ id, checkboxClass, count }: { id: string; checkboxClass: string; count: number }) {
  const container = document.createElement('div');
  container.id = id;
  for (let i = 0; i < count; i++) {
    const cb = document.createElement('button');
    cb.className = checkboxClass;
    cb.setAttribute('aria-checked', 'false');
    container.appendChild(cb);
  }
  document.body.appendChild(container);
  return container;
}

describe('updateCheckboxAriaAttributes', () => {
  const CHECKBOX_ID = 'test-checkbox';
  const CHECKBOX_CLASS = 'checkbox-btn';
  let container: HTMLElement;

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('updates only the checked checkbox to correct aria-checked', () => {
    container = createCheckboxDOM({ id: CHECKBOX_ID, checkboxClass: CHECKBOX_CLASS, count: 3 });
    const states: CheckboxStates[] = [
      { checked: false },
      { checked: true },
      { checked: false },
    ];
    updateCheckboxAriaAttributes(CHECKBOX_ID, CHECKBOX_CLASS, states, 1);
    const checkboxes = container.querySelectorAll('button');
    expect(checkboxes[0].getAttribute('aria-checked')).toBe('false');
    expect(checkboxes[1].getAttribute('aria-checked')).toBe('true');
    expect(checkboxes[2].getAttribute('aria-checked')).toBe('false');
  });

  it('handles missing checkbox container gracefully', () => {
    const states: CheckboxStates[] = [ { checked: false } ];
    // Should not throw, just log error
    expect(() => updateCheckboxAriaAttributes('missing-id', CHECKBOX_CLASS, states, 0)).not.toThrow();
  });

  it('handles missing checkboxes gracefully', () => {
    container = createCheckboxDOM({ id: CHECKBOX_ID, checkboxClass: 'wrong-class', count: 2 });
    const states: CheckboxStates[] = [
      { checked: false },
      { checked: false },
    ];
    // Should not throw, just log error
    expect(() => updateCheckboxAriaAttributes(CHECKBOX_ID, CHECKBOX_CLASS, states, 0)).not.toThrow();
  });

  it('does not update aria-checked if already correct', () => {
    container = createCheckboxDOM({ id: CHECKBOX_ID, checkboxClass: CHECKBOX_CLASS, count: 1 });
    const btn = container.querySelector('button')!;
    btn.setAttribute('aria-checked', 'true');
    const states: CheckboxStates[] = [ { checked: true } ];
    updateCheckboxAriaAttributes(CHECKBOX_ID, CHECKBOX_CLASS, states, 0);
    expect(btn.getAttribute('aria-checked')).toBe('true');
  });
});