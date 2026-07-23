#!/usr/bin/env node
/**
 * LoopOS Universal Native Agent Plugin Installer
 *
 * Installs LoopOS across all supported AI agent CLIs:
 * - Gemini CLI (plugin system)
 * - Claude CLI (CLAUDE.md global config)
 * - OpenCode CLI (AGENTS.md global config)
 *
 * Supports: Windows (PowerShell/CMD), macOS (Zsh/Bash), Linux, WSL, FreeBSD
 * Zero External Dependencies — 100% Native Node.js
 *
 * @module install
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

console.log("--- Installing LoopOS Native Agent Plugin ---");

// ─── Utilities ───────────────────────────────────────────────────────────────

/**
 * Resolves the user's home directory across platforms.
 * Respects XDG_CONFIG_HOME, HOME, and os.homedir() in priority order.
 * @returns {string} Absolute path to the home directory.
 */
function resolveHomeDir() {
  return process.env.XDG_CONFIG_HOME || process.env.HOME || os.homedir();
}

/**
 * Normalizes line endings to LF for consistent cross-platform string ops.
 * @param {string} str - Input string.
 * @returns {string} String with CRLF replaced by LF.
 */
function normalizeLF(str) {
  return str ? str.replace(/\r\n/g, "\n") : "";
}

/**
 * Performs an atomic file write via temp-file-then-rename to prevent corruption.
 * @param {string} filePath - Target file path.
 * @param {string} content - Content to write.
 */
function atomicWrite(filePath, content) {
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, content, "utf8");
  fs.renameSync(tmpPath, filePath);
}

// ─── Minimal Activation-Gated Pointer ────────────────────────────────────────

/**
 * The minimal section injected into agent global configs.
 * Contains ONLY an activation guard and a pointer to the skill/LOOP.md.
 * The full protocol lives in SKILL.md (Gemini) or LOOP.md (project-level).
 */
const LOOP_SECTION_HEADER = "## 5. NATIVE /loop PROTOCOL";

const LOOP_SECTION_CONTENT = `## 5. NATIVE /loop PROTOCOL

> **ACTIVATION GUARD**: The LoopOS protocol is ONLY active when the user explicitly invokes \`/loop\` or explicitly says "run the loop" / "start the loop". For ALL other interactions, this section is **dormant**. Do NOT bootstrap \`.loop/\`, read \`.loop/\` state files, formulate goals, create workflows, or execute the loop protocol. Respond to the user's request directly using standard agent behavior.

When activated via \`/loop\`, read the loop skill instructions (\`SKILL.md\`) and follow the protocol defined there. The full protocol lives exclusively in the skill file, not here.
`;

// ─── Protocol Injector ───────────────────────────────────────────────────────

/**
 * Injects or updates the minimal LoopOS pointer section in an agent's
 * global config file. Preserves all existing user content.
 *
 * Behavior:
 * - If the section doesn't exist → appends the minimal pointer.
 * - If the section exists → replaces only that section with the minimal pointer.
 * - Never overwrites the entire file; only touches the LoopOS section.
 *
 * @param {string} filePath - Absolute path to the agent's global config file.
 * @param {string} agentName - Display name for console output (e.g., "Claude CLI").
 */
function injectOrUpdateProtocol(filePath, agentName) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const content = fs.existsSync(filePath)
    ? normalizeLF(fs.readFileSync(filePath, "utf8"))
    : "";

  let updated = "";

  if (!content.includes(LOOP_SECTION_HEADER)) {
    // Append — preserve all existing content, add section at the end
    updated =
      content +
      (content && !content.endsWith("\n") ? "\n" : "") +
      "\n" +
      LOOP_SECTION_CONTENT +
      "\n";
    console.log(
      `  ✅ Appended /loop activation guard to ${path.basename(filePath)} (${agentName}).`
    );
  } else {
    // Update — replace only the LoopOS section, preserve everything before it
    const beforeLoop = content.split(LOOP_SECTION_HEADER)[0].trimEnd();
    updated = beforeLoop + "\n\n" + LOOP_SECTION_CONTENT + "\n";
    console.log(
      `  ✅ Updated /loop activation guard in ${path.basename(filePath)} (${agentName}).`
    );
  }

  atomicWrite(filePath, updated);
}

// ─── Source Validation ───────────────────────────────────────────────────────

const sourceDir = __dirname;
const skillPath = path.join(sourceDir, "skills", "loop", "SKILL.md");

if (!fs.existsSync(skillPath)) {
  console.error("❌ Error: SKILL.md not found at expected path:", skillPath);
  process.exit(1);
}

const homedir = resolveHomeDir();

// ─── Multi-Agent Installation ────────────────────────────────────────────────

// A. Gemini CLI — Plugin Installation (copies plugin files into plugin system)
console.log("\n[Gemini CLI]");
const geminiTargetDir = path.join(
  homedir,
  ".gemini",
  "config",
  "plugins",
  "loop-os"
);
const geminiSkillsDir = path.join(geminiTargetDir, "skills", "loop");

if (!fs.existsSync(geminiSkillsDir)) {
  fs.mkdirSync(geminiSkillsDir, { recursive: true });
}

fs.copyFileSync(
  path.join(sourceDir, "plugin.json"),
  path.join(geminiTargetDir, "plugin.json")
);
fs.copyFileSync(skillPath, path.join(geminiSkillsDir, "SKILL.md"));
console.log("  ✔ Installed LoopOS plugin files.");

// Gemini global AGENTS.md — minimal pointer only
const geminiAgentsPath = path.join(
  homedir,
  ".gemini",
  "config",
  "AGENTS.md"
);
injectOrUpdateProtocol(geminiAgentsPath, "Gemini CLI");

// B. Claude CLI — Global CLAUDE.md injection (minimal pointer)
console.log("\n[Claude CLI]");
const claudeConfigPath = path.join(homedir, ".claude", "CLAUDE.md");
injectOrUpdateProtocol(claudeConfigPath, "Claude CLI");

// C. OpenCode CLI — Uses same Gemini config path, already handled above
console.log("\n[OpenCode CLI]");
console.log(
  "  ✔ Shares Gemini config (AGENTS.md). Already configured."
);

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log("\n--- Installation Complete ---");
console.log("LoopOS is installed across all agents.");
console.log("The protocol is DORMANT by default.");
console.log("Invoke /loop in any agent to activate autonomous execution.\n");
