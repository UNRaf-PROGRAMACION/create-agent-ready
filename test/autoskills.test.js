import test from "node:test";
import assert from "node:assert/strict";
import { autoSkillsArguments, supportsAutoSkills } from "../src/autoskills.js";

test("checks the AutoSkills Node.js requirement", () => {
  assert.equal(supportsAutoSkills("22.5.0"), false);
  assert.equal(supportsAutoSkills("22.6.0"), true);
  assert.equal(supportsAutoSkills("23.0.0"), true);
});

test("uses a pinned AutoSkills version and safe discovery mode", () => {
  assert.deepEqual(autoSkillsArguments("discover"), ["--yes", "autoskills@0.3.6", "--dry-run"]);
  assert.deepEqual(autoSkillsArguments("install"), ["--yes", "autoskills@0.3.6", "--yes"]);
});
