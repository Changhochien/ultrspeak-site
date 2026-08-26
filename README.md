# ultrspeak-site

Marketing site for [ultrspeak](https://ultrspeak.com) — private, offline voice
dictation for Mac and Windows. Built with [Astro](https://astro.build) and
Tailwind CSS v4, deployed as a static-asset Cloudflare Worker that also hosts
the app's download and update endpoints.

## Overview

- **Fully localized**: English (root paths) plus 日本語 (`/ja`), 简体中文
  (`/zh-cn`), 繁體中文 (`/zh-tw`). All user-facing strings live in
  [`src/i18n/ui.ts`](src/i18n/ui.ts) — every locale must carry every key.
- **Homepage** sells the app directly: modes demo, feature grid, integrations,
  how-it-works, a Local-vs-Cloud comparison ledger, pricing (Free +
  Pro US$19.49/year via Stripe checkout through the account portal).
- **SEO/AEO**: `@astrojs/sitemap`, robots.txt, llms.txt, per-locale
  SoftwareApplication + FAQPage JSON-LD (`src/components/StructuredData.astro`),
  og:image/Twitter cards, self-hosted variable fonts (no font CDN requests).
- **Design system**: committed in [`DESIGN.md`](DESIGN.md) (warm paper theme,
  OKLCH tokens, Hanken Grotesk + JetBrains Mono). Product positioning and
  audience live in [`PRODUCT.md`](PRODUCT.md).

## Layout

```
src/
├── assets/screenshots/     App screenshots (optimized by astro:assets)
├── components/             Homepage sections + page shells (pages/)
├── i18n/                   config, ui.ts (all copy), utils (paths/hreflang)
├── layouts/Base.astro      <head>: canonical, hreflang, OG/Twitter, JSON-LD host
├── pages/                  Root routes + [locale]/[...route].astro
└── styles/global.css       Tailwind v4 @theme tokens, motion, focus ring
worker/
├── index.ts                Download/update routing (see Worker notes)
public/                     robots.txt, llms.txt, og.jpg, favicon
scripts/audit-build.mjs     Post-build gate asserting approved copy pins
```

## Development

Requires **Node >= 22.12**.

```sh
npm install
npm run dev                 # http://localhost:4321
```

| Command | Action |
| :-- | :-- |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Build to `./dist` + run the static-output audit gate |
| `npm run preview` | Preview the production build locally |
| `npm run test:i18n` | `tsc --noEmit` + translation-dictionary tests |
| `npm run preview:cloudflare` | Build, then serve through the worker (`wrangler dev`) |
| `npm run deploy:preview` | Build + `wrangler deploy` to Cloudflare |
| `npm run test:worker` | Vitest suite for worker routing |
| `npm run typecheck:worker` | Regenerate/check `worker-configuration.d.ts` |

Both test suites must pass before merging; `npm run build` must pass too —
`scripts/audit-build.mjs` fails the build if pinned approved copy (titles,
hero lines, pricing language, retired slogans) drifts in any locale.

### Editing content

Copy lives in `src/i18n/ui.ts`. When changing or adding keys, update all four
locales, then run `npm run test:i18n`. Strings pinned by the audit gate
(`scripts/audit-build.mjs`) or by `src/i18n/i18n.test.ts` must be updated in
those files in the same change. Product facts (pricing, platform support,
privacy claims) come from [`PRODUCT.md`](PRODUCT.md) — don't invent numbers.

## Worker notes

`worker/index.ts` runs first only for its own routes (see `run_worker_first`
in [`wrangler.jsonc`](wrangler.jsonc)); every other request falls through to
the static assets in `dist/`.

Routes owned by the worker:

- `/download/macos[-test]`, `/download/windows` — resolve a release manifest
  from R2 (`downloads/{platform}/{channel}/latest.json`) and stream the signed
  installer with `Content-Disposition: attachment`; 503 "being prepared" page
  when no manifest exists. `?source=` is sanitized and counted in a
  structured log event (no IP/UA/referrer recorded).
- `/updates/macos/{channel}/appcast.xml` and release artifacts — Sparkle
  update feed for the macOS shell (immutable caching, byte-range support).
- `/tauri/{channel}/latest.json` and artifacts — Tauri updater manifests for
  stable/beta/canary across darwin/windows/linux targets.

Bindings: `RELEASES` (R2 bucket `ultrwispr-updates`) and `ASSETS`
(the `dist/` build). Update/download routes always respond with
`X-Robots-Tag: noindex`. Route resolution helpers are exported for tests
(`worker/index.test.ts`, 33 cases covering manifests, ranges, ETags, safety).

## Deployment

```sh
npm run deploy:preview      # build + wrangler deploy
```

Deploys the `ultrspeak-site-preview` worker; the live URL is
`https://ultrspeak-site-preview.hcchangdesign.workers.dev`. The production
hostname (`ultrspeak.com`) is bound to this worker in the Cloudflare
dashboard. There is no CI — deploys are manual from `main`.
