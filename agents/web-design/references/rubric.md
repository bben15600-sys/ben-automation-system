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
