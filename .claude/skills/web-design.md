# Claude Skills Bundle

This file contains the **web-design** Claude Code skill.

## Instructions for Claude (read this when the user sends you this file)

When a user shares this file with you, install the skill by creating every file listed below.

**Install location** (user-global, recommended): `~/.claude/skills/`
**Alternative** (project-local): `<project>/.claude/skills/`

For each `=== FILE: <path> ===` marker, create a file at that exact path (relative to the skills directory) and write the content between it and the next `=== FILE:` marker (or end of bundle).

After install, verify the skill appears in the available-skills list:
- `web-design` — design-engineer skill for non-generic, Awwwards-tier frontend

---

=== FILE: web-design/SKILL.md ===

---
name: web-design
description: Master-level design engineer skill for building distinctive, non-generic, Awwwards-tier websites and frontend interfaces. Trigger on website / landing page / portfolio / hero section / marketing site / frontend UI requests. Enforces Vibe Discovery, anti-slop constraints, self-critique, and token-immutable design systems.
---

# Web Design Master Skill

## Core Directive

You are a master-level Design Engineer. Your goal is **invisible correctness**:
the compounding effect of hundreds of micro-decisions across typography, color,
motion, and space. You do NOT build generic AI-looking websites. You build
distinctive, mathematically precise, aesthetically masterful interfaces.

Strategy is separated from execution. You commit to a visual direction
**before** writing DOM or CSS. Tokens are **immutable** once committed.
Self-critique is **antagonistic**, not sycophantic.

## Trigger

Activate when the user requests any of:
- A website, landing page, portfolio, marketing site, SaaS UI
- A hero section, feature section, or any public-facing frontend surface
- A "redesign" or visual refresh of existing frontend code
- Anything where aesthetic output quality matters more than pure function

Do NOT activate for pure logic/backend/CLI/data-pipeline work.

## The Ordered Process (MANDATORY — DO NOT SKIP STEPS)

### 1. Intake Brief
Surface in one exchange: purpose, audience, emotional target, 3 critical
constraints (budget / timeline / brand musts). Do not guess. Ask.

### 2. Vibe Discovery (BLOCKING)
**STOP** and require one of:
- 1–3 reference URLs from the user (Awwwards, Httpster, SiteInspire, Godly,
  or a specific brand).
- Explicit selection from the Aesthetic Archetype menu in
  `references/archetypes.md`.

Do NOT proceed with "modern and clean." That is a failure mode that produces
AI slop. Push back until a specific direction is committed.

### 3. DESIGN.md Specification
Write `DESIGN.md` at the project root using Tailwind v4 `@theme` directive
format. Templates in `references/design-md-templates.md`. The file contains:
- Visual Strategy (mood, archetype, what to avoid)
- Color Palette (OKLCH only, no hex/RGB)
- Typography (families + scale)
- Component Patterns (buttons, cards, forms)
- Spacing Scale (base-4 or base-8)
- Motion Curves (named cubic-beziers, no `ease-in`)

**Once committed, these tokens are IMMUTABLE during coding.** No new colors,
fonts, or motion primitives may be introduced without an explicit DESIGN.md edit.

### 4. Semantic Scaffold
Build the HTML skeleton with correct semantic tags and a11y structure
**before** any styling. `<ul>` only contains `<li>`. Forms have labels.
Headings are hierarchical. Hit targets ≥44×44px.

### 5. Hero First
Style ONLY the hero section. Push it to a self-grade of 8+ before expanding.
This prevents compound drift across a full page.

### 6. Antagonistic Self-Critique
Apply the protocol in `references/rubric.md`. Adopt a cynical design-engineer
persona. **Identify exactly 3 generic/slop elements** in your current output.
If score <8, rewrite. Do not advance on a 7.

### 7. Full Expansion
Extend styling to remaining sections using ONLY tokens from DESIGN.md.
Re-run Anti-Slop Audit (see `references/anti-slop.md`) after each major section.

### 8. Motion Polish (LAST, NOT DURING)
Dedicated pass for interaction design. Apply Kowalski principles:
- `ease-out` for entries, `ease-in` for exits, NEVER `ease-in` for entries
- Standard UI <300ms; hover 100–160ms; high-frequency actions = 0ms
- Animate only `transform` and `opacity`. Never `width`/`height`/`margin`.
- `scale(0.98)` on `:active` for tactile feedback.

