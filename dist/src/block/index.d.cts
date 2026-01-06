import { a as AccessibilityInstance } from '../Types.d-w1KLKLcA.cjs';

/**
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block container.
 * @param {string} blockItemsClass The shared class of the elements that are children of the block.
*/

declare function makeBlockAccessible(blockId: string, blockItemsClass: string): AccessibilityInstance;

export { makeBlockAccessible };
