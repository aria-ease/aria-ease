# How You Can Contribute

## For new contributors

Create a new branch using format feature e.g add-support-for-input, clean-up-tab-event-listeners e.t.c. That'll be the branch where you can push commits to, and create pull requests from.

## For returning contributors

Open a new issue, as detailed as possible. Fix and test issue locally. Create a pull request to dev branch, and await review and/or merge.

## Contribution Guidelines

Write all functions in type-safe TypeScript.

Test features vigorously, for keyboard and screen reader users.

Algorithms must follow best software practices.

All functions must be JSDoc documented.

All commits must have either format; "fix: fixed event listener perfomance leak" for issues fixing or refactoring, or "build: added ... feature" for creating an entirely new feature that didn't exist before.

## Pattern Updates

When the W3C ARIA Authoring Practices Guide (APG) introduces changes to existing patterns or adds new patterns, aria-ease must update to maintain compliance with the international accessibility standards.

### Monitoring APG Changes

We monitor specification changes through:
- APG Change Log
- W3C ARIA Practices GitHub Repository
- ARIA Working Group Task Force Meetings
- Automated CI/CD pipeline that monitors the W3C ARIA-practices repo

All changes are documented in `src/utils/test/contract/SPEC-TRACKING.md`.

### When Updating a Pattern Contract

You **must** complete the following steps:

1. **Link to APG Section**
   - Reference the exact APG pattern URL being updated
   - Note the APG version/date of the change
   - Document in `SPEC-TRACKING.md`

2. **Describe Behavioral Delta**
   - Clearly describe what changed in the pattern specification
   - Explain the difference between old and new behavior
   - Document impact on existing implementations

3. **Update Utility (if needed)**
   - Modify the corresponding utility function(s) in `src/[pattern]/index.ts`
   - Ensure backward compatibility when possible
   - Add new parameters or methods as needed

4. **Update Contract**
   - Update the contract JSON in `src/utils/test/contract/contracts/[Pattern]Contract.json`
   - Follow strict semantic versioning:
     - **Patch (x.x.X)**: Clarifications, non-behavioral fixes
     - **Minor (x.X.x)**: New optional features, backward-compatible additions
     - **Major (X.x.x)**: Breaking changes, removed features, behavioral changes
   - Update the `meta.version` and `meta.lastUpdated` fields

5. **Add Regression Test**
   - Add test cases covering the new/changed behavior
   - Ensure existing test coverage is not broken
   - Test both jsdom and Playwright (browser) modes if applicable

6. **Include Migration Notes (if breaking)**
   - Document breaking changes in `CHANGELOG.md`
   - Provide clear migration path for existing users
   - Include code examples showing before/after
   - Update documentation pages to reflect changes

### Contract Versioning

Contracts use strict semantic versioning to ensure consuming projects can track compliance:

- Contracts are versioned independently from the library
- Version changes signal behavioral contract changes
- Consuming projects can pin to specific contract versions
- CI/CD pipelines can detect breaking contract changes

### Propagation Timeline

When APG changes are detected:
1. **Day 0**: CI/CD creates issue with APG delta
2. **Day 1-3**: Review change, assess impact, plan update
3. **Day 4-7**: Implement utility and contract updates
4. **Day 8-10**: Testing and documentation
5. **Day 11-14**: Release with migration notes

This ensures consuming projects can update within 2 weeks of APG changes.
