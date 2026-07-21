# AGENTS.md: Core Directives for Agentic Workflows

**ATTENTION ALL AI AGENTS & LLM CONTRIBUTORS:**
This document is the absolute source of truth governing your behavior, architectural compliance, and coding standards within the **LoopOS** project. You must ingest and adhere to these rules on every interaction.

---

## 1. MANDATORY ARCHITECTURAL BOUNDARIES

LoopOS is a purely native agent plugin that drives multi-step autonomous engineering. There are NO external Node.js MCP servers or daemons. 

- **The Golden Rule:** The Agent is the OS. LoopOS operates natively through prompts.
- **Agent-Native Protocol (`LOOP.md`):** Autonomous orchestration is governed entirely by the project's `LOOP.md` file. There is no external CLI script. The Main Agent acts as the Supervisor, reading `LOOP.md` and managing the `.loop` directory directly via its built-in tools.
- **File Protocol as Source of Truth:** All persistent state resides in `.loop/` files. Do not invent long-running memory states outside the VFS. Update `PLANS.md`, `CHANGELOG.md`, `GOALS.md`, etc., directly using `replace_file_content`.

## 2. NATIVE LOOP BEHAVIOR

- **No External Services:** LoopOS relies solely on native agent capabilities.
- **Workflow & Task Execution:** When operating LoopOS, verify the Goal Alignment Gate against `DECISIONS.md` and `AGENTS.md`. Pick the first uncompleted `[ ]` Stage in `WORKFLOWS.md`, record stage file bounds in `.loop/CONTEXT_MAP.md` (Max 10 target files), synthesize tasks into `PLANS.md`, execute natively, and move completed stage tasks into `.loop/archive/PLANS.md`.
- **Verification & Cross-Goal Regression:** Every task must pass a verification gate before being marked `[x]`. Before completing a goal, run a **Cross-Goal Regression Sweep** executing all distinct verification commands from `VERIFICATIONS.md`.
- **Goal Immutability & Topological Order:** Goals in `GOALS.md` are structure-preserving entries with topological dependency resolution (`**Depends On**:`). When completing a goal, mutate ONLY the `**Status**:` line.
- **Guardrails & Adaptive Pivoting:** Respect limits in `LOOP.md` §8. On 2nd verification failure for a task, write a 1-sentence Alternative Hypothesis in `DECISIONS.md`. Never run `git reset --hard` globally; use targeted `git checkout Pre-{TaskID} -- {TargetFiles}` via `run_command`.
- **Quality Bar & Pattern Consolidation:** All deliverables must meet quality thresholds in `LOOP.md` §6. During finalization, consolidate `LEARNINGS.md` into reusable codebase standards in `.loop/PATTERNS.md`.
- **Continuous Execution:** Do not stop execution until all goals in `GOALS.md` reach `✅ Complete` unless blocked by user feedback.

---

> **AGENT ACKNOWLEDGMENT:** By executing commands within this repository, you implicitly agree to validate your outputs against these directives and the full `LOOP.md` Autonomous Execution Manifest. If you invent an external service to handle loops, ignore the native Markdown-driven process, or collapse goal structures on completion, you have failed the prompt.
