# LoopOS

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

**LoopOS** is a lightweight plugin that gives your AI coding assistant (like Gemini or Claude) the ability to execute autonomous, multi-step tasks. 

Instead of relying on heavy background servers or complex proxy scripts, LoopOS uses plain text Markdown files to give your agent a "memory" and a "to-do list", allowing it to work continuously until a goal is achieved.

## Features

- **No Servers Required:** LoopOS is 100% native. It uses your agent's built-in file reading and terminal capabilities to orchestrate its workflow.
- **Smart Pipelines:** The agent automatically breaks large goals into logical stages (e.g. Design -> Build -> Test) so it doesn't get overwhelmed.
- **Transparent State:** The entire execution loop is visible in human-readable Markdown. Watch the agent check off boxes `[x]` in real-time.
- **Built-in Best Practices:** Out of the box, the agent is instructed to write tests, verify its work, and avoid breaking your existing codebase.
- **Self-Healing:** Learns from mistakes natively by appending design insights to `DECISIONS.md` and codebase gotchas to `LEARNINGS.md`.

## Installation

To install LoopOS globally across your local agent environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/LoopOS.git
   cd LoopOS
   ```
2. Run the installation script:
   ```bash
   node install.js
   ```

This injects the `/loop` command into your global Agent contexts (Gemini, Claude, and OpenCode).

## Usage

Navigate to any project directory where you want your agent to build a feature or fix a bug, and type:

```bash
> @agent "Use /loop to build a new task manager application."
```

The agent will automatically create a `.loop/` directory, map out a goal, write an execution checklist, and autonomously begin fulfilling the task.

### How it Works

LoopOS creates a hidden `.loop/` folder in your project. This acts as the agent's brain for the current session:

- `GOALS.md` — What we are trying to achieve.
- `WORKFLOWS.md` — The high-level stages of the project.
- `PLANS.md` — The granular to-do list for the current stage.
- `CHANGELOG.md` — A record of what was successfully completed.

If you want to enforce specific rules for your team (like "Always use TailwindCSS"), you can create an optional `LOOP.md` file in the root of your project, and the agent will obey it.

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
