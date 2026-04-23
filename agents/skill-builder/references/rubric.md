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
