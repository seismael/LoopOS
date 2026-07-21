#!/usr/bin/env node
/**
 * LoopOS Universal Native Agent Plugin Installer
 * 
 * Supports: Windows (PowerShell/CMD), macOS (Zsh/Bash), Linux, WSL, FreeBSD
 * Zero External Dependencies — 100% Native Node.js
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

console.log("--- Installing LoopOS Native Agent Plugin ---");

// 1. Cross-Platform Home & XDG Directory Resolver
function resolveHomeDir() {
  return process.env.XDG_CONFIG_HOME || process.env.HOME || os.homedir();
}

// 2. Line-Ending Normalization (CRLF -> LF)
function normalizeLF(str) {
  return str ? str.replace(/\r\n/g, "\n") : "";
}

// 3. Extract SKILL.md Body (Stripping YAML Frontmatter)
const sourceDir = __dirname;
const skillsSourceDir = path.join(sourceDir, "skills", "loop");
const skillPath = path.join(skillsSourceDir, "SKILL.md");

if (!fs.existsSync(skillPath)) {
  console.error("❌ Error: SKILL.md not found at expected path:", skillPath);
  process.exit(1);
}

const rawSkillContent = normalizeLF(fs.readFileSync(skillPath, "utf8"));
let skillBody = rawSkillContent;

if (rawSkillContent.startsWith("---")) {
  const secondIndex = rawSkillContent.indexOf("---", 3);
  if (secondIndex !== -1) {
    skillBody = rawSkillContent.substring(secondIndex + 3).trim();
  }
}

const homedir = resolveHomeDir();
const loopHeader = "\n\n## 5. NATIVE /loop PROTOCOL\n";

// 4. Atomic Cross-Platform Protocol Injector
function injectOrUpdateProtocol(filePath, agentName) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const content = fs.existsSync(filePath) ? normalizeLF(fs.readFileSync(filePath, "utf8")) : "";
  let updated = "";

  if (!content.includes("NATIVE /loop PROTOCOL")) {
    updated = content + (content && !content.endsWith("\n") ? "\n" : "") + loopHeader + skillBody + "\n";
    console.log(`✅ Successfully injected /loop protocol into ${path.basename(filePath)} (${agentName}).`);
  } else {
    const beforeLoop = content.split("## 5. NATIVE /loop PROTOCOL")[0].trimEnd();
    updated = beforeLoop + loopHeader + skillBody + "\n";
    console.log(`✅ Successfully updated /loop protocol in ${path.basename(filePath)} (${agentName}).`);
  }

  // Atomic write via temp file to avoid corruption
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, updated, "utf8");
  fs.renameSync(tmpPath, filePath);
}

// 5. Multi-Agent Installation Matrix
// A. Gemini Plugin Installation
const geminiTargetDir = path.join(homedir, ".gemini", "config", "plugins", "loop-os");
const geminiSkillsDir = path.join(geminiTargetDir, "skills", "loop");

if (!fs.existsSync(geminiSkillsDir)) {
  fs.mkdirSync(geminiSkillsDir, { recursive: true });
}

fs.copyFileSync(path.join(sourceDir, "plugin.json"), path.join(geminiTargetDir, "plugin.json"));
fs.copyFileSync(skillPath, path.join(geminiSkillsDir, "SKILL.md"));
console.log("✔ Successfully installed LoopOS plugin into Gemini.");

// B. Claude CLI Global Config Injection
const claudeConfigPath = path.join(homedir, ".claude", "CLAUDE.md");
injectOrUpdateProtocol(claudeConfigPath, "Claude CLI");

// C. OpenCode CLI Global Config Injection
const opencodeConfigPath = path.join(homedir, ".gemini", "config", "AGENTS.md");
injectOrUpdateProtocol(opencodeConfigPath, "OpenCode CLI");

console.log("\nInstallation Complete! LoopOS is active across all agents and ready to run `/loop`.");