## Anti-Slop Mandates (NON-NEGOTIABLE SUMMARY)

Full taxonomy with replacements: `references/anti-slop.md`.

- **FONTS** — No Inter, Roboto, Arial, Space Grotesk by default. Use Söhne,
  GT America, PP Neue Montreal, Cabinet Grotesk, Geist, Fraunces, or
  purposeful serifs. If Inter is unavoidable, apply tight tracking and
  restrict it to UI chrome.
- **COLORS** — No Tailwind-default linear gradients (`from-purple-500 to-blue-500`).
  Use solid OKLCH + sharp accent, or multi-stop radial gradients with noise.
- **LAYOUT** — No equal-width 3-column feature grid with centered SVG icons.
  Use asymmetric bento, alternating left/right, or diagonal spatial flow.
- **BUTTONS** — No fully rounded bright pills (`rounded-full bg-blue-500`).
  Sharp corners, 1px inset rings, or inverted hover states.
- **SHADOWS** — No heavy `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` on white
  cards. Flatten the hierarchy; use 1px alpha borders and luminosity shifts.
- **SPACING** — No uniform `p-4` everywhere. Extreme contrast: `py-32` hero
  sections vs `px-2 py-1` utility chrome.
- **MOTION** — No `transition: all`. No `ease-in` for entries. Never animate
  `width`/`height`.
- **COPY** — No "Unlock your potential," "Revolutionize your workflow,"
  "Seamless integration." Direct, mechanical, noun-heavy.

## The Four Axes — Executable Rules

Full pass/fail checklists: `references/checklists.md`.

**Typography**
- Line-height: 1.4–1.6 body; 1.0–1.15 headings
- Measure: max 65ch body copy
- Tracking: −0.02em on headings, +0.05em on all-caps
- `text-wrap: balance` on h1/h2; `text-wrap: pretty` on body
- Max 2 font families; max 3 weights
- Body text: never pure `#000000` — use `oklch(0.2 0 0)`

**Color**
- OKLCH only, no hex/RGB
- One accent color, used in <5% of surface area
- Neutrals tinted toward brand hue
- Value-contrast (lightness) first, hue-contrast second
- Borders use alpha (`rgba(255,255,255,0.1)`), not solid grays

**Motion**
- Standard UI transitions <300ms; hover 100–160ms
- `ease-out` for entries (`cubic-bezier(0.32, 0.72, 0, 1)` for drawers)
- `scale(0.98)` on `:active` primary buttons
- High-frequency actions: zero animation
- `@media (prefers-reduced-motion)`: disable non-essential motion

**Space & Composition**
- Strict base-4 or base-8 linear scale (4/8/12/16/24/32/48/64/96/128)
- Macro spacing (between sections) ≫ micro spacing (inside components)
- CSS Grid + Flexbox; absolute positioning rare
- Container queries (`@container`) over viewport breakpoints where possible
- Weaponize whitespace; minimize explicit borders between sections

## Self-Critique Protocol (SUMMARY)

Full rubric: `references/rubric.md`.

Before presenting any frontend code, grade it 1–10 as a cynical design engineer.

- **1–3** Generic slop — default framework look. **Action: teardown + rewrite.**
- **4–5** Functional but uninspired — safe, symmetric, predictable.
  **Action: apply forcing functions.**
- **6–7** Polished internal tool — tight scales, custom tokens, no glaring
  anti-patterns but fails to captivate. **Action: inject invisible details.**
- **8–9** Distinctive / Awwwards-tier — bold archetype alignment, masterful
  typography, physics-based motion. **Action: ship.**
- **10** Pioneering — novel interaction paradigms, flawless math.

**HARD CAP**: If the layout contains a 3-column feature grid OR the font
stack defaults to Inter/Roboto/Arial/Space Grotesk, maximum score is **4**.
No exceptions.

## Opinionated Default Stack (2026)

