# ARIA Pattern Specification Tracking

This document tracks synchronization between aria-ease contracts and the W3C ARIA Authoring Practices Guide (APG).

## Purpose

- List all supported APG patterns
- Link to exact APG section
- Note APG version/date
- Track last sync date
- Document behavioral deltas when APG changes

## Supported Patterns

### Accordion
- **APG Reference**: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
- **Contract Version**: 1.0.0
- **APG Version Synced**: APG 1.2 (June 2026)
- **Last Reviewed**: 09-06-2026
- **Status**: ✅ Fully Compliant
- **Notes**: None

### Combobox
- **APG Reference**: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- **Contract Version**: 1.0.0
- **APG Version Synced**: APG 1.2 (June 2026)
- **Last Reviewed**: 11-06-2026
- **Status**: ✅ Fully Compliant
- **Notes**: None

### Menu
- **APG Reference**: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
- **Contract Version**: 1.0.0
- **APG Version Synced**: APG 1.2 (June 2026)
- **Last Reviewed**: 11-06-2026
- **Status**: ✅ Fully Compliant
- **Notes**: None

---

## Change Log Template

When APG updates a pattern, document the delta here:

```markdown
### [Pattern Name] - [Date]
- **APG Version**: [version]
- **Change Type**: [Breaking | Addition | Clarification]
- **Behavioral Delta**: 
  - [What changed in the specification]
- **Impact**: 
  - [How this affects aria-ease implementations]
- **Actions Taken**:
  - [ ] Updated contract to version X.X.X
  - [ ] Updated utility functions
  - [ ] Added regression tests
  - [ ] Updated documentation
  - [ ] Added migration notes
- **Migration Notes**: 
  - [Guidance for consuming projects]
```

---

## Monitoring Sources

1. **APG Change Log**: https://www.w3.org/WAI/ARIA/apg/about/change-log/
2. **GitHub Repository**: https://github.com/w3c/aria-practices
3. **ARIA Working Group**: https://www.w3.org/WAI/ARIA/
4. **Automated CI/CD**: Monitors w3c/aria-practices for commits affecting supported patterns
