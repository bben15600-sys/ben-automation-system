# FIT-DECISION — skill-builder

## Source
- **Source repo:** bben15600-sys/claude-Skills
- **Source skill path:** skill-builder/SKILL.md
- **Source commit:** e8e762c67c906eb6096c373ff7148263a810aaaa
- **Source branch:** claude/mobile-skill-research-0dHX0
- **Distributor run timestamp:** 2026-04-23T17:47:00Z

## Classification
- **Decision:** STRONG_MATCH (user override from WEAK_MATCH)
- **Rubric score:** 5 (HARD CAP on trigger-keyword occurrences) → overridden to STRONG by user
- **HARD CAPS applied:** trigger-keyword-zero-occurrences (max 5)
- **Override rationale:** Meta-skill triggers are user utterances (future prompts), not target-code content. The trigger-keyword HARD CAP is structurally inapplicable to meta-skills; user explicitly accepted this and elevated to STRONG_MATCH.

## Evidence

> Location: .claude/CLAUDE.md:42-46, 88-92
>
> ```
> ### Agent System
> Agents live in `agents/<name>/SKILL.md`. Claude Code reads the SKILL.md and executes Notion operations:
> - `budget-tracker` — Monthly expense totals by category, car savings progress
> - `daily-brief` — Stock prices (VOO, QQQ, NVDA, TSLA) vs portfolio targets
> ...
> ## Conventions
> - Agent instructions: `agents/<name>/SKILL.md`
> - Config templates: `config/` (never commit filled-in secrets)
> - Language: Hebrew for all user-facing output; English for code, config, and SKILL.md logic
> ```

**Why this quote:** The target's documented convention (`agents/<name>/SKILL.md`, Hebrew user-facing + English skill internals) is byte-identical to the convention skill-builder prescribes in its own `## Default Artifacts and Conventions` section. The source skill even references `agents/daily-brief/SKILL.md` by name as a template for simpler skills — evidence of explicit awareness of this target's structure.

## Mismatch Reasons Considered

1. **Existing skills in target are shallow by design** — `agents/daily-brief/SKILL.md` (16 lines) and peers are simple "Instructions + Data Sources" Notion-agents. skill-builder explicitly says "Do NOT activate for ... a simple Instructions → Data Sources shape." This implies most new skills here would bypass skill-builder anyway.
2. **Trigger keywords have 0 occurrences in target code** — grep for "build a skill" / "create a skill" / "design a skill" returns 0 matches in target code. Rubric HARD CAP: max score 5.
3. **Target's primary stack is Next.js + Python for Notion automation, not skill authoring** — skill-builder is a workshop tool; the target is a production system.

**Why they were insufficient:**
- (1) skill-builder is opt-in — it's a tool for building NON-trivial skills, not a forced workflow for all new agents.
- (2) Is a structural artifact of meta-skills: triggers are future user utterances, not code content. The HARD CAP fires on meta-skills regardless of true fit — user accepted the override.
- (3) Skills coexist with the production system; skill-builder adds tooling without disrupting runtime code.

## Fingerprint Summary

Files read from the target during evaluation:

- `.claude/CLAUDE.md`
- `.claude/skills/web-design.md` (first 50 lines — confirmed to be a bundle file, not installed skill)
- `agents/daily-brief/SKILL.md`
- `agents/budget-tracker/SKILL.md`
- `agents/video-project-manager/SKILL.md`
- `agents/weekly-scheduler/SKILL.md`
- `web/package.json`
- Full file tree (via `git ls-tree`)

**Primary stack identified:** Python (scripts/automation) + TypeScript/Next.js 16.2.4 (web/) with Notion API integration.
**Monorepo:** No (single-repo with `web/` subdirectory; primary work happens outside subpackages).

## Adaptations Applied

- [x] **Paths:** `skill-builder/` → `agents/skill-builder/` (matches target's `agents/<name>/SKILL.md` convention — declared in `.claude/CLAUDE.md:90`)
- [x] **Trigger keywords:** unchanged
- [x] **Description frontmatter:** unchanged
- [x] **Reference files:** all 6 copied as-is to `agents/skill-builder/references/`

Total adaptation cost: **trivial** (directory prefix only).

## Conflict Resolution

N/A — no existing `agents/skill-builder/SKILL.md`. The bundle file at `.claude/skills/web-design.md` textually contains skill-builder content as a distribution artifact but does not occupy the target path per spec's DUPLICATE_EXISTS definition.

## Verification

Post-commit verification result:

- [ ] File exists at expected path — pending
- [ ] Frontmatter parses (name + description present) — pending
- [ ] Target's CLAUDE.md references or can locate this skill — CLAUDE.md documents `agents/<name>/SKILL.md` convention, so skill is auto-locatable

Verification status: pending (see commit verification block below, appended post-push).

## Rerun Guidance

Re-evaluate if:
- Source skill's `SKILL.md` changes materially (new triggers, rewritten description)
- Target adds a competing meta-skill (DOMAIN_CONFLICT)
- Target's `agents/<name>/SKILL.md` convention changes (e.g., migrates to `.claude/skills/<name>/`)
