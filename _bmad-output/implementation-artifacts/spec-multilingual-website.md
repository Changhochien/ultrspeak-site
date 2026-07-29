---
title: 'Multilingual website system'
type: 'feature'
created: '2026-07-29'
status: 'done'
baseline_commit: '998576b0e8340f5410d99b197d5c0f6519f239ad'
context:
  - '/Users/changtom/Downloads/ultrspeak-site/PRODUCT.md'
  - '/Users/changtom/Downloads/ultrspeak-site/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Astro marketing site is English-only: copy is embedded in page and component templates, the document language is fixed, and there is no locale-aware routing or language selector. This prevents the site from serving its Traditional Chinese, Simplified Chinese, and Japanese audiences.

**Approach:** Add a typed, extensible localization layer with English, Traditional Chinese (`zh-TW`), Simplified Chinese (`zh-CN`), and Japanese (`ja`) as the initial locales. Keep existing English URLs canonical and unprefixed, publish equivalent translated pages under `/zh-tw/`, `/zh-cn/`, and `/ja/`, and give visitors an accessible selector that preserves the current page and section.

## Boundaries & Constraints

**Always:** Keep the site fully static and compatible with the existing Astro/Cloudflare build; make English the default locale; use one shared set of page/component templates rather than duplicating markup; provide complete Traditional Chinese, Simplified Chinese, and Japanese translations; localize visible copy, metadata, accessibility labels, form feedback, image alt text, and internal navigation; emit correct `lang`, canonical, and `hreflang` metadata; retain existing external account, download, mail, and form destinations; make adding a future locale a dictionary-and-config change with compile-time shape checking.

**Ask First:** Adding languages beyond English, Traditional Chinese, Simplified Chinese, and Japanese; translating route slugs; changing prices, product claims, legal meaning, checkout behavior, or download tracking; introducing server-side locale detection or a third-party localization service.

**Never:** Auto-translate at runtime, depend on client JavaScript for localized content, duplicate whole page templates per locale, prefix English URLs, redirect visitors solely from browser-language detection, or silently fall back to partially translated Chinese UI.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| English visit | `/`, `/privacy`, or another existing route | English content renders at the unchanged URL with `lang="en"` | N/A |
| Traditional Chinese visit | `/zh-tw/`, `/zh-tw/privacy`, or another localized route | Equivalent Traditional Chinese content renders with `lang="zh-TW"` | Build fails if the locale dictionary is incomplete |
| Simplified Chinese visit | `/zh-cn/`, `/zh-cn/privacy`, or another localized route | Equivalent Simplified Chinese content renders with `lang="zh-CN"` | Build fails if the locale dictionary is incomplete |
| Japanese visit | `/ja/`, `/ja/privacy`, or another localized route | Equivalent Japanese content renders with `lang="ja"` | Build fails if the locale dictionary is incomplete |
| Language switch | Visitor changes language on any page, including a hash section | Navigate to the matching route and preserve the hash where applicable | Unknown paths fall back to the target locale home |
| Search crawler | Any localized page | Canonical URL and reciprocal `hreflang` links identify English, all three translated locales, and `x-default` versions | N/A |

</frozen-after-approval>

## Code Map

- `astro.config.mjs` -- Astro 6 i18n routing derived from the shared locale registry.
- `src/i18n/` -- locale registry, typed translation dictionaries, and locale-aware URL helpers.
- `src/layouts/Base.astro` -- document language, localized metadata, canonical URL, alternate-language links, and shared page shell.
- `src/components/*.astro` -- shared marketing UI converted from hard-coded strings to locale dictionaries.
- `src/pages/*.astro` -- default-language page entry points.
- `src/pages/[locale]/[...route].astro` -- one static route generator for every translated locale and public page.
- `src/styles/global.css` -- language-selector styling and CJK-safe typography adjustments if required.

## Tasks & Acceptance

**Execution:**
- [x] `astro.config.mjs`, `src/i18n/config.ts`, `src/i18n/ui.ts`, `src/i18n/utils.ts` -- define supported locales, enforce dictionary parity, and generate locale-aware paths and SEO URLs.
- [x] `src/layouts/Base.astro`, `src/components/*.astro` -- thread locale data through the shared layout and marketing components; add an accessible language selector to navigation.
- [x] `src/pages/*.astro`, `src/pages/[locale]/[...route].astro` -- localize home, contact, checkout success, privacy, and terms pages without duplicating their presentation markup.
- [x] `src/i18n/i18n.test.ts`, `package.json` -- test locale/path behavior and dictionary completeness; expose a focused verification command.

**Acceptance Criteria:**
- Given any supported locale, when every public route is built, then the page contains complete locale-specific visible text and metadata while retaining the existing visual design and functional destinations.
- Given a visitor on any English, Traditional Chinese, Simplified Chinese, or Japanese page, when they use the language selector, then they reach the counterpart route with the selector state and document language updated.
- Given a translation key is removed or structurally mismatched, when type checking/build verification runs, then the change fails before deployment.
- Given the site is built statically, when the generated output is inspected, then both locale route sets exist with reciprocal canonical/alternate links and no client-rendered translation dependency.

## Spec Change Log

## Design Notes

English stays at existing URLs to avoid breaking links and search equity. Translations use lowercase URL paths (`/zh-tw/`, `/zh-cn/`, and `/ja/`) while emitting standards-formatted document languages (`zh-TW`, `zh-CN`, and `ja`). Components receive a locale and resolve typed copy centrally; localized route files remain thin composition entry points.

## Verification

**Commands:**
- `npm run test:i18n` -- all locale registry, route mapping, and dictionary parity tests pass.
- `npm run build` -- Astro generates all English, Traditional Chinese, Simplified Chinese, and Japanese pages without warnings or missing translation failures.
- `git diff --check` -- no whitespace errors.

**Manual checks:**
- Inspect desktop and mobile navigation on English, Traditional Chinese, Simplified Chinese, and Japanese home, legal, contact, and success pages; verify selector usability, CJK wrapping, hashes, forms, download/account links, metadata, and responsive layout.

## Suggested Review Order

**Static locale architecture**

- One generator creates every translated page from the shared route registry.
  [`[...route].astro:21`](../../src/pages/%5Blocale%5D/%5B...route%5D.astro#L21)

- The registry is the single source for paths, labels, and document languages.
  [`config.ts:1`](../../src/i18n/config.ts#L1)

- English defines the compile-time translation shape inherited by every locale.
  [`ui.ts:3`](../../src/i18n/ui.ts#L3)

- Shared page composition prevents markup drift between language versions.
  [`HomePage.astro:21`](../../src/components/pages/HomePage.astro#L21)

**Navigation and metadata**

- Accessible switching preserves route, query, and hash with a no-script fallback.
  [`Nav.astro:63`](../../src/components/Nav.astro#L63)

- Canonical, hreflang, Open Graph, and document language metadata stay reciprocal.
  [`Base.astro:32`](../../src/layouts/Base.astro#L32)

- Missing observer support no longer blocks content reveals or language controls.
  [`Base.astro:74`](../../src/layouts/Base.astro#L74)

**Verification and configuration**

- Focused tests enforce dictionary parity, routing, fallback, and URL preservation.
  [`i18n.test.ts:27`](../../src/i18n/i18n.test.ts#L27)

- Astro consumes the shared registry while retaining unprefixed English URLs.
  [`astro.config.mjs:4`](../../astro.config.mjs#L4)
