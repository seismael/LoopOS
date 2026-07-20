# LOOP.md — Autonomous Execution Manifest

> The definitive contract governing how AI Agents execute autonomous loops
> in this project. Every section is a binding directive.

## 1. Identity & Execution Mode

- **Native Execution**: The Agent IS the kernel. You operate natively using your own built-in capabilities — file I/O, shell commands, code generation, browser preview, and subagent delegation.
- **No External Middleware**: No daemons, no MCP servers, no background processes. LoopOS is pure prompt-driven architecture.
- **State Persistence**: All operational state persists exclusively in `.loop/` VFS files. If it's not in a file, it doesn't exist.

## 2. Execution Pipeline

Default 5-phase pipeline per goal. Phases may be overridden or extended by the goal's own constraints in `GOALS.md`.

| Phase | Name | Deliverable | State File |
|:---:|:---|:---|:---|
| 1 | **Scoping** | Decompose goal into deterministic "Done When" criteria; write execution checklist | `GOALS.md`, `PLANS.md` |
| 2 | **Design & Setup** | Scaffold project structure, record architectural decisions | `DECISIONS.md` |
| 3 | **Test-Driven Implementation** | Write failing tests first, then implementation code to pass them | `PLANS.md` (task progression) |
| 4 | **Refactor & Document** | Clean up code, add documentation, record codebase gotchas | `LEARNINGS.md` |
| 5 | **Verification** | Run verification gates, confirm all acceptance criteria are met | `CHANGELOG.md` |

> **Pipeline Override**: If the goal explicitly specifies a different workflow (e.g., research-only, UI-only, refactor-only), adapt the pipeline accordingly. The 5-phase default applies when no override is specified.

## 3. State Protocol

The `.loop/` directory is the single source of truth. Each file has a strict purpose:

| File | Role | Mutation Rules |
|:---|:---|:---|
| `GOALS.md` | **Goal Ledger** — Immutable-structure entries tracking what must be achieved | Status-only field mutations. Never truncate, collapse, or rewrite goal bodies. |
| `PLANS.md` | **Execution Checklist** — Ordered task breakdown per phase | `[ ]` → `[/]` → `[x]` transitions only. Append new phases; never delete completed ones. |
| `CHANGELOG.md` | **Delivery Record** — Chronological log of what was built and when | Append-only. One entry per completed task or milestone. |
| `DECISIONS.md` | **Decision Records** — Architectural choices with rationale | Append-only. Format: `**D{N}**: {Decision} — {Rationale}.` |
| `LEARNINGS.md` | **Gotchas & Patterns** — Discovered pitfalls, workarounds, and useful patterns | Append-only. These inform future goals in the same project. |
| `LOOP.md` | **Runtime Config** — Per-project execution parameters (copied from template) | Mutable. Agent may adjust parameters mid-loop if justified in DECISIONS.md. |

### Goal Lifecycle (Immutable Structure)

Goals are **append-only, structure-preserving ledger entries**.

**Status transitions**: `🔵 Defined` → `🟡 In Progress` → `✅ Complete` (or `🔴 Blocked`).

**Rules:**
1. When a goal is first written, it MUST include: title, status, "Done When" criteria, and any relevant constraints or acceptance criteria.
2. When transitioning status, you MUST use `replace_file_content` to change **ONLY** the `**Status**:` line. Never rewrite, truncate, or collapse the goal body.
3. Completed goals retain their full structure permanently — they serve as the historical record of what was defined and achieved.

**Goal Template:**
```markdown
## G{N}: {Title}
**Status**: 🔵 Defined
**Done When**:
- {Deterministic acceptance criterion 1}
- {Deterministic acceptance criterion 2}
**Constraints**:
- {Any relevant constraints, dependencies, or non-goals}
```

## 4. Context Scoping & Delegation

Managing context is critical for long-running loops across complex goals.

- **Context Boundaries**: Before each major phase, prune irrelevant context from your working memory. Focus only on the files, specs, and state relevant to the current task.
- **Subagent Delegation**: For complex or isolated tasks, spawn a subagent with a bounded context scope:
  - Parent agent retains orchestration responsibility and all `.loop/` state writes.
  - Subagent receives only the files and specifications relevant to its sub-task.
  - Subagent reports results back; parent validates and updates state.
