const fs = require("fs");
const path = require("path");
const os = require("os");

const homedir = os.homedir();
const sourceDir = __dirname;

// 1. Install to Gemini Config
const targetDir = path.join(homedir, ".gemini", "config", "plugins", "loop-os");

console.log("--- Installing LoopOS Native Agent Plugin ---");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.copyFileSync(path.join(sourceDir, "plugin.json"), path.join(targetDir, "plugin.json"));

const skillsSourceDir = path.join(sourceDir, "skills", "loop");
const skillsTargetDir = path.join(targetDir, "skills", "loop");

if (!fs.existsSync(skillsTargetDir)) {
  fs.mkdirSync(skillsTargetDir, { recursive: true });
}

fs.copyFileSync(path.join(skillsSourceDir, "SKILL.md"), path.join(skillsTargetDir, "SKILL.md"));
console.log("✔ Successfully installed LoopOS into Gemini.");

// 2. Install to Claude Config
const claudeConfigPath = path.join(homedir, ".claude", "CLAUDE.md");
const skillContent = fs.readFileSync(path.join(skillsSourceDir, "SKILL.md"), "utf8");

// Extract just the markdown body, ignoring the YAML frontmatter
const skillBody = skillContent.split("---")[2].trim();

const claudeHeader = "\n\n## 5. NATIVE /loop PROTOCOL\n";

if (!fs.existsSync(path.dirname(claudeConfigPath))) {
  fs.mkdirSync(path.dirname(claudeConfigPath), { recursive: true });
}
if (!fs.existsSync(claudeConfigPath)) {
  fs.writeFileSync(claudeConfigPath, "");
}
let claudeContent = fs.readFileSync(claudeConfigPath, "utf8");
if (!claudeContent.includes("NATIVE /loop PROTOCOL")) {
  fs.appendFileSync(claudeConfigPath, claudeHeader + skillBody);
  console.log("✅ Successfully injected /loop protocol into CLAUDE.md (Claude).");
} else {
  const beforeLoop = claudeContent.split("## 5. NATIVE /loop PROTOCOL")[0];
  fs.writeFileSync(claudeConfigPath, beforeLoop + claudeHeader + skillBody);
  console.log("✅ Successfully updated /loop protocol in CLAUDE.md.");
}

// 3. Install to OpenCode (Gemini) Global Rules
const opencodeConfigPath = path.join(homedir, ".gemini", "config", "AGENTS.md");
if (!fs.existsSync(path.dirname(opencodeConfigPath))) {
  fs.mkdirSync(path.dirname(opencodeConfigPath), { recursive: true });
}
if (!fs.existsSync(opencodeConfigPath)) {
  fs.writeFileSync(opencodeConfigPath, "");
}
let opencodeContent = fs.readFileSync(opencodeConfigPath, "utf8");
if (!opencodeContent.includes("NATIVE /loop PROTOCOL")) {
  fs.appendFileSync(opencodeConfigPath, claudeHeader + skillBody);
  console.log("✅ Successfully injected /loop protocol into AGENTS.md (OpenCode).");
} else {
  const beforeLoop = opencodeContent.split("## 5. NATIVE /loop PROTOCOL")[0];
  fs.writeFileSync(opencodeConfigPath, beforeLoop + claudeHeader + skillBody);
  console.log("✅ Successfully updated /loop protocol in AGENTS.md.");
}


console.log("Installation Complete! You can now use `/loop` across all agents.");

