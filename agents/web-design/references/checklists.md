# The Four Axes — Pass/Fail Checklists

Run each checklist in full before declaring a section done. Every item is
binary (pass or fail). A single fail requires a fix before advancing.

---

## AXIS 1: Typography

| # | Check | Verification | Pass Criteria |
|---|---|---|---|
| 1 | Framework default evasion | Inspect `font-family` CSS vars | No Inter/Roboto/Arial/Space Grotesk as primary |
| 2 | Body line-height | Inspect `line-height` on `<p>` | Between 1.4 and 1.6 |
| 3 | Heading line-height | Inspect `line-height` on `<h1>`–`<h4>` | Between 1.0 and 1.15 |
| 4 | Measure constraint | Inspect body container `max-width` | ≤65 characters (`max-w-[65ch]` or `max-w-prose`) |
| 5 | Dynamic tracking | Inspect `letter-spacing` | Headings −0.02em; all-caps +0.05em |
| 6 | Scale ratio | Verify font-size tokens | Follows defined ratio (Major Third 1.25, Perfect Fourth 1.333, etc.) — not arbitrary px |
| 7 | Contrast compliance | Calculate text/bg contrast | WCAG 2 AA minimum (4.5:1 body, 3:1 large) |
| 8 | Absolute black avoidance | Check text color tokens | No pure `#000000`; use `oklch(0.2 0 0)` or similar |
| 9 | Alignment constraints | Check `text-align` | Left-aligned or purposeful center only; no `justify` |
| 10 | Orphan prevention | Inspect wrapping rules | `text-wrap: balance` on headings; `text-wrap: pretty` on body |
| 11 | Font weight restraint | Count distinct weights | ≤3 weights in active use |
| 12 | System font fallbacks | Review `font-family` stack | Fallbacks include `system-ui, -apple-system, sans-serif` |
| 13 | Tabular numbers | Inspect data tables / metrics | `font-variant-numeric: tabular-nums` on aligned data |
| 14 | Antialiasing optimization | Check global CSS | `-webkit-font-smoothing: antialiased` for dark mode |
| 15 | Ligature management | Inspect code blocks / special UI | `font-variant-ligatures` set intentionally |

**Forcing functions:**
- Primary headline must use a display font NOT in `[Inter, Roboto, Arial, Space Grotesk]`
- Headline `line-height` must not exceed 1.1
- No more than 2 font families across the entire page

**Anti-patterns to reject:**
- 3+ font families
- Ultra-thin body text (<300 weight)
- Justified body text
- Default browser line-height

**5 Concrete Elevation Moves:**
1. Replace standard bullets with custom SVGs, em-dashes, or numbered markers
2. Apply `text-wrap: balance` to all `h1`/`h2` to prevent orphan words
3. Introduce a monospaced font exclusively for micro-copy (timestamps, versions, IDs)
4. Apply optical margin alignment: pull large headings left with negative margin
5. Use opacity (not color change) for secondary text to keep hue family unified

---

## AXIS 2: Color

| # | Check | Verification | Pass Criteria |
|---|---|---|---|
| 1 | OKLCH standardization | Inspect color token definitions | `oklch()` exclusively; no hex/RGB/HSL |
| 2 | Accent scarcity | Measure high-chroma surface area | Exactly 1 accent, <5% of total interface |
| 3 | Neutral tinting | Inspect grayscale tokens | Tinted toward primary brand hue |
| 4 | Dark-mode depth | Verify elevation strategy | Border opacity + lightness shifts; NOT inverted drop shadows |
| 5 | Hover state nuance | Compare base vs hover | Luminosity shifts 5–10%; no jarring hue change |
| 6 | Semantic desaturation | Inspect success/error/warning backgrounds | Heavily desaturated; text remains high-contrast |
| 7 | Value-based contrast | Evaluate palette in grayscale | Interface remains legible and hierarchical on lightness alone |
| 8 | Input distinction | Review `<input>` / `<textarea>` | Distinct bg or subtle border vs page surface |
| 9 | Alpha-channel borders | Inspect border colors | `rgba(…,α)` or `color-mix()` instead of solid hex |
| 10 | Pure color avoidance | Check for maximum-saturation fills | No `oklch(L 1 H)` on large areas |
| 11 | Gradient complexity | Inspect `background-image` gradients | Multi-stop or noise-overlaid; no 2-stop linear |
| 12 | Focus ring prominence | Review `:focus-visible` | High contrast vs element AND background |
| 13 | Text hierarchy via lightness | Compare primary/secondary text tokens | Distinguished by L (e.g., L=0.2 vs L=0.4), not hue |
| 14 | Background stratification | Evaluate layered surfaces | App background distinct from content container |
| 15 | Brand color preservation | Verify primary brand token usage | Reserved for primary actions; not diluted across chrome |

**Forcing functions:**
- Palette must define strictly limited semantic roles: `background`, `surface`, `border`, `text-primary`, `text-secondary`, `accent`. No arbitrary colors may be introduced.
- If using placeholders for form fields: place the label ABOVE the input; do not rely on placeholder as label.

