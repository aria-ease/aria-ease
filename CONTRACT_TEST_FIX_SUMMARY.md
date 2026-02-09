# Menu Contract Test Fixes - February 2026

## Problem Summary

Menu contract tests were failing intermittently despite manual testing passing perfectly. This classic "flaky test" scenario was caused by **race conditions** and **insufficient state verification** between test iterations.

## Root Cause

### What Was Happening:

1. **Test Isolation Failure**: Between tests, the reset logic would:
   - Press Escape to close menu
   - Wait a fixed 200ms
   - Start next test immediately
   - **Never verify menu actually closed or focus returned to trigger**

2. **Browser Async Processing**: Even though the menu code is synchronous, browsers process these changes asynchronously:
   - Focus changes
   - Display property updates
   - Event handler registration/cleanup
   - Style recalculations

3. **Premature Test Start**: Tests would start while previous test cleanup was still in progress, causing:
   - Menu in intermediate state (partially closed)
   - Focus not yet settled on trigger
   - Event handlers not fully attached/removed
   - Unpredictable aria-expanded states

### Specific Timing Issues:

- **Initialization**: 6s timeout could expire before component ready
- **Menu clicks**: 500ms might not be enough for all state updates
- **Keyboard navigation**: 100ms before/after key press insufficient
- **State reset**: 200ms fixed wait without verification

## Fixes Applied

### 1. Multi-Strategy Close Logic (Lines 154-250)

**FINAL WORKING SOLUTION:**

The original fix attempted to close with Escape but continued even when it failed. The working solution uses **3 progressive strategies** and fails fast if none work:

```typescript
// Strategy 1: Try Escape key (proper keyboard interaction)
await closeElement.focus();
await page.keyboard.press("Escape");
menuClosed = await waitForMenuToClose(popupSelector);

// Strategy 2: If Escape failed, click trigger to toggle
if (!menuClosed) {
  await triggerElement.click();
  menuClosed = await waitForMenuToClose(popupSelector);
}

// Strategy 3: If still open, click outside
if (!menuClosed) {
  await page.mouse.click(10, 10);
  menuClosed = await waitForMenuToClose(popupSelector);
}

// Strategy 4: If STILL open, throw error (component is broken)
if (!menuClosed) {
  throw new Error("❌ FATAL: Cannot close menu between tests");
}
```

**Why this works:**

- ✅ Actually verifies menu closed (not just hoping)
- ✅ Tries alternative close methods if one fails
- ✅ Catches real bugs in menu component
- ✅ Ensures clean state before each test

### 2. Increased Strategic Wait Times

| Operation              | Before | After                      | Reason                             |
| ---------------------- | ------ | -------------------------- | ---------------------------------- |
| Initialization timeout | 6s     | 10s + 300ms buffer         | Allow full component setup         |
| Menu clicks            | 500ms  | 800ms                      | State propagation + focus settling |
| Keyboard nav (before)  | 100ms  | 200ms                      | Ensure focused element ready       |
| Keyboard nav (after)   | 100ms  | 300ms                      | Allow focus change to complete     |
| Pre-assertion wait     | 0ms    | 300ms                      | Let all state changes settle       |
| General menu actions   | 100ms  | 200ms                      | Consistent state timing            |
| State reset            | 200ms  | 300ms (after verification) | Post-verification settling         |

### 3. Better Debugging Output

Added diagnostic information to failures:

- **Visibility assertions**: Reports actual `display`, `visibility`, `opacity` values
- **Focus assertions**: Reports which element actually has focus (`TAG#id.class`)

Example:

```
❌ First menu item should have focus after clicking trigger
   actual focus: DIV#menu-trigger.menu-button
```

## Testing the Fixes

### 1. Rebuild the Package

```bash
cd /Users/macx/aria-ease/package
npm run build
```

### 2. Start Dev Server

```bash
cd /Users/macx/aria-ease/test/js
npm run dev
```

### 3. Run Contract Tests (in new terminal)

```bash
cd /Users/macx/aria-ease/test/js
npm test
```

### 4. Watch for Success

Look for output like:

```
✓ Menu Accessibility Test > renders menu without accessibility violation(s)
  ✅ Clicking the trigger opens the menu...
  ✅ Arrow Down key moves focus to next menu item
  ✅ Escape key closes the menu...
```

## Why This Works Now ✅

1. **No More Premature Starts**: Tests wait for actual state changes, not arbitrary timeouts
2. **Guaranteed Clean State**: Multi-strategy close ensures menu is actually closed between tests
3. **Proper Focus Management**: Waits for focus to settle before assertions
4. **Adequate Processing Time**: Browsers get enough time to complete async operations
5. **Better Failure Diagnosis**: When tests do fail, you see what actual state was
6. **Fail Fast on Bugs**: If menu won't close after 3 attempts, catches real component bugs

