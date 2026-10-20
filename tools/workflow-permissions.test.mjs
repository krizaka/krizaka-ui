// node --test tools/ — OpenSSF Scorecard (Token-Permissions): a workflow's top-level token is read-only; the write scopes
// sit on the job that needs them (a top-level write drops the whole repository to 0 on that check).
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const dir = join(import.meta.dirname, "..", ".github", "workflows");

/** The top-level `permissions:` block of a workflow (inline `{ … }` or indented), without comments. */
export function topLevelPermissions(text) {
  const lines = text.split("\n");
  const i = lines.findIndex((l) => /^permissions:/.test(l));
  if (i < 0) return null;
  const inline = lines[i].replace(/#.*/, "");
  if (/\{.*\}|read-all|write-all/.test(inline)) return inline;
  const block = [inline];
  for (const l of lines.slice(i + 1)) {
    if (/^\S/.test(l) && l.trim()) break;
    block.push(l.replace(/#.*/, ""));
  }
  return block.join("\n");
}

describe("workflow permissions", () => {
  it("the parser reads inline and block forms", () => {
    assert.match(topLevelPermissions("permissions: { contents: write }\njobs:"), /write/);
    assert.doesNotMatch(topLevelPermissions("permissions:\n  contents: read\njobs:\n  a:\n    permissions:\n      contents: write\n"), /write/);
  });
  for (const f of readdirSync(dir).filter((n) => /\.ya?ml$/.test(n))) {
    it(`${f} has no top-level write`, () => {
      const p = topLevelPermissions(readFileSync(join(dir, f), "utf8"));
      if (p !== null) assert.doesNotMatch(p, /write/, `${f}: move the write scopes to the job`);
    });
  }
});
