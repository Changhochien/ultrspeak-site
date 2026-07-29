---
title: 'Correct the free tier to 8,000 words weekly'
type: 'bugfix'
created: '2026-07-29'
status: 'done'
baseline_commit: '50f535794586200a3091396166794fd2b1fffbae'
context:
  - 'PRODUCT.md'
  - '_bmad-output/implementation-artifacts/spec-reposition-multilingual-homepage.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The website incorrectly advertises a 2,000-word daily free allowance. The implemented ultrwispr entitlement contract uses an 8,000-word weekly limit, so the hero and pricing copy currently misstate the product.

**Approach:** Replace the old allowance and cadence everywhere ultrspeak describes its own free tier, using native weekly wording in English, Traditional Chinese, Simplified Chinese, and Japanese. Keep the existing hero hierarchy, Pro price, platform scope, recognition languages, and product behavior unchanged.

## Boundaries & Constraints

**Always:** Treat 8,000 words per week as the authoritative free allowance; preserve the typed translation shape; use `每週` for Traditional Chinese, `每周` for Simplified Chinese, and `週8,000語まで` for Japanese; keep US$19.49 per year, Mac and Windows, English and Mandarin recognition, and on-device/offline claims unchanged; record that this explicit user decision supersedes the former 2,000-per-day constraint.

**Ask First:** Changing weekly reset semantics, rollover behavior, account requirements, Pro pricing, or quota enforcement outside this static-site repository.

**Never:** Retain an ultrspeak 2,000-per-day claim; alter competitor facts that legitimately mention their own allowances; invent a reset day/time; change entitlement service code already enforcing 8,000 weekly; reposition the qualification line as part of this quota correction.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| English homepage | Hero and Free pricing card | “8,000 words a week/per week” | No daily or 2,000-word ultrspeak claim |
| Traditional Chinese homepage | Hero and Free pricing card | 「每週可免費輸入 8,000 字詞」 | No `每天`, `每日`, or Simplified terminology |
| Simplified Chinese homepage | Hero and Free pricing card | 「每周可免费输入 8,000 字词」 | No `每日`, `每週`, or Traditional terminology |
| Japanese homepage | Hero and Free pricing card | 「週8,000語まで無料」 | No `1日` or 2,000-word limit |

</frozen-after-approval>

> **Superseded hero-qualification constraint (2026-07-30):** The approved
> `spec-remove-hero-qualification.md` decision removes the Free allowance from
> the hero. The 8,000-word weekly allowance remains authoritative in the Free
> pricing card and product documentation.

## Code Map

- `src/i18n/ui.ts` -- localized hero qualification and Free pricing-card source.
- `src/i18n/i18n.test.ts` -- exact four-locale qualification contract.
- `scripts/audit-build.mjs` -- generated-homepage allowance and cadence assertions.
- `PRODUCT.md` -- durable product-level quota source of truth.
- `_bmad-output/implementation-artifacts/spec-reposition-multilingual-homepage.md` -- prior approved constraint explicitly superseded by the user.
- `_bmad-output/planning-artifacts/research/market-desktop-voice-dictation-positioning-research-2026-07-29.md` -- ultrspeak recommendation language that still says “daily allowance.”

## Tasks & Acceptance

**Execution:**
- [x] `PRODUCT.md` -- document the free tier as 8,000 words per week.
- [x] `src/i18n/ui.ts` -- replace hero and pricing allowance copy natively in all four locales.
- [x] `src/i18n/i18n.test.ts` -- lock exact weekly copy and reject former ultrspeak allowance variants.
- [x] `scripts/audit-build.mjs` -- verify rendered hero and pricing output contain 8,000 plus the correct weekly cadence.
- [x] Prior spec and research artifacts -- record the human override and remove obsolete ultrspeak daily-allowance guidance without changing competitor facts.

**Acceptance Criteria:**
- Given any localized homepage, when it is built, then its hero and Free pricing card state an 8,000-word weekly allowance.
- Given release checks, when old product copy reintroduces 2,000 per day or a daily cadence, then verification fails.
- Given the existing deployment behavior, when this copy-only correction ships, then routes, language selection, downloads, checkout, Pro pricing, and entitlement enforcement remain unchanged.

## Spec Change Log

- **Implementation:** Corrected all four localized hero qualifications and Free
  pricing-card allowances to 8,000 words weekly, added exact source and
  generated-output regressions for the former daily claims, established the
  quota in `PRODUCT.md`, and recorded the supersession in the prior spec and
  research recommendations. The competitor allowance evidence remains
  unchanged.
- **Review patch:** Broadened the rendered-output guard to reject the former
  2,000-word allowance anywhere on a localized homepage, identified the Free
  pricing card with a stable data attribute instead of display order, and made
  the source assertion independent of the allowance feature's array position.

## Verification

**Commands:**
- `npm run test:i18n` -- exact localized weekly allowance assertions pass.
- `npm run test:worker` -- download Worker behavior remains unchanged.
- `npm run build` -- all 20 static pages pass the strengthened output audit.
- `git diff --check` -- no whitespace errors.

**Manual checks:**
- Inspect the hero and Free pricing card at desktop and 320px in all four locales; confirm weekly wording remains legible.

## Suggested Review Order

**Product truth**

- Establishes the authoritative Free and Pro plan limits.
  [`PRODUCT.md:42`](../../PRODUCT.md#L42)

- Records why the previously approved daily quota no longer applies.
  [`spec-reposition-multilingual-homepage.md:42`](./spec-reposition-multilingual-homepage.md#L42)

**Localized customer copy**

- Defines native weekly hero and pricing language across all four locales.
  [`ui.ts:42`](../../src/i18n/ui.ts#L42)

- Identifies the Free card independently of display order for reliable auditing.
  [`Pricing.astro:33`](../../src/components/Pricing.astro#L33)

**Release protection**

- Audits exact localized weekly claims and rejects obsolete rendered allowances.
  [`audit-build.mjs:122`](../../scripts/audit-build.mjs#L122)

- Locks source translations while allowing harmless pricing-feature reordering.
  [`i18n.test.ts:123`](../../src/i18n/i18n.test.ts#L123)

**Supporting guidance**

- Aligns market-positioning recommendations with the implemented weekly allowance.
  [`market-desktop-voice-dictation-positioning-research-2026-07-29.md:637`](../planning-artifacts/research/market-desktop-voice-dictation-positioning-research-2026-07-29.md#L637)