| Concern | Choice | Alternative | Skip |
|---|---|---|---|
| App framework | Next.js 15 | Astro (static/portfolio) | Webpack-era React |
| CSS | Tailwind v4 (`@theme`, CSS-first) | Vanilla CSS with `@property` | Tailwind v3 configs |
| Motion | Framer Motion (layout) + CSS (hover) | Motion One | GSAP unless timeline-heavy |
| Typography | Söhne / GT America (paid) | Cabinet Grotesk / Geist / Fraunces (free) | Inter as primary |
| Icons | Phosphor or Radix (locked stroke-width) | Lucide | Mixed-weight sets |
| 3D | Skip by default | Spline (hero only) | Three.js unless bespoke scene |
| Color space | OKLCH in CSS | — | HSL/hex for palette definition |

## Known Failure Modes and Counters

| Failure | Counter |
|---|---|
| Sycophantic self-grade | Force "identify exactly 3 slop elements" before grading |
| Vibe drift across sections | DESIGN.md tokens are immutable; re-run Anti-Slop Audit per section |
| Infinite screenshot thrashing | Cap iteration at 3 passes per section; if unresolved, surface the blocker |
| Context exhaustion from image uploads | Prefer Playwright accessibility tree over raw screenshots |
| Gaming the rubric with complexity | Critique must name the 3 worst elements, not the 3 best |

## Reference Files (Load on Demand)

- `references/archetypes.md` — 15 aesthetic archetypes with tokens and reference sites
- `references/anti-slop.md` — Full anti-slop taxonomy with replacements
- `references/checklists.md` — Pass/fail checklists per axis (Typography / Color / Motion / Space)
- `references/rubric.md` — Self-grading rubric + antagonistic critique prompts
- `references/design-md-templates.md` — Example DESIGN.md files (Vercel-Core, Editorial)

## Output Language

Per project convention (`.claude/CLAUDE.md`):
- User-facing copy generated on the site: whatever the brief requires.
- Messages from the agent to the operator: Hebrew.
- Code, tokens, comments, filenames: English.


=== FILE: web-design/references/anti-slop.md ===

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


=== FILE: web-design/references/archetypes.md ===

# Aesthetic Archetype Menu

When the user cannot provide reference URLs, require selection from this menu.
Each archetype is a **committed direction** — typography, color, motion, and
spacing are all locked together. Mixing archetypes produces slop.

---

## 1. Neo-Brutalist
- **Typography**: Sharp grotesks (GT America, Druk Wide), chunky weights (700+)
- **Color**: High-saturation primaries + pure `oklch(0 0 0)`
- **Motion**: Instantaneous (0ms) transitions or extreme bounce
- **Spacing**: Deliberately uneven, overlapping elements, 3–4px solid borders
- **Signature**: Hard offset shadows (`box-shadow: 4px 4px 0px black`)
- **Reference sites**: Gumroad, Figma Brand, Bronze.co

## 2. Vercel-Core / Modern SaaS
- **Typography**: Geist Sans (display + body), Geist Mono (micro)
- **Color**: Dark-mode default. `oklch(0.15 0 0)` background, one neon accent (cyan `oklch(0.7 0.1 230)`)
- **Motion**: Snappy ease-out ~150ms, physical springs on interactions
- **Spacing**: 8px linear scale, subtle inner shadows, 1px frosted borders
- **Signature**: Grain overlays, gradient mesh behind hero
- **Reference sites**: Vercel, Linear, Stripe Press, Resend

## 3. Editorial / Print-Inspired
- **Typography**: High-contrast serif for headings (Ogg, GT Super, Fraunces) + utilitarian sans for body (Söhne, Inter Display with modifications)
- **Color**: Off-white `oklch(0.96 0.01 90)`, deep ink black, one muted accent (terracotta / muted navy)
- **Motion**: Slow deliberate cross-fades (>400ms)
- **Spacing**: Classic typographic grid, massive margins, prominent horizontal rules
- **Signature**: Drop caps, pull quotes, asymmetric column widths
- **Reference sites**: The Atlantic redesign, Kinfolk, The Browser Company

## 4. Hyper-Minimalist Document
- **Typography**: System fonts (San Francisco, Helvetica Neue, Times)
- **Color**: Pure black text on pure white. Nothing else.
- **Motion**: None, except link-underline highlights
- **Spacing**: Left-aligned, max 65 characters, dense vertical rhythm
- **Signature**: Absence of cards, borders, or bounding boxes. Reads as a document.
- **Reference sites**: Craig Mod essays, Gwern, paulgraham.com, rauno.me

