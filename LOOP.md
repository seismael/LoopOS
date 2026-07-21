# LOOP.md — Autonomous Execution Manifest

> The definitive contract governing how AI Agents execute autonomous loops
> in this project. Every section is a binding directive.

## 1. Identity & Execution Mode

- **Native Execution**: The Agent IS the kernel. You operate natively using your own built-in capabilities — file I/O, shell commands, code generation, browser preview, and subagent delegation.
- **No External Middleware**: No daemons, no MCP servers, no background processes. LoopOS is pure prompt-driven architecture.
- **State Persistence**: All operational state persists exclusively in `.loop/` VFS files. If it's not in a file, it doesn't exist.

## 2. Execution Pipeline (State Machine)

The execution pipeline is a strict state machine. You must not transition to the next phase until all Exit Criteria of the current phase are met.

### Phase 1: Intent Scoping & Alignment
**Objective**: Translate intent into a deterministic Goal and audit alignment.
**Entry Criteria**: New Goal required.
**Exit Criteria**: 
- `GOALS.md` contains deterministic "Done When" criteria with status `🔵 Defined`.
- **Goal Alignment Gate**: Pre-flight audit verified against `DECISIONS.md` (ADRs) and `AGENTS.md`. Any conflicts logged to `DECISIONS.md` before transitioning goal to `🟡 In Progress`.

### Phase 2: Workflow Orchestration
**Objective**: Dynamically design the high-level pipeline for the goal.
**Entry Criteria**: Goal is `🔵 Defined` and aligned.
**Exit Criteria**: `WORKFLOWS.md` contains an ordered list of Stages required to complete the Goal.

### Phase 3: Stage Execution (JIT Planning & Loop)
**Objective**: Synthesize granular tasks for the *current* Stage, then iteratively execute and verify them.
**Entry Criteria**: Uncompleted Stages exist in `WORKFLOWS.md`.
**Exit Criteria**: 
- `PLANS.md` tasks for the current Stage are all `[x]`.
- Every `[x]` task has a verification record in `VERIFICATIONS.md`.
- Current Stage in `WORKFLOWS.md` is marked `[x]`.
- **Clean VFS Archival**: Completed stage tasks are moved from `PLANS.md` into `.loop/archive/PLANS.md`. (Loop repeats for next Stage).

### Phase 4: Finalization
**Objective**: Clean up and report.
**Entry Criteria**: All Stages in `WORKFLOWS.md` are marked `[x]`.
**Exit Criteria**:
- Goal status in `GOALS.md` updated to `✅ Complete`.
- `CHANGELOG.md` updated with deliverables.
- `LEARNINGS.md` updated with any codebase gotchas.

## 3. State Protocol & Structured Objects

The `.loop/` directory is the single source of truth. Each file has a strict purpose and format.

| File / Path | Role | Mutation Rules |
|:---|:---|:---|
| `GOALS.md` | **Goal Ledger** | Status-only field mutations. Never rewrite goal bodies. |
| `WORKFLOWS.md` | **Workflow Ledger** | Contains ordered Stages for active Goals. |
| `PLANS.md` | **Execution Checklist** | Contains Structured Task Objects, generated **JIT** per Stage. |
| `VERIFICATIONS.md` | **Verification Ledger** | Append-only. Contains Proof of passing gates. |
| `CHANGELOG.md` | **Delivery Record** | Append-only log of milestones. |
| `DECISIONS.md` | **Decision Records** | Append-only. Contains Structured ADR Objects. |
| `LEARNINGS.md` | **Gotchas & Patterns** | Append-only insights. |
| `archive/` | **VFS Archival** | Stores archived ledger snapshots (`PLANS.md`, `CHANGELOG.md`). |
| `LOOP.md` | **Runtime Config** | Immutable during a loop (unless Rule Relaxation triggered). |
| `capabilities/`| **Tool Registry** | Markdown tool capabilities & auto-detected environment commands (`detected.md`). |

