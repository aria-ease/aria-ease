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
    btn.setAttribute('aria-label', 'Closed');
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
      { display: false, openedAriaLabel: 'Open 1', closedAriaLabel: 'Closed 1' },
      { display: true, openedAriaLabel: 'Open 2', closedAriaLabel: 'Closed 2' },
      { display: false, openedAriaLabel: 'Open 3', closedAriaLabel: 'Closed 3' },
    ];
    updateAccordionTriggerAriaAttributes(ACCORDION_ID, TRIGGER_CLASS, states, 1);
    const triggers = container.querySelectorAll('button');
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers[0].getAttribute('aria-label')).toBe('Closed 1');
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
    expect(triggers[1].getAttribute('aria-label')).toBe('Open 2');
    expect(triggers[2].getAttribute('aria-expanded')).toBe('false');
    expect(triggers[2].getAttribute('aria-label')).toBe('Closed 3');
  });

  it('throws if accordion container is missing', () => {
    const states: AccordionStates[] = [
      { display: false, openedAriaLabel: 'Open', closedAriaLabel: 'Closed' },
    ];
    expect(() => updateAccordionTriggerAriaAttributes('missing-id', TRIGGER_CLASS, states, 0)).toThrow();
  });

  it('throws if triggers are missing', () => {
    container = createAccordionDOM({ id: ACCORDION_ID, triggerClass: 'wrong-class', count: 2 });
    const states: AccordionStates[] = [
      { display: false, openedAriaLabel: 'Open', closedAriaLabel: 'Closed' },
      { display: false, openedAriaLabel: 'Open', closedAriaLabel: 'Closed' },
    ];
    expect(() => updateAccordionTriggerAriaAttributes(ACCORDION_ID, TRIGGER_CLASS, states, 0)).toThrow();
  });

  it('throws if state/DOM length mismatch', () => {
    container = createAccordionDOM({ id: ACCORDION_ID, triggerClass: TRIGGER_CLASS, count: 2 });
    const states: AccordionStates[] = [
      { display: false, openedAriaLabel: 'Open', closedAriaLabel: 'Closed' },
      { display: false, openedAriaLabel: 'Open', closedAriaLabel: 'Closed' },
      { display: false, openedAriaLabel: 'Open', closedAriaLabel: 'Closed' },
    ];
    expect(() => updateAccordionTriggerAriaAttributes(ACCORDION_ID, TRIGGER_CLASS, states, 0)).toThrow();
  });

  it('does not update attributes if already correct', () => {
    container = createAccordionDOM({ id: ACCORDION_ID, triggerClass: TRIGGER_CLASS, count: 1 });
    const btn = container.querySelector('button')!;
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Open');
    const states: AccordionStates[] = [
      { display: true, openedAriaLabel: 'Open', closedAriaLabel: 'Closed' },
    ];
    updateAccordionTriggerAriaAttributes(ACCORDION_ID, TRIGGER_CLASS, states, 0);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Open');
  });
});
