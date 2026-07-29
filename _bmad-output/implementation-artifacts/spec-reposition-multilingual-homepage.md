---
title: 'Reposition the multilingual homepage'
type: 'feature'
created: '2026-07-29'
status: 'done'
baseline_commit: '2271d6781317a8993db96838973a47af360e3d4c'
context:
  - 'PRODUCT.md'
  - 'DESIGN.md'
  - '_bmad-output/planning-artifacts/research/market-desktop-voice-dictation-positioning-research-2026-07-29.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The homepage leads with “Speak. It’s already written.”, “Stop typing. Start speaking.”, and an unqualified 3× speed claim. Competitors use nearly identical language, the Traditional Chinese hero reads like a translation, and the localized pages do not disclose English/Mandarin recognition early enough.

**Approach:** Replace the homepage metadata, hero, and closing CTA with a native four-locale message system centered on clear text, local processing, and cursor delivery. Keep platform, language, free-tier, and privacy claims accurate and visible above the fold.

## Boundaries & Constraints

**Always:** Preserve the existing typed translation shape and shared components; write each locale natively; retain the title/accent split; say Mac and Windows; identify supported recognition as English and Mandarin Chinese; describe on-device, offline processing plainly; keep the US$19.49 annual price and 2,000-word daily free allowance consistent with the existing pricing section; preserve all routes, download links, checkout behavior, and locale selection.

**Ask First:** Changing product capabilities, pricing, free limits, supported recognition languages, checkout behavior, or the established visual hierarchy.

**Never:** Claim Japanese recognition; retain “Stop typing. Start speaking.” or its translated equivalents; lead with “3× faster,” “perfect text,” “speed of thought,” or “speak, don’t type”; claim support for every text field without qualification; add runtime translation, locale-specific templates, or new product behavior.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| English homepage | Default `/` route | Hero reads “Your words, ready at the cursor.” and explains local, offline cursor delivery | No unsupported speed or universal-app claim |
| Traditional Chinese homepage | `/zh-tw/` | Hero reads 「用說的，寫得更清楚。」 with natural Taiwan supporting copy | No literal English syntax or mainland terminology |
| Simplified Chinese homepage | `/zh-cn/` | Hero reads 「直接说，写得更清楚。」 with native simplified copy | No Traditional Chinese leakage |
| Japanese homepage | `/ja/` | Hero reads 「話すだけで、伝わる文章に。」 and immediately states English/Mandarin recognition | Must not imply Japanese recognition |
| Metadata/social preview | Any home locale | Localized title and description reflect the new positioning | No “perfect,” 3×, or former slogan remains |
| Closing CTA | Any locale | Localized message contrasts voice staying on-device with text reaching the cursor | Download links and copyright remain unchanged |

</frozen-after-approval>

> **Superseded quota constraint (2026-07-29):** The approved
> `spec-correct-free-tier-to-8000-weekly.md` decision supersedes this spec's
> historical 2,000-word daily allowance constraint. The authoritative
> ultrspeak Free tier is now 8,000 words per week.

## Code Map

- `src/i18n/ui.ts` -- typed source of localized metadata, hero, trial disclosure, and footer CTA copy.
- `src/components/Hero.astro` -- renders the existing hero title/accent and qualification line.
- `src/components/Footer.astro` -- renders the closing title/accent and download actions.
- `src/components/Features.astro` and `src/components/Integrations.astro` -- render existing workflow-compatibility copy that must remain qualified rather than universal.
- `src/i18n/i18n.test.ts` -- locale parity and release-critical copy assertions.
- `scripts/audit-build.mjs` -- validates generated static pages for all locales.

## Tasks & Acceptance

**Execution:**
- [x] `src/i18n/ui.ts` -- replace home metadata, hero, trial qualification, and footer CTA copy in all four locales while preserving key parity.
- [x] `src/i18n/ui.ts` -- qualify the pre-existing feature and integration compatibility copy in all four locales so it does not promise support for every text field or every app.
- [x] `src/i18n/i18n.test.ts` -- assert the four selected hero headlines, immediate language disclosure, and removal of saturated or unsupported claims.
- [x] `scripts/audit-build.mjs` -- scope generated checks to the visible hero, enforce the full daily-free/annual-price qualification, and reject retired universal compatibility claims.
- [x] Generated homepages -- inspect desktop and 320px layouts to confirm the longer native copy wraps without clipping or overlap.

