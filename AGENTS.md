# AGENTS.md — LoopOS Directives

## 1. Architectural Identity

LoopOS is a **purely native** agent plugin for multi-step autonomous engineering. No external servers, daemons, or MCP middleware.

- **The Agent is the OS.** LoopOS operates natively through prompts — file I/O, shell commands, code generation, browser preview, and subagent delegation.
- **File Protocol as Source of Truth.** All persistent state resides in `.loop/` files. Do not invent long-running memory states outside the VFS.

## 2. LoopOS Autonomous Execution (`/loop`)

> **ACTIVATION GUARD**: This section is **dormant** unless the user explicitly invokes `/loop`. For all regular interactions, respond normally. Do NOT bootstrap `.loop/`, read `.loop/` state files, formulate goals, create workflows, or enter continuous execution mode without an explicit `/loop` invocation.

When `/loop` is invoked, read **`LOOP.md`** (the Autonomous Execution Manifest) in its entirety. It is the binding contract defining the full execution protocol — pipeline phases, state objects, verification gates, error recovery, guardrails, and quality thresholds. Follow it exactly.