- **Context Hygiene**: If the context window is nearing saturation, summarize completed work in `CHANGELOG.md` and offload details before continuing.

## 5. Verification Gates

Before marking any plan task `[x]`, the agent MUST pass at least one verification gate:

| Gate Type | When to Use | Examples |
|:---|:---|:---|
| **Automated** | Code changes with existing test infrastructure | Unit tests, linters, type checks, build commands |
| **Runtime** | UI, API, or CLI deliverables | Browser preview, curl validation, CLI output checks |
| **Structural** | File/config changes without runnable tests | File existence checks, schema validation, content grep |
| **Manual Fallback** | No automated gate is feasible | Document what was verified and how in `CHANGELOG.md` |

> **Hard Rule**: Never mark a task `[x]` without documenting what verification was performed. "I wrote the code" is not verification.

## 6. Quality Thresholds

These are non-negotiable standards for every deliverable:

- **Pattern Conformance**: Read `AGENTS.MD` before writing any code. Follow the project's established patterns, naming conventions, and architectural boundaries.
- **No Placeholders**: Every deliverable must be production-grade. No `TODO` stubs, no lorem ipsum, no mock data unless the goal explicitly requests prototyping.
- **Documentation**: All non-trivial functions, classes, and modules must have docstrings/JSDoc/TSDoc appropriate to the project's language.
- **Design Bar**: If the goal involves UI, the deliverable must meet the project's stated design standards. Generic or "basic" output is a failure state.

## 7. Error Handling & Recovery

Failures during execution are handled by category:

| Failure Type | Response | Max Attempts |
|:---|:---|:---|
| **Transient** (network, rate limits, timeout) | Retry with exponential backoff | 3 |
| **Logic** (test failure, build error, type error) | Self-diagnose → fix → re-verify | 3 per task |
| **Ambiguity** (unclear requirements, missing specs) | Mark goal `🔴 Blocked`, document the blocker in `GOALS.md`, request user input | 1 (then wait) |
| **Destructive** (data loss risk, irreversible operation) | Log intent to `DECISIONS.md`, request user confirmation before proceeding | 1 (then wait) |

> **Never silently skip a failing task.** Either fix it, escalate it, or block the goal.

## 8. Guardrails

Hard limits to prevent runaway loops and scope creep:

- **Max Iterations Per Goal**: 30 task-level iterations. If a goal cannot be completed within this budget, mark it `🔴 Blocked` and report to the user.
- **Mandatory Pause**: Before any destructive operation (database migration, bulk file deletion, production deployment), log the intent to `DECISIONS.md` and pause for user confirmation.
- **No Scope Creep**: If a task reveals work beyond the current goal, log it as a **new goal candidate** in `GOALS.md` with status `🔵 Defined`. Do not execute it in the current loop iteration.
- **Single Responsibility**: Each plan task should be completable in one focused execution step. If a task grows complex, decompose it into sub-tasks in `PLANS.md`.

## 9. Multi-Goal Orchestration

When multiple goals exist in `GOALS.md`:

- **Sequential by Default**: Goals execute in order (G1 → G2 → G3). A new goal is not started until the current goal reaches `✅ Complete`.
- **Mid-Loop Additions**: New goals added during execution are appended to `GOALS.md` with status `🔵 Defined` and queued after the current goal.
- **Cross-Goal Dependencies**: If Goal B depends on Goal A, this must be explicitly declared in Goal B's `**Constraints**:` section. The agent must not start Goal B until Goal A is `✅ Complete`.
- **Goal Rejection**: If a proposed goal conflicts with existing goals or architectural boundaries, the agent should document the conflict in `DECISIONS.md` and request user resolution.

## 10. Finalization Protocol

When all goals in `GOALS.md` reach `✅ Complete`:

1. **Audit**: Verify every task in `PLANS.md` is marked `[x]`.
2. **Changelog**: Write a final summary entry to `CHANGELOG.md` covering all deliverables.
3. **Learnings**: Capture any final codebase insights in `LEARNINGS.md`.
4. **Report**: Declare the loop complete to the user with a concise summary of:
   - Goals achieved
   - Key decisions made
   - Any deferred goals (status `🔵 Defined`) that remain for future loops
