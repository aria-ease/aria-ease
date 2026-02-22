import { A as AccessibilityInstance } from '../Types.d-CBuuHF3d.js';

/**
 * Adds keyboard interaction to block. The block traps focus and can be interacted with using the keyboard.
 * @param {string} blockId The id of the block container.
 * @param {string} blockItemsClass The shared class of the elements that are children of the block.
*/

interface BlockConfig {
    blockId: string;
    blockItemsClass: string;
}
declare function makeBlockAccessible({ blockId, blockItemsClass }: BlockConfig): AccessibilityInstance;

export { makeBlockAccessible };
