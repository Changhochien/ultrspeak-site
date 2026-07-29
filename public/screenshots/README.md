# Screenshots

App screenshots live in `src/assets/screenshots/` (not here) so Astro
optimizes them at build time. Import them statically in components.

| File | Used by | Notes |
|------|---------|-------|
| `app-home.jpg` | Hero (`Hero.astro`) | Full app window, Home screen. ~2400×1640. |
| `app-history.jpeg` | Features (`Features.astro`) | History screen, used in the "Nothing gets lost" card. ~2752×1536. |
| `state-listening.png` / `state-transcribing.png` / `state-done.png` | How it works (`HowItWorks.astro`) | Floating transcription-indicator pills, one per step. Transparent PNG. |
