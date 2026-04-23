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
