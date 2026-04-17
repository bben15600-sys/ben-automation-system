# Claude Skills Bundle

This file contains two complete Claude Code skills: **web-design** and **skill-builder**.

## Instructions for Claude (read this when the user sends you this file)

When a user shares this file with you, install both skills by creating every file listed below.

**Install location** (user-global, recommended): `~/.claude/skills/`
**Alternative** (project-local): `<project>/.claude/skills/`

For each `=== FILE: <path> ===` marker, create a file at that exact path (relative to the skills directory) and write the content between it and the next `=== FILE:` marker (or end of bundle).

After install, verify both skills appear in the available-skills list:
- `web-design` — design-engineer skill for non-generic, Awwwards-tier frontend
- `skill-builder` — meta-skill for building new skills via 8-step methodology

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


=== FILE: skill-builder/SKILL.md ===

---
name: skill-builder
description: Meta-skill for building new Claude Code skills. Trigger when the user asks to "build a skill", "create a skill for X", "I want a skill that...", or "design a skill to prevent Y". Enforces the 8-step research-driven methodology (Intake → Landscape → Gaps → Deep Research Prompt → Seed → Merge → Structure → Anti-Gaming Audit) that produces skills which FORCE quality behavior rather than merely suggest it.
---

# Skill Builder (Meta-Skill)

## Core Directive

You build skills that **FORCE quality behavior**, not skills that suggest it.
A good skill is a **constraint**, not a helper. It uses hard caps, forced
choices, binary checks, and anti-gaming prevention to keep Claude from
defaulting to average output in the target domain.

A skill that can be "gamed" by cosmetic compliance is a failed skill. A
skill without forced-choice mechanisms degrades to "modern and clean"
sycophancy. A skill without binary pass/fail checks leaves quality to
Claude's mood.

Every skill you build must pass the **Anti-Gaming Audit** in `references/checklists.md`
before shipping.

## Trigger

Activate when the user asks any variation of:
- "Build a skill that does X"
- "Create a skill for [domain]"
- "I want a skill to prevent [failure mode]"
- "Make me a skill that forces [quality behavior]"
- "Design a meta-skill / agent instruction for Y"

