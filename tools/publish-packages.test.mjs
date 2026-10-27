import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const script = readFileSync(new URL("./publish-packages.sh", import.meta.url), "utf8");
const workflow = readFileSync(new URL("../.github/workflows/release.yml", import.meta.url), "utf8");

test("@krizaka/ui is published without a token (OIDC), the others with changeset publish", () => {
  assert.match(script, /env -u NODE_AUTH_TOKEN NPM_CONFIG_USERCONFIG=.*npm publish .*--provenance/);
  assert.match(script, /pnpm changeset publish/);
  assert.ok(script.indexOf("npm publish") < script.indexOf("pnpm changeset publish"));
});

test("release.yml goes through the script and keeps NPM_TOKEN for the other packages", () => {
  assert.equal((workflow.match(/bash tools\/publish-packages\.sh/g) ?? []).length, 2);
  assert.match(workflow, /NODE_AUTH_TOKEN: \$\{\{ secrets\.NPM_TOKEN \}\}/);
  assert.match(workflow, /id-token: write/);
});
