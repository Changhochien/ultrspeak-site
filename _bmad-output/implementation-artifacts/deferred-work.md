# Deferred work

## Resolved website issues from multilingual review

- [x] Payment documentation now identifies account-based Stripe subscriptions, matching the pricing, privacy, terms, and checkout-success copy (`PRODUCT.md`, `src/i18n/ui.ts`).
- [x] The placeholder Formspree endpoint and fake server-delivery state were removed. Contact now opens a localized `mailto:` draft to `hello@ultrspeak.com`, explains that the website does not send it, and provides a copyable fallback (`src/components/pages/ContactPage.astro`, `src/i18n/ui.ts`).
- [x] The on-device privacy feature and related FAQ answer now refer to the visitor's computer/device across English, Traditional Chinese, Simplified Chinese, and Japanese (`src/i18n/ui.ts`).

## Deferred source-of-truth question

- [ ] Confirm the legal copyright holder before replacing the `ultrspeak` product brand with a company or individual owner in the localized footer notice.
