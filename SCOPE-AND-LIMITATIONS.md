# Scope and Limitations

## Our Commitment to Transparency

**Aria-Ease is powerful, but it's not a complete accessibility solution on its own.**

We believe the biggest problem in accessibility tooling isn't a lack of tools—it's a lack of transparency about what those tools actually cover. Too many tools present themselves as comprehensive solutions without clearly communicating their limitations. This leads to false confidence, missed issues, and real legal/ethical consequences.

**We're different. We're honest about what we do AND what we don't do.**

---

## ✅ What Aria-Ease DOES Cover

Aria-Ease provides **production-ready accessibility utilities** for common interactive patterns. We handle the complex, repetitive technical implementation so you don't have to.

### Component Patterns (7 Core)

We provide full WCAG-compliant implementations for:

- ✅ **Menu / Dropdowns** - Navigation menus, user profile dropdowns, context menus
- ✅ **Accordion** - Expandable sections, FAQs, collapsible content
- ✅ **Checkbox Groups** - Multi-select options with keyboard navigation
- ✅ **Radio Button Groups** - Single-select options with arrow key navigation
- ✅ **Toggle Buttons** - On/off switches, settings toggles
- ✅ **Combobox** - Autocomplete, search with suggestions, editable dropdowns
- ✅ **Block Navigation** - Landmark region navigation (skip links)

### Technical Implementation

For each pattern, Aria-Ease automatically handles:

- ✅ **Keyboard Navigation**
  - Arrow keys (↑ ↓ ← →)
  - Tab/Shift+Tab
  - Enter and Space activation
  - Escape to close/cancel
  - Home/End for first/last item

- ✅ **ARIA Attributes**
  - Roles (`role="menu"`, `role="menuitem"`, etc.)
  - States (`aria-expanded`, `aria-checked`, `aria-selected`)
  - Properties (`aria-controls`, `aria-labelledby`, `aria-haspopup`)
  - Relationships (`aria-owns`, `aria-describedby`)

- ✅ **Focus Management**
  - Focus trapping (for modals and menus)
  - Focus restoration (return to trigger element)
  - Visible focus indicators (CSS support)
  - Logical focus order
  - First/last item navigation

- ✅ **State Management**
  - Component state tracking
  - Event handling
  - Cleanup on unmount
  - Dynamic content updates (via `refresh()` methods)

### Standards Compliance

- ✅ Based on **WAI-ARIA Authoring Practices Guide (APG)**
- ✅ **WCAG 2.1 Level AA** compliant for covered patterns
- ✅ Follows **established interaction patterns** from W3C
- ✅ **Keyboard-first** approach (not mouse-dependent)

### Testing Tools

- ✅ **Contract Testing Framework** - Validate component behavior
- ✅ **CLI Audit Tool** - Powered by axe-core for automated scanning
- ✅ **Component-Specific Tests** - Pre-built test suites
- ✅ **Playwright Integration** - Browser-based testing

---

## ❌ What Aria-Ease DOES NOT Cover

**This is equally important.** Aria-Ease is part of a complete accessibility strategy, not the entire strategy.

### Visual & Design Accessibility

- ❌ **Typography** - Font size, line height, letter spacing
- ❌ **Visual Layout** - Reading order, visual hierarchy
- ❌ **Responsive Design** - Mobile accessibility, touch targets
- ❌ **CSS Styling** - You control all visual presentation
- ❌ **Animation/Motion** - `prefers-reduced-motion`, animation safety

**Why:** Aria-Ease handles JavaScript behavior and ARIA semantics. Visual accessibility requires design decisions we can't automate.

**Use Instead:** Lighthouse, axe DevTools, WAVE, manual design review

---

### Content Accessibility

- ❌ **Alternative Text** - Image alt text, decorative vs informative
- ❌ **Link Text** - Descriptive link text vs "click here"
- ❌ **Form Labels** - `<label>` associations, placeholders vs labels
- ❌ **Error Messages** - Clear, actionable error descriptions
- ❌ **Instructions** - Help text, required field indicators
- ❌ **Language** - `lang` attribute, plain language, readability
- ❌ **Tables** - `<th>`, `scope`, `<caption>` for data tables
- ❌ **Lists** - Semantic `<ul>`, `<ol>`, `<dl>` markup

**Why:** Content accessibility requires human judgment about context, clarity, and meaning.

**Use Instead:** Manual content review, plain language experts, content accessibility guidelines

---

### Multimedia & Documents

- ❌ **Video Captions** - Closed captions, subtitles, transcripts
- ❌ **Audio Descriptions** - Descriptive narration for visual content
- ❌ **Transcripts** - Text alternatives for audio/video
- ❌ **PDF Accessibility** - Tagged PDFs, reading order
- ❌ **Documents** - Word docs, PowerPoint, Excel accessibility

