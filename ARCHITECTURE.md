# LoopOS Architecture

LoopOS is a 100% native, deterministic agentic kernel designed to orchestrate long-running, autonomous execution loops for AI coding assistants. It discards traditional middleware (like Node.js or Python orchestration servers) in favor of a pure prompt-driven, Virtual File System (VFS)-backed architecture.

## 1. Core Philosophy

The architecture of LoopOS is built on four foundational pillars:

- **Zero Middleware**: The AI Agent *is* the operating system. LoopOS operates natively using the agent's built-in capabilities (file I/O, terminal commands, browser preview). There are no external MCP (Model Context Protocol) servers, background daemons, or polling loops.
- **VFS as State**: All operational memory, context, and execution state persist exclusively in Markdown files within the `.loop/` directory. If a state is not in a `.loop/` file, it does not exist.
- **Deterministic Execution**: The agent follows a rigid `Pick → Execute → Verify → Mark Done → Repeat` cycle defined by explicit rules, preventing infinite loops and hallucinated workflows.
- **Instruction as Code (Markdown-Driven)**: Configuration, guardrails, and behavioral rules are defined in human-readable Markdown (`LOOP.md`, `AGENTS.md`), ensuring the contract is equally legible to the LLM and the human supervisor.

## 2. System Components

### The Kernel Protocol (`skills/loop/SKILL.md`)
This is the core "operating system kernel" loaded into the LLM's system prompt or skill context. It defines the fundamental logic for how the agent should read state, reason about tasks, and update files. It dictates the 6-step autonomous loop:
1. **Bootstrapping**: Scaffolding the `.loop/` state directory.
2. **Workspace Reconnaissance**: Scanning existing patterns, tech stack, and boundaries.
3. **Goal Formulation (Scoping)**: Ingesting user intent into a deterministic plan.
4. **Native Execution**: The continuous task execution cycle.
5. **Verification**: Mandatory gating before task completion.
6. **Finalization**: Auditing and reporting.

### The Execution Manifest (`LOOP.md`)
While `SKILL.md` tells the agent *how* to process a loop, `LOOP.md` tells it *what rules* govern the current project's loop. It defines pipeline phases, verification gate requirements, max iteration limits (guardrails), and quality thresholds.

### The State Files (`.loop/`)
The `.loop/` directory acts as the system's RAM and persistent storage:
- **`GOALS.md` (The Ledger)**: Contains immutable-structure goals. Status transitions from `🔵 Defined` → `🟡 In Progress` → `✅ Complete`. The body of the goal (acceptance criteria, constraints) is strictly preserved to maintain a historical record of intent.
- **`PLANS.md` (The Instruction Pointer)**: Contains the execution checklist. The agent reads this file sequentially, mutating state from `[ ]` (todo) to `[/]` (in-progress) to `[x]` (done).
- **`CHANGELOG.md` (The Event Log)**: An append-only chronological record of what was delivered.
- **`DECISIONS.md` (The ADRs)**: Append-only architectural decision records.
- **`LEARNINGS.md` (The Cache)**: Discovered codebase patterns and gotchas, offloaded from the LLM's active context window to preserve tokens.

## 3. The Execution Engine (The LLM as Processor)

LoopOS relies on the LLM's inherent ability to read context, select a tool, and receive the tool's output. The "loop" is driven by the LLM's instruction to continuously iterate until a stop condition is met.

1. **Read Cycle**: The agent reads `LOOP.md` and `.loop/PLANS.md`.
2. **Instruction Fetch**: It identifies the first `[ ]` task.
3. **State Mutate (Lock)**: It uses `replace_file_content` to change `[ ]` to `[/]`. This acts as a rudimentary lock, signaling intent.
4. **Execute**: The agent uses its toolset (e.g., `write_to_file`, `run_command`) to perform the work.
5. **Verify**: The agent runs a verification gate (e.g., `npm test`, browser preview). If verification fails, it enters a structured Self-Correction Protocol (Diagnose → Fix → Re-verify).
6. **State Mutate (Commit)**: Upon successful verification, it changes `[/]` to `[x]` and appends to `CHANGELOG.md`.
7. **Jump**: The LLM loops back to step 1.

## 4. Context Window Management

A primary challenge in long-running autonomous loops is LLM context window saturation. LoopOS mitigates this architecturally:

- **State Offloading**: Implementation details are flushed to the VFS (`CHANGELOG.md`, `LEARNINGS.md`) rather than kept in the active prompt history. The agent relies on the *current state* of the files rather than its memory of past actions.
- **Context Boundaries**: Before major phases, the agent is instructed to prune irrelevant context and focus only on files pertinent to the active task.
- **Subagent Delegation**: For complex or highly isolated tasks, the main Supervisor Agent spawns a Subagent. The parent passes a tightly bounded context (only specific files/specs). The Subagent performs the work and reports back. The parent handles all `.loop/` state mutations, preventing Subagents from corrupting the orchestration state.

## 5. Security & Guardrails

To prevent runaway agent behavior (infinite loops, destructive actions), LoopOS implements hard guardrails within the `LOOP.md` manifest:

- **Iteration Ceilings**: Goals have a maximum iteration limit (e.g., 30 steps). If exceeded, the goal status transitions to `🔴 Blocked`.
- **Mandatory Pauses**: Destructive operations (e.g., database migrations, bulk file deletions) require the agent to log intent to `DECISIONS.md` and yield execution to the human user for approval.
- **Scope Creep Prevention**: Discovered tangential work must be logged as a *new* goal in `GOALS.md` with status `🔵 Defined` and deferred, rather than executing it inline.

## 6. Integration Architecture

LoopOS injects its kernel protocol into the host agent's environment:

- **Gemini**: Handled via `plugin.json` and a specific `.gemini/config/plugins/loop-os/skills/loop/SKILL.md` installation.
- **Claude / OpenCode**: Handled by appending the core markdown protocol directly into the user's global `~/.claude/CLAUDE.md` context file.

The installer script (`install.js`) manages this cross-platform injection seamlessly, allowing the same fundamental LoopOS architecture to run consistently regardless of the underlying LLM interface.
