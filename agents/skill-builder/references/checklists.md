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