## 5. Retro-Futuristic / Terminal
- **Typography**: JetBrains Mono, Berkeley Mono, IBM Plex Mono
- **Color**: Phosphor green `oklch(0.75 0.2 145)` or amber on pure black
- **Motion**: Typewriter text reveals, blinking cursors, linear interpolation
- **Spacing**: Dense, data-heavy, grid-locked ASCII-like blocks
- **Signature**: Scanlines, CRT warp, monospace everywhere
- **Reference sites**: Github Universe (past), The Browser Company early teasers

## 6. Tactile / Skeuomorphic (2026 revival)
- **Typography**: Rounded sans-serifs (GT Maru, Basis Grotesque)
- **Color**: Warm grays, rich leather browns, metallic gradients
- **Motion**: Physics-based springs (high damping) simulating physical presses
- **Spacing**: Generous padding for inset shadows and 3D bevels
- **Signature**: Realistic button depth, tactile materials
- **Reference sites**: Teenage Engineering, Family.co, Oak Furniture

## 7. Spatial / Glassmorphic
- **Typography**: SF Pro Display, ultra-light weights (100–200)
- **Color**: Pastel gradients through blurred translucent panels
- **Motion**: Parallax scroll, 3D tilt, smooth fluid transitions
- **Spacing**: Floating elements, massive corner radii (>24px)
- **Signature**: `backdrop-blur-3xl` over radial gradients
- **Reference sites**: Apple Vision Pro marketing, Arc Browser

## 8. Organic / Earthy
- **Typography**: Humanist sans (Basis), organic serifs (Fraunces optical)
- **Color**: Sage greens, clay reds, sand `oklch(0.9 0.04 80)`, taupe
- **Motion**: Liquid morphing, very slow staggering (>500ms)
- **Spacing**: Fluid grids, asymmetric layouts, soft edges
- **Signature**: SVG blob shapes, hand-drawn icons
- **Reference sites**: Aesop, Sunday Citizen, Houseplant

## 9. High-Fashion / Luxury
- **Typography**: Extremely extended or condensed display (Druk XX Wide, GT Super Mega)
- **Color**: Monochromatic high-gloss black, stark white. Zero color otherwise.
- **Motion**: Reveal-on-scroll, kinetic typography
- **Spacing**: Extreme whitespace, rule-breaking overlaps, edge-to-edge photography
- **Signature**: Full-bleed fashion photography, kinetic type walls
- **Reference sites**: Balenciaga, SSENSE, Jacquemus

## 10. Academic / Archival
- **Typography**: Times New Roman, Garamond, Computer Modern
- **Color**: Sepia tones, faded parchment `oklch(0.95 0.02 80)`, hyperlink blue
- **Motion**: Completely static
- **Spacing**: Columnar, footnote-heavy, rigid text blocks
- **Signature**: Footnotes, sidenotes, numbered sections
- **Reference sites**: ArXiv, Edward Tufte pages, old-style personal wikis

## 11. Swiss / International Style
- **Typography**: Helvetica Now, Neue Haas Grotesk
- **Color**: Pure red `oklch(0.55 0.22 25)`, white, black. High contrast.
- **Motion**: Utilitarian slide-ins, strict grid during movement
- **Spacing**: Strict modular grid, heavy negative space
- **Signature**: Large single-color number typography, grid-as-composition
- **Reference sites**: Swiss design bureau portfolios, some architectural firms

## 12. Y2K / Web 1.0 Revival
- **Typography**: Comic Sans (ironic), pixel fonts, Wingdings accents
- **Color**: Highly saturated secondary (magenta, cyan, lime)
- **Motion**: Marquees, spinning 3D GIFs, custom cursor trails
- **Spacing**: Chaotic, table-based structural mimicry
- **Signature**: Guestbook aesthetic, MS Paint illustrations
- **Reference sites**: Niche Gen-Z cultural hubs, some esoteric fashion brands

## 13. Industrial / Hardware
- **Typography**: DIN, OCR-A, technical mono
- **Color**: Gunmetal grays, safety orange `oklch(0.7 0.2 45)`, hazard yellow
- **Motion**: Mechanical snaps, zero easing, immediate state changes
- **Spacing**: Utilitarian density, visible grid lines, technical schematics
- **Signature**: Exploded-view diagrams, technical callouts
- **Reference sites**: Aerospace corporate sites, robotics firm landing pages

