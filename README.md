# LoopOS

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

**LoopOS** is a lightweight, 100% native autonomous loop protocol for your AI coding assistants (Gemini, Claude, OpenCode, and more).

It gives your agent a persistent **VFS memory** and **structured execution pipeline** inside a local `.loop/` folder—allowing it to execute complex, multi-goal engineering tasks autonomously without external daemons, proxies, or background servers.

---

## Key Features

- **100% Native & Zero-Daemon:** Runs entirely via standard Markdown files and your agent's native tools. No background Node servers or proxy daemons required.
- **Stage-Driven Memory (`CONTEXT_MAP.md`):** Keeps prompt memory lean (Max 10 files per active stage) to prevent token window degradation on large codebases.
- **Topological Goal Graphs (`Depends On`):** Supports multi-goal projects with strict dependency graphs (e.g. Goal 2 waits for Goal 1).
- **Strict TDD Enforcement:** Automatically writes failing unit tests (**RED state**) before writing implementation logic (**GREEN state**).
- **Cross-Goal Regression Sweeps:** Automatically re-runs legacy verification tests when completing new goals to ensure zero regressions.
- **Pattern Consolidation (`PATTERNS.md`):** Distills codebase gotchas into a living, reusable design guide for future sessions.
- **Safe Surgical Rollbacks:** Reverts targeted files safely via native git checkouts with full user permission visibility.

---

## Universal Installation

Install LoopOS globally across all your CLI agents with a single command:

```bash
npx loopos-install
```

*(Or clone the repository and run `node install.js`)*

This activates the `/loop` protocol globally in Gemini CLI, Claude CLI, and OpenCode CLI.

---

## Quick Start

In any project directory, ask your AI agent to run a loop:

```bash
> @agent "Use /loop Goal 1: Build User Auth in auth.js with tests. Goal 2: Build Profile API in profile.js with tests (Depends On: G1)."
```

The agent will automatically scaffold a `.loop/` folder, map out a topological pipeline, write an execution checklist, and execute the task autonomously until all goals pass verification!

---

## How It Works

LoopOS maintains state in a human-readable `.loop/` directory inside your workspace:

- `GOALS.md` — The goal ledger with topological dependency graphs.
- `WORKFLOWS.md` — High-level stage pipeline.
- `PLANS.md` — Active stage to-do list (automatically archived upon stage completion).
- `CONTEXT_MAP.md` — Active stage file bounds (Max 10 target files).
- `VERIFICATIONS.md` — Append-only verification command transcripts.
- `DECISIONS.md` — Architectural decision records & hypothesis pivots.
- `PATTERNS.md` — Consolidated codebase coding standards.

---

## License

Apache License 2.0 — see [LICENSE](LICENSE) for details.
