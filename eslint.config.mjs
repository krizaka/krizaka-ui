// The monorepo lints itself with the configuration it publishes (@krizaka/config).
import { krizakaBase } from "@krizaka/config/eslint";
import { krizakaUi } from "@krizaka/config/eslint/krizaka-ui";

export default [
  ...krizakaBase,
  // The platform's primitives hold the line the products are asked to reach: the four UI rules, strict, no allowlist.
  ...krizakaUi({ files: ["packages/ui/src/**/*.{jsx,tsx}", "packages/ui/registry/examples/**/*.tsx"] }),
  { name: "krizaka-ui/fixtures", ignores: ["packages/*/test/fixtures/**"] },
  // The compiled registry examples (tsup, build output, git-ignored): their sources are linted.
  { name: "krizaka-ui/compiled-examples", ignores: ["packages/ui/registry/examples/**/*.js", "packages/ui/registry/examples/**/*.d.ts"] },
];