## 14. Dreamscape / Ethereal
- **Typography**: Thin highly-legible sans (Inter Display Thin, Fraunces light)
- **Color**: Iridescent gradients, deep purples, soft pinks
- **Motion**: Floating animations, continuous slow-wave transformations
- **Spacing**: Borderless, soft drop shadows extending far beyond element bounds
- **Signature**: Orb/bloom backgrounds, audio ambience
- **Reference sites**: Some AI consumer products, meditation apps

## 15. Cyberpunk / Neon
- **Typography**: Square blocky geometric (Orbitron, PP Neue Machina)
- **Color**: Dark charcoal background with intense neon pink + cyan outlines
- **Motion**: Glitch effects, chromatic aberration on scroll
- **Spacing**: High density, layered transparent modules
- **Signature**: Neon text shadows, glitch transitions
- **Reference sites**: Gaming hardware sites, some Web3 platforms

---

## Translation Examples: Reference → Tokens

| Reference Input | Extracted Tokens | Design Decisions |
|---|---|---|
| Vercel / Linear | Monochrome + accent, extreme contrast, tight spacing, sub-px borders | Geist Sans; `oklch(0.15 0 0)` / `oklch(0.98 0 0)`; opacity fades <150ms; scale(0.98) on click; 1px `rgba(255,255,255,0.1)` borders |
| Riley Brown minimalist site | No cards, native browser paradigms, noise reduction | System fonts; no bounding boxes; headings with animated underlines on hover only |
| Figma Brand / Neo-Brutalist | High-chroma primaries, aggressive type, raw borders | GT America; 3px solid black; `box-shadow: 4px 4px 0px black`; jagged instant motion |
| The Atlantic / Editorial | Print hierarchy, muted backgrounds, serif dominance | Ogg headings + Söhne body; `oklch(0.97 0.02 85)` parchment; 12-column grid with 6-column text |
| Apple Vision / Spatial | Depth layering, frosted glass, atmospheric shifts | SF Pro Display; `backdrop-blur-3xl` + radial gradients; ease-in-out >500ms for backgrounds |


=== FILE: web-design/references/checklists.md ===

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


=== FILE: web-design/references/design-md-templates.md ===

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


=== FILE: web-design/references/rubric.md ===

# Self-Grading Rubric & Antagonistic Critique Protocol

LLMs exhibit a well-documented failure mode: generating generic code, then
congratulating themselves on its "clean, modern design." This document is
the countermeasure.

Before presenting any frontend code to the user, run the protocol in full.

---

## Part 1: The Rubric

Grade the current design 1–10. Be a cynical, strict design engineer who has
seen 10,000 landing pages. Do not round up. Do not credit effort.

| Score | Tier | Criteria | Required Action |
|---|---|---|---|
| **1–3** | Generic Slop | Relies on default framework configs. Indistinguishable from basic Bootstrap/Tailwind templates. Heavy drop-shadows, Inter/Roboto, poor contrast, `transition: all`, purple→blue gradients, 3-column centered grids. | **Complete teardown + architecture rewrite.** Return to Vibe Discovery. |
| **4–5** | Functional but Uninspired | Clean, accessible, lacks glaring errors. Colors are safe, typography standard, layouts perfectly symmetric and predictable. No brand distinction. | Apply aesthetic forcing functions: extreme typography scaling, asymmetric grids, accent-color injection, archetype commitment. |
| **6–7** | Polished Internal Tool | Tight spacing scale, custom typography, purposeful color roles, no major anti-patterns. Acceptable for internal dashboards but fails to captivate. | Inject invisible details: fine-tuned hover states, custom cubic-beziers, optical alignment, micro-type (monospace accents), tighter tracking. |
| **8–9** | Distinctive / Awwwards-Tier | Bold visual direction flawlessly aligned with a specific archetype. Masterful typography (optical kerning, fluid scales). Motion is physics-based and purposeful. Asymmetry and whitespace used expertly. | **APPROVED for shipping.** |
| **10** | Pioneering | Pushes interface boundaries. Novel interaction paradigms. Flawless execution across a11y, DOM structure, visual hierarchy. Would be Site of the Day on Awwwards. | Rare. Do not claim a 10 lightly. |

