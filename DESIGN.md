# ultrspeak — Design System

## Theme

Light and warm. The scene: someone at their Mac in daylight, mid-workday,
wanting a calm, fast, trustworthy tool. Light theme, but never flat white —
a warm paper background gives it craft and softness.

## Color (OKLCH)

Strategy: restrained. Warm tinted neutrals carry the page; amber is the single
accent, used with intent (CTAs, highlights, the waveform, active states).

- `--paper`   oklch(0.961 0.008 80)  — warm bone background
- `--card`    oklch(0.995 0.004 80)  — warm near-white surfaces
- `--ink`     oklch(0.235 0.014 65)  — warm near-black text
- `--ink-2`   oklch(0.505 0.014 68)  — muted text
- `--line`    oklch(0.895 0.008 80)  — hairline borders
- `--amber`   oklch(0.785 0.150 72)  — accent fills, waveform
- `--amber-ink` oklch(0.560 0.130 60) — amber used as readable text
- `--ink-strong` oklch(0.18 0.012 65) — deepest ink, hero headline

Never `#000`/`#fff`. All neutrals tinted warm (hue ~70-80).

## Typography

- Display: **Fraunces** (variable, optical sizing). Headlines, 400-560 weight.
  Soft, warm, characterful serif. Italic used for accented words.
- Body: **Hanken Grotesk**, 400/500/600. Clean grotesk, 16-18px, line-height 1.6.
- Mono: **JetBrains Mono**, 400/500. Keyboard keys, code, license keys.
- Body line length capped ~68ch. Scale steps ≥1.25 ratio.

## Elevation

Light, soft shadows only. Cards:
`0 1px 2px oklch(0.235 0.014 65 / 0.05), 0 14px 30px -18px oklch(0.235 0.014 65 / 0.16)`.
Hairline 1px `--line` borders. Generous radii: 20-28px cards, full pills/buttons.

## Components

- Buttons: amber fill + ink text (primary); ink-outline (secondary). Full radius.
- Pills/badges: small, uppercase tracking, hairline border or amber fill.
- Sections: generous vertical rhythm (≥7rem desktop), centered max-width ~72rem.

## Motion

ease-out-expo / quint. Staggered load-in reveals, scroll reveals, looping
waveform bars, app marquee. No bounce. Respect prefers-reduced-motion.
