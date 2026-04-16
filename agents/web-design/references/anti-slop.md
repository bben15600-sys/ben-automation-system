# Anti-Slop Taxonomy

AI coding agents optimize for mathematically average aesthetics. The output
is immediately identifiable as AI-generated. This taxonomy enumerates the
specific tells and provides the master's replacement for each.

Run this audit after every major section is styled. Any violation requires
a fix before advancing.

---

## Typography

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| Inter / Roboto as primary font | Framework default; signals zero curation | Use Söhne, GT America, Basis Grotesque, Cabinet Grotesk, Geist. If Inter unavoidable, restrict to UI chrome + tight tracking |
| Multiple font families (3+) | Visual chaos from no commitment | Max 2 families. Use weights for hierarchy. |
| Ultra-thin body text (<300) | Illegibility masquerading as elegance | Body weight 400–500. Reserve thin for display only. |
| Default line-height (1.2 or browser default) | Cramped, unstyled feel | Body 1.4–1.6; Headings 1.0–1.15 |
| Full-width body paragraphs on ultra-wide screens | Lines stretch past readability | Constrain to `max-w-[65ch]` |
| `text-align: justify` | Creates "rivers" of whitespace | Left-aligned always; purposeful center rarely |
| Pure `#000000` body text | Retina-searing on white; amateur tell | Use `oklch(0.2 0 0)` or dark slate |

## Color

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| `bg-gradient-to-r from-purple-500 to-blue-500` | 2018 ICO landing page | Solid OKLCH block, or multi-stop radial with noise overlay |
| Hex or HSL color tokens | Perceptual non-uniformity | OKLCH exclusively |
| Equal-saturation palette | Nothing dominates, nothing recedes | One dominant neutral + one accent at <5% surface area |
| Neutral grays (pure) | Brand-less, sterile | Tint neutrals toward brand hue |
| `bg-blue-500` primary CTA | Tailwind default tell | Black, white, or brand-proprietary color |
| Solid `#CCCCCC` borders | Heavy, disconnected | Alpha-transparent borders (`rgba(0,0,0,0.08)`) |
| Placeholder text as primary label | A11y failure + low contrast | Proper `<label>` elements |
| Success = green, error = red, warning = yellow (saturated) | Bootstrap default palette | Heavily desaturated and lightened semantic backgrounds |

## Layout

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| 3-column feature grid with centered SVG icons + titles | Universal Tailwind starter template | Asymmetric bento, alternating left/right horizontal rows, or numbered sections (01, 02, 03) |
| Hero: centered headline + subheadline + 1–2 CTAs | Landing Page template #1 | Off-center, overlapping type layers, or edge-to-edge full-bleed typography |
| Symmetric `max-w-7xl mx-auto` containers everywhere | Math with no rhythm | Intentional asymmetry; 7/5 column splits; edge-bleeding sections |
| Equal padding at every breakpoint (`p-8`) | No hierarchy | `py-32` section padding; `px-2 py-1` utility padding |
| Thick dark `<hr>` dividers between sections | Clutters, prevents breathing | Macro whitespace; optional 1px at 5% opacity |
| All images with identical rounded corners | Template scaffolding | Edge-to-edge bleed in hero; sharp borders if brutalist |
| Centered text everywhere | Lack of typographic conviction | Left-aligned default; center only with purpose |

## Components

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| Floating white cards with `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` | Material Design 2016 | Flatten; rely on spacing + 1px alpha borders |
| `rounded-full` bright primary buttons | Default Tailwind pill | Sharp `rounded-md` or `rounded-none`; high-contrast black/white |
| Gradient CTA buttons | Crypto landing page 2021 | Solid color, 1px inset ring, `scale(0.98)` on active |
| Generic Heroicons/Feather icons at inconsistent weights | Whatever was imported first | Lock a set (Phosphor, Radix); enforce single `stroke-width` |
| Placeholder gray `<img>` boxes | Unstyled template | Real imagery or typographic hero instead |
| Drop-shadowed hover states on every interactive element | Cargo-cult depth | Luminosity shift or `translateY(-1px)` instead |

## Motion

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| `transition: all 0.3s ease-in-out` everywhere | Mushy, delayed, universally wrong | Target specific properties (`transition: transform 150ms ease-out`) |
| `ease-in-out` on entering elements | Slow start feels unresponsive | `ease-out` for entries, `ease-in` for exits |
| 300ms+ durations on hover | Feels sluggish | 100–160ms on hovers |
| Animating `width`, `height`, `margin` | Triggers reflow; jank | Animate `transform` and `opacity` only |
| No `prefers-reduced-motion` handling | A11y failure | Wrap non-essential motion in media query |
| Cartoonish bounce on serious UI | Playfulness mismatched to context | Tight springs; high damping |

## Copy

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| "Unlock your potential" | LLM default marketing | "Ship faster." "Build." "Deploy." |
| "Revolutionize your workflow" | Same | Direct noun-heavy claims |
| "Seamless integration" | Same | "Works with Slack, Linear, GitHub." |
| "Powered by AI" | 2024 boilerplate | Describe the actual mechanism |
| 6th-grade marketing superlatives | Inauthentic | Mechanical precise language; 6th-grade reading level, not 6th-grade vocabulary |

---

## The Audit Command

After styling any section, before declaring it done, answer:

1. Is there a 3-column feature grid? → REWRITE
2. Is the font stack defaulting to Inter / Roboto / Arial / Space Grotesk? → REWRITE
3. Is there `transition: all`? → REWRITE
4. Is there a purple→blue linear gradient? → REWRITE
5. Is every element padded uniformly? → REWRITE
6. Are there white floating cards with drop shadows? → REWRITE

If any answer is yes, the section is unshippable.