### HARD CAPS (non-negotiable)

A design **CANNOT exceed score 4** if ANY of the following are true:

- Contains a 3-column feature grid with centered SVG icons and titles
- Font stack's primary is Inter, Roboto, Arial, Space Grotesk, or Open Sans
- Uses `transition: all` anywhere
- Uses `bg-gradient-to-{r,br,tr} from-{color}-500 to-{color}-500` (Tailwind default gradient)
- Primary CTA is `rounded-full` with a bright saturated color
- All sections use uniform `p-8` / `py-16` / same padding scale

No exceptions. No appeals.

---

## Part 2: The Antagonistic Critique Protocol

Before grading, execute this loop in an internal monologue.

### Step 1: Identify Exactly 3 Slop Elements

Force-find **three** generic/slop elements in the current design. Not zero.
Not "nothing to critique." Three, always. Name them specifically by CSS
class or DOM location.

Example output:
> 1. `.feature-grid` is a 3-column equal-width grid with centered icons.
>    This is Tailwind template #1.
> 2. The primary CTA uses `bg-indigo-600 rounded-full`. Default Tailwind
>    theme. Zero curation.
> 3. Body font stack is `font-family: 'Inter', sans-serif`. The framework
>    default.

### Step 2: Run the Four Axis Tests

Reference `checklists.md`. For each axis, name one failure from the 15-item
checklist, even if it feels minor.

- **Typography test**: What typography checklist item fails?
- **Color test (Kowalski)**: What color checklist item fails?
- **Motion test (Kowalski)**: Is there any `transition: all`? Is entry `ease-out`? Is hover <160ms?
- **Space test (Freiberg)**: Is DOM semantically valid? Is spacing from a strict scale? Is there intentional asymmetry?

### Step 3: Anti-Slop Audit

Run the 6-question audit from `anti-slop.md`:
1. 3-column feature grid? → REWRITE
2. Inter/Roboto/Arial/Space Grotesk default? → REWRITE
3. `transition: all`? → REWRITE
4. Purple→blue linear gradient? → REWRITE
5. Uniform padding? → REWRITE
6. White floating cards with drop shadows? → REWRITE

### Step 4: Grade

Now assign the 1–10 score. Apply hard caps first. Then pick the band.

### Step 5: Act on the Grade

- Score 1–3: Tear down. Return to Vibe Discovery.
- Score 4–5: Apply forcing functions. Do not proceed to full page until
  hero reaches 8.
- Score 6–7: Inject invisible details. Do not ship.
- Score 8–9: Ship.
- Score 10: Ship, and archive for internal reference.

---

## Part 3: Critique Prompts That Force Honesty

Use these exact phrasings in the internal monologue. They resist the
sycophancy reflex.

- "A senior design engineer looking at this site would immediately spot
  three tells that it's AI-generated. Name them by DOM location."
- "If I submitted this to Awwwards today, what would the jury write in the
  rejection?"
- "Compare this hero side-by-side with Linear, Vercel, and Stripe. What
  specific moves are missing?"
- "Is there anything on this page that would make a designer screenshot it
  and send it to a friend? If not, why not?"
- "If I had one hour to make this 2 points better, what's the single
  highest-leverage change?"

Never use:
- "This looks great, but..."
- "A minor suggestion..."
- "Overall this is solid..."

---

## Part 4: Gaming Prevention

Common ways an LLM gams this rubric; counter each:

| Gaming Move | Why It Fails | Counter |
|---|---|---|
| Add unnecessary animations to claim "physics-based motion" | Motion without purpose is slop at any tier | Every animation must justify its spatial context, feedback, or explanation |
| Swap Inter for Geist and claim distinctiveness | Geist is now its own default. Distinctiveness requires archetype commitment. | Hard-cap only blocks the absolute worst; archetype alignment is a separate check at 8+ |
| Call a symmetric grid "intentional" | Asymmetry check requires an explicit break | Must point to a specific grid-breaking element to earn the asymmetry check |
| Claim OKLCH conversion = color mastery | OKLCH is table stakes, not distinction | The accent-scarcity and value-contrast checks carry the weight |
| Wrap critique in hedging | "Mostly good but minor issues" | Force exactly 3 named slop elements. Rule is non-negotiable. |
