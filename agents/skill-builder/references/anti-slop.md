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
