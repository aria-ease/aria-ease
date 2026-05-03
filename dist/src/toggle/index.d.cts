import { c as ToggleConfig, a as AccessibilityInstance } from '../Types.d-BjBTlIzl.cjs';

/**
 * Makes a toggle button accessible by managing ARIA attributes and keyboard interactions.
 * Handles toggle button state with proper focus management.
 * @param {string} toggleId - The id of the toggle button or toggle button container.
 * @param {string} togglesClass - The shared class of toggle buttons (for groups).
 * @param {boolean} isSingleToggle - Whether this is a single toggle button (default: true).
 */

declare function makeToggleAccessible({ toggleId, togglesClass, isSingleToggle, callback }: ToggleConfig): AccessibilityInstance;

export { makeToggleAccessible };
