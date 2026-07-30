---
title: 'Remove the visible language-selector label'
type: 'bugfix'
created: '2026-07-30'
status: 'done'
baseline_commit: 'e2411d4b5671dceb7802120fff6033ae60c2d040'
context:
  - '_bmad-output/implementation-artifacts/spec-multilingual-website.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The navigation language selector expands to show “Choose language”
beside the current locale on large screens. The explanatory wording makes the
control unnecessarily wide and visually competes with the navigation actions.

**Approach:** Remove only the visible explanatory wording from the selector
trigger. Keep the globe icon, current locale short label, chevron, dropdown,
localized accessible name, and all switching behavior unchanged.

## Boundaries & Constraints

**Always:** Show the globe, current locale short label, and chevron at every
viewport width; preserve the existing 44px minimum target, border, focus
treatment, menu alignment, four locale destinations, active-locale state,
route/query/hash preservation, and localized screen-reader label.

**Ask First:** Removing or replacing the locale short label, changing the
dropdown contents, changing locale names or codes, altering navigation spacing
beyond what follows naturally from the shorter trigger, or changing language
routing and detection.

**Never:** Remove the language selector; hide it from assistive technology;
delete the localized `nav.language` strings while they remain accessibility
labels; replace the selector with flags; change translated page content,
pricing, hero copy, downloads, or Worker behavior.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Selector closed | Any supported locale and viewport | Trigger shows globe, locale short label, and chevron only | No visible “Choose language” equivalent |
| Assistive technology | Focus reaches the selector | Localized accessible name identifies language selection and current language | Build audit fails if the label is lost |
| Selector opened | Any public route | Four locale choices and the active checkmark remain available | Existing route fallback behavior remains unchanged |
| Narrow navigation | 320px or 390px viewport | Compact trigger and adjacent pricing action remain usable without overflow | Both controls retain at least 44px height |

</frozen-after-approval>

## Code Map

- `src/components/Nav.astro` -- renders the selector trigger, accessible label,
  current locale short label, dropdown, and navigation action.
- `src/i18n/ui.ts` -- retains localized `nav.language` strings for accessibility.
- `src/i18n/config.ts` -- defines the visible locale short labels.
- `src/i18n/i18n.test.ts` -- source-level selector accessibility and structure
  regression coverage.
- `scripts/audit-build.mjs` -- validates generated language links across every
  locale and public route.

## Tasks & Acceptance

**Execution:**
- [x] `src/components/Nav.astro` -- remove the visible `t.nav.language` span
  from the summary while preserving its localized `aria-label`; add a stable
  trigger marker only if needed for generated-output verification.
- [x] `src/i18n/i18n.test.ts` -- assert the selector keeps localized accessible
  naming and does not render the visible explanatory span.
- [x] `scripts/audit-build.mjs` -- verify every generated selector trigger
  contains only the expected locale short label as visible text while keeping
  its localized accessible name and four destinations.
- [x] Generated pages -- inspect all four homepages at 320px, 390px, and desktop
  with the selector closed and open.

**Acceptance Criteria:**
- Given any supported locale, when the navigation renders, then the language
  trigger shows only its icon, current locale short label, and chevron as
  visible content.
- Given a keyboard or screen-reader user, when they focus the language trigger,
  then its localized accessible name still communicates language selection and
  the full current-language name.
- Given any localized public route, when the menu opens and a language is
  selected, then all four choices, active state, counterpart route, query, and
  fragment behavior remain unchanged.
- Given a 320px viewport, when navigation renders, then neither the selector nor
  adjacent action overflows and both remain at least 44px tall.

## Spec Change Log

- 2026-07-30: Adversarial review scoped the source test to the marked language
  trigger and added generated-output protection for both required icons.
- 2026-07-30: Browser verification covered all four homepages at 320px, 390px,
  and 1440px. Every trigger and adjacent action measured 44px tall; document
  width matched viewport width; each open menu stayed within the viewport with
  four links and one active locale.
- 2026-07-30: Keyboard focus produced a visible solid 2px outline at mobile and
  desktop widths. Switching English to Traditional Chinese preserved
  `?source=selector-test#pricing`.

## Verification

**Commands:**
- `npm run test:i18n` -- selector structure, dictionary parity, and route helpers
  pass.
- `npm run build` -- all 20 generated pages pass the revised static audit.
- `git diff --check` -- no whitespace errors.

**Manual checks:**
- Check `/`, `/zh-tw/`, `/zh-cn/`, and `/ja/` at 320px, 390px, and 1440px;
  confirm compact trigger content, visible focus, menu operation, 44px targets,
  and no horizontal overflow.

## Suggested Review Order

**Compact selector**

- Start where visible copy is removed without weakening the accessible name.
  [`Nav.astro:65`](../../src/components/Nav.astro#L65)

**Generated-output protection**

- Review exact locale labels and accessibility expectations across all routes.
  [`audit-build.mjs:54`](../../scripts/audit-build.mjs#L54)

- Confirm rendered triggers retain two icons and only the short label.
  [`audit-build.mjs:82`](../../scripts/audit-build.mjs#L82)

**Focused regression coverage**

- Verify the source test targets only the marked language trigger.
  [`i18n.test.ts:284`](../../src/i18n/i18n.test.ts#L284)