### 3a. Goal Object (`GOALS.md`)
**Rules**: Append-only, structure-preserving. Status transitions: `🔵 Defined` → `🟡 In Progress` → `✅ Complete` (or `🔴 Blocked`).

```markdown
## G{N}: {Title}
**Status**: 🔵 Defined
**Done When**:
- {Deterministic acceptance criterion 1}
- {Deterministic acceptance criterion 2}
**Constraints**:
- {Any relevant constraints, dependencies, or non-goals}
```

### 3b. Workflow Object (`WORKFLOWS.md`)
**Rules**: A dynamically generated sequence of high-level Stages tailored to the active Goal.

```markdown
## W-{GoalID}: {Title}
**Type**: {Feature | Bug Fix | Refactor | Scaffolding}
**Stages**:
1. [ ] Stage 1: {Description of logical checkpoint}
2. [ ] Stage 2: {Description}
```

### 3c. Task Object (`PLANS.md`)
**Rules**: Populated via Just-In-Time (JIT) planning. Only tasks for the *currently active Stage* exist here. Every task must be defined using this structure before any code is written.

```markdown
### T{Phase}.{Step}: {Task Title}
**Status**: [ ] Pending | [/] In Progress | [x] Completed
**Depends On**: [List of preceding Task IDs, e.g., T1.1]
**Target Files**: 
- `path/to/file.ext`
**Verification Gate**: {Automated | Runtime | Structural}
**Verification Command**: `{exact command to run}`
**Execution Steps**:
- {Specific action 1}
- {Specific action 2}
```

### 3d. Verification Record (`VERIFICATIONS.md`)
**Rules**: Before marking a task `[x]`, you MUST append a record here proving it passed its gate.

```markdown
### V-{TaskID}: {Verification Title}
**Timestamp**: {YYYY-MM-DD HH:MM:SS}
**Gate Type**: {Automated | Runtime | Structural | Manual}
**Command Run**: `{The exact command executed}`
**Output Transcript**:
```text
(Paste the trailing ~15 lines of the successful test/build output here)
```
**Status**: ✅ Passed
```

### 3e. ADR Object (`DECISIONS.md`)
**Rules**: Any design choice, new dependency, or pattern deviation MUST be logged here.

```markdown
### ADR-{N}: {Decision Title}
**Status**: 🔵 Proposed | ✅ Accepted | ❌ Rejected
**Context**: {Brief description of the problem}
**Options Considered**:
1. {Option A} — Pros: ..., Cons: ...
2. {Option B} — Pros: ..., Cons: ...
**Decision**: {The chosen option}
**Consequences**: {Impact on the system}
```

## 4. Context Scoping & Delegation

Managing context is critical for long-running loops across complex goals.

- **Context Boundaries**: Before each major phase, prune irrelevant context from your working memory. Focus only on the files, specs, and state relevant to the current task.
- **Subagent Delegation**: For complex or isolated tasks, spawn a subagent with a bounded context scope:
  - Parent agent retains orchestration responsibility and all `.loop/` state writes.
  - Subagent receives only the files and specifications relevant to its sub-task.
  - Subagent reports results back; parent validates and updates state.
- **Context Hygiene**: If the context window is nearing saturation, summarize completed work in `CHANGELOG.md` and offload details before continuing.

## 5. Verification Policy

Before marking any plan task `[x]`, the agent MUST pass a verification gate and log it to `VERIFICATIONS.md`:

| Gate Type | When to Use | Examples |
|:---|:---|:---|
| **Automated** | Code changes with existing test infrastructure | Unit tests, linters, type checks, build commands |
| **Runtime** | UI, API, or CLI deliverables | Browser preview, curl validation, CLI output checks |
| **Structural** | File/config changes without runnable tests | File existence checks, schema validation, content grep |
| **Manual Fallback** | No automated gate is feasible | Document exactly what was manually verified and how |