**Why:** These require specialized tools and manual creation.

**Use Instead:** Dedicated caption services, document remediation tools, manual creation

---

### Custom & Complex Patterns

- ❌ **Custom Widgets** - Patterns not in our 7 core components
- ❌ **Data Tables** - Sortable, filterable, complex tables
- ❌ **Rich Text Editors** - Complex WYSIWYG interfaces
- ❌ **Drag-and-Drop** - Accessible drag interfaces with keyboard
- ❌ **Charts/Graphs** - Data visualization accessibility
- ❌ **Maps** - Interactive map accessibility
- ❌ **Carousels** - Image carousels, slideshows
- ❌ **Tabs** - Tabbed interfaces (coming soon)
- ❌ **Modals/Dialogs** - Alert dialogs, confirmations (coming soon)
- ❌ **Tooltips** - Hover/focus tooltips (coming soon)

**Why:** We focus on doing 7 patterns exceptionally well. Custom patterns need custom solutions.

**Use Instead:** Build using WAI-ARIA APG as reference, or wait for us to add support

---

### Assistive Technology Testing

- ❌ **Screen Reader Testing** - How content sounds in NVDA, JAWS, VoiceOver
- ❌ **Announcement Behavior** - What gets read and when
- ❌ **Voice Control** - Dragon NaturallySpeaking, Voice Control
- ❌ **Magnification** - ZoomText, OS magnification
- ❌ **Switch Access** - Single-switch, multi-switch navigation
- ❌ **Eye Tracking** - Gaze-based interaction

**Why:** These require actual assistive technology and human testing. No automated tool can fully replicate this.

**Use Instead:** Manual testing with real assistive technology, user testing with disabled users

---

### Browser & Platform Compatibility

- ❌ **Cross-Browser Edge Cases** - Rare browser-specific bugs
- ❌ **Legacy Browser Support** - IE11, very old browsers
- ❌ **Mobile Touch Patterns** - Touch-specific interactions (primarily keyboard-focused)
- ❌ **Platform-Specific AT** - iOS VoiceOver gestures, Android TalkBack nuances

**Why:** We test on modern browsers, but edge cases exist. Mobile touch patterns need dedicated research.

**Use Instead:** Cross-browser testing, real device testing, mobile-specific accessibility patterns

---

### Organizational & Process

- ❌ **Policy Development** - Creating accessibility policies
- ❌ **VPAT/ACR Creation** - Voluntary Product Accessibility Templates
- ❌ **Legal Compliance** - Legal review, ADA expertise

**Why:** These are human services, not technical tools.

**Use Instead:** Accessibility consultants, legal counsel, training programs

---

## 🔁 What STILL Requires Manual Testing

Even after implementing Aria-Ease correctly, you should manually test:

### Critical Manual Tests

1. **Screen Reader Experience**
   - Navigate with NVDA (Windows)
   - Navigate with JAWS (Windows)
   - Navigate with VoiceOver (macOS/iOS)
   - Navigate with TalkBack (Android)
   - Verify announcements make sense
   - Check for redundant or confusing output

2. **Keyboard-Only Navigation**
   - Unplug your mouse
   - Navigate through entire interface
   - Verify nothing is unreachable
   - Check focus is always visible
   - Test logical tab order

3. **Context-Specific Validation**
   - Do error messages make sense?
   - Are instructions clear?
   - Is the user flow logical?
   - Are labels descriptive enough?
   - Do tooltips provide helpful information?

4. **Real User Testing**
   - Test with actual disabled users
   - Observe pain points
   - Gather feedback
   - Iterate based on real usage

### Why Manual Testing Matters

**Automated tools (including Aria-Ease) catch ~30-40% of accessibility issues.**

The remaining 60-70% require human judgment:

- Is this label meaningful in context?
- Is the error message helpful?
- Does the tab order make logical sense?
- Are announcements clear without visual context?
- Does this work for my users' actual needs?

**Aria-Ease makes your automated 30-40% rock solid. You still need to handle the other 60-70%.**

---

## 🧩 Aria-Ease in a Complete Accessibility Strategy

We recommend a **layered approach** to accessibility:

### Layer 1: Automated Scanning (10-15% coverage)

**Tools:** axe-core, Lighthouse, WAVE  
**Catches:** Missing alt text, color contrast, HTML validation, basic ARIA errors  
**Aria-Ease Role:** CLI audit tool provides this layer

### Layer 2: Component Behavior (15-25% coverage)

