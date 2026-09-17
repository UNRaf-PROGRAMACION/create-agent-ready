import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { doctorReport, inspectProject } from "../src/doctor.js";

test("detects a Godot project and Git", async (t) => {
  const target = await mkdtemp(join(tmpdir(), "agent-ready-doctor-"));
  t.after(() => rm(target, { recursive: true, force: true }));
  mkdirSync(join(target, ".git"));
  writeFileSync(join(target, "project.godot"), "[application]\n");
  const result = inspectProject(target);

  assert.equal(result.gitRepository, true);
  assert.deepEqual(result.technologies, ["Godot"]);
  assert.match(doctorReport(result), /AutoSkills integration requires Node.js >=22.6/);
});