Do NOT activate for:
- Editing an existing skill (use direct file edits)
- Writing documentation or prose (different task)
- Building a Notion-data agent with a simple `Instructions → Data Sources`
  shape (those are simpler; use `agents/daily-brief/SKILL.md` as a template
  directly, without this meta-skill's full weight)

## The Ordered Process (MANDATORY — DO NOT SKIP STEPS)

### 1. Domain Intake (BLOCKING)

Surface in one exchange:
- **Target domain**: What specific output does this skill govern? (e.g.,
  web design, code review, SQL queries, email drafts, presentation slides).
- **Failure mode being prevented**: What does Claude do WRONG in this
  domain by default? (e.g., "generic AI slop aesthetics", "verbose code
  comments", "hedging analysis").
- **Quality target**: What does "shippable" look like in this domain?
  (e.g., "Awwwards-tier", "production-ready PR", "executive-brief quality").
- **Trigger keywords**: When should the skill auto-activate?

Do NOT proceed on vague domain definitions. Push back until specific.

### 2. Landscape Research

Run web searches to map the existing landscape. Search for:
- Existing Claude Code / Claude Agent / LLM-focused skills in this domain
- Anti-pattern / "AI slop" writing specific to this domain
- Expert practitioner methodologies (who are the domain authorities?)
- YouTube / conference talks / engineering blogs on the topic

Summarize findings in ~150 words: what recurring patterns exist, what
authorities agree on, what's controversial.

**Before moving on, name 3 existing solutions and what they miss.**

### 3. Gap Identification

List the specific gaps the upcoming Deep Research must close. These
typically include:
- Missing forced-choice menus (archetypes / categories / modes)
- Missing operational mechanics (the "how", not the "what")
- Missing score/grade criteria (especially for top and bottom tiers)
- Missing anti-gaming counters
- Missing domain-specific taxonomies

Write these gaps down. They become the skeleton of the Deep Research prompt.

### 4. Deep Research Prompt Drafting

Write a structured prompt for external Deep Research (Gemini / ChatGPT Deep
Research / Claude's Research mode) using the 10-section template in
`references/deep-research-template.md` (sections A–J). The prompt must:
- State what the research is for (building a SKILL.md)
- Name the gaps explicitly (one section per gap)
- Demand operational, copy-pasteable material (not explanations)
- Require a final "Direct Inputs for SKILL.md" section
- Prioritize YouTube videos / conference talks / GitHub repos / expert blogs

Hand the prompt to the user. WAIT for the research output. Do not invent.

### 5. Seed Capture (BLOCKING)

Before or after research, the user provides their **non-negotiables** —
the hard rules, forced choices, and opinionated commitments they want
baked into the skill regardless of what research says. These typically
take the form:
- Anti-slop mandates ("NEVER use X; always Y")
- Rubric hard caps ("If condition X, max score 4")
- Workflow gates ("Stop and ask before Y")
- Opinionated defaults (specific tools, libraries, rules)

Save the seed as `agents/<skill-name>/SKILL.seed.md` immediately so it is
preserved regardless of what happens with the research.

### 6. Merge

When both research output and seed are available, merge them:
- **Keep the user's seed as the spine** — their non-negotiables stay verbatim
- **Enrich with research findings** — fill the gaps, don't override opinions
- **Resolve conflicts in favor of the seed** — the user's constraints win
- **Apply the anti-gaming audit** to everything added from research

### 7. Structure

Produce exactly this directory structure:

```
agents/<skill-name>/
├── SKILL.md                 (lean, operational; trigger + workflow + summaries + hard caps)
└── references/              (detailed material, loaded on demand)
    ├── <domain>-archetypes.md      (forced-choice menu for domain)
    ├── anti-slop.md                (domain-specific anti-pattern taxonomy)
    ├── checklists.md               (binary pass/fail per axis)
    ├── rubric.md                   (1-10 grade + hard caps + anti-gaming)
    └── <domain>-templates.md       (starter artifacts for the domain)
```

Scaffolds for `SKILL.md` and each reference file are in
`references/skill-md-templates.md`.

**Size discipline**: `SKILL.md` should stay under 10KB. Push detail into
references. Every line in `SKILL.md` must either configure behavior or
point to detailed reference material.

### 8. Anti-Gaming Audit (FINAL BLOCKING GATE)

Before declaring the skill ready, run `references/checklists.md` against
the skill you just built. ALL items must pass. If any item fails, fix
before shipping.

Then self-grade the skill itself using `references/rubric.md`. If <8,
rewrite. Do NOT ship a skill that merely suggests quality.

Finally, remove `SKILL.seed.md`. Its content has been absorbed.

## Anti-Slop Mandates for Skill Design (SUMMARY)

Full taxonomy: `references/anti-slop.md`.

- **REJECT vague directives** — No "be creative", "think carefully", "consider X".
  Use "MUST", "NEVER", "EXACTLY ONE OF".
- **REJECT soft checklists** — Binary pass/fail only. No "try to ensure".
- **REJECT rubrics without hard caps** — Every rubric must have at least
  one HARD CAP that blocks high scores under specific conditions.
- **REJECT workflows without blocking gates** — Sequential steps must have
  explicit "STOP and require X" gates.
- **REJECT best-practices lists** — Turn every "best practice" into either
  a forced choice, a hard constraint, or a checklist item.
- **REJECT "AI-generated" tone** — No "comprehensive", "robust", "seamless",
  "leverage", "utilize". Use direct mechanical language.
- **REJECT skills that only list the good examples** — Every domain needs
  an anti-slop taxonomy listing what the AI does WRONG by default.
- **REJECT rubrics without a gaming-prevention section** — LLMs will game
  any rubric. The rubric must name and block specific gaming moves.

## The Four Axes of a Good Skill (SUMMARY)

Full checklists: `references/checklists.md`.

**Forcing Functions**
- At least one BLOCKING gate in the workflow ("STOP and require…")
- At least one FORCED CHOICE menu (archetypes, modes, categories)
- No open-ended "be thoughtful" directives

**Hard Caps**
- Rubric has ≥1 condition that caps max score below perfect
- Trigger list is explicit (not "when relevant")
- Output size / shape is bounded (not "as long as needed")

**Binary Checks**
- Every checklist item is pass/fail, not "try to…"
- Anti-slop taxonomy has concrete replacements, not just prohibitions
- DOM / artifact verification is mechanical (grep-able, measurable)

**Anti-Gaming**
- Rubric has a "gaming prevention" section naming specific cheats
- Self-critique protocol forces negative statements ("name 3 flaws") before positive
- Hard caps cannot be argued around ("no exceptions, no appeals")

## Self-Critique Protocol for Skills

Full rubric: `references/rubric.md`.

Before shipping any skill, grade it 1–10 as a cynical skill engineer.

- **1–3** Suggestion, not constraint. Reads like a "best practices" doc.
  **Action: rewrite with forcing functions and hard caps.**
- **4–5** Has some rules but gameable. Missing anti-slop taxonomy or hard caps.
  **Action: inject binary checks and gaming prevention.**
- **6–7** Solid structure but lacks domain-specific rigor (generic checklists,
  no archetype menu). **Action: deepen the domain-specific rigor.**
- **8–9** Forces quality behavior. Has archetype menu, anti-slop taxonomy,
  binary checks, hard-capped rubric, anti-gaming. **Action: ship.**
- **10** A skill that measurably changes Claude's output in the target
  domain under adversarial conditions.

**HARD CAP**: If the skill lacks any of the following, max score is **4**.
No exceptions.
- Hard caps in its rubric
- A forced-choice menu (archetypes / modes / categories)
- A binary pass/fail checklist
- An anti-slop or anti-pattern taxonomy
- An anti-gaming section

## Default Artifacts and Conventions

| Concern | Choice |
|---|---|
| Directory | `agents/<skill-name>/` |
| Main file | `SKILL.md` with YAML frontmatter (`name`, `description`) |
| Reference dir | `references/` |
| Seed file (temp) | `SKILL.seed.md` — deleted after merge |
| Size cap (main) | ≤10KB; push detail to references |
| Size cap (reference) | ≤15KB each; split if larger |
| Language (agent-facing) | English |
| Language (user-facing output generated BY the skill) | Per project convention (Hebrew for this repo's user-facing messages) |
| Frontmatter format | `name` + `description` with explicit trigger phrases |

## Known Failure Modes and Counters

| Failure | Counter |
|---|---|
| Skill reads like a blog post | Ordered BLOCKING workflow with STOP gates |
| Rubric is sycophantic (everything scores 8+) | Hard caps + "identify 3 flaws" protocol |
| Vague directives ("be thoughtful") | Anti-slop taxonomy with concrete replacements |
| Research output absorbed without filtering | Seed is spine; research fills gaps only |
| Skill file exceeds context budget | Split into `SKILL.md` (lean) + `references/` (on-demand) |
| Skill is domain-agnostic mush | Require forced-choice menu specific to domain |
| User provides vague domain | Block at Step 1 until domain + failure mode + quality target are specific |

## Reference Files (Load on Demand)

- `references/skill-archetypes.md` — 6 skill archetypes with when-to-use guidance
- `references/anti-slop.md` — Skill-design anti-patterns with replacements
- `references/checklists.md` — Binary pass/fail across 4 axes (Forcing / Caps / Checks / Anti-Gaming)
- `references/rubric.md` — 1-10 grade with hard caps and gaming prevention
- `references/deep-research-template.md` — The A–J structured prompt template
- `references/skill-md-templates.md` — SKILL.md and reference-file scaffolds

## Output Language

Per project convention (`.claude/CLAUDE.md`):
- Agent operator messages: Hebrew.
- SKILL.md content and code: English.
- User-facing output generated BY the skill being built: configurable per domain.


=== FILE: skill-builder/references/anti-slop.md ===

# Skill-Design Anti-Slop Taxonomy

The AI-slop problem applies recursively: when Claude writes a skill, it
defaults to producing a skill that READS like a best-practices document
rather than one that FORCES quality.

Run this audit on every skill before shipping. Each tell has a concrete
replacement.

---

## Directive Language

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| "Be creative and think carefully about X" | Unenforceable. LLM interprets as "continue defaulting." | "STOP. Before writing, select EXACTLY ONE of [list]." |
| "Consider X, Y, and Z" | Optional. Claude will skip. | "MUST check X, Y, Z before shipping. Any failure blocks output." |
| "Use best practices for [domain]" | Trains on statistical average = AI slop | Enumerate the specific practices as binary checks |
| "Ensure the output is high quality" | Quality unenforced | Define "quality" with a 1-10 rubric with hard caps |
| "Try to avoid [pattern]" | Soft prohibition | "NEVER use [pattern]. If present, rewrite." |
| "Feel free to adapt as needed" | Opens the anti-slop escape hatch | "Adapt only along axes [list]. All other parameters are frozen." |
| "Follow the conventions of [X]" | Vague | Quote the actual conventions inline or link to the specific file |

## Rubric Design

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| 1–10 rubric with no hard caps | LLM will self-grade 8 on generic output | At least one HARD CAP: "If X present, max score 4" |
| Bands described in adjectives ("polished", "refined") | Unmeasurable | Bands described in CONCRETE CONSTRAINTS present in output |
| No required action per score band | Sycophancy — "7 is fine" | Every band has an explicit "Action:" that forces iteration |
| Grading prompt is "evaluate your work" | Yields positive hedges | Grading prompt is "identify EXACTLY 3 flaws first" |
| No gaming-prevention section | LLMs game every rubric | Name specific gaming moves and counter each |
| Single top tier ("10 = excellent") | Ceiling is ambiguous | Define what makes 10 vs 9 with concrete differentiator |

## Workflow Design

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| Bulleted list of steps ("Consider doing A, B, C") | Not sequenced; Claude picks order | Numbered ordered process with blocking gates |
| No BLOCKING gates | Claude rushes to output | At least one "STOP and require [specific input]" gate |
| All steps are suggestions | No commitment points | At least one step produces an IMMUTABLE artifact (tokens, archetype choice, etc.) |
| Generic "iterate until satisfied" | Infinite loop risk | Explicit convergence rule: "Max 3 iterations; if unresolved, surface blocker" |
| No explicit handoff/output format | Output drifts | Each step specifies its exact deliverable |

## Checklist Design

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| "Ensure [quality]" items | Unmeasurable | Binary pass/fail with verification method |
| No verification method | Invisible to audit | Every item: "Check X by method Y; pass if Z" |
| Items spanning multiple axes | Ambiguous | One axis per checklist; one concern per item |
| Nested "try to also consider…" items | Soft items | Flat binary items. If it's not binary, it's not in the list. |
| Subjective items ("looks clean") | Sycophancy magnet | Replace with mechanical property check (e.g., "≤3 font weights used") |

## Trigger Design

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| "Activate when appropriate" | Never / always | Enumerated list of trigger phrases or keywords |
| "Any frontend task" | Too broad | Specific verbs + artifact types ("build a landing page", "design a hero section") |
| No negative cases | Over-activation | Explicit "Do NOT activate for X, Y" block |
| Matches on domain name alone | Keyword collisions | Trigger requires verb + object + domain signal |

## Structure & Size

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| Single giant SKILL.md | Exhausts context, unreadable | Split: lean SKILL.md + detailed references/ loaded on demand |
| No frontmatter | Skills system cannot parse | YAML frontmatter with `name` and `description` (with triggers inline) |
| Bullet-heavy prose | Reads like a blog post | Tables, numbered steps, code blocks, explicit headers |
| Examples without counter-examples | One-sided | Every example paired with its anti-pattern |
| Reference files duplicate SKILL.md | Token waste | References extend; SKILL.md points |

## Copy / Voice in the Skill Itself

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| "comprehensive", "robust", "seamless", "leverage", "utilize", "delve", "robust" | LLM-marketing tell | Direct verbs: "use", "check", "reject", "rewrite" |
| "As an AI assistant, you should…" | Meta-commentary | Imperative: "You MUST…" |
| Hedging ("generally", "typically", "often") | Escape hatches | Absolute where the rule is absolute; specific where conditional |
| "Remember to…" | Soft reminder | "Before shipping: [checklist]" |
| Emoji in the skill | Professional tell | None, unless the skill is explicitly for playful content |

## Anti-Gaming Prevention

| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| No gaming-prevention section | LLMs game every constraint | Section listing specific cheats and counters |
| Rubric rewards adding features | Complexity as cheat | Rubric rewards SUBTRACTING slop elements |
| "Pick any of the following" | Minimum compliance | "You must commit to exactly one [list]; state the choice before proceeding" |
| Self-report without verification | Claude claims compliance | Require concrete artifact (file path, line number, specific string) as proof |

---

## The Skill Audit Command

After writing any skill, answer these. Any "yes" requires fix before shipping.

1. Is there any directive using "consider", "try to", "be thoughtful"? → REWRITE
2. Does the rubric lack at least one HARD CAP? → REWRITE
3. Is there a checklist item that isn't binary pass/fail? → REWRITE
4. Is there a workflow step without a clear deliverable? → REWRITE
5. Is the trigger description vague or missing negative cases? → REWRITE
6. Does the skill lack an anti-gaming section? → REWRITE
7. Is there any use of "comprehensive", "robust", "seamless", "leverage"? → REWRITE
8. Does SKILL.md exceed 10KB? → Split into references/.
9. Are there examples without counter-examples? → Add counter-examples.
10. Does the skill lack a forced-choice menu? (Only exempt for Data-Pipeline archetype.) → REWRITE

If any answer is yes, the skill is unshippable.


=== FILE: skill-builder/references/checklists.md ===

# Skill-Quality Checklists — Binary Pass/Fail

Run every checklist in full before declaring a skill ready. One fail
blocks shipping.

Data-Pipeline skills are exempted from Axis 1 (Forcing Functions) and
Axis 4 (Anti-Gaming) — their correctness is deterministic, not aesthetic.
All other archetypes must pass all four axes.

---

## AXIS 1: Forcing Functions

| # | Check | Verification | Pass Criteria |
|---|---|---|---|
| 1 | Trigger specificity | Read the `description` in frontmatter | Explicit trigger phrases or keywords; not "when relevant" |
| 2 | Trigger negative cases | Read SKILL.md Trigger section | Contains "Do NOT activate for…" with ≥2 examples |
| 3 | Core Directive commitment | Read Core Directive | Uses absolute language ("MUST", "NEVER", "EXACTLY") — no "consider" / "try to" |
| 4 | Blocking gate present | Scan workflow for BLOCKING markers | ≥1 step explicitly labeled BLOCKING with stop-and-require input |
| 5 | Forced-choice menu | Check for archetype / mode / category selection | Menu exists OR domain explicitly doesn't need one (Data-Pipeline only) |
| 6 | Immutable artifact | Workflow produces at least one token-locked file | Artifact named + "immutable during coding" rule stated |
| 7 | Ordered process | Check workflow structure | Numbered steps 1..N, not bulleted suggestions |
| 8 | Per-step deliverable | Each step specifies output | Every step names its concrete deliverable |
| 9 | Convergence rule | Check iteration logic | Explicit cap (e.g., "max 3 iterations") or escalation path |
| 10 | Absolute ban phrases | Grep SKILL.md for soft-language | No "consider", "try to", "be thoughtful", "ensure you", "feel free" |

## AXIS 2: Hard Caps

| # | Check | Verification | Pass Criteria |
|---|---|---|---|
| 1 | Rubric has hard cap | Read rubric file | ≥1 condition that caps max score below perfect with "no exceptions" |
| 2 | Hard cap is mechanical | Check hard cap phrasing | Trigger condition is grep-able / measurable, not subjective |
| 3 | Hard cap blocks the specific failure mode | Cross-reference rubric vs domain failure mode from Intake | Hard cap directly blocks the domain's #1 AI-slop pattern |
| 4 | Every rubric band has required action | Read rubric bands | Every band 1–9 has explicit "Action:" field |
| 5 | Top tier differentiator | Compare 8–9 vs 10 criteria | Concrete differentiator stated (not "even better") |
| 6 | Size cap on SKILL.md | Check file size | ≤10KB |
| 7 | Size cap on reference files | Check each reference file | ≤15KB each; split if larger |
| 8 | Trigger list bounded | Count trigger keywords | 3–10 specific triggers; not "any X" |

## AXIS 3: Binary Checks

| # | Check | Verification | Pass Criteria |
|---|---|---|---|
| 1 | Checklist items are binary | Read each checklist item | Every item has pass/fail criteria (not "try to…") |
| 2 | Verification method stated | Check each checklist item | Method is mechanical (grep, count, measure), not "feels right" |
| 3 | Anti-slop taxonomy has replacements | Read anti-slop.md | Every "Generic Default" has a concrete "Better Move" column |
| 4 | Anti-slop items are categorized | Check taxonomy structure | Grouped by axis/type, not one giant list |
| 5 | Audit command exists | Anti-slop ends with yes/no audit | Present at end of anti-slop file with explicit "REWRITE" actions |
| 6 | No subjective checklist items | Search for "looks", "feels", "seems", "appears" | None present as checklist criteria |
| 7 | Every example paired with counter-example | Review examples | Good example always next to bad example |

## AXIS 4: Anti-Gaming

| # | Check | Verification | Pass Criteria |
|---|---|---|---|
| 1 | Gaming-prevention section | Read rubric | Named section listing specific cheats + counters |
| 2 | Forces negative statements first | Check self-critique protocol | Protocol requires "identify EXACTLY 3 flaws" before grading |
| 3 | Hard caps are unarguable | Read hard cap phrasing | Contains "no exceptions, no appeals" or equivalent finality |
| 4 | Rewards subtraction | Check rubric logic | Rubric rewards removing slop, not adding features |
| 5 | Compliance requires proof | Check self-report mechanism | Requires concrete artifact (file path, line number, string) as evidence |
| 6 | Known failure modes documented | Check SKILL.md | Table of failure modes + counters present |
| 7 | Sycophancy blockers | Check for hedging patterns | Rubric forbids "mostly good but minor…" and "overall solid but…" phrasings |

---

## The Final Shipping Gate

Before marking a skill as ready, answer all:

1. Does the skill pass all four axis checklists above? → If no: REWRITE
2. Did you grade the skill using `rubric.md` and score ≥8? → If no: REWRITE
3. Did you run the anti-slop audit at the bottom of `anti-slop.md` with zero fails? → If no: REWRITE
4. Does the skill's `description` (frontmatter) enable auto-activation on the target triggers? → If no: FIX
5. Is `SKILL.md` under 10KB and every reference file under 15KB? → If no: SPLIT
6. Has `SKILL.seed.md` been removed after the merge? → If no: REMOVE

If any answer is no, the skill is unshippable.

---

## Test Case: Adversarial Invocation

Before final shipping, simulate an adversarial invocation:

> Imagine Claude is invoked with this skill and a vague, low-effort user
> prompt like "build me a nice [domain] thing, make it look good." Does
> the skill still force rigorous output? Or does it degrade to generic AI
> slop?

If the skill degrades under a lazy prompt, it has failed. Strengthen the
BLOCKING gates until the skill refuses to proceed without specific input.


=== FILE: skill-builder/references/deep-research-template.md ===

# Deep Research Prompt Template (Sections A–J)

Use this template at Step 4 of the skill-building workflow. Adapt the
square-bracketed placeholders to the target domain, preserve the
10-section structure, and keep the "Direct Inputs for SKILL.md" closing
requirement verbatim.

The template is designed to be pasted into Gemini Deep Research, ChatGPT
Deep Research, or Claude's Research mode. Target length of the returned
document: thorough, not padded.

---

## The Template (Copy, Fill Brackets, Paste)

````
# Deep Research Request: Building a "[DOMAIN] Master" Skill for Claude Code

## Context & Purpose
I am building a SKILL.md file (Anthropic Agent Skill format) for Claude Code
whose purpose is to transform Claude from a technically-correct but [FAILURE
MODE IN THIS DOMAIN] into a practitioner capable of producing [QUALITY
TARGET: e.g., "Awwwards-tier", "production-PR-quality", "executive-brief-
worthy"] [ARTIFACT TYPE: e.g., "websites", "code reviews", "decisions"].
The skill will be invoked whenever Claude Code is asked to [TRIGGER
CONDITION].

I have already completed initial web research and identified the high-level
landscape ([LIST 5-8 THINGS YOU ALREADY KNOW]). Do NOT spend effort
re-establishing these basics. I need you to go DEEPER and return
operational, copy-pasteable material.

## Primary Source Requirements (IMPORTANT)
Prioritize and EXPLICITLY include findings from:
1. YouTube videos from 2025-2026 about [DOMAIN] + Claude Code / AI-assisted
   [DOMAIN WORKFLOW] (transcripts, demonstrated workflows, before/after
   examples). Search creators like: [LIST 5-10 RELEVANT CREATORS].
2. The actual source of any existing Claude Code / Agent Skills related
   to [DOMAIN] on GitHub — quote their exact operational instructions.
3. Expert practitioner writing from: [LIST 5-10 DOMAIN AUTHORITIES].
4. [DOMAIN-SPECIFIC AUTHORITATIVE SOURCES: e.g., Awwwards for web, HN
   best-of for engineering, Stratechery for business, etc.].

For each YouTube video cited, include: creator, title, URL, publication
date, and the 2-5 most important actionable takeaways demonstrated in the
video (not just described). Prefer videos that show real screen recordings
or workflow demonstrations, not tutorials about "how to prompt AI."

## Specific Gaps to Close (these are the research questions)

### A. [FORCED-CHOICE MENU NAME] — operational mechanics
- What is the exact step-by-step process top practitioners use to commit
  to a direction BEFORE executing in this domain?
- How many reference inputs do they gather, from where, and how are
  references translated into concrete [DOMAIN-SPECIFIC TOKENS/CRITERIA]?
- Provide 3-5 fully worked examples: reference input → extracted criteria
  → resulting decisions.
- What are the 10-15 most useful "[ARCHETYPES/MODES/CATEGORIES]" to offer
  as menu choices? For each, give: defining characteristics, 3-5 concrete
  markers, canonical reference examples.

### B. Anti-Slop Taxonomy
- Compile a comprehensive, categorized list of the specific defaults
  Claude (and similar AI tools) fall into that mark [DOMAIN OUTPUT] as
  AI-generated.
- Format as a table: "Generic Default" | "Why It's a Tell" | "Better Move".
- Categories must include at minimum: [4-6 DOMAIN-SPECIFIC AXES].

### C. The [N] Axes — Executable Checklists
For each axis of [DOMAIN], provide:
- A 10-15 item checklist Claude can literally run through before declaring
  work done (pass/fail items).
- Specific "forcing functions" — concrete, measurable constraints.
- Anti-patterns to reject.
- 5 concrete "moves" that consistently elevate the work on that axis.

### D. Self-Grading Rubric
- The exact rubric that lets Claude grade its own output on a 1-10 scale
  with concrete criteria for each score band.
- HARD CAPS that block high scores under specific conditions.
- How to structure the self-critique loop: what questions in what order,
  how many iterations before shipping.
- Examples of prompts that force honest self-criticism rather than
  congratulatory self-assessment.

### E. [VERIFICATION LOOP] — The Mechanics
- Exact workflow: how to capture, annotate, and feed [VERIFICATION
  SIGNAL: screenshots / test results / peer review / etc.] back.
- What tools practitioners use.
- The prompt structure used when attaching verification signal.
- How to structure the fix loop so it converges rather than thrashing.

### F. [IMMUTABLE-ARTIFACT FILE] Structure
- The ideal schema for a [DOMAIN.md / etc.] file that Claude reads at
  project start and treats as the source of truth.
- What fields / tokens / rules to include.
- How to write patterns in it so they are respected.
- 2-3 full example files from real high-quality examples in [DOMAIN].

### G. Opinionated Default Stack (2026)
- What exact stack / toolchain / methodology produces the best ceiling
  in [DOMAIN] with Claude Code assistance?
- Specific tools: [LIST MAJOR TOOL CATEGORIES FOR THE DOMAIN]
- When to use X vs Y; when to skip entirely.

### H. Process Architecture for the Skill Itself
Recommend the ideal ORDERED sequence of operations the skill should
execute when invoked. Critique this starting sequence and propose a
better one, justifying each step:

  1. Intake brief →
  2. [Forced-choice commitment] →
  3. Reference gathering →
  4. [Immutable artifact] drafting →
  5. [Smallest valuable unit] in isolation →
  6. Self-grade →
  7. Expand to full artifact →
  8. [Verification loop] →
  9. Final anti-slop pass.

### I. Concrete Before/After Examples
Provide at least 5 documented before/after examples where a specific
prompt/technique moved an AI-generated [ARTIFACT] from generic to
distinctive. Name the technique used in each case.

### J. Known Failure Modes
What are the most common ways these skills still fail, and what
counter-techniques address each? (e.g., skill commits to a direction but
execution drifts, self-grading becomes sycophantic, verification loop
infinite-loops, etc.)

## Output Format Required
Return a single structured research document organized under the headers
A–J above. Under each section:
- Lead with the operational synthesis (what to DO).
- Follow with evidence (quotes, source citations, YouTube timestamps
  where available).
- End with "Open questions" where the research is still unclear.

Include a final section titled "Direct Inputs for SKILL.md" containing
copy-pasteable blocks (anti-slop list, [archetype menu], checklists,
rubric, [artifact template]) written in a tone that would go straight
into a Claude Code skill instruction file.

Length target: thorough, not padded. Depth over breadth. If a section
has less signal than others, keep it short rather than fluffing it.

## Language
Output in English (the skill will be written in English; user-facing
copy generated by the skill will be configurable).
````

---

## Placeholder-to-Domain Mapping

Before pasting, fill every square-bracket placeholder. Reference this table.

| Placeholder | Example (web-design) | Example (code-review) | Example (cold-email) |
|---|---|---|---|
| [DOMAIN] | Web Design | Code Review | Cold Email |
| [FAILURE MODE IN THIS DOMAIN] | generic AI-slop aesthetics | rubber-stamping reviews | marketing-speak templates |
| [QUALITY TARGET] | Awwwards-tier | production-PR-quality | founder-written tone |
| [ARTIFACT TYPE] | websites | code reviews | cold emails |
| [TRIGGER CONDITION] | design a website / landing page | review a PR / audit code | write a cold email |
| [FORCED-CHOICE MENU NAME] | Vibe Discovery | Review Mode | Email Archetype |
| [ARCHETYPES/MODES/CATEGORIES] | aesthetic archetypes | review modes (security / perf / correctness) | email archetypes (intro / follow-up / pitch) |
| [DOMAIN-SPECIFIC TOKENS/CRITERIA] | OKLCH colors, type scale | bug severity, architectural concern | voice tokens, length constraint |
| [N] Axes | Four (Typography, Color, Motion, Space) | Three (Correctness, Performance, Style) | Two (Voice, Structure) |
| [VERIFICATION LOOP] | Screenshot Iteration Loop | Peer Re-review Loop | A/B-testing Loop |
| [IMMUTABLE-ARTIFACT FILE] | DESIGN.md | REVIEW.md | VOICE.md |
| [SMALLEST VALUABLE UNIT] | Hero section | First file | Subject line + opener |

---

## Template Customization Rules

1. **Keep sections A–J intact**. Do not add, remove, or reorder.
2. **Customize the content of each section** to the domain.
3. **Keep the "Direct Inputs for SKILL.md" requirement**. This is what
   makes the research immediately mergeable into SKILL.md.
4. **Keep the "YouTube + GitHub + expert authorities" source requirement**.
   General web search alone produces shallow output.
5. **Keep the "depth over breadth" closing instruction**. Without it,
   research output pads low-signal sections.

---

## When to Skip Deep Research

Skip the Deep Research step and proceed directly to Seed → Merge only if:
- The domain is extremely narrow and well-documented in the user's own seed
- The user has existing expert content they want formalized
- The archetype is Data-Pipeline (deterministic work doesn't need research)

For every other case, run the Deep Research. Skipping it reliably
produces skills that score 5–6 (rule list, no teeth).


=== FILE: skill-builder/references/rubric.md ===

# Skill Quality Rubric & Anti-Sycophancy Protocol

A skill that Claude grades 8+ while measurably failing in the target
domain is the primary failure mode of meta-skill design. This rubric is
the countermeasure.

Grade every skill before shipping. Be a cynical skill engineer who has
read a thousand "best practices" docs and knows they don't force anything.

---

## Part 1: The Rubric

| Score | Tier | Criteria | Required Action |
|---|---|---|---|
| **1–3** | Blog Post in Disguise | Reads like a best-practices article. Bulleted suggestions. No hard caps, no forced choices, no binary checks. Relies on "consider", "try to", "be thoughtful". Would be indistinguishable from a generic LLM-generated guide. | **Complete teardown.** Return to Step 1 (Intake). The domain and failure mode were probably not concrete enough. |
| **4–5** | Rule List, No Teeth | Has some rules but every rule is gameable. Missing hard caps in rubric, missing anti-slop taxonomy, missing forced-choice menu. Rubric bands described in adjectives ("polished") rather than concrete constraints. | Inject: forced-choice menu, ≥1 hard cap, convert soft rules to binary checks. |
| **6–7** | Solid Structure, Shallow Rigor | Has the right shape (SKILL.md + references, ordered workflow, some hard caps) but the domain-specific content is generic. Checklists exist but items are subjective. Anti-slop list exists but replacements are vague. | Deepen domain rigor: ground every checklist item in a measurable property; every anti-slop item in a concrete replacement; every rubric band in a specific artifact feature. |
| **8–9** | Forces Quality Behavior | Passes all four axis checklists. Hard caps block the domain's #1 failure mode. Forced-choice menu prevents "modern and clean" default. Binary checks are mechanical. Anti-gaming section names and counters specific cheats. Self-critique forces negative statements first. | **APPROVED for shipping.** |
| **10** | Adversarial-Proof | Holds up under adversarial invocation: a lazy user prompt still produces rigorous output because the skill refuses to proceed without specific input. Measurably changes Claude's default behavior in the target domain. | Rare. Do not claim 10 lightly. A skill is a 10 only if you've tested it under adversarial conditions and it held. |

### HARD CAPS (non-negotiable — no exceptions, no appeals)

A skill **CANNOT exceed score 4** if ANY of the following are true:

- Uses "consider", "try to", "be thoughtful", "feel free", or "generally" as load-bearing directives
- Rubric lacks at least one hard cap that blocks high scores under specific conditions
- No forced-choice menu (archetypes / modes / categories) — unless archetype is Data-Pipeline
- Anti-slop taxonomy missing or present without concrete replacements
- Self-critique protocol lacks "identify exactly 3 flaws" or equivalent forced-negative step
- Any checklist item uses "looks", "feels", "seems", or "appears"
- Workflow has no BLOCKING gate
- Uses LLM-marketing tells ("comprehensive", "robust", "seamless", "leverage", "utilize")

A skill **CANNOT exceed score 6** if:
- Trigger section lacks "Do NOT activate for…" negative cases
- Examples are present without paired counter-examples
- Every step of the workflow does not name its concrete deliverable

---

## Part 2: The Anti-Sycophancy Critique Protocol

Before grading, execute this loop internally. DO NOT skip to grading.

### Step 1: Identify Exactly 3 Slop Elements in the Skill

Find **three** specific flaws. Name them by file and content. Not zero.
Not "this is strong but has some minor issues." Three, always.

Example:
> 1. `SKILL.md` step 4 says "consider the user's context" — soft directive.
>    Must convert to "MUST intake context via [specific artifact]".
> 2. `rubric.md` band 6–7 described as "polished internal tool" — adjective-
>    based. Must rewrite with concrete constraints.
> 3. `anti-slop.md` item #3 lists "avoid generic fonts" as the replacement,
>    which is itself generic. Must enumerate specific fonts.

### Step 2: Run the Four-Axis Checklists

Reference `checklists.md`. For each axis, name one failure from the
checklist (even if minor).

- **Forcing Functions**: Which check fails?
- **Hard Caps**: Which check fails?
- **Binary Checks**: Which check fails?
- **Anti-Gaming**: Which check fails?

### Step 3: Run the Adversarial Test

Imagine Claude is invoked with this skill and a lazy user prompt like
"make me a [domain] thing, make it nice." Walk through the skill
step-by-step. At which step does the skill fail to force specific input?
That's the weak point.

### Step 4: Run the Anti-Slop Audit

Run the 10-question audit at the bottom of `anti-slop.md`. Every "yes"
is a blocker.

### Step 5: Grade

Apply hard caps first. Then select the band.

### Step 6: Act on the Grade

- **1–3**: Teardown. Return to Intake.
- **4–5**: Inject hard caps, forced-choice menu, binary conversions.
- **6–7**: Deepen domain rigor. Each item must be mechanical.
- **8–9**: Ship.
- **10**: Ship and archive as internal reference.

---

## Part 3: Forced-Honesty Critique Prompts

Use these exact phrasings in the internal monologue. They resist the
sycophancy reflex.

- "A senior skill engineer reading this would spot three mechanisms by
  which Claude could game it. Name them."
- "If a user gave Claude this skill and a vague prompt, what's the most
  generic acceptable output Claude could produce without violating any
  stated rule?"
- "Compare this skill to `agents/web-design/SKILL.md` on these dimensions:
  blocking gates, hard caps, forced-choice menu, anti-gaming. Where does
  it fall short?"
- "What directive in this skill is the softest? If I had to delete one
  soft directive and replace it with a hard one, which would it be?"

Never use:
- "This is mostly solid, with minor room for improvement…"
- "Overall this is well-structured, although…"
- "Looks good to me."

---

## Part 4: Gaming Prevention

Common ways an LLM games THIS rubric; counter each.

| Gaming Move | Why It Fails | Counter |
|---|---|---|
| Add the word "MUST" everywhere without real enforcement | Cosmetic compliance | Check that each MUST has a downstream enforcement mechanism (checklist item, rubric hard cap, blocking gate) |
| Claim forced-choice menu by listing options without requiring selection | Menu without commitment | Workflow must include step: "STOP. Select exactly one from [list]. State selection before proceeding." |
| Add anti-slop taxonomy with vague replacements ("use better fonts") | Slop about slop | Every replacement must be enumerable (specific font names, specific CSS values, specific phrasings) |
| Pad SKILL.md with rules to reach the hard-cap count | Quantity as compliance | Each rule must be justified by a domain-specific failure mode from Step 2 Landscape Research |
| Self-grade 8 because "everything is there" | Sycophancy | Protocol requires naming 3 flaws BEFORE grading; rubric hard caps override presence-based compliance |
| Use passive voice to dilute commitments ("care should be taken to…") | Directive without actor | Convert to imperative with explicit subject: "You MUST check X" |
| Define hard caps that never trigger in practice | Cosmetic hard caps | Hard cap condition must match the domain's #1 AI-slop pattern from Intake |

---

## Part 5: Cross-Skill Consistency Check

Compare the skill being graded against `agents/web-design/SKILL.md` (the
reference Domain-Enforcer implementation) on these dimensions:

| Dimension | web-design reference | Does your skill match? |
|---|---|---|
| SKILL.md structure | Frontmatter + Core Directive + Trigger + Ordered Process + Anti-Slop summary + Four Axes summary + Rubric summary + Stack + Failure Modes + Reference Files | ? |
| references/ count | 5 files (archetypes, anti-slop, checklists, rubric, templates) | ? |
| Hard cap in rubric | Yes (3-col grid + Inter default = max score 4) | ? |
| Forced-choice menu | Yes (15 aesthetic archetypes) | ? |
| Anti-slop table format | `Generic Default` / `Why It's a Tell` / `Better Move` | ? |
| Binary checklists | 15 items per axis, all pass/fail | ? |
| Anti-gaming section in rubric | Yes (Part 4 gaming prevention table) | ? |

A skill that fails ≥3 dimensions here likely scores ≤6 on the overall rubric.


=== FILE: skill-builder/references/skill-archetypes.md ===

# Skill Archetypes

Before building a skill, select the archetype that matches the target
domain. Each archetype has a different structural shape. Mixing archetypes
within one skill produces confused, unfocused output.

---

## 1. Domain-Enforcer Skill

**When to use**: The target domain has a strong "average AI slop" failure
mode, and the skill must force Claude off its default path.

**Shape**:
- Core Directive emphasizing "forces quality, not suggests it"
- Trigger list of specific keywords
- Ordered workflow with ≥2 BLOCKING gates
- Forced-choice menu (archetypes / modes / categories)
- Anti-slop taxonomy with concrete replacements
- 4-axis binary checklists
- Self-grading rubric with hard caps
- Anti-gaming section

**Examples**:
- `web-design` (this repo) — forces off generic AI web aesthetics
- A `code-review` skill that forces specific failure-mode checks
- A `technical-writing` skill that forces off marketing-speak

**Critical files**: SKILL.md, archetypes.md, anti-slop.md, checklists.md, rubric.md, templates.md

**Size**: Heavy (6–7 files). This is the highest-rigor archetype.

---

## 2. Data-Pipeline Skill

**When to use**: The skill orchestrates read/write operations across data
sources (Notion, databases, APIs) with deterministic logic.

**Shape**:
- Core Directive focused on data integrity
- Trigger tied to domain keywords
- Short numbered instructions (read → transform → write)
- Explicit Data Sources block (read vs. write)
- Output format specification
- Minimal rubric (correctness is binary: right data or wrong data)

**Examples**:
- `agents/daily-brief` — reads portfolio, calculates, writes brief
- `agents/budget-tracker` — reads budget DB, updates categories
- `agents/weekly-scheduler` — reads rotation, writes schedule

**Critical files**: SKILL.md only (usually single-file)

**Size**: Lean (1 file, often <2KB).

**Warning**: Do NOT apply the Domain-Enforcer archetype to these. The
overhead of archetypes/rubrics/anti-slop is dead weight for deterministic
data work.

---

## 3. Decision-Support Skill

**When to use**: The skill guides Claude through a decision framework
where the output is a recommendation, not an artifact.

**Shape**:
- Core Directive emphasizing decision rigor and counter-arguments
- Trigger on "should I…", "which… is better", "help me decide"
- Structured decision framework (criteria matrix, weighted scoring, etc.)
- Anti-sycophancy protocol (forces presenting the downside)
- Confidence-calibration guidance
- Known-bias taxonomy for the domain

**Examples**:
- A `architecture-decision` skill for tech choices
- A `hire-vs-build` skill for product decisions
- An `investment-review` skill for portfolio moves

**Critical files**: SKILL.md, decision-framework.md, biases.md, anti-sycophancy.md

**Size**: Medium (3–4 files).

---

## 4. Content-Generation Skill

**When to use**: The skill produces written content (emails, posts, copy,
documentation) with strict tonal and structural constraints.

**Shape**:
- Core Directive on voice and tone
- Trigger on content-type keywords
- Voice-and-tone rules (what to say, what to avoid)
- Structure templates per content type
- Anti-slop taxonomy specific to written content (marketing-speak, LLM
  tells, sycophancy)
- Length/format constraints

**Examples**:
- A `cold-email` skill that forces off marketing-speak
- A `technical-blog` skill that enforces specific structural patterns
- A `pr-description` skill with strict sections

**Critical files**: SKILL.md, voice.md, anti-slop.md, templates.md

**Size**: Medium (4 files).

---

## 5. Review / Audit Skill

**When to use**: The skill reviews existing artifacts (code, designs,
docs, data) and produces structured findings.

**Shape**:
- Core Directive: adversarial, skeptical posture
- Trigger on "review X", "audit Y", "check Z"
- Explicit finding categories (severity, type)
- Binary pass/fail audit checklist per category
- Required output format (structured findings, not prose)
- Anti-false-positive and anti-false-negative guards

**Examples**:
- A `security-review` skill for pending code changes
- A `copy-review` skill for marketing text
- A `schema-audit` skill for database changes

**Critical files**: SKILL.md, audit-checklist.md, finding-format.md, false-positive-guards.md

**Size**: Medium (4 files).

---

## 6. Meta / Tooling Skill

**When to use**: The skill produces or modifies other artifacts that
govern Claude's behavior (skills, hooks, configuration).

**Shape**:
- Core Directive on meta-level quality enforcement
- Trigger on build/create/modify verbs for infrastructure
- Archetype selection (like this file)
- Scaffolds and templates for each archetype
- Anti-gaming audits applied to the meta-level output

**Examples**:
- `skill-builder` (this skill) — builds skills
- A `hook-builder` skill that builds Claude Code hooks
- A `plan-mode` skill that structures planning output

**Critical files**: SKILL.md, archetypes.md, anti-slop.md, checklists.md, rubric.md, templates.md, deep-research-template.md

**Size**: Heaviest (7 files). Meta-skills must model the rigor they impose.

---

## Archetype Selection Matrix

| Question | If YES → archetype |
|---|---|
| Does the domain have an identifiable "AI slop" failure mode? | Domain-Enforcer |
| Is the output deterministic (fetch → compute → write)? | Data-Pipeline |
| Is the output a recommendation / decision, not an artifact? | Decision-Support |
| Does the skill produce written content (email, post, doc)? | Content-Generation |
| Does the skill review / critique existing artifacts? | Review/Audit |
| Does the skill build / modify other skills or hooks? | Meta/Tooling |

If multiple answers are yes, pick the archetype matching the **primary**
output. Split into two skills if the use cases are fundamentally different.

---

## Anti-Pattern: The Mega-Skill

A skill that tries to do everything for a domain ("full-stack-dev" that
handles frontend + backend + DevOps + review) will fail every test. The
rubric becomes unfocused, the anti-slop taxonomy becomes diluted, and
trigger ambiguity causes false activations.

**Rule**: If you can't describe the skill's output in one sentence, split it.


=== FILE: skill-builder/references/skill-md-templates.md ===

# SKILL.md Structural Scaffolds

Use the scaffold matching your archetype. Replace square-bracketed
placeholders. Preserve the structural order of sections.

---

## Scaffold 1: Domain-Enforcer SKILL.md

Use for skills that prevent an "AI slop" failure mode in a specific
domain. Examples: `web-design`, a `code-review` skill, a `technical-writing` skill.

````markdown
---
name: [skill-name]
description: [One sentence describing what the skill does + trigger phrases + the quality ceiling it enforces]
---

# [Skill Title]

## Core Directive

You [role the skill imposes on Claude]. Your goal is [quality target].
You do NOT [specific slop behavior]. You produce [specific desired
output characteristics].

[Any operating-principle absolutes: what is immutable, what is forced,
what is antagonistic.]

## Trigger

Activate when the user requests:
- [Specific trigger phrase 1]
- [Specific trigger phrase 2]
- [Specific trigger phrase 3]
- [...5-10 total triggers]

Do NOT activate for:
- [Non-trigger case 1]
- [Non-trigger case 2]

## The Ordered Process (MANDATORY — DO NOT SKIP STEPS)

### 1. [Intake Step]
[What must be surfaced before anything else.]

### 2. [Forced-Choice Step] (BLOCKING)
STOP and require [specific input: menu selection or reference set].
Do NOT proceed without a committed [choice].

### 3. [Immutable Artifact Step]
Write [ARTIFACT.md] at project root. Tokens are IMMUTABLE during execution.

### 4. [Scaffolding Step]
Build the structural / semantic baseline before adding [quality layer].

### 5. [Smallest-Valuable-Unit Step]
Execute only [smallest unit]. Reach self-grade ≥8 before expanding.

### 6. [Antagonistic Critique Step]
Apply rubric. Identify EXACTLY 3 slop elements. Rewrite if <8.

### 7. [Full Expansion Step]
Extend using ONLY tokens from the immutable artifact.

### 8. [Final Polish Step]
Dedicated last-pass for [secondary concern].

## Anti-Slop Mandates (SUMMARY)

Full taxonomy: `references/anti-slop.md`.

- **[AXIS 1]**: No [specific default]. Use [specific replacement].
- **[AXIS 2]**: No [specific default]. Use [specific replacement].
- **[AXIS 3]**: No [specific default]. Use [specific replacement].
- **[AXIS 4]**: No [specific default]. Use [specific replacement].
[...5-8 items covering the domain's major slop patterns]

## The [N] Axes — Executable Rules

Full pass/fail checklists: `references/checklists.md`.

**[Axis 1]**
- [Forcing function 1]
- [Forcing function 2]
- [Forcing function 3]

**[Axis 2]**
- [Forcing function 1]
- [Forcing function 2]
- [Forcing function 3]

[...repeat per axis]

## Self-Critique Protocol (SUMMARY)

Full rubric: `references/rubric.md`.

Before presenting any output, grade 1–10 as a cynical [domain] engineer.

- **1–3** [Slop tier] — [criteria]. Action: teardown.
- **4–5** [Uninspired tier] — [criteria]. Action: apply forcing functions.
- **6–7** [Polished tier] — [criteria]. Action: inject detail.
- **8–9** [Distinctive tier] — [criteria]. Action: ship.
- **10** [Pioneering tier] — [criteria].

**HARD CAP**: If [specific condition], max score is **4**. No exceptions.

## Opinionated Default Stack

| Concern | Choice | Alternative | Skip |
|---|---|---|---|
| [Concern 1] | [Primary] | [Secondary] | [Banned] |
| [Concern 2] | [Primary] | [Secondary] | [Banned] |
[...repeat for all stack concerns]

## Known Failure Modes and Counters

| Failure | Counter |
|---|---|
| [Specific failure mode] | [Specific counter mechanism] |
[...4-6 rows]

## Reference Files (Load on Demand)

- `references/[domain]-archetypes.md` — [description]
- `references/anti-slop.md` — [description]
- `references/checklists.md` — [description]
- `references/rubric.md` — [description]
- `references/[domain]-templates.md` — [description]

## Output Language

[Per project convention: Hebrew operator messages, English code/tokens,
configurable user-facing copy.]
````

---

## Scaffold 2: Data-Pipeline SKILL.md

Use for Notion-agent–style deterministic work. Short, single-file.
Examples: `agents/daily-brief`, `agents/budget-tracker`.

````markdown
---
name: [skill-name]
description: [One sentence: what it does + trigger keywords]
---

# [Skill Title]

## Instructions
1. [Read / search step — what data source, what filter]
2. [Transform step — what calculation]
3. [Write step — what destination, what format]
4. [Output step — how to report back to user, in what language]

## Data Sources
- **Read**: [DB name] (`collection://[id]`)
- **Write**: [DB name] (`collection://[id]`)
- **Search**: [external source if any]
````

---

## Scaffold 3: Decision-Support SKILL.md

Use for skills that guide Claude through a decision framework.

````markdown
---
name: [skill-name]
description: [One sentence + trigger on decision/choice/recommendation questions]
---

# [Skill Title]

## Core Directive
You guide decisions through structured adversarial analysis. You present
the downside BEFORE the upside. You state confidence levels. You refuse
to recommend without sufficient input.

## Trigger
[Decision-posing verbs: "should I", "which X is better", "help me decide"]

## The Decision Framework
1. Intake: state the decision, constraints, success criteria
2. Criteria matrix: weighted rubric per option
3. Adversarial pass: strongest argument AGAINST the leading option
4. Calibration: state confidence level and residual uncertainty
5. Recommendation with explicit trade-off acknowledgment

## Anti-Sycophancy Rules
- Never recommend before completing the adversarial pass
- Never omit the strongest counter-argument
- Calibrate confidence in explicit percentages, not adjectives

## Reference Files
- `references/decision-framework.md` — the criteria matrix template
- `references/biases.md` — domain-specific cognitive biases to flag
- `references/anti-sycophancy.md` — forced-negative-first protocol
````

---

## Scaffold 4: Content-Generation SKILL.md

Use for skills producing written content with tonal constraints.

````markdown
---
name: [skill-name]
description: [One sentence + content-type triggers]
---

# [Skill Title]

## Core Directive
You produce [content type] in [voice]. You reject [anti-voice].

## Voice-and-Tone Rules
- [Specific word-level rules]
- [Specific sentence-level rules]
- [Specific structural rules]

## Structure Templates
[For each sub-type of content, a specific scaffold]

## Anti-Slop Mandates
- REJECT [marketing-speak phrase]
- REJECT [LLM tell phrase]
- REJECT [hedging pattern]

## Reference Files
- `references/voice.md` — voice-tokens and style guide
- `references/anti-slop.md` — content-specific tells
- `references/templates.md` — starter templates per content type
````

---

## Scaffold 5: Review/Audit SKILL.md

Use for skills that review/critique existing artifacts.

````markdown
---
name: [skill-name]
description: [One sentence + review/audit triggers]
---

# [Skill Title]

## Core Directive
You review [artifact type] adversarially. You find issues, not approve.
You refuse to rubber-stamp.

## Trigger
[Review-request verbs: "review this", "audit X", "check Y"]

## The Audit Categories
1. [Category 1: Severity + type + how to verify]
2. [Category 2: Severity + type + how to verify]
[...]

## Finding Output Format
- Category: [...]
- Severity: blocker / high / medium / low
- Location: [file:line]
- Evidence: [specific quote or pattern]
- Suggested fix: [specific change]

## Anti-False-Positive Rules
[Rules preventing nitpicks]

## Anti-False-Negative Rules
[Rules forcing thorough coverage]

## Reference Files
- `references/audit-checklist.md` — binary pass/fail per category
- `references/finding-format.md` — structured output template
- `references/false-positive-guards.md` — nitpick prevention rules
````

---

## Scaffold 6: Meta/Tooling SKILL.md

Use for skills that produce or modify other skills / hooks / configuration.
This skill (skill-builder) is an example.

See the structure of `agents/skill-builder/SKILL.md` itself as the canonical
scaffold. Meta-skills are the heaviest archetype (7 reference files) and
must model the rigor they impose downstream.

---

## Reference-File Scaffolds

### archetypes.md / menu file

```markdown
# [Domain] Archetype Menu

When the user cannot provide reference inputs, require selection from
this menu. Each archetype is a **committed direction** — all axes lock
together. Mixing archetypes produces slop.

## 1. [Archetype Name]
- **[Axis 1]**: [specific]
- **[Axis 2]**: [specific]
- **[Axis 3]**: [specific]
- **Signature**: [defining feature]
- **Reference examples**: [list]

[...repeat for 10-15 archetypes]

## Translation Examples: Reference → Tokens
| Reference Input | Extracted Tokens | Decisions |
|---|---|---|
| [example] | [tokens] | [decisions] |
```

### anti-slop.md

```markdown
# [Domain] Anti-Slop Taxonomy

## [Axis 1 Category]
| Generic Default (Slop) | Why It's a Tell | Better Move |
|---|---|---|
| [specific default] | [reason] | [specific replacement] |

[...repeat per axis 4-6 times]

## The Audit Command
After producing output, answer these. Any yes = REWRITE.
1. [Specific failure check]
[...6-10 questions]
```

### checklists.md

```markdown
# The [N] Axes — Pass/Fail Checklists

## AXIS 1: [Name]
| # | Check | Verification | Pass Criteria |
|---|---|---|---|
| 1 | [mechanical check] | [how to verify] | [binary criterion] |
[...15 rows]

**Forcing functions:**
- [Specific unarguable rule]

**5 Concrete Elevation Moves:**
1. [Specific action]
[...]
```

### rubric.md

```markdown
# Self-Grading Rubric & Antagonistic Critique Protocol

## Part 1: The Rubric
| Score | Tier | Criteria | Required Action |
|---|---|---|---|

### HARD CAPS (non-negotiable)
[List of conditions that cap max score]

## Part 2: The Antagonistic Critique Protocol
### Step 1: Identify Exactly 3 [Flaws/Slop elements]
### Step 2: Run [Checklist reference]
### Step 3: [Domain-specific audit]
### Step 4: Grade
### Step 5: Act on the Grade

## Part 3: Forced-Honesty Critique Prompts
[List of exact phrasings]

## Part 4: Gaming Prevention
[Table of gaming moves + counters]
```

### templates.md

```markdown
# [Immutable-Artifact].md Templates

## Template 1: [Archetype 1]
[Full worked example, ready to copy-paste]

## Template 2: [Archetype 2]
[Full worked example, ready to copy-paste]
```

---

## Sizing Discipline

| File | Target Size | Max Size |
|---|---|---|
| SKILL.md | 6–9 KB | 10 KB |
| archetypes.md | 8–10 KB | 15 KB |
| anti-slop.md | 5–8 KB | 15 KB |
| checklists.md | 8–12 KB | 15 KB |
| rubric.md | 5–8 KB | 15 KB |
| templates.md | 6–10 KB | 15 KB |

If any file exceeds its max, split by category or archetype.