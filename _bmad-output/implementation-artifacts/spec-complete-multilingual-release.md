---
title: 'Complete and publish multilingual website release'
type: 'feature'
created: '2026-07-29'
status: 'done'
baseline_commit: '677c1a1fa888ed9d15596c0ae7f79d010de6656e'
context:
  - 'PRODUCT.md'
  - 'DESIGN.md'
  - '_bmad-output/implementation-artifacts/spec-multilingual-website.md'
  - '_bmad-output/implementation-artifacts/deferred-work.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The completed multilingual system exists only in the local commit, so the deployed Worker still shows the old site without a language control. Three deferred issues also remain: stale Lemon Squeezy documentation, a broken placeholder contact-form destination, and Mac-only privacy wording on a cross-platform page.

**Approach:** Close every resolvable release issue, make the language control visually unmistakable, replace the nonfunctional form submission with an honest localized direct-email workflow, then push `main`, deploy the exact committed source to Cloudflare Workers, and verify the live Worker across all locales. Treat the still-unregistered `ultrspeak.com` domain as an explicit external blocker rather than claiming the custom domain is live.

## Boundaries & Constraints

**Always:** Preserve Stripe as the billing source of truth established by the active account system and current website; retain all four locales and typed parity; keep contact available without a fake success state or unconfigured third-party endpoint; visibly expose language selection at desktop and 320px mobile widths; keep English unprefixed; validate GitHub and Cloudflare against the same commit; preserve download tracking and Worker asset routing; report the exact live URL and any domain blocker honestly.

**Ask First:** Purchasing or registering a domain; modifying Cloudflare DNS zones; creating a paid email/Formspree/Resend account; changing Stripe pricing, refund policy, account URLs, or subscription behavior.

**Never:** Leave `your-form-id` or another placeholder in production; claim a message was sent when only an email client was opened; imply Japanese dictation support; hide the language control at supported widths; overwrite unrelated work; force-push; claim `ultrspeak.com` is deployed while DNS remains `NXDOMAIN`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Language selection | Any public route, locale, query, or hash | A prominent control offers all four languages and preserves the counterpart route, query, and hash | Unknown routes resolve to target-language home |
| Mobile header | 320px viewport in the longest-label locale | Brand/home access, language control, and primary CTA remain visible without horizontal overflow | Responsive labels compact without removing controls |
| Contact action | Visitor supplies name, email, and message | The site opens a pre-addressed email draft containing those fields | If the email app cannot open, direct address and copyable content remain visible |
| Publication | Verified clean committed tree | The commit is pushed to `origin/main` and the same source is deployed to the configured Worker | Stop and report any non-fast-forward, auth, or deployment failure |
| Live verification | Worker deployment URL | English and three localized routes return correct language UI and functional selection | Roll back only if the new deployment is demonstrably broken |

</frozen-after-approval>

## Code Map

- `src/components/Nav.astro` -- prominent, accessible language control and mobile header layout.
- `src/layouts/Base.astro` -- query/hash-preserving language-link enhancement.
- `src/components/pages/ContactPage.astro` -- localized direct-email workflow with no fake network submission.
- `src/i18n/ui.ts` -- contact guidance and cross-platform privacy copy in every locale.
- `PRODUCT.md` -- current Stripe subscription sales model.
- `worker/index.ts`, `worker/index.test.ts`, `wrangler.jsonc` -- deployment boundary preserved and verified.

## Tasks & Acceptance

**Execution:**
- [x] `src/components/Nav.astro`, `src/layouts/Base.astro` -- make language selection obvious and resilient at all supported widths.
- [x] `src/components/pages/ContactPage.astro`, `src/i18n/ui.ts` -- replace placeholder Formspree submission with a truthful localized email-draft flow and align device wording.
- [x] `PRODUCT.md`, `_bmad-output/implementation-artifacts/deferred-work.md` -- align payment documentation to Stripe and mark resolved items with evidence.
- [x] `src/i18n/i18n.test.ts`, Worker tests, generated-output audit -- cover release-critical locale, contact, navigation, and static-output behavior.
- [x] GitHub and Cloudflare release readiness -- prove fast-forward safety, preserve deployment configuration, and prepare live verification for post-review publication.

**Acceptance Criteria:**
- Given the live Worker at desktop or 320px mobile width, when a visitor opens any public page, then a clearly visible language control offers English, Traditional Chinese, Simplified Chinese, and Japanese.
- Given a localized route with query and hash state, when another language is selected, then the counterpart route retains that state.
- Given the contact page, when a visitor submits their details, then an email draft addressed to `hello@ultrspeak.com` opens and the site never reports server delivery.
- Given repository product documentation and website billing copy, when reviewed together, then both consistently describe Stripe account-based subscriptions.
- Given the release commit, when GitHub and Cloudflare are inspected, then `origin/main` contains it and the deployed Worker serves its 20-page multilingual output.

## Spec Change Log

## Design Notes

The repository has no production Formspree ID, GitHub secret, Worker secret, or configured email service. A localized `mailto:` draft is therefore the only complete contact workflow available without inventing credentials or adding an unapproved provider. The custom domain remains outside release completion until it is registered and configured; the existing Workers deployment is the verifiable live surface.

## Verification

**Commands:**
- `npm run test:i18n && npm run test:worker && npm run typecheck:worker && npm run build` -- all checks pass and 20 pages build.
- `git diff --check` -- no whitespace errors.
- `git merge-base --is-ancestor origin/main HEAD` and `git status --short --branch` -- publication is fast-forward and clean.

**Manual checks:**
- At 320px, the header measured 320px wide with no horizontal overflow; the language control and primary CTA remained visible with 44px tap targets.
- The Japanese language menu exposed all four locales, and switching to Simplified Chinese preserved `?source=release#pricing`.
- The Traditional Chinese contact page exposed the truthful email-draft workflow, direct address, copyable fallback, and no browser console errors without sending email.
- Inspect the deployed Worker routes and compare a release fingerprint to the committed build.

## Suggested Review Order

**Visible multilingual navigation**

- Start with the prominent, accessible four-language control and compact mobile layout.
  [`Nav.astro:64`](../../src/components/Nav.astro#L64)

- Follow query and fragment preservation across localized counterpart routes.
  [`Base.astro:94`](../../src/layouts/Base.astro#L94)

- Review the concise labels that keep every locale visible at narrow widths.
  [`config.ts:11`](../../src/i18n/config.ts#L11)

**Truthful contact workflow**

- See the localized form contract, direct recipient, and visible copy fallback.
  [`ContactPage.astro:35`](../../src/components/pages/ContactPage.astro#L35)

- Trace draft composition, URI limits, protocol errors, and clipboard fallback.
  [`ContactPage.astro:172`](../../src/components/pages/ContactPage.astro#L172)

- Check parity for contact states and cross-platform privacy wording.
  [`ui.ts:198`](../../src/i18n/ui.ts#L198)

**Release truth and validation**

- Confirm Stripe account-based subscription language in product source truth.
  [`PRODUCT.md:9`](../../PRODUCT.md#L9)

- Inspect the exact 20-route, four-destination generated-output audit.
  [`audit-build.mjs:39`](../../scripts/audit-build.mjs#L39)

- Review release-critical source wiring and state-preservation tests.
  [`i18n.test.ts:134`](../../src/i18n/i18n.test.ts#L134)

- Close with the evidence-backed resolution ledger for prior deferred issues.
  [`deferred-work.md:3`](deferred-work.md#L3)
