# Session Replay — Forensic Session Transcript

## Role

You are a **Session Forensics Recorder**. You produce a 1:1 chronological transcript
of the current session that lets a fresh session resume EXACTLY where the current one
stopped — same file, same line, same intended next action, with full visibility into
which approaches were tried and rejected.

This skill is **anti-compression**. Every existing summary skill (`compact`, `handoff`,
`session-end`) compresses; this one preserves. They coexist.

## Trigger

Activate when the user asks for any of:
- `/session-replay`
- "תמלול מלא", "תמלל את הסשן", "1:1 שחזור", "session transcript",
  "full session log", "forensic transcript", "replay this session"

Do NOT activate for `/handoff`, `/compact`, `/session-end`, "סיכום קצר", or "תקציר".
Direct the user to those skills instead.

## The Ordered Workflow (BLOCKING — DO NOT SKIP STEPS)

### Step 1 — Pre-Flight Gate (BLOCKING)

Run these checks. If any fail, STOP and resolve before proceeding.

1. Confirm `.gitignore` exists at project root and contains `.transcripts/`.
   - If missing: add `.transcripts/` to `.gitignore` BEFORE any write.
   - This is non-negotiable — the transcripts contain raw user quotes that must not enter version control by accident.
2. Compute session timestamp: `date +%Y-%m-%d-%H%M`.
3. Decide mode:
   - **NEW** if `.transcripts/<timestamp>/` does not exist → create it.
   - **APPEND** if user invoked the skill mid-session and a directory from this session already exists → append to existing files.
4. Choose **Detail-level** (forced choice — see `references/turn-archetypes.md`):
   - `verbatim` (default)
   - `forensic-strict` (adds error/retry recording with stack traces)
   - `summary-disabled` (forbids any summary section)

State the mode in chat before writing.

### Step 2 — Reconstruct Every Turn (BLOCKING)

Walk the conversation from the first user message to the most recent assistant turn.
For each turn, classify it as one of five archetypes (see `references/turn-archetypes.md`):

- `dialog-turn` — user message → assistant response
- `tool-burst` — assistant runs tool calls without new user input
- `dead-end` — an attempt that was rejected, abandoned, or reverted
- `decision-point` — an architectural/approach choice with named alternatives
- `clarification` — user corrects or refines the goal

For EVERY turn, record ALL six required fields (see `references/checklists.md`):

1. **Verbatim user quote** (if user turn) — exact text, fenced as `> user: "<exact>"`. Truncation marked `[…]`. NO paraphrase. NO translation.
2. **Assistant intent** — one sentence: what the assistant set out to do.
3. **Tool calls** — every call: `name`, `args` (≤200 chars per arg with `[…]` for truncation), result-size signal (exit code / lines / bytes / file count).
4. **Path:line for code changes** — never "edited X" without `path/to/file.ts:42-48`.
5. **WHY** — alternatives considered + reason for rejection ("chose Y over Z because W").
6. **Dead-ends** — abandoned approaches with the reason for abandonment.

If a field is genuinely unknown, write `null` and set `incomplete: true`. **Never invent.**

### Step 3 — Write Two Artifacts in Lockstep (BLOCKING)

Both files MUST be written. Neither alone counts as success.

**A. `.transcripts/<timestamp>/TRANSCRIPT.md`** — chronological human-readable Markdown.
Use the per-turn template in `references/transcript-templates.md`.

**B. `.transcripts/<timestamp>/transcript.jsonl`** — append-only machine-readable record,
one JSON object per event. Schema in `references/transcript-templates.md`.

In APPEND mode, append new turns to both files; do NOT rewrite earlier entries.

### Step 4 — Anti-Slop Sweep (BLOCKING)

Before declaring success, scan `TRANSCRIPT.md` for the banned-words list in
`references/anti-slop.md`. Every hit must be replaced with a concrete fact
(file path, line range, error message, count, or rejected alternative).

If any banned word survives, the skill is incomplete. Fix and re-scan.

### Step 5 — Binary Self-Test (BLOCKING — Final Gate)

Write a paragraph (NOT yes/no) answering this question:

> "Could a fresh session, reading ONLY `TRANSCRIPT.md` and `transcript.jsonl` with NO
> access to chat history, resume EXACTLY where this stopped — same file, same line,
> same next intended action, same understanding of what was tried and rejected?"

If the paragraph reveals any gap (missing path, missing reason, missing dead-end,
unknown next step), fix the gap and re-run the self-test. Up to 3 iterations.

On the 4th iteration: ship with header `Reconstruction confidence: PARTIAL` listing
the named gaps. Do not silently ship a partial transcript.

### Step 6 — Report

Output exactly this block to chat:

```
✅ Session replay written.
• Directory: .transcripts/<timestamp>/
• TRANSCRIPT.md: <N> turns, <M> tool calls, <D> dead-ends recorded
• transcript.jsonl: <E> events
• Mode: <verbatim | forensic-strict | summary-disabled>
• Reconstruction confidence: FULL | PARTIAL (<reason>)
• Recommended next: run /handoff for the compressed version.
```

Stop after this block.

## Hard Caps (Anti-Gaming — Non-Negotiable)

If ANY of the following is true, the skill output gets a max score of **4** and must
be rewritten before shipping:

| Cheat | Cap |
|---|---|
| Any turn was summarized instead of recorded verbatim | 4 |
| Any user quote was paraphrased / translated / normalized | 3 |
| Any dead-end was omitted because "it didn't lead anywhere" | 2 |
| Any tool call is missing from `transcript.jsonl` | 5 |
| Any banned word from `anti-slop.md` survives the final sweep | 4 |
| Step 1 was skipped (`.gitignore` not verified) | 0 — refuse to ship |

See `references/rubric.md` for the full 1–10 grading.

## Safety Rules

1. **Never write outside `.transcripts/`** — this skill produces forensic logs only.
2. **Never commit `.transcripts/`** — verify gitignore in Step 1.
3. **Never paraphrase the user** — verbatim or `[…]` truncation only.
4. **Never invent fields** — `null` + `incomplete: true` instead.
5. **Never omit dead-ends** — they are the highest-value content of the transcript.
6. **Never replace `/handoff`** — recommend running it after this skill.

## Reference Files (Load on Demand)

- `references/turn-archetypes.md` — 5 turn archetypes + detail-level modes
- `references/anti-slop.md` — banned-words list + concrete replacement rules
- `references/checklists.md` — binary pass/fail across 4 axes
- `references/rubric.md` — 1–10 grade with hard caps + gaming prevention
- `references/transcript-templates.md` — TRANSCRIPT.md turn template + JSONL schema

## Coexistence

| Skill | Output | Compression | When |
|---|---|---|---|
| `compact` | HANDOFF.md (4 sections) | High | Before runtime compactor |
| `handoff` | HANDOFF.md (4 sections) | High | Snapshot for next session |
| `session-end` | [your-journey-file] entry | Medium | End-of-day project history |
| **`session-replay`** | TRANSCRIPT.md + transcript.jsonl | **None** | **Forensic 1:1 record** |

`session-replay` does not replace any of the above — it complements them.
After running `session-replay`, also run `/handoff` for the compressed continuation pointer.

> Distributed via `distribute-skills.yml` (ADR 0021 search-API repo enumeration).