**Tools:** Aria-Ease, manual keyboard testing  
**Catches:** Keyboard navigation, focus management, ARIA implementation, interactive patterns  
**Aria-Ease Role:** ⭐ Component Contract Testing tool provides this layer

### Layer 3: Content & Context (30-40% coverage)

**Tools:** Manual review, content experts, plain language tools  
**Catches:** Confusing labels, unclear instructions, poor content structure, readability issues  
**Aria-Ease Role:** Not applicable - human judgment required

### Layer 4: Assistive Technology (15-25% coverage)

**Tools:** Screen readers, voice control, manual testing  
**Catches:** Announcement quality, AT compatibility, real user experience  
**Aria-Ease Role:** Not applicable - requires real AT testing

### Layer 5: User Testing (5-10% coverage, but critical)

**Tools:** Real users with disabilities  
**Catches:** Real-world usability, workflow issues, unexpected pain points  
**Aria-Ease Role:** Not applicable - requires human testing

### The Complete Stack

```
┌─────────────────────────────────────┐
│  User Testing with Disabled Users   │ ← Critical final layer
├─────────────────────────────────────┤
│  Manual Screen Reader Testing       │ ← NVDA, JAWS, VoiceOver
├─────────────────────────────────────┤
│  Content & Context Review           │ ← Human judgment
├─────────────────────────────────────┤
│  Aria-Ease Component Utilities      │ ← Interactive patterns ⭐
├─────────────────────────────────────┤
│  Automated Scanning (axe, Lighthouse)│ ← Basic issues
└─────────────────────────────────────┘
```

**You need all layers.** Aria-Ease is one critical piece, not the whole puzzle.

---

## 🤝 Recommended Complementary Tools

We actively recommend using these tools **alongside** Aria-Ease:

### Automated Scanning