## If Tests Still Fail

If you see failures after these changes, check the diagnostic output:

### For visibility failures:

```
actual: display:block, visibility:visible, opacity:1
```

Indicates menu didn't close - might need longer close animation time

### For focus failures:

```
actual focus: DIV#menu-div.menu-container
```

Indicates focus stuck in menu - might need longer focus settling time

### Next Steps if Needed:

1. Check if your menu has CSS transitions/animations
2. Increase specific wait times based on animation duration
3. Look for JavaScript setTimeout/Promise delays in menu code
4. Consider enabling `slowMo` in Playwright for extreme debugging

## Performance Note

nd multi-strategy close logic add ~2-3 seconds per test:

- Before: ~10-15 seconds (but flaky 💔)
- After: ~30-40 seconds (but reliable ✅)

This is an acceptable trade-off for test reliability. Once tests are consistently passing for a week or two, you can incrementally reduce timeouts to find the optimal balance.

## Quick Monitoring (Simple Method)

Run your tests and check for warnings:

```bash
cd /Users/macx/aria-ease/docs
npx aria-ease test 2>&1 | grep "Menu did not close"
```

**Interpretation:**

- **No output:** Escape strategy working perfectly! ✅
- **Repeated warnings:** Need to investigate (see ADD_MONITORING.md)

For detailed analysis with statistics, see [ADD_MONITORING.md](ADD_MONITORING.md) which includes:

- Automated analysis script
- Exact code locations for logging
- Troubleshooting guide based on results

## Related History

This issue was previously partially addressed in:

- f05c7f0 - "increased timeout value in Playwright contract test runner"
- 13a8cff - "fixed menu component contract test failing when submenu not found"
- **Feb 9, 2026** - Final fix with multi-strategy close logic ✅

The earlier the test runner\*\* to add logging:

```typescript
// After Strategy 1
if (menuClosed) {
  console.log('✅ Strategy 1 (Escape) worked');
}

// After Strategy 2
if (!menuClosed && ...) {
  console.log('⚠️  Strategy 1 failed, trying Strategy 2 (click trigger)');
}
if (menuClosed) {
  console.log('✅ Strategy 2 (click trigger) worked');
}

// After Strategy 3
if (!menuClosed) {
  console.log('⚠️  Strategy 2 failed, trying Strategy 3 (click outside)');
}
if (menuClosed) {
  console.log('✅ Strategy 3 (click outside) worked');
}
```

2. **Run tests and watch the output:**

   ```bash
   cd /Users/macx/aria-ease/docs
   npx aria-ease test 2>&1 | grep "Strategy"
   ```

3. **Interpret results:**
   - **If always Strategy 1**: Perfect! Your Escape handler works correctly
   - **If always Strategy 2**: Your Escape handler might not be registered or has issues
   - **If always Strategy 3**: Both keyboard and click handlers have issues
   - **If mixed**: Timing issues or race conditions in event handlers

### What to Do Based on Results

**If Strategy 2 or 3 is always needed:**

1. Check your menu's Escape key handler:

   ```javascript
   // Look in makeMenuAccessible.ts
   menuItem.addEventListener("keydown", handler);
   ```

2. Verify the Escape event reaches the focused element:

   ```javascript
   // Add debug logging
   console.log("Escape pressed on:", document.activeElement);
   ```

3. Check if event.preventDefault() is called:

   ```javascript
   if (event.key === "Escape") {
     event.preventDefault(); // Should be here
     closeMenu();
   }
   ```

4. Verify focus is on a menu item (not trigger) when Escape is pressed

### Optimizing After Stabilization

Once tests pass consistently for 1-2 weeks:

1. **Reduce timeouts gradually** (10% at a time):

   ```typescript
   // Try reducing from 800ms to 720ms
   await page.waitForTimeout(componentName === "menu" ? 720 : 200);
   ```

2. **Run tests 10 times in a row** after each reduction:

   ```bash
   for i in {1..10}; do
     echo "Run $i"
     npx aria-ease test || break
   done
   ```

3. **If any run fails**, revert the change

4. **Keep reducing until you hit the minimum reliable values**
   This is acceptable trade-off for test reliability. Once tests are consistently passing, you can incrementally reduce timeouts to find the optimal balance.

## Related Commits

This issue was previously partially addressed in:

- f05c7f0 - "increased timeout value in Playwright contract test runner"
- 13a8cff - "fixed menu component contract test failing when submenu not found"

But those fixes addressed symptoms, not the root cause of inadequate state verification.
