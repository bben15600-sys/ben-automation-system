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