**Acceptance Criteria:**
- Given any supported locale, when its homepage is generated, then metadata, hero, qualification, and footer communicate one coherent local/offline cursor-delivery position.
- Given the Traditional Chinese page, when a native reader sees the hero, then the primary line is 「用說的，寫得更清楚。」 and cursor detail appears in supporting prose.
- Given the Japanese page, when a visitor evaluates product support, then English and Mandarin recognition is explicit above the fold.
- Given the source and generated output, when release checks run, then old slogans, “perfect text,” and unqualified 3× claims are absent from homepage metadata and hero copy.
- Given existing navigation, pricing, download, contact, legal, and copyright behavior, when the copy changes ship, then those behaviors remain unchanged.

## Spec Change Log

- **Loop 1 — acceptance audit:** The approved constraint against universal text-field claims was not represented in the execution tasks, leaving older “any/every text field/app” copy untouched. Expanded the code map and tasks to cover feature/integration compatibility copy, visible-hero scoping, full allowance/annual-price qualification, and regression checks. Avoid the known-bad state where metadata masks a missing hero or legacy universal promises remain elsewhere on the homepage. **KEEP:** preserve the four approved native headlines, local/offline privacy positioning, explicit English/Mandarin limits, Mac/Windows availability, US$19.49 annual price, localized footer CTA, existing routes/actions, and verified responsive layout. The former 2,000-per-day quota instruction is superseded by the approved 8,000-word weekly Free tier.

## Design Notes

Use the existing amber accent to emphasize the benefit half of each headline. Prefer concise title splits:

- `Your words,` / `ready at the cursor.`
- `用說的，` / `寫得更清楚。`
- `直接说，` / `写得更清楚。`
- `話すだけで、` / `伝わる文章に。`

## Verification

**Commands:**
- `npm run test:i18n` -- typed locale parity and copy assertions pass.
- `npm run build` -- Astro emits 20 pages and the static-output audit passes.
- `git diff --check` -- no whitespace errors.

**Manual checks:**
- Inspect `/`, `/zh-tw/`, `/zh-cn/`, and `/ja/` at desktop and 320px widths; confirm headline, support disclosure, and footer remain legible.

## Suggested Review Order

**Localized message system**

- Start with the English source, qualification, and privacy-first cursor promise.
  [`ui.ts:35`](../../src/i18n/ui.ts#L35)

- Review the user-approved native Traditional Chinese direction.
  [`ui.ts:389`](../../src/i18n/ui.ts#L389)

- Confirm Simplified Chinese remains native and recognition-limited.
  [`ui.ts:674`](../../src/i18n/ui.ts#L674)

- Confirm Japanese marketing never implies Japanese speech recognition.
  [`ui.ts:858`](../../src/i18n/ui.ts#L858)

**Compatibility boundaries**

- Feature copy now qualifies text-field compatibility without losing the benefit.
  [`ui.ts:77`](../../src/i18n/ui.ts#L77)

- Integration messaging names common workflows instead of promising every app.
  [`ui.ts:96`](../../src/i18n/ui.ts#L96)

- Activation instructions consistently describe hold-to-talk in supported apps.
  [`ui.ts:113`](../../src/i18n/ui.ts#L113)

**Rendered contract**

- Stable hero markers scope generated-output verification to visible content.
  [`Hero.astro:15`](../../src/components/Hero.astro#L15)

- Mac and Windows shortcut names render inside the exact qualification line.
  [`Hero.astro:66`](../../src/components/Hero.astro#L66)

**Release guardrails**

- Locale fixtures define exact metadata, headlines, limits, and annual pricing.
  [`audit-build.mjs:122`](../../scripts/audit-build.mjs#L122)

- Generated pages verify the rendered hero rather than metadata substrings.
  [`audit-build.mjs:234`](../../scripts/audit-build.mjs#L234)

- Typed tests lock native headlines and localized metadata.
  [`i18n.test.ts:86`](../../src/i18n/i18n.test.ts#L86)

- Qualification and retired-claim checks prevent scope or pricing regressions.
  [`i18n.test.ts:124`](../../src/i18n/i18n.test.ts#L124)

**Decision trail**

- Competitive synthesis explains the defensible cursor-and-privacy position.
  [`market-desktop-voice-dictation-positioning-research-2026-07-29.md:511`](../planning-artifacts/research/market-desktop-voice-dictation-positioning-research-2026-07-29.md#L511)

- Final copy decision records the native Traditional Chinese rationale.
  [`market-desktop-voice-dictation-positioning-research-2026-07-29.md:791`](../planning-artifacts/research/market-desktop-voice-dictation-positioning-research-2026-07-29.md#L791)
