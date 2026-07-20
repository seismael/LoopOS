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

// 2. Install to Claude / OpenCode Config
const claudeConfigPath = path.join(homedir, ".claude", "CLAUDE.md");
const skillContent = fs.readFileSync(path.join(skillsSourceDir, "SKILL.md"), "utf8");

// Extract just the markdown body, ignoring the YAML frontmatter
const skillBody = skillContent.split("---")[2].trim();

const claudeHeader = "\n\n## 5. NATIVE /loop PROTOCOL\n";

if (fs.existsSync(claudeConfigPath)) {
  let claudeContent = fs.readFileSync(claudeConfigPath, "utf8");
  if (!claudeContent.includes("NATIVE /loop PROTOCOL")) {
    fs.appendFileSync(claudeConfigPath, claudeHeader + skillBody);
    console.log("✔ Successfully injected /loop protocol into CLAUDE.md (Claude & OpenCode).");
  } else {
    // Basic replacement if it already exists
    const beforeLoop = claudeContent.split("## 5. NATIVE /loop PROTOCOL")[0];
    fs.writeFileSync(claudeConfigPath, beforeLoop + claudeHeader + skillBody);
    console.log("✔ Successfully updated /loop protocol in CLAUDE.md.");
  }
} else {
  console.log("�  CLAUDE.md not found, skipping Claude/OpenCode integration.");
}

console.log("Installation Complete! You can now use `/loop` across all agents.");

