# Fonts

All fonts are SIL Open Font License 1.1.

- **Geist / Geist Mono** (Vercel): `Geist-latin.woff2` is the variable font limited to weights
  400–500; `GeistMono-400-latin.woff2` is a static 400 instance. `GeistMono-Regular.ttf` is only
  used by the OG-image renderer.
- **Instrument Serif** (Instrument): from `@fontsource/instrument-serif`. The `.woff` is only used
  by the OG-image renderer (Satori can't read woff2).

The woff2 files are subset to Basic Latin plus the handful of symbols the site uses (é ’ “ ” – — …
· • ← ↑ → ↓ ↵ ⌘ ● ✓ ❯). If you add text with other characters, re-subset with fonttools:

```bash
pyftsubset <font> --unicodes="U+0020-007E,U+00A0,U+00A9,U+00B7,U+00D7,U+00E4,U+00E9,U+00F6,U+00FC,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2190-2193,U+21B5,U+2318,U+25CF,U+2713,U+276F" --flavor=woff2 --output-file=<out>
```
