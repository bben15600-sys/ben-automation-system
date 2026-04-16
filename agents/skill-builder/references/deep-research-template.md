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
