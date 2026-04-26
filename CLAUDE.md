# CLAUDE.md

Enrollment marker for the [`bben15600-sys/claude-Skills`](https://github.com/bben15600-sys/claude-Skills) skill distribution system.

## What this does

The hub's `distribute-skills.yml` workflow installs skills to `.claude/commands/`
when they match this repo's `fit:` criteria (declared in each skill's frontmatter).
A skill is only installed if its `fit:` block evaluates to true against this
repo's tree, primary language, README, and GitHub topics.

## Opt-out

To suppress distribution of a specific skill, add its name (one per line) to
`.skill-distribution-ignore` at the repo root.

## Repo-specific guidance

Replace this file with project-specific Claude instructions whenever it makes
sense. Skill distribution continues as long as `CLAUDE.md` exists at the root.

---
*Auto-generated enrollment marker — see ADR 0020 in claude-Skills hub.*
