import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { filesFor } from "./templates.js";
import { CliError } from "./args.js";

const manifestPath = ".agent-ready/manifest.json";
const generatorName = "create-agent-ready-unraf";

function readManifest(target) {
  const path = join(target, manifestPath);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    throw new CliError(`Cannot read generated manifest: ${path}`);
  }
}

export function planScaffold(target, options) {
  if (!existsSync(target)) throw new CliError(`Target directory does not exist: ${target}`);
  const manifest = readManifest(target);
  if (manifest && manifest.generator !== generatorName) {
    throw new CliError(`Refusing to replace an unmanaged manifest: ${join(target, manifestPath)}\nMove it or use a different target directory.`);
  }
  const generated = new Set(manifest?.files || []);
  const files = filesFor(options);
  const conflicts = files
    .filter(({ path }) => existsSync(join(target, path)) && !generated.has(path))
    .map(({ path }) => path);
  if (conflicts.length) {
    throw new CliError(`Refusing to replace existing files:\n${conflicts.map((file) => `  - ${file}`).join("\n")}\nMove them, choose another target, or use --force only after this CLI has generated them.`);
  }
  if (!options.force) {
    const generatedConflicts = files
      .filter(({ path, content }) => existsSync(join(target, path)) && generated.has(path) && readFileSync(join(target, path), "utf8") !== content)
      .map(({ path }) => path);
    if (generatedConflicts.length) {
      throw new CliError(`Generated files already exist:\n${generatedConflicts.map((file) => `  - ${file}`).join("\n")}\nUse --force to replace files recorded in .agent-ready/manifest.json.`);
    }
  }
  return files.filter(({ path, content }) => {
    const destination = join(target, path);
    return !existsSync(destination) || options.force || readFileSync(destination, "utf8") !== content;
  });
}

export function writeScaffold(target, options, version) {
  const files = planScaffold(target, options);
  const selectedFiles = filesFor(options).map(({ path }) => path);
  if (options.dryRun) return files.map(({ path }) => path);

  for (const file of files) {
    const destination = join(target, file.path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, file.content, "utf8");
  }
  const previousManifest = readManifest(target);
  const manifest = {
    generator: generatorName,
    version,
    level: options.level,
    workshop: options.workshop,
    additions: options.additions,
    files: [...new Set([...(previousManifest?.files || []), ...selectedFiles])].sort()
  };
  const destination = join(target, manifestPath);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return files.map(({ path }) => path);
}
