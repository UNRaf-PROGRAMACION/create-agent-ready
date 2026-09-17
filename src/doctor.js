import { existsSync } from "node:fs";
import { join } from "node:path";

const indicators = [
  ["Godot", "project.godot"],
  ["Node.js", "package.json"],
  ["Unity", "ProjectSettings/ProjectVersion.txt"],
  ["Python", "pyproject.toml"],
  ["Java", "build.gradle"],
  ["Java", "pom.xml"]
];

export function inspectProject(target) {
  const technologies = indicators
    .filter(([, path]) => existsSync(join(target, path)))
    .map(([name]) => name);
  return {
    target,
    node: process.versions.node,
    gitRepository: existsSync(join(target, ".git")),
    opencodeConfig: existsSync(join(target, ".opencode")),
    agentsInstructions: existsSync(join(target, "AGENTS.md")),
    technologies
  };
}

export function doctorReport(result) {
  const lines = ["Agent-ready doctor", `Target: ${result.target}`, `Node.js: ${result.node}`];
  lines.push(`Git repository: ${result.gitRepository ? "yes" : "no"}`);
  lines.push(`AGENTS.md: ${result.agentsInstructions ? "yes" : "no"}`);
  lines.push(`OpenCode configuration: ${result.opencodeConfig ? "yes" : "no"}`);
  lines.push(`Detected project types: ${result.technologies.join(", ") || "none"}`);
  lines.push("AutoSkills integration requires Node.js >=22.6.");
  return lines.join("\n");
}
