// The monorepo lints itself with the configuration it publishes (@krizaka/config).
import { krizakaBase } from "@krizaka/config/eslint";
import { krizakaUi } from "@krizaka/config/eslint/krizaka-ui";
import { krizakaStack } from "@krizaka/config/eslint/stack";

export default [
  ...krizakaBase,
  // The platform's primitives hold the line the products are asked to reach: the four UI rules, strict, no allowlist.
  ...krizakaUi({ files: ["packages/ui/src/**/*.{jsx,tsx}", "packages/ui/registry/examples/**/*.tsx", "packages/charts/src/**/*.tsx", "packages/charts/registry/examples/**/*.tsx"] }),
  // The stack rules hold the apps; the packages are the @krizaka facades, where TanStack and the tables/forms belong.
  ...krizakaStack({ files: ["apps/**/*.{js,jsx,mjs,ts,tsx}"] }),
  { name: "krizaka-ui/fixtures", ignores: ["packages/*/test/fixtures/**"] },
  // tsup writes a temporary bundled config next to tsup.config.ts while a build runs: a lint at the same moment (turbo
  // runs them in parallel) must not read it, or it fails on a file that vanished (ENOENT).
  { name: "krizaka-ui/tsup-temp", ignores: ["**/tsup.config.bundled_*"] },
  // The compiled registry examples (tsup, build output, git-ignored): their sources are linted.
  { name: "krizaka-ui/compiled-examples", ignores: ["packages/*/registry/examples/**/*.js", "packages/*/registry/examples/**/*.d.ts"] },
];
