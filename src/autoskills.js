import { spawnSync } from "node:child_process";
import { CliError } from "./args.js";

export const AUTOSKILLS_VERSION = "0.3.6";

export function supportsAutoSkills(nodeVersion = process.versions.node) {
  const [major, minor] = nodeVersion.split(".").map(Number);
  return major > 22 || (major === 22 && minor >= 6);
}

export function autoSkillsArguments(mode) {
  const args = ["--yes", `autoskills@${AUTOSKILLS_VERSION}`];
  if (mode === "discover") args.push("--dry-run");
  else args.push("--yes");
  return args;
}

export function runAutoSkills(mode, target, spawn = spawnSync) {
  if (!supportsAutoSkills()) {
    throw new CliError("AutoSkills requires Node.js >=22.6. Run the scaffold without --skills or upgrade Node.js.");
  }
  const result = spawn("npx", autoSkillsArguments(mode), { cwd: target, stdio: "inherit", shell: process.platform === "win32" });
  if (result.error) throw new CliError(`Could not run AutoSkills: ${result.error.message}`);
  if (result.status !== 0) throw new CliError(`AutoSkills exited with code ${result.status}.`);
}
