# Security Policy

## Supported Versions

We actively support the following versions of aria-ease with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 2.2.x   | :white_check_mark: |
| 2.1.x   | :white_check_mark: |
| 2.0.x   | :x:                |
| < 2.0   | :x:                |

## Reporting a Vulnerability

We take the security of aria-ease seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:

- **scriptkidd98@gmail.com**: [Create an issue with label "security" and we'll provide a private channel]

### What to Include

Please include the following information in your report:

- Type of vulnerability (e.g., XSS, CSRF, injection, etc.)
- Full paths of source file(s) related to the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days with assessment and timeline
- **Fix & Disclosure**: Coordinated disclosure after patch is released

### Security Best Practices for Users

When using aria-ease in your application:

1. **Keep Updated**: Always use the latest version of aria-ease
2. **Sanitize User Input**: When using dynamic IDs/classes from user input, sanitize them first
3. **Content Security Policy**: Implement CSP headers in your application
4. **Regular Audits**: Use the built-in `npx aria-ease audit` tool regularly
5. **Dependency Scanning**: Monitor dependencies with tools like `npm audit`

### Known Security Considerations

#### DOM Selector Injection

aria-ease uses DOM selectors with user-provided IDs and class names. Always validate these inputs:

```javascript
// ❌ Bad - Unsanitized user input
const menuId = userInput; // Could be: "menu'); maliciousCode(); //"
makeMenuAccessible({ menuId, ... });

// ✅ Good - Validated input
const menuId = userInput.replace(/[^a-zA-Z0-9-_]/g, '');
makeMenuAccessible({ menuId, ... });
```

#### Event Handler Memory Leaks

Always call `cleanup()` methods when components unmount to prevent memory leaks:

```javascript
// React example
useEffect(() => {
  const menu = makeMenuAccessible({ ... });
  return () => menu.cleanup(); // ✅ Clean up on unmount
}, []);
```

## Security Hall of Fame

We appreciate security researchers who help keep aria-ease and our users safe:

<!-- Contributors who report valid security issues will be listed here -->

---

Thank you for helping keep aria-ease secure!
