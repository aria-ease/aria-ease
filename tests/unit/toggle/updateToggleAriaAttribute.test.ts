import { describe, it, expect, afterEach } from 'vitest';
import { updateToggleAriaAttribute } from '../../../src/toggle/src/updateToggleAriaAttribute/updateToggleAriaAttribute';
import { ToggleStates } from '../../../Types';

function createToggleDOM({ id, toggleClass, count }: { id: string; toggleClass: string; count: number }) {
  const container = document.createElement('div');
  container.id = id;
  for (let i = 0; i < count; i++) {
    const btn = document.createElement('button');
    btn.className = toggleClass;
    btn.setAttribute('aria-pressed', 'false');
    container.appendChild(btn);
  }
  document.body.appendChild(container);
  return container;
}

describe('updateToggleAriaAttribute', () => {
  const TOGGLE_ID = 'test-toggle';
  const TOGGLE_CLASS = 'toggle-btn';
  let container: HTMLElement;

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('updates only the pressed toggle to correct aria-pressed', () => {
    container = createToggleDOM({ id: TOGGLE_ID, toggleClass: TOGGLE_CLASS, count: 3 });
    const states: ToggleStates[] = [
      { pressed: false },
      { pressed: true },
      { pressed: false },
    ];
    updateToggleAriaAttribute(TOGGLE_ID, TOGGLE_CLASS, states, 1);
    const toggles = container.querySelectorAll('button');
    expect(toggles[0].getAttribute('aria-pressed')).toBe('false');
    expect(toggles[1].getAttribute('aria-pressed')).toBe('true');
    expect(toggles[2].getAttribute('aria-pressed')).toBe('false');
  });

  it('handles missing toggle container gracefully', () => {
    const states: ToggleStates[] = [ { pressed: false } ];
    // Should not throw, just log error
    expect(() => updateToggleAriaAttribute('missing-id', TOGGLE_CLASS, states, 0)).not.toThrow();
  });

  it('handles missing toggles gracefully', () => {
    container = createToggleDOM({ id: TOGGLE_ID, toggleClass: 'wrong-class', count: 2 });
    const states: ToggleStates[] = [ { pressed: false }, { pressed: false } ];
    // Should not throw, just log error
    expect(() => updateToggleAriaAttribute(TOGGLE_ID, TOGGLE_CLASS, states, 0)).not.toThrow();
  });

  it('handles state/DOM length mismatch gracefully', () => {
    container = createToggleDOM({ id: TOGGLE_ID, toggleClass: TOGGLE_CLASS, count: 2 });
    const states: ToggleStates[] = [ { pressed: false }, { pressed: false }, { pressed: false } ];
    // Should not throw, just log error
    expect(() => updateToggleAriaAttribute(TOGGLE_ID, TOGGLE_CLASS, states, 0)).not.toThrow();
  });

  it('does not update aria-pressed if already correct', () => {
    container = createToggleDOM({ id: TOGGLE_ID, toggleClass: TOGGLE_CLASS, count: 1 });
    const btn = container.querySelector('button')!;
    btn.setAttribute('aria-pressed', 'true');
    const states: ToggleStates[] = [ { pressed: true } ];
    updateToggleAriaAttribute(TOGGLE_ID, TOGGLE_CLASS, states, 0);
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });
});
