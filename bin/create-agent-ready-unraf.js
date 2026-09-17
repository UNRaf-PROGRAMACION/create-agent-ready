#!/usr/bin/env node
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { parseArgs, CliError, usage } from "../src/args.js";
import { inspectProject, doctorReport } from "../src/doctor.js";
import { planScaffold, writeScaffold } from "../src/scaffold.js";
import { runAutoSkills } from "../src/autoskills.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

function confirmInstall() {
  return new Promise((resolveConfirmation) => {
    process.stdout.write("AutoSkills will download externally maintained skills. Continue? [y/N] ");
    process.stdin.setEncoding("utf8");
    process.stdin.once("data", (input) => resolveConfirmation(input.trim().toLowerCase() === "y"));
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return console.log(usage());
  if (options.version) return console.log(version);
  const target = resolve(options.target);

  if (options.doctor) {
    console.log(doctorReport(inspectProject(target)));
    return;
  }

  const shouldScaffold = !options.skills || options.levelExplicit || options.workshop || options.additions.length > 0;
  if (shouldScaffold) {
    const files = options.dryRun ? planScaffold(target, options).map(({ path }) => path) : writeScaffold(target, options, version);
    console.log(`${options.dryRun ? "Would create" : "Created"} ${files.length} file(s):`);
    for (const file of files) console.log(`  - ${file}`);
  }

  if (options.skills) {
    if (options.dryRun) console.log(`Would run AutoSkills in ${options.skills} mode.`);
    else {
      if (options.skills === "install" && !options.yes && !(await confirmInstall())) {
        console.log("AutoSkills installation cancelled.");
        return;
      }
      runAutoSkills(options.skills, target);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof CliError ? error.message : error.stack || error.message);
  process.exitCode = 1;
});
