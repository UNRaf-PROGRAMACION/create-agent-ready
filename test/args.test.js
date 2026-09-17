import test from "node:test";
import assert from "node:assert/strict";
import { CliError, parseArgs } from "../src/args.js";

test("uses base level and current directory by default", () => {
  const result = parseArgs([]);
  assert.equal(result.target, ".");
  assert.equal(result.level, "base");
});

test("parses all supported scaffold options", () => {
  const result = parseArgs(["game", "--level=sdd-pro", "--workshop", "--add", "gdd-to-sdd", "--dry-run", "--force"]);
  assert.equal(result.target, "game");
  assert.equal(result.level, "sdd-pro");
  assert.equal(result.workshop, true);
  assert.deepEqual(result.additions, ["gdd-to-sdd"]);
  assert.equal(result.dryRun, true);
  assert.equal(result.force, true);
});

test("rejects gdd-to-sdd without an SDD level", () => {
  assert.throws(() => parseArgs(["--add=gdd-to-sdd"]), CliError);
});

test("rejects unknown flags and skills modes", () => {
  assert.throws(() => parseArgs(["--unknown"]), CliError);
  assert.throws(() => parseArgs(["--skills=everything"]), CliError);
});
