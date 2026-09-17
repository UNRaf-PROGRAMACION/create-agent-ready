import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { CliError, parseArgs } from "../src/args.js";
import { planScaffold, writeScaffold } from "../src/scaffold.js";
import { filesFor } from "../src/templates.js";

async function tempProject() {
  const directory = await mkdtemp(join(tmpdir(), "agent-ready-"));
  mkdirSync(join(directory, ".git"));
  return directory;
}

test("generates the SDD workshop and GDD add-on", async (t) => {
  const target = await tempProject();
  t.after(() => rm(target, { recursive: true, force: true }));
  const options = parseArgs([target, "--level=sdd", "--workshop", "--add=gdd-to-sdd"]);
  const files = writeScaffold(target, options, "0.1.0");

  assert.ok(files.includes("AGENTS.md"));
  assert.ok(existsSync(join(target, ".sdd/templates/spec.md")));
  assert.ok(existsSync(join(target, ".sdd/specs/.gitkeep")));
  assert.ok(existsSync(join(target, ".sdd/plans/.gitkeep")));
  assert.ok(existsSync(join(target, ".sdd/evidence/.gitkeep")));
  assert.ok(existsSync(join(target, "docs/game/gdd-breve.md")));
  assert.ok(existsSync(join(target, ".opencode/skills/gdd-to-sdd/SKILL.md")));
  const manifest = JSON.parse(readFileSync(join(target, ".agent-ready/manifest.json"), "utf8"));
  assert.equal(manifest.level, "sdd");
});

test("dry run plans files without writing them", async (t) => {
  const target = await tempProject();
  t.after(() => rm(target, { recursive: true, force: true }));
  const options = parseArgs([target, "--level=sdd", "--dry-run"]);
  const files = writeScaffold(target, options, "0.1.0");

  assert.ok(files.includes(".sdd/templates/spec.md"));
  assert.equal(existsSync(join(target, "AGENTS.md")), false);
});

test("refuses to replace project files", async (t) => {
  const target = await tempProject();
  t.after(() => rm(target, { recursive: true, force: true }));
  writeFileSync(join(target, "AGENTS.md"), "project instructions\n");
  const options = parseArgs([target, "--level=base"]);

  assert.throws(() => planScaffold(target, options), CliError);
});

test("force replaces only a recorded generated file", async (t) => {
  const target = await tempProject();
  t.after(() => rm(target, { recursive: true, force: true }));
  const initial = parseArgs([target, "--level=base"]);
  writeScaffold(target, initial, "0.1.0");
  const forced = parseArgs([target, "--level=base", "--force"]);
  writeScaffold(target, forced, "0.1.0");
  assert.match(readFileSync(join(target, "AGENTS.md"), "utf8"), /Working agreement/);
});

test("refuses to replace an unmanaged manifest", async (t) => {
  const target = await tempProject();
  t.after(() => rm(target, { recursive: true, force: true }));
  mkdirSync(join(target, ".agent-ready"));
  writeFileSync(join(target, ".agent-ready/manifest.json"), JSON.stringify({ generator: "another-tool", files: [] }));

  assert.throws(() => planScaffold(target, parseArgs([target, "--level=base"])), /unmanaged manifest/);
});

test("adds a workshop to an existing unchanged SDD harness", async (t) => {
  const target = await tempProject();
  t.after(() => rm(target, { recursive: true, force: true }));
  writeScaffold(target, parseArgs([target, "--level=sdd"]), "0.1.0");
  writeScaffold(target, parseArgs([target, "--level=sdd", "--workshop"]), "0.1.0");
  assert.ok(existsSync(join(target, "docs/game/gdd-breve.md")));
});

test("generates professional SDD traceability artifacts", async (t) => {
  const target = await tempProject();
  t.after(() => rm(target, { recursive: true, force: true }));
  writeScaffold(target, parseArgs([target, "--level=sdd-pro"]), "0.1.0");
  assert.ok(existsSync(join(target, ".sdd/templates/traceability.md")));
  assert.ok(existsSync(join(target, ".sdd/templates/risk-and-rollback.md")));
  assert.ok(existsSync(join(target, ".github/pull_request_template.md")));
});

test("ships SDD templates with approval and criterion-level evidence", () => {
  const files = new Map(filesFor(parseArgs(["--level=sdd", "--workshop"])).map(({ path, content }) => [path, content]));

  assert.match(files.get(".sdd/templates/spec.md"), /## Human approval/);
  assert.match(files.get(".sdd/templates/evidence.md"), /Verification by acceptance criterion/);
  assert.match(files.get(".agent-ready/workshop/guia-de-inicio.md"), /--dry-run/);
  assert.match(files.get("docs/game/gdd-breve.md"), /## Player fantasy/);
});
