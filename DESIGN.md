# DESIGN.md — oslife Life OS Dashboard

## Visual Strategy

**Archetype**: Dark Micro-Neumorphism (Soft UI)
**Mood**: Tactile, premium hardware. Like a high-end audio mixer or luxury car console.
**Key principle**: Neumorphism ONLY on interactive elements (buttons, toggles, goals). Data stays clean and high-contrast.
**What to avoid**: Full neumorphism on every card (too heavy). Flat/generic template look. Low contrast text.
**References**: Neumorphism.io, Dribbble "dark neumorphism dashboard"

## Color Palette

```css
/* Base surface — all neumorphic shadows are relative to this */
--neu-base:       #1e1e2e;
--neu-dark:       #161624;     /* shadow dark side */
--neu-light:      #282840;     /* shadow light side */

/* Backgrounds */
--bg-base:        #1a1a2e;     /* page background */
--bg-card:        #1e1e2e;     /* card surface = neu-base */
--bg-card-hover:  #232338;
--bg-input:       #1a1a2e;     /* inset/pressed surface */

/* Text */
--text-primary:   #e8e8f0;
--text-secondary: #9090a8;
--text-muted:     #5a5a72;

/* Accent — mint/cyan, pops against dark purple-gray */
--accent:         #64ffda;
--accent-soft:    rgba(100, 255, 218, 0.1);

/* Semantic */
--positive:       #64ffda;
--negative:       #ff6b8a;
--warning:        #ffd93d;
--info:           #8b8aff;
```

## Neumorphic Shadows

```css
/* Raised — element pops out */
.neu-raised {
  background: #1e1e2e;
  box-shadow: 6px 6px 12px #161624,
             -6px -6px 12px #282840;
  border-radius: 16px;
}

/* Pressed — element pushed in (completed state, active) */
.neu-pressed {
  background: #1a1a2e;
  box-shadow: inset 4px 4px 8px #161624,
              inset -4px -4px 8px #282840;
  border-radius: 16px;
}

/* Flat card — subtle, for data containers */
.neu-flat {
  background: #1e1e2e;
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 16px;
}

/* Interactive hover — slightly more raised */
.neu-raised:hover {
  box-shadow: 8px 8px 16px #161624,
             -8px -8px 16px #282840;
}

/* Button press */
.neu-raised:active {
  box-shadow: inset 3px 3px 6px #161624,
              inset -3px -3px 6px #282840;
}
```

## Typography

**Primary**: Heebo (Hebrew + Latin)
**Monospace**: JetBrains Mono (numbers, metrics)

```
Scale (Major Third):
  xs:    0.75rem / 12px
  sm:    0.875rem / 14px
  base:  1rem / 16px
  lg:    1.25rem / 20px
  xl:    1.563rem / 25px
  2xl:   1.953rem / 31px
  3xl:   2.441rem / 39px

Headings: weight 700, line-height 1.1, tracking -0.02em
Body: weight 400, line-height 1.55
Numbers: JetBrains Mono weight 700, tabular-nums
Labels: weight 600, tracking 0.06em, uppercase, xs size
```

## Spacing Scale (base-8)

```
2:   8px
3:  12px
4:  16px
5:  20px
6:  24px
8:  32px
12: 48px
16: 64px
```

## Component Patterns

**Metric Cards**: neu-flat (subtle). Number in accent color or text-primary. Label in text-muted uppercase.

**Goal Items**: neu-raised when incomplete. Transitions to neu-pressed when done. Satisfying tactile feedback.

**AI Chat Button**: Large neu-raised circle with accent glow. Pops out visually.

**Progress Bars**: Inset track (neu-pressed look), filled part in accent color.

**Navigation**: Flat, no neumorphism. Active tab gets subtle accent underline.

**Buttons**: neu-raised, :active → neu-pressed (scale 0.98). Accent border on primary.

## Motion

```
Durations: hover 120ms, standard 180ms, expand 280ms
Easing: ease-out for entries, ease-in for exits
Active press: scale(0.98) + shadow inset, 100ms
Only animate: transform, opacity, box-shadow
```

## RTL

- Light source from top-left (works for both LTR and RTL)
- Logical properties for spacing
- Grid flows naturally in RTL
