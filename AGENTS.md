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
- **Workflow & Task Execution:** When operating LoopOS, verify the Goal Alignment Gate against `DECISIONS.md` and `AGENTS.md` before starting. Pick the first uncompleted `[ ]` Stage in `WORKFLOWS.md`, perform JIT file reconnaissance, synthesize granular tasks into `PLANS.md`, execute natively, and move completed stage tasks into `.loop/archive/PLANS.md`.
- **Verification Before Completion:** Every task must pass a verification gate (automated test, runtime check, or documented manual verification) before being marked `[x]`. See `LOOP.md` §5 (Verification Gates) for gate types.
- **Goal Immutability:** Goals in `GOALS.md` are structure-preserving ledger entries. When completing a goal, mutate ONLY the `**Status**:` line. Never collapse, truncate, or rewrite the goal body. See `LOOP.md` §3 (Goal Lifecycle).
- **Guardrails & Surgical Rollbacks:** Respect limits in `LOOP.md` §8. Never run `git reset --hard` globally; log intent in `DECISIONS.md` and use targeted `git checkout Pre-{TaskID} -- {TargetFiles}` via native `run_command` (relying on host native approval).
- **Quality Bar:** All deliverables must meet the quality thresholds in `LOOP.md` §6 — no placeholders, proper documentation, pattern conformance.
- **Continuous Execution:** Do not stop execution until the entire `WORKFLOWS.md` is completed unless you encounter a blocking issue requiring user feedback.

---

> **AGENT ACKNOWLEDGMENT:** By executing commands within this repository, you implicitly agree to validate your outputs against these directives and the full `LOOP.md` Autonomous Execution Manifest. If you invent an external service to handle loops, ignore the native Markdown-driven process, or collapse goal structures on completion, you have failed the prompt.
