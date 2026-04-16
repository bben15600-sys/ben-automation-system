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
