import { A as AccessibilityInstance } from '../Types.d-CBuuHF3d.js';

/**
 * Makes a toggle button accessible by managing ARIA attributes and keyboard interactions.
 * Handles toggle button state with proper focus management.
 * @param {string} toggleId - The id of the toggle button or toggle button container.
 * @param {string} togglesClass - The shared class of toggle buttons (for groups).
 * @param {boolean} isSingleToggle - Whether this is a single toggle button (default: true).
 */

interface ToggleConfig {
    toggleId: string;
    togglesClass?: string;
    isSingleToggle?: boolean;
}
declare function makeToggleAccessible({ toggleId, togglesClass, isSingleToggle }: ToggleConfig): AccessibilityInstance;

export { makeToggleAccessible };
