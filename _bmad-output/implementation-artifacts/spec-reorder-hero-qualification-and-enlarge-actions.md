---
title: 'Reorder the hero qualification and enlarge its actions'
type: 'bugfix'
created: '2026-07-30'
status: 'done'
baseline_commit: 'd38eb7292ff2b50d36dd9fa7b041c93a0e607e9a'
context:
  - 'DESIGN.md'
  - 'PRODUCT.md'
  - '_bmad-output/implementation-artifacts/spec-correct-free-tier-to-8000-weekly.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The long platform, quota, shortcut, language, and Pro-price qualification currently sits below the hero action buttons. This makes the actions feel interrupted and leaves the bottom of the text-first hero visually heavy; the two actions are also too small for their primary role.

**Approach:** Move the unchanged qualification directly above the action group, then make both hero actions larger and equal in geometry. Stack the actions at narrow mobile widths and keep them side by side from the small breakpoint upward so the buttons become the final, prominent step before the app preview.

## Boundaries & Constraints

**Always:** Preserve the exact localized qualification copy, keyboard shortcut, action labels, `#download` and `#modes` destinations, amber primary/outlined secondary treatments, title hierarchy, and four-locale shared component. Keep each mobile action at least 56px tall, use equal sizing, retain visible keyboard focus, and avoid horizontal overflow at 320px.

**Ask First:** Rewriting or splitting the qualification, changing CTA labels or destinations, altering the hero headline/body, or changing the app-preview position.

**Never:** Put the qualification beneath the actions; hide any quota, platform, price, or recognition-language disclosure; use locale-specific component markup; shrink the controls below accessible touch-target sizing; change pricing, product behavior, navigation, or download behavior.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Narrow mobile hero | Any locale at 320px | Qualification precedes two stacked, full-width actions at least 56px tall | No clipping or horizontal overflow |
| Wider hero | Any locale at 640px or desktop | Qualification precedes two equal-height actions on one centered row | Longer localized labels remain legible |
| Keyboard navigation | Focus reaches hero actions | Both actions show a visible focus indicator and retain their anchors | No focus loss from markup reorder |
| Rendered output | Generated localized homepage | Qualification marker occurs before action-group marker | Static audit fails if order regresses |

</frozen-after-approval>

> **Superseded hero-qualification constraint (2026-07-30):** The approved
> `spec-remove-hero-qualification.md` decision removes the qualification block
> entirely. This spec's enlarged, equal-sized action geometry, destinations,
> focus treatment, and responsive layout remain authoritative.

## Code Map

- `src/components/Hero.astro` -- owns hero content order, animation sequence, CTA geometry, and anchor destinations.
- `scripts/audit-build.mjs` -- validates generated hero content and can lock qualification-before-actions order.
- `src/i18n/i18n.test.ts` -- protects localized qualification text and CTA-key parity.
- `DESIGN.md` -- requires prominent full-pill actions, warm amber hierarchy, and restrained visual weight.

## Tasks & Acceptance

**Execution:**
- [x] `src/components/Hero.astro` -- place the qualification after the body and before a marked action group; enlarge both actions to equal 56px-or-taller geometry, stack them on narrow mobile, and preserve responsive one-row layout from `sm`.
- [x] `src/components/Hero.astro` -- align rise-animation delays with the new visual order and add explicit focus-visible treatment without altering destinations.
- [x] `scripts/audit-build.mjs` -- assert the rendered qualification marker precedes the hero-action marker on every localized homepage.
- [x] Generated homepages -- inspect all four locales at 320px and desktop; confirm order, button size, wrapping, focus, anchors, and overflow.

**Acceptance Criteria:**
- Given any supported homepage locale, when the hero renders, then the unchanged qualification appears above the enlarged actions.
- Given a 320px viewport, when the actions render, then they stack full-width, remain at least 56px tall, and do not cause horizontal overflow.
- Given a small-or-larger viewport, when the actions render, then both controls share one centered row and equal visual geometry.
- Given release verification, when the qualification is moved below the action group again, then the static-output audit fails.
- Given the layout-only change, when the site builds, then localized copy, quota, price, routes, downloads, pricing, and Worker behavior remain unchanged.

## Spec Change Log

- **Review patch:** Replaced independent auto-width actions with equal grid
  tracks and content-safe minimum heights, preventing future localized labels
  from creating unequal buttons or clipping at larger text sizes. Tightened
  the generated-output audit to require one correctly typed marker of each
  kind and to preserve both hero anchor destinations.

## Design Notes

The disclosure is supporting decision information, not post-action fine print. It should follow the product explanation and lead into the decisions. Use the existing amber and card treatments; prominence should come from 56–64px height, larger horizontal padding, `text-base`, and full-width mobile stacking rather than new colors or heavier effects.

## Verification

**Commands:**
- `npm run test:i18n` -- localized copy contracts and typed translation parity pass.
- `npm run test:worker` -- download behavior remains unchanged.
- `npm run typecheck:worker` -- Worker and application types remain valid.
- `npm run build` -- all 20 pages build and the strengthened static audit passes.
- `git diff --check` -- no whitespace errors.

**Manual checks:**
- Inspect `/`, `/zh-tw/`, `/zh-cn/`, and `/ja/` at 320px and 1440px; verify qualification order, action height, responsive stacking, keyboard focus, anchors, and no overflow.

## Suggested Review Order

**Hero hierarchy**

- Moves decision information before actions and makes the CTAs the visual endpoint.
  [`Hero.astro:49`](../../src/components/Hero.astro#L49)

- Uses equal grid tracks and content-safe minimum heights across breakpoints.
  [`Hero.astro:62`](../../src/components/Hero.astro#L62)

**Release protection**

- Requires one typed marker per hero and locks their rendered order.
  [`audit-build.mjs:291`](../../scripts/audit-build.mjs#L291)

- Preserves both action destinations inside the marked hero action group.
  [`audit-build.mjs:313`](../../scripts/audit-build.mjs#L313)