- **[axe DevTools](https://www.deque.com/axe/devtools/)** - Browser extension, most comprehensive rules
- **[Lighthouse](https://developers.google.com/web/tools/lighthouse)** - Built into Chrome DevTools
- **[WAVE](https://wave.webaim.org/)** - Visual feedback tool

### Screen Readers (FREE)

- **[NVDA](https://www.nvaccess.org/)** - Windows (most popular, free, open source)
- **[JAWS](https://www.freedomscientific.com/products/software/jaws/)** - Windows (industry standard, paid)
- **VoiceOver** - macOS/iOS (built-in, free)
- **TalkBack** - Android (built-in, free)

### Code Linters

- **[eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)** - React accessibility linting
- **[axe-linter](https://github.com/dequelabs/axe-linter-vscode)** - VS Code accessibility linting

### Learning Resources

- **[WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)** - Official W3C patterns
- **[WebAIM](https://webaim.org/)** - Excellent learning resources
- **[The A11Y Project](https://www.a11yproject.com/)** - Community-driven accessibility resource

### Professional Services

- **Accessibility Consultants** - Manual auditing, VPAT creation, training
- **Inclusive Web** - Professional accessibility consulting (we're in conversation with them!)
- **Deque** - Enterprise accessibility solutions
- **Level Access** - Comprehensive accessibility services

---

## 📊 Coverage Estimate

Based on typical web application accessibility issues:

| Category                     | Aria-Ease Coverage | Requires Manual             |
| ---------------------------- | ------------------ | --------------------------- |
| **Keyboard Navigation**      | 95%                | 5% (edge cases)             |
| **Focus Management**         | 90%                | 10% (complex flows)         |
| **ARIA Attributes**          | 100%               | 0% (for covered patterns)   |
| **Interactive Patterns**     | 100%               | 0% (for 7 core components)  |
| **Color Contrast**           | 95%                | 5% (edge cases)             |
| **Alternative Text**         | 0%                 | 100% (human judgment)       |
| **Content Structure**        | 0%                 | 100% (human judgment)       |
| **Screen Reader Experience** | 70%                | 30% (test announcements)    |
| **Form Accessibility**       | 0%                 | 100% (use proper HTML)      |
| **Multimedia**               | 0%                 | 100% (captions/transcripts) |

**Overall Page Coverage: ~20-30%** of total accessibility requirements  
**Interactive Component Coverage: ~90-95%** for supported patterns

**Translation:** Aria-Ease handles most of the hard interactive JavaScript stuff. You handle content, design, and validation.

---

## ⚖️ Legal Disclaimer

**Aria-Ease is a development tool, not legal advice or a compliance guarantee.**

### What We Claim

✅ Aria-Ease implements patterns according to WAI-ARIA Authoring Practices  
✅ Our implementations are WCAG 2.1 Level AA compliant for covered patterns  
✅ We regularly update to match current standards  
✅ We provide testing tools to validate implementations

### What We Do NOT Claim

❌ That using Aria-Ease alone makes your site legally compliant  
❌ That you don't need manual testing  
❌ That all accessibility issues are covered  
❌ That you won't need professional accessibility review

### Your Responsibilities

When using Aria-Ease, you are still responsible for:

- Testing with real assistive technology
- Validating content accessibility
- Ensuring visual accessibility (typography, etc)
- Conducting user testing
- Seeking professional accessibility review when needed
- Staying current with evolving standards
- Meeting your specific legal/regulatory requirements

**If you're building a site that must meet legal compliance (government, healthcare, education, finance), consult with accessibility professionals and legal counsel. Aria-Ease is a powerful tool in your toolkit, but it's not a substitute for professional expertise.**

---

## 🎯 When to Use Aria-Ease

### ✅ Great Fit

- Building custom UI components
- Need accessible interactive patterns quickly
- Want to avoid component library design lock-in
- Building with any framework (React, Vue, Svelte, vanilla JS)
- Need small bundle sizes
- Want built-in testing
- Have existing codebase (incremental adoption)
- DIY remediation after accessibility audit

### ⚠️ Maybe Not a Fit

- Need patterns we don't support yet (tabs, modals, tooltips - coming soon)
- Need zero-code solution (we're a developer tool)
- Need comprehensive accessibility solution (we're one layer)
- Building with design system that already has accessible components

### 💡 Perfect Use Cases

1. **Startup/Agency** building custom UIs → Use Aria-Ease for interactive patterns
2. **Post-Audit Remediation** → axe-core finds issues → Fix with Aria-Ease
3. **Accessibility Consultant** → Use to accelerate client remediation
4. **Enterprise Team** → Incremental adoption to improve existing codebase
5. **Open Source Project** → Add accessibility without heavy dependencies

---

## 🔮 Roadmap: What's Coming

We're expanding coverage, but we want to be clear about current vs future capabilities:

### Coming Soon (Next 3-6 Months)

- Tabs component
- Modal/Dialog component
- Tooltip component
- Mobile touch pattern support
- Additional testing utilities
- Drag-and-Drop

### Under Research (6-12 Months)

- Data table utilities
- Chart/graph accessibility helpers
- Carousel patterns

### Will Not Support

- Visual design/styling (by design - that's your creativity)
- Content creation (requires human judgment)
- Professional consulting services (we build tools)

---

## 💬 Questions & Contact

### "Can I use Aria-Ease for WCAG 2.1 AA compliance?"

**For supported patterns, yes.** For your entire site, Aria-Ease is part of the solution, not the complete solution.

You need:

- Aria-Ease for interactive components ✅
- Proper HTML semantics
- Color contrast checking
- Alternative text
- Form labels
- Content accessibility
- Manual testing

### "Will Aria-Ease prevent my site from getting sued?"

**No tool can guarantee that.** Legal compliance involves many factors beyond technical implementation.

Aria-Ease reduces your technical accessibility issues significantly, but you need:

- Comprehensive accessibility strategy
- Manual testing
- User testing
- Professional review for high-risk sites
- Legal counsel for compliance questions

### "What if I find a bug or limitation?"

**Please tell us!** We're committed to improving.

- **Bugs:** Report on [GitHub Issues](https://github.com/aria-ease/aria-ease/issues)
- **Limitations:** We'll document them here and in release notes
- **Feature Requests:** We prioritize based on community needs

### "Can I get professional support?"

**Yes, Aria-Ease provides consulting services like audit/testing, remediation.**

You can see a list of services on the services page https://ariaease.site/services

For now:

- Community support via GitHub Discussions
- Documentation at https://ariaease.site/docs
- Open source, so you can read the code

---

## ✨ Our Philosophy

**Transparency builds trust. Trust enables adoption. Adoption improves accessibility.**

We'd rather be honest about our scope and have you use us confidently as part of your strategy than overpromise and underdeliver.

**Accessibility is a journey, not a destination. Aria-Ease makes part of that journey much easier.**

---

## 📖 Additional Resources

- **[README](README.md)** - Quick start and API reference
- **[Documentation Site](https://ariaease.site/docs)** - Full documentation with examples
- **[GitHub Repository](https://github.com/aria-ease/aria-ease)** - Source code, issues, discussions
- **[NPM Package](https://www.npmjs.com/package/aria-ease)** - Installation and version history
- **[WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)** - The standards we implement
- **[WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)** - Web Content Accessibility Guidelines

---

**Last Updated:** February 18, 2026  
**Version:** 6.2.0  
**Maintained By:** Aria-Ease Team

_We update this document as we learn more. If you have suggestions for how we can be more transparent, please let us know._
