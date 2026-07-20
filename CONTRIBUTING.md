# Contributing to LoopOS

First off, thank you for considering contributing to LoopOS! It's people like you that make open source such a great community.

## 1. Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check if there's already an open issue for it. If not, feel free to open a new one.

## 2. Setting up your environment

LoopOS is uniquely built as a 100% native agent protocol. Therefore, there is no massive codebase to compile!
The entire architecture lives inside `skills/loop/SKILL.md` and the universal `install.js` script.

1. Fork the repo and clone it locally.
2. Make edits to `skills/loop/SKILL.md` to enhance the autonomous loop behavior.
3. Test your changes locally by running `node install.js` to sync your local changes to your agent CLIs.

## 3. Core Philosophy

- **Zero Middleware:** We are strictly against adding external MCP servers or backend daemons. LoopOS is a pure agent kernel. Any new features must be natively driven by agent prompts and file I/O operations.
- **VFS State:** All operational state must live in `.loop/` files. Do not rely on persistent memory outside of the workspace file system.

## 4. Submitting a Pull Request

1. Create a new branch (`git checkout -b feature/amazing-feature`).
2. Make your changes and commit them with descriptive messages.
3. Push your branch to GitHub and open a Pull Request.

By contributing to LoopOS, you agree that your contributions will be licensed under its Apache 2.0 License.
