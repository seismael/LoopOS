# LoopOS

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

**LoopOS** is a deterministic, natively-integrated agentic kernel designed to empower AI coding assistants (like Gemini, Claude, and OpenCode) to operate autonomously in multi-step execution loops. By discarding traditional, heavy Node.js or Python backend servers in favor of a 100% native prompt-driven architecture, LoopOS operates identically to an operating system kernel for agent workflows.

## The Concept

Modeled after the "Ralph" concept of autonomous agent loops, LoopOS utilizes pure Markdown and native agent tool capabilities to track state, manage checkpoints, and complete long-running software engineering tasks without losing context or requiring an external daemon.

When you invoke the `/loop` command, the agent uses `.loop/` state files (`GOALS.md`, `PLANS.md`, `CHANGELOG.md`) as its operational memory, continuously picking up the next uncompleted task until the entire pipeline is achieved.

## Features

- **100% Native Architecture:** No daemons, no background servers, no MCP middleware. Just pure agentic capability running on the VFS.
- **Universal CLI Support:** Supports Gemini CLI, Claude CLI, and OpenCode CLI natively.
- **Transparent State Management:** The entire state of the execution loop is visible in human-readable Markdown. Watch the agent check off boxes `[x]` in real-time.
- **Self-Healing Context:** Learns from mistakes natively by appending design insights to `DECISIONS.md` and codebase gotchas to `LEARNINGS.md`.

## Installation

To install the LoopOS native plugin globally across your local agent environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/LoopOS.git
   cd LoopOS
   ```
2. Run the installation script:
   ```bash
   node install.js
   ```

This will automatically inject the `/loop` Native Agent Protocol into your global Agent contexts (Gemini plugins, Claude, and OpenCode `CLAUDE.md`).

## Usage

Navigate to any project directory where you want to start autonomous execution, and trigger your agent:

```bash
> @agent "Use /loop to build a new task manager application."
```

The agent will scaffold the `.loop` directory, present a goal, write an execution checklist, and autonomously begin fulfilling the task.

## Repository Structure

- `plugin.json`: Metadata for the Gemini plugin interface.
- `skills/loop/SKILL.md`: The core LoopOS kernel prompt instructions — the 6-step protocol (Bootstrap → Scope → Execute → Verify → Goal Complete → Finalize).
- `AGENTS.MD`: Mandatory architectural boundaries and native loop behavior directives.
- `LOOP.md`: The **Autonomous Execution Manifest** — the definitive contract governing pipeline phases, state protocol, verification gates, quality thresholds, error handling, guardrails, and multi-goal orchestration.
- `install.js`: The universal installer script.
- `.loop/` (per-project, created at runtime):
  - `GOALS.md` — Immutable-structure goal ledger
  - `PLANS.md` — Execution checklist with task progression
  - `CHANGELOG.md` — Chronological delivery record
  - `DECISIONS.md` — Architectural decision records
  - `LEARNINGS.md` — Codebase gotchas and discovered patterns

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to the core LoopOS protocol.

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

