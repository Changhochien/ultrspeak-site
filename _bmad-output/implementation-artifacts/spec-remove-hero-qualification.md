---
title: 'Remove the qualification block from the hero'
type: 'bugfix'
created: '2026-07-30'
status: 'done'
baseline_commit: '1b0a9c6dc3a6ead56ebbf375fba0fbe8809271f0'
context:
  - 'PRODUCT.md'
  - '_bmad-output/implementation-artifacts/spec-reorder-hero-qualification-and-enlarge-actions.md'
  - '_bmad-output/implementation-artifacts/spec-correct-free-tier-to-8000-weekly.md'
  - '_bmad-output/implementation-artifacts/spec-reposition-multilingual-homepage.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The hero still contains a long qualification block covering the Free allowance, keyboard shortcut, recognition languages, platforms, and Pro price. The user has decided that this information does not belong in the hero, where it competes with the core product message and actions.

**Approach:** Remove the qualification block completely from the shared hero and delete its now-unused localized source fields. Keep the enlarged hero actions directly after the supporting body, while retaining the Free allowance and recognition scope in the pricing and supporting sections where visitors can evaluate details.

## Boundaries & Constraints

**Always:** Remove the complete qualification paragraph and keyboard-key presentation from every localized hero; preserve the hero eyebrow, headline, body, enlarged equal-sized actions, focus treatment, `#download` and `#modes` destinations, app preview, metadata, and four-locale shared component. Keep the Free pricing card at 8,000 words weekly in every locale and preserve the US$19.49 annual Pro price elsewhere.

**Ask First:** Moving any part of the removed qualification into another hero element, changing hero or CTA copy, removing pricing-card quota information, or changing pricing, recognition capabilities, navigation, downloads, or product behavior.

**Never:** Leave dead `trialBefore`/`trialAfter` translation fields; render `data-home-hero-qualification`, a hero `<kbd>`, the 8,000-word allowance, or the Pro price inside the hero; weaken the pricing allowance regression checks; shrink or reorder the enlarged actions.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Localized homepage hero | `/`, `/zh-tw/`, `/zh-cn/`, or `/ja/` | Body flows directly into the enlarged action group | No qualification paragraph or keyboard key |
| Free pricing card | Any localized homepage | Correct 8,000-word weekly allowance remains visible | Former 2,000/daily allowance still fails release checks |
| Narrow mobile | 320px viewport | Actions remain equal, stacked, and at least 56px tall | No horizontal overflow or empty gap |
| Wider layout | 640px or desktop | Actions remain equal on one centered row | App preview retains its existing position |

</frozen-after-approval>

## Code Map

- `src/components/Hero.astro` -- renders the qualification block and enlarged action group.
- `src/i18n/ui.ts` -- defines the four localized `trialBefore` and `trialAfter` fields that become unused.
- `src/i18n/i18n.test.ts` -- currently constructs and asserts the localized hero qualification.
- `scripts/audit-build.mjs` -- currently requires hero quota, price, language, qualification order, and exact qualification text.
- Prior completed specs -- contain historical constraints explicitly superseded by this user decision.

## Tasks & Acceptance

**Execution:**
- [x] `src/components/Hero.astro` -- remove the full qualification paragraph and adjust action spacing/animation so the body flows directly into the existing enlarged actions.
- [x] `src/i18n/ui.ts` -- remove `trialBefore` and `trialAfter` from English, Traditional Chinese, Simplified Chinese, and Japanese hero dictionaries.
- [x] `src/i18n/i18n.test.ts` -- remove qualification fixtures and references while continuing to assert exact localized pricing allowances and rejection of the former 2,000-word limit.
- [x] `scripts/audit-build.mjs` -- stop requiring qualification-only hero claims; reject any hero qualification marker, `<kbd>`, 8,000-word allowance, or Pro price; continue exact pricing-card allowance and action-destination checks.
- [x] Prior completed specs -- append a clear supersession note without rewriting frozen historical intent.
- [x] Generated homepages -- inspect all four locales at 320px and desktop for clean body-to-action spacing, unchanged action geometry, and no overflow.

**Acceptance Criteria:**
- Given any supported homepage locale, when the hero renders, then no qualification block, keyboard-key element, quota, or Pro price appears inside it.
- Given the hero body, when its next marketing control renders, then it is the enlarged action group with unchanged destinations and accessible sizing.
- Given any Free pricing card, when the page renders, then the correct localized 8,000-word weekly allowance remains present.
- Given release checks, when qualification content returns to the hero or the former 2,000-word allowance returns anywhere on the homepage, then verification fails.
- Given this presentation-only removal, when the site builds, then metadata, pricing, supported-language claims elsewhere, routes, downloads, checkout, and Worker behavior remain unchanged.

## Spec Change Log

- 2026-07-30: Implemented the approved removal across the shared hero and all
  four locale dictionaries; retained the enlarged action layout and pricing
  truth.
- 2026-07-30: Adversarial review tightened release guards for plain-text
  shortcuts, equivalent quota/price formatting, body-to-action order, dead
  translation fields, supported languages, annual billing, CTA geometry, and
  former daily allowances anywhere on a homepage.
- 2026-07-30: Responsive browser evidence covered `/`, `/zh-tw/`, `/zh-cn/`,
  and `/ja/` at 320px, 640px, and 1440px: no qualification or `<kbd>`, no
  horizontal overflow, 272x56 mobile actions, 192x64 wider actions, and a 36px
  body-to-action gap.

## Design Notes

The hero should end its message with a decision, not a compact terms summary. Preserve the current large CTA geometry and use the former body-to-action rhythm so removing the paragraph does not leave an artificial vertical gap.

## Verification

**Commands:**
- `npm run test:i18n` -- typed locale parity and localized pricing allowance contracts pass.
- `npm run test:worker` -- download Worker behavior remains unchanged.
- `npm run typecheck:worker` -- Worker and application types remain valid.
- `npm run build` -- all 20 pages pass the revised static-output audit.
- `git diff --check` -- no whitespace errors.

**Manual checks:**
- Inspect `/`, `/zh-tw/`, `/zh-cn/`, and `/ja/` at 320px and 1440px; verify the qualification is absent, actions retain 56/64px equal geometry, and the page has no horizontal overflow.

## Suggested Review Order

**Hero removal and action hierarchy**

- Start where the supporting body now flows directly into the enlarged actions.
  [`Hero.astro:41`](../../src/components/Hero.astro#L41)

- Verify generated heroes reject disclosure variants and preserve action geometry.
  [`audit-build.mjs:276`](../../scripts/audit-build.mjs#L276)

**Pricing and locale truth**

- Confirm the Pro card exposes an auditable annual-price boundary.
  [`Pricing.astro:59`](../../src/components/Pricing.astro#L59)

- Review exact per-locale weekly, language, annual, and former-limit contracts.
  [`audit-build.mjs:141`](../../scripts/audit-build.mjs#L141)

- Confirm hero disclosure fields are absent from the shared translation shape.
  [`ui.ts:35`](../../src/i18n/ui.ts#L35)

- Verify tests reject dead hero fields and duplicate pricing allowances.
  [`i18n.test.ts:126`](../../src/i18n/i18n.test.ts#L126)

**Historical intent**

- Confirm prior qualification ordering is explicitly superseded without rewriting history.
  [`spec-reorder-hero-qualification-and-enlarge-actions.md:40`](spec-reorder-hero-qualification-and-enlarge-actions.md#L40)

- Confirm the weekly pricing truth remains authoritative outside the hero.
  [`spec-correct-free-tier-to-8000-weekly.md:39`](spec-correct-free-tier-to-8000-weekly.md#L39)
