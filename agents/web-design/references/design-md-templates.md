# DESIGN.md Templates

When Step 3 of the workflow (DESIGN.md Specification) is reached, write a
`DESIGN.md` at the project root using one of these templates as scaffold.

Once the file is committed, its tokens are **immutable** during coding.
No new colors, fonts, or motion primitives may be introduced without an
explicit DESIGN.md edit.

Format uses Tailwind v4's CSS-first `@theme` directive so tokens are
natively consumed by both the compiler and the agent.

---

## Template 1: Vercel-Core (Modern SaaS)

````markdown
# DESIGN.md — Vercel-Core Archetype

## 1. Visual Strategy
- **Mood**: Technical, highly polished, invisible correctness
- **Audience**: Developers, technical decision-makers
- **Avoid**: Floating drop-shadows, fully-rounded buttons, bright linear gradients, centered 3-column grids

## 2. Tailwind v4 Theme (`app/globals.css`)

```css
@import "tailwindcss";

@theme {
  /* Colors — OKLCH native */
  --color-base-background: oklch(0.15 0 0);        /* deep charcoal */
  --color-base-surface:    oklch(0.20 0 0);        /* elevated card */
  --color-base-border:     oklch(1 0 0 / 0.08);    /* 8% white */
  --color-text-primary:    oklch(0.98 0 0);
  --color-text-secondary:  oklch(0.65 0 0);
  --color-text-tertiary:   oklch(0.50 0 0);
  --color-accent-cyan:     oklch(0.70 0.12 230);   /* single accent */

  /* Typography */
  --font-sans: "Geist Sans", system-ui, -apple-system, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;

  /* Type scale (Major Third, 1.25) */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.25rem;
  --text-xl:   1.5625rem;
  --text-2xl:  1.953rem;
  --text-3xl:  2.441rem;
  --text-display: clamp(3rem, 8vw, 6rem);

  /* Spacing (base-8 linear) */
  --spacing-1:  0.25rem;   /* 4px  */
  --spacing-2:  0.5rem;    /* 8px  */
  --spacing-3:  0.75rem;   /* 12px */
  --spacing-4:  1rem;      /* 16px */
  --spacing-6:  1.5rem;    /* 24px */
  --spacing-8:  2rem;      /* 32px */
  --spacing-12: 3rem;      /* 48px */
  --spacing-16: 4rem;      /* 64px */
  --spacing-24: 6rem;      /* 96px */
  --spacing-32: 8rem;      /* 128px */

  /* Motion curves (Kowalski) */
  --ease-snappy:  cubic-bezier(0.23, 1, 0.32, 1);
  --ease-drawer:  cubic-bezier(0.32, 0.72, 0, 1);
  --ease-out-ui:  cubic-bezier(0, 0, 0.2, 1);
  --ease-in-exit: cubic-bezier(0.4, 0, 1, 1);

  /* Durations */
  --duration-hover: 140ms;
  --duration-ui:    220ms;
  --duration-drawer: 400ms;

  /* Borders & radii */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  /* No --radius-full. Pills are rejected in this archetype. */
}
```

## 3. Component Patterns

- **Buttons**: `rounded-md`; `border: 1px solid var(--color-base-border)`;
  background lift 5–10% L on hover; `scale: 0.98` on `:active` with
  `transition: transform var(--duration-hover) var(--ease-snappy)`
- **Cards**: No `box-shadow`. Depth via 1px alpha border + slight L shift of
  the surface token (`--color-base-surface`).
- **Forms**: 2px cyan focus ring with offset; no placeholder-as-label;
  label sits above input.
- **Icons**: Phosphor, `stroke-width: 1.5px`.

## 4. Layout Rules

- Macro padding: `py-24` to `py-32` between sections
- Micro padding: `px-2` to `px-4` inside chrome
- Grid: 12-col at desktop; asymmetric splits preferred (5/7, 4/8)
- One grid-break per page minimum
- `@container` queries for reusable components
````

---

## Template 2: Neo-Editorial

````markdown
# DESIGN.md — Neo-Editorial Archetype

## 1. Visual Strategy
- **Mood**: Sophisticated, archival, high-contrast, print-inspired
- **Audience**: Design-literate readers, editorial brands, premium content
- **Avoid**: Any card component, any pill button, any feature grid, all drop shadows

## 2. Tailwind v4 Theme

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-base-paper:    oklch(0.97 0.02 85);   /* faded parchment */
  --color-base-ink:      oklch(0.18 0.01 60);   /* ink black */
  --color-text-primary:  oklch(0.18 0.01 60);
  --color-text-secondary: oklch(0.45 0.01 60);
  --color-accent-terracotta: oklch(0.55 0.12 45);
  --color-rule: oklch(0.18 0.01 60 / 0.2);      /* 20% ink for rules */

  /* Typography */
  --font-serif: "Ogg", "GT Super Display", "Times New Roman", serif;
  --font-sans:  "Söhne", "Helvetica Neue", system-ui, sans-serif;
  --font-mono:  "Söhne Mono", ui-monospace, monospace;

  /* Type scale (Perfect Fourth, 1.333) */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1.0625rem;    /* body slightly larger for readability */
  --text-lg:   1.417rem;
  --text-xl:   1.889rem;
  --text-2xl:  2.517rem;
  --text-3xl:  3.355rem;
  --text-display: clamp(4rem, 10vw, 9rem);

  /* Spacing (base-8, wider than SaaS) */
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-24: 6rem;
  --spacing-32: 8rem;
  --spacing-48: 12rem;
  --spacing-64: 16rem;       /* editorial breathing */

  /* Motion */
  --ease-slow-fade: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fade:  520ms;
  --duration-hover: 180ms;

  /* Radii — editorial uses sharp corners */
  --radius-none: 0;
  --radius-sm:   2px;
}
```

## 3. Component Patterns

- **Buttons**: NOT traditional buttons. Inline text links with a solid 1px
  bottom border that expands to 2px and underlines on hover. For CTAs, use
  `<a>` with arrow glyph `→` and hover-translate the arrow right by 4px.
- **"Cards"**: Not used. Content blocks separated by full-width horizontal
  rules (`border-bottom: 1px solid var(--color-rule)`) or vertical spacing
  alone.
- **Drop caps**: First paragraph of a section uses CSS `::first-letter`
  with the serif family, 4x size, `float: left`.
- **Pull quotes**: Serif, italic, increased tracking, 50% column width,
  left margin offset.

## 4. Layout Rules

- 12-column classical grid; body text spans max 6 columns (preserves wide margins)
- `max-w-[65ch]` enforced on all body copy blocks
- Images full-bleed to column edges; never rounded
- Section separation: `py-32` minimum, often `py-48`
- Footnotes at right margin on desktop; inline on mobile
````

---

## Choosing a Template

| If the archetype is… | Start from | Key adaptations |
|---|---|---|
| Vercel-Core, Cyberpunk, Retro-Terminal, Industrial | Template 1 | Adjust accent color, font stack |
| Editorial, Academic, High-Fashion | Template 2 | Adjust serif family, spacing scale |
| Neo-Brutalist | Custom | Sharp borders, hard offset shadows, primaries on white |
| Spatial/Glassmorphic, Dreamscape | Custom | Radial gradients + blur backgrounds, light weights |
| Hyper-Minimalist Document | Custom | System fonts only, no tokens beyond spacing scale |
| Organic/Earthy, Tactile | Template 2 with warm palette | Muted earth tokens, humanist sans |

When the archetype has no template, draft one from scratch following the
five-matrix structure: Visual Strategy, Colors, Typography, Component
Patterns, Layout & Motion.
