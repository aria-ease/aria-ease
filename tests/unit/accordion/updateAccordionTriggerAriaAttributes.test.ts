import { describe, it, expect, afterEach } from 'vitest';
import { updateAccordionTriggerAriaAttributes } from '../../../src/accordion/src/updateAccordionTriggerAriaAttributes/updateAccordionTriggerAriaAttributes';
import { AccordionStates } from '../../../Types';

function createAccordionDOM({ id, triggerClass, count }: { id: string; triggerClass: string; count: number }) {
  const container = document.createElement('div');
  container.id = id;
  for (let i = 0; i < count; i++) {
    const btn = document.createElement('button');
    btn.className = triggerClass;
    btn.setAttribute('aria-expanded', 'false');
    container.appendChild(btn);
  }
  document.body.appendChild(container);
  return container;
}

describe('updateAccordionTriggerAriaAttributes', () => {
  const ACCORDION_ID = 'test-accordion';
  const TRIGGER_CLASS = 'accordion-trigger';
  let container: HTMLElement;

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('updates only the clicked trigger to expanded and correct label', () => {
    container = createAccordionDOM({ id: ACCORDION_ID, triggerClass: TRIGGER_CLASS, count: 3 });
    const states: AccordionStates[] = [
      { display: false },
      { display: true },
      { display: false },
    ];
    updateAccordionTriggerAriaAttributes(ACCORDION_ID, TRIGGER_CLASS, states, 1);
    const triggers = container.querySelectorAll('button');
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
    expect(triggers[2].getAttribute('aria-expanded')).toBe('false');
  });

  it('handles missing accordion container gracefully', () => {
    const states: AccordionStates[] = [
      { display: false },
    ];
    // Should not throw, just log error
    expect(() => updateAccordionTriggerAriaAttributes('missing-id', TRIGGER_CLASS, states, 0)).not.toThrow();
  });

  it('handles missing triggers gracefully', () => {
    container = createAccordionDOM({ id: ACCORDION_ID, triggerClass: 'wrong-class', count: 2 });
    const states: AccordionStates[] = [
      { display: false },
      { display: false },
    ];
    // Should not throw, just log error
    expect(() => updateAccordionTriggerAriaAttributes(ACCORDION_ID, TRIGGER_CLASS, states, 0)).not.toThrow();
  });

  it('handles state/DOM length mismatch gracefully', () => {
    container = createAccordionDOM({ id: ACCORDION_ID, triggerClass: TRIGGER_CLASS, count: 2 });
    const states: AccordionStates[] = [
      { display: false },
      { display: false },
      { display: false },
    ];
    // Should not throw, just log error
    expect(() => updateAccordionTriggerAriaAttributes(ACCORDION_ID, TRIGGER_CLASS, states, 0)).not.toThrow();
  });

  it('does not update attributes if already correct', () => {
    container = createAccordionDOM({ id: ACCORDION_ID, triggerClass: TRIGGER_CLASS, count: 1 });
    const btn = container.querySelector('button')!;
    btn.setAttribute('aria-expanded', 'true');
    const states: AccordionStates[] = [
      { display: true },
    ];
    updateAccordionTriggerAriaAttributes(ACCORDION_ID, TRIGGER_CLASS, states, 0);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });
});