**5 Concrete Elevation Moves:**
1. Replace solid gray borders with `color-mix()` or alpha transparency
2. Overlay noise texture on primary gradients to eliminate banding
3. Map dark-mode surfaces to a strict OKLCH L scale: 0.15 (background) → 0.25 (highest elevated card)
4. Highly saturated, contrasting focus-ring color for `:focus-visible`
5. Tint "white" backgrounds slightly toward brand hue for subliminal presence

---

## AXIS 3: Motion (Kowalski Principles)

| # | Check | Verification | Pass Criteria |
|---|---|---|---|
| 1 | Targeted transitions | Search CSS for `transition: all` | Zero instances |
| 2 | Entry easing | Review modal/popover entries | `ease-out` exclusively |
| 3 | Exit easing | Review dismissal animations | `ease-in` |
| 4 | Duration ceilings | Inspect transition timings | Standard UI <300ms; hovers 100–160ms |
| 5 | High-frequency restraint | Evaluate keyboard-shortcut actions | Zero animation on high-frequency commands |
| 6 | Stagger compression | Measure list-animation delays | 30–80ms between items |
| 7 | Physics interpolation | Review complex/drag animations | Spring physics (e.g., `useSpring`) over linear CSS timing |
| 8 | Purposeful motion | Justify every animation | Provides spatial context, feedback, or explanation |
| 9 | Active-state feedback | Inspect `:active` on interactive | `scale(0.98)` or equivalent tactile shrink |
| 10 | Reduced-motion compliance | Check for `@media (prefers-reduced-motion)` | Non-essential motion disabled |
| 11 | Continuous motion easing | Review loaders/spinners | Linear easing only |
| 12 | Interruptibility | Test mid-flight interrupts | No jank or freeze on new input |
| 13 | Asymmetric timing | Compare hold vs release actions | Deliberate actions slowed; release snappy |
| 14 | Transform-only animation | Check animated properties | Only `transform` and `opacity` |
| 15 | Constrained springs | Evaluate damping/stiffness | No cartoonish bounce in serious UI |

**Forcing functions:**
- NEVER use `ease-in` for UI entries
- All hover-state durations clamped to [100ms, 160ms]
- No animation on `width`, `height`, `margin`, `padding`, `top`, `left`

**5 Concrete Elevation Moves:**
1. Custom drawer/modal ease-out: `cubic-bezier(0.32, 0.72, 0, 1)`
2. `scale(0.97)` on `:active` of primary buttons for tactile press
3. Staggered delays of exactly 40ms for cascading list entries
4. Framer Motion `layoutId` for morphing components between spatial states
5. Slow playback 5x during iteration to manually debug abrupt stops / wrong transform origins

---

## AXIS 4: Space & Composition

| # | Check | Verification | Pass Criteria |
|---|---|---|---|
| 1 | Linear spacing scale | Inspect padding/margin/gap values | Strict base-4 or base-8 (4/8/12/16/24/32/48/64/96/128) |
| 2 | Macro vs micro rhythm | Compare intra-component vs inter-section spacing | Section gaps substantially larger than internal padding |
| 3 | Modern layout primitives | Review container styling | CSS Grid + Flexbox predominantly; rare absolute positioning |
| 4 | Container queries | Check responsive handling | Component shifts via `@container` where possible |
| 5 | Optical alignment | Evaluate circular icons near text | Nudged past strict math to appear optically aligned |
| 6 | Whitespace weaponization | Analyze hero + primary landing areas | Massive breathing padding establishes focus |
| 7 | Hierarchical scaling | Review depth communication | Typography scaling + spacing; NOT just z-index/shadows |
| 8 | Bounding-box minimization | Count explicit borders/card containers | Few; elements align to underlying grid naturally |
| 9 | Intentional asymmetry | Evaluate overall grid | Contains 7/5 or asymmetric splits somewhere |
| 10 | Hit-target optimization | Measure interactive elements | ≥44×44px on touch |
| 11 | Semantic DOM structure | Review HTML tags | `<ul>` contains only `<li>`; labels paired with inputs; landmarks present |
| 12 | Content-driven breakpoints | Analyze responsive shifts | Triggered by content break, not device width |
| 13 | Proximity grouping | Evaluate forms and cards (Gestalt) | Related elements clustered; explicit distance between functional groups |
| 14 | Line-length optimization | Check paragraph widths on ultra-wide | `max-width` prevents uncomfortable stretching |
| 15 | DOM nesting sanity (INP) | Evaluate structure | No deep unnecessary nesting; good INP |

**Forcing functions:**
- Spacing must be pulled from a defined scale. No arbitrary `gap: 17px`.
- Macro gap between sections ≥3× the max internal component padding.
- Containers use `@container` when a component is used in multiple widths.

**5 Concrete Elevation Moves:**
1. Alternate section alignment (left/right/full-bleed) rather than center-stacking
2. Break the grid once per page: one element bleeds out, overlaps, or breaks alignment
3. Use a very small content column (e.g., 5 of 12) for a hero headline to force focus
4. Full-bleed section contrasted against narrow-max-width section for rhythm
5. Remove explicit dividers; rely on `py-32` or more to communicate section boundaries
