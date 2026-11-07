// The monorepo lints itself with the configuration it publishes (@krizaka/config).
import { krizakaBase } from "@krizaka/config/eslint";
import { krizakaUi } from "@krizaka/config/eslint/krizaka-ui";
import { krizakaStack } from "@krizaka/config/eslint/stack";

export default [
  ...krizakaBase,
  // The platform's primitives hold the line the products are asked to reach: the four UI rules, strict, no allowlist.
  ...krizakaUi({ files: ["packages/ui/src/**/*.{jsx,tsx}", "packages/ui/registry/examples/**/*.tsx", "packages/charts/src/**/*.tsx", "packages/charts/registry/examples/**/*.tsx", "packages/sovkora-design-system/src/**/*.tsx", "packages/sovkora-design-system/registry/examples/**/*.tsx"] }),
  // The Sovkora design system (moved in from sovkora-ui-kit, ADR-029) keeps its own cap: 250 lines a file, except a
  // `*.registry.ts(x)` data file, which holds data only — a function in one is a component that must move out.
  {
    name: "krizaka-ui/sovkora-design-system",
    files: ["packages/sovkora-design-system/**/*.{ts,tsx}"],
    rules: { "max-lines": ["error", { max: 250, skipBlankLines: false, skipComments: false }] },
  },
  {
    name: "krizaka-ui/sovkora-design-system-registries",
    files: ["packages/sovkora-design-system/**/*.registry.{ts,tsx}"],
    rules: {
      "max-lines": "off",
      "no-restricted-syntax": [
        "error",
        { selector: "FunctionDeclaration", message: "A *.registry file holds data only (exempt from the 250-line cap on that condition): move the component to its own file." },
      ],
    },
  },
  // The stack rules hold the apps; the packages are the @krizaka facades, where TanStack and the tables/forms belong.
  ...krizakaStack({ files: ["apps/**/*.{js,jsx,mjs,ts,tsx}"], codeRules: "off" }),
  { name: "krizaka-ui/fixtures", ignores: ["packages/*/test/fixtures/**"] },
  // tsup writes a temporary bundled config next to tsup.config.ts while a build runs: a lint at the same moment (turbo
  // runs them in parallel) must not read it, or it fails on a file that vanished (ENOENT).
  { name: "krizaka-ui/tsup-temp", ignores: ["**/tsup.config.bundled_*"] },
  // The compiled registry examples (tsup, build output, git-ignored): their sources are linted.
  { name: "krizaka-ui/compiled-examples", ignores: ["packages/*/registry/examples/**/*.js", "packages/*/registry/examples/**/*.d.ts"] },
];
