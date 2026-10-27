import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isTrustedPublisherMissing } from "./npm-publish-error.mjs";

const script = readFileSync(new URL("./publish-packages.sh", import.meta.url), "utf8");
const workflow = readFileSync(new URL("../.github/workflows/release.yml", import.meta.url), "utf8");

test("every package tries OIDC first, then NPM_TOKEN only on an auth error, with a warning", () => {
  assert.match(script, /env -u NODE_AUTH_TOKEN NPM_CONFIG_USERCONFIG=.*npm publish .*--provenance/);
  assert.match(script, /::warning::\$name: trusted publisher not configured or mismatched/);
  assert.match(script, /npm-publish-error\.mjs/);
  assert.ok(script.indexOf("env -u NODE_AUTH_TOKEN") < script.indexOf("token.npmrc\" npm publish"));
  assert.doesNotMatch(script, /changeset publish/);
});

test("auth failures are retried with the token, other errors fail", () => {
  for (const l of ["npm error code ENEEDAUTH", "npm error 404 Not Found - PUT https://registry.npmjs.org/@krizaka%2fui", "OIDC exchange: package not found"])
    assert.equal(isTrustedPublisherMissing(l), true, l);
  for (const l of ["npm error code E403 cannot publish over the previously published versions", "npm error code E500", "ETIMEDOUT"])
    assert.equal(isTrustedPublisherMissing(l), false, l);
});

test("release.yml goes through the script and keeps NPM_TOKEN for the other packages", () => {
  assert.equal((workflow.match(/bash tools\/publish-packages\.sh/g) ?? []).length, 2);
  assert.match(workflow, /NODE_AUTH_TOKEN: \$\{\{ secrets\.NPM_TOKEN \}\}/);
  assert.match(workflow, /id-token: write/);
});

test("the fallback publish runs on the commit of the run, not on the changesets version branch", () => {
  const i = workflow.indexOf("Publish the versions on main that npm does not have yet");
  const step = workflow.slice(i, workflow.indexOf("- name:", i + 10));
  assert.match(step, /git checkout -f "\$GITHUB_SHA"/);
  assert.ok(step.indexOf("git checkout -f") < step.indexOf("publish-packages.sh"));
});

test("every package is built before packing", () => {
  assert.match(script, /turbo run build --filter='\.\/packages\/\*'/);
});
