# DESIGN.md — oslife Life OS Dashboard

## Visual Strategy

**Archetype**: Bento Spatial + Vercel-Core hybrid
**Mood**: Calm command center. Precise, not flashy. Like checking your instruments — everything in its place.
**What to avoid**: Neon glow, glassmorphism blur, gradient borders, template-looking symmetric grids.
**References**: amie.so, craft.do, vercel.com/dashboard, linear.app

## Color Palette (OKLCH)

```css
@theme inline {
  /* Backgrounds */
  --color-bg-base:     oklch(0.08 0.01 260);    /* near-black with blue tint */
  --color-bg-surface:  oklch(0.12 0.01 260);    /* raised surface */
  --color-bg-card:     oklch(0.14 0.012 260);   /* card background — solid, no transparency */
  --color-bg-hover:    oklch(0.17 0.015 260);   /* hover state */
  --color-bg-input:    oklch(0.10 0.01 260);    /* input fields */

  /* Borders — alpha only, never solid gray */
  --color-border:      oklch(0.40 0.01 260 / 0.12);
  --color-border-active: oklch(0.65 0.15 250 / 0.4);

  /* Text */
  --color-text-primary:   oklch(0.93 0.01 260);  /* not pure white */
  --color-text-secondary: oklch(0.65 0.02 260);
  --color-text-muted:     oklch(0.45 0.02 260);

  /* Single accent — used in <5% of surface */
  --color-accent:      oklch(0.72 0.18 250);     /* muted blue */
  --color-accent-soft: oklch(0.72 0.18 250 / 0.12);

  /* Semantic colors — for data only */
  --color-positive:    oklch(0.72 0.16 155);     /* green */
  --color-negative:    oklch(0.65 0.20 25);      /* red */
  --color-warning:     oklch(0.78 0.15 80);      /* amber */
  --color-info:        oklch(0.70 0.12 280);     /* purple */
}
```

## Typography

**Primary**: Heebo (Hebrew + Latin) — already loaded, good weight range
**Monospace**: JetBrains Mono — for numbers, metrics, code
**No additional display font.** Contrast comes from weight and size, not font count.

```
Scale (Major Third — 1.25x):
  xs:    0.75rem  / 12px
  sm:    0.875rem / 14px
  base:  1rem     / 16px
  lg:    1.25rem  / 20px
  xl:    1.563rem / 25px
  2xl:   1.953rem / 31px
  3xl:   2.441rem / 39px
  hero:  3.052rem / 49px

Headings: weight 800, line-height 1.1, tracking -0.025em
Body: weight 400, line-height 1.55, tracking 0
Numbers/metrics: JetBrains Mono weight 700, tabular-nums
All-caps labels: weight 600, tracking 0.08em, font-size xs
```

## Spacing Scale (base-8 linear)

```
1:   4px     (micro — icon gaps)
2:   8px     (compact — inline spacing)
3:  12px     (tight — list items)
4:  16px     (standard — card padding mobile)
5:  20px     (comfortable)
6:  24px     (card padding desktop)
8:  32px     (section gap mobile)
10: 40px     (spacious)
12: 48px     (section gap desktop)
16: 64px     (page section break)
24: 96px     (hero breathing room)
```

Macro spacing (between sections) >> micro spacing (inside cards).

## Component Patterns

**Cards**: Solid background (no blur/glass). 1px alpha border. Border-radius 12px. No box-shadow. Hover: border lightens subtly, no transform.

**Metric numbers**: JetBrains Mono, 2xl-3xl size, accent color only for the primary metric. Others in text-primary.

**Buttons**: Border-radius 8px (not full-round). 1px ring border. Filled buttons: bg-accent, text-bg-base. Ghost buttons: transparent + ring. Active: scale(0.98). No gradient.

**Progress bars**: Height 3px. Solid color. Border-radius 2px. Background: bg-surface. No glow.

**Labels/Tags**: All-caps, xs font, tracking wide, bg-surface, border-radius 4px.

**Lists**: Left/right border accent strip (3px) instead of colored dots.

## Layout — Bento Grid

Dashboard uses **asymmetric bento grid**, NOT equal columns:

```
Desktop (3 columns, auto rows):
┌──────────┬────────┐
│  Large    │ Small  │
│  metric   │ metric │
├────┬─────┤────────┤
│ Sm │ Sm  │ Medium │
│    │     │ (goals)│
├────┴─────┼────────┤
│ Wide     (timeline)│
├──────────┬────────┤
│ Medium   │ Medium │
│ (chart)  │ (quick)│
└──────────┴────────┘

Mobile (1 column):
Stack vertically. Large metric spans full width.
Small metrics: 2-column sub-grid.
```

## Motion Curves

```css
--ease-out:    cubic-bezier(0.32, 0.72, 0, 1);       /* entries, drawers */
--ease-snappy: cubic-bezier(0.2, 0, 0, 1);           /* UI transitions */
--ease-micro:  cubic-bezier(0.25, 0.1, 0.25, 1);     /* hover, subtle */

Durations:
  hover:     120ms
  standard:  180ms
  expand:    280ms
  page:      350ms

Rules:
  - ease-out for entries, ease-in for exits
  - Animate ONLY transform + opacity
  - scale(0.98) on :active for buttons
  - @media (prefers-reduced-motion): disable
  - High-frequency (toggle, tab switch): 0ms
```

## RTL Considerations

- All logical properties: `margin-inline-start` not `margin-left`
- `text-align: start` not `right`
- Grid flows naturally in RTL
- Icons: don't mirror universal icons (checkmarks, plus). Mirror directional icons (arrows, chevrons).
