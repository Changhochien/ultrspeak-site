---
title: 'Enhance localized copyright notices'
type: 'feature'
created: '2026-07-29'
status: 'done'
route: 'one-shot'
---

# Enhance localized copyright notices

## Intent

**Problem:** The shared footer displayed only a copyright symbol and year, leaving the ownership notice incomplete and identical across every language.

**Approach:** Render one complete, dynamically dated copyright notice with natural English, Traditional Chinese, Simplified Chinese, and Japanese wording, then validate the composed footer on every generated page.

## Suggested Review Order

**Localized footer output**

- Start with the complete semantic notice and dynamic year substitution.
  [`Footer.astro:15`](../../src/components/Footer.astro#L15)

- Review the four locale-specific copyright formulations.
  [`ui.ts:197`](../../src/i18n/ui.ts#L197)

**Release safeguards**

- Verify every generated page contains the exact localized footer notice.
  [`audit-build.mjs:124`](../../scripts/audit-build.mjs#L124)

- Confirm typed dictionaries retain all four approved formulations.
  [`i18n.test.ts:71`](../../src/i18n/i18n.test.ts#L71)

- Track the unresolved legal-owner source of truth without inventing it.
  [`deferred-work.md:9`](deferred-work.md#L9)