> **Hard Rule**: Never mark a task `[x]` without documenting the verification record. "I wrote the code" is not verification.


## 6. Quality Thresholds

These are non-negotiable standards for every deliverable:

- **Pattern Conformance**: Read `AGENTS.md` before writing any code. Follow the project's established patterns, naming conventions, and architectural boundaries.
- **No Placeholders**: Every deliverable must be production-grade. No `TODO` stubs, no lorem ipsum, no mock data unless the goal explicitly requests prototyping.
- **Documentation**: All non-trivial functions, classes, and modules must have docstrings/JSDoc/TSDoc appropriate to the project's language.
- **Design Bar**: If the goal involves UI, the deliverable must meet the project's stated design standards. Generic or "basic" output is a failure state.

## 7. Error Handling & Recovery

Failures during execution are handled by category:

| Failure Type | Response | Max Attempts |
|:---|:---|:---|
| **Transient** (network, rate limits, timeout) | Retry with exponential backoff | 3 |
| **Logic** (test failure, build error, type error) | Self-diagnose → fix → re-verify. If 3 attempts fail, trigger Rule Relaxation or log intent to `DECISIONS.md` and propose a **Surgical Rollback** (`git checkout Checkpoint-Pre-{TaskID} -- {TargetFiles}`) via native `run_command`. | 3 per task |
| **Ambiguity** (unclear requirements, missing specs) | Mark goal `🔴 Blocked`, document the blocker in `GOALS.md`, request user input | 1 (then wait) |
| **Destructive** (data loss risk, irreversible operation) | Log intent to `DECISIONS.md`, defer to native host UI permission prompts | 1 (then wait) |

### 7a. Dynamic Rule Relaxation (The "Frustration" Metric)
If the agent fails verification 3 times for a strict rule (e.g., a rigid linter or type-checker blocking core logic progress), the agent is permitted to temporarily amend `.loop/LOOP.md` to append an explicit exception (e.g., `Exception: Ignore TS-Lint for Task 3.2`) to maintain forward momentum. This MUST be logged in `DECISIONS.md`.

> **Never silently skip a failing task.** Either fix it, escalate it, or block the goal.

## 8. Guardrails

Hard limits to prevent runaway loops and scope creep:

- **Max Iterations Per Goal**: 30 task-level iterations. If a goal cannot be completed within this budget, mark it `🔴 Blocked` and report to the user.
- **Mandatory Checkpointing (Git)**: Before modifying any files for a task, the agent MUST checkpoint the workspace by running `git add .` and `git commit -m "LoopOS Checkpoint: Pre-{TaskID}"`.
- **Safe Surgical Rollback**: Never run global `git reset --hard`. If a task fails all fix attempts, log the rollback intent in `DECISIONS.md` and revert ONLY the failing task's target files using `git checkout Checkpoint-Pre-{TaskID} -- {TargetFiles}` via `run_command` (relying on host native approval).
- **Native Host Approvals**: Do not invent parallel approval CLI scripts or prompt hacks. All tool permissions and approvals defer 100% to the host agent's native UI permission prompts. Log intent to `DECISIONS.md` prior to executing sensitive commands.
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

1. **Audit**: Verify every Stage in `WORKFLOWS.md` is marked `[x]`.
2. **Changelog**: Write a final summary entry to `CHANGELOG.md` covering all deliverables.
3. **Learnings**: Capture any final codebase insights in `LEARNINGS.md`.
4. **Report**: Declare the loop complete to the user with a concise summary of:
   - Goals achieved
   - Key decisions made
   - Any deferred goals (status `🔵 Defined`) that remain for future loops

## 11. Capability Registry

To execute proprietary or highly specialized workflows natively, users can place markdown files in `.loop/capabilities/` (e.g., `database-tools.md`, `deploy-scripts.md`).
During the Reconnaissance phase, the agent MUST read all files in this directory to load its permitted capabilities. This acts as a native dependency injection for agent tooling.
