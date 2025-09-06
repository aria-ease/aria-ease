import { describe, it, expect, afterEach } from 'vitest';
import { updateRadioAriaAttributes } from '../../../src/radio/src/updateRadioAriaAttributes/updateRadioAriaAttributes';
import { RadioStates } from '../../../Types';

function createRadioDOM({ id, radioClass, count }: { id: string; radioClass: string; count: number }) {
  const container = document.createElement('div');
  container.id = id;
  for (let i = 0; i < count; i++) {
    const btn = document.createElement('button');
    btn.className = radioClass;
    btn.setAttribute('aria-checked', 'false');
    container.appendChild(btn);
  }
  document.body.appendChild(container);
  return container;
}

describe('updateRadioAriaAttributes', () => {
  const RADIO_ID = 'test-radio';
  const RADIO_CLASS = 'radio-btn';
  let container: HTMLElement;

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('updates only the checked radio to correct aria-checked', () => {
    container = createRadioDOM({ id: RADIO_ID, radioClass: RADIO_CLASS, count: 3 });
    const states: RadioStates[] = [
      { checked: false },
      { checked: true },
      { checked: false },
    ];
    updateRadioAriaAttributes(RADIO_ID, RADIO_CLASS, states, 1);
    const radios = container.querySelectorAll('button');
    expect(radios[0].getAttribute('aria-checked')).toBe('false');
    expect(radios[1].getAttribute('aria-checked')).toBe('true');
    expect(radios[2].getAttribute('aria-checked')).toBe('false');
  });

  it('throws if radio container is missing', () => {
    const states: RadioStates[] = [ { checked: false } ];
    expect(() => updateRadioAriaAttributes('missing-id', RADIO_CLASS, states, 0)).toThrow();
  });

  it('throws if radios are missing', () => {
    container = createRadioDOM({ id: RADIO_ID, radioClass: 'wrong-class', count: 2 });
    const states: RadioStates[] = [ { checked: false }, { checked: false } ];
    expect(() => updateRadioAriaAttributes(RADIO_ID, RADIO_CLASS, states, 0)).toThrow();
  });

  it('does not update aria-checked if already correct', () => {
    container = createRadioDOM({ id: RADIO_ID, radioClass: RADIO_CLASS, count: 1 });
    const btn = container.querySelector('button')!;
    btn.setAttribute('aria-checked', 'true');
    const states: RadioStates[] = [ { checked: true } ];
    updateRadioAriaAttributes(RADIO_ID, RADIO_CLASS, states, 0);
    expect(btn.getAttribute('aria-checked')).toBe('true');
  });
});
