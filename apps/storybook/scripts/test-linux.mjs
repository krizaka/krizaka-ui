// Rewrites the Linux screenshots (the ones CI compares) from macOS or Windows: the same runner, inside the official
// Playwright image for the installed Playwright version, on linux/amd64 like GitHub's ubuntu-latest runners.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

import { fixedBin } from "../../../scripts/fixed-bin.mjs";

const DOCKER = fixedBin("docker");

const require = createRequire(import.meta.url);
const { version } = JSON.parse(readFileSync(require.resolve("playwright/package.json"), "utf8"));
const repo = resolve(import.meta.dirname, "..", "..", "..");

execFileSync(
  DOCKER,
  [
    "run", "--rm", "--platform", "linux/amd64", "--ipc=host",
    "-v", `${repo}:/repo`,
    "-v", "/repo/node_modules", "-v", "/repo/apps/storybook/node_modules", "-v", "/repo/packages/ui/node_modules",
    "-v", "/repo/packages/tokens/node_modules", "-v", "/repo/packages/tailwind/node_modules",
    "-v", "/repo/packages/icons/node_modules", "-v", "/repo/packages/charts/node_modules", "-v", "/repo/packages/intl/node_modules",
    "-v", "/repo/packages/i18n/node_modules", "-v", "/repo/packages/query/node_modules", "-v", "/repo/packages/realtime/node_modules",
    "-v", "/repo/packages/fonts/node_modules", "-v", "/repo/packages/push/node_modules", "-v", "/repo/packages/pacer/node_modules",
    // tsup's declaration build runs out of the default heap under amd64 emulation (Apple silicon): give it room.
    "-e", "NODE_OPTIONS=--max-old-space-size=8192",
    "-w", "/repo",
    `mcr.microsoft.com/playwright:v${version}-noble`,
    "bash", "-c",
    // The packages' dist are built on the host when `--no-build` is passed (the emulated tsup build can run out of memory).
    `corepack enable && pnpm install --frozen-lockfile --store-dir /tmp/pnpm-store && ${process.argv.includes("--no-build") ? "true" : "pnpm turbo run build --filter=@krizaka/storybook^..."} && pnpm --filter storybook storybook:build && pnpm --filter storybook test:update ${process.argv.slice(2).filter((arg) => arg !== "--no-build").join(" ")}`,
  ],
  { stdio: "inherit" },
);
