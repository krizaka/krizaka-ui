// Rewrites the Linux screenshots (the ones CI compares) from macOS or Windows: the same runner, inside the official
// Playwright image for the installed Playwright version, on linux/amd64 like GitHub's ubuntu-latest runners.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { version } = JSON.parse(readFileSync(require.resolve("playwright/package.json"), "utf8"));
const repo = resolve(import.meta.dirname, "..", "..", "..");

execFileSync(
  "docker",
  [
    "run", "--rm", "--platform", "linux/amd64", "--ipc=host",
    "-v", `${repo}:/repo`,
    "-v", "/repo/node_modules", "-v", "/repo/apps/storybook/node_modules", "-v", "/repo/packages/ui/node_modules",
    "-v", "/repo/packages/tokens/node_modules", "-v", "/repo/packages/tailwind/node_modules", "-v", "/repo/packages/config/node_modules",
    "-w", "/repo",
    `mcr.microsoft.com/playwright:v${version}-noble`,
    "bash", "-c",
    "corepack enable && pnpm install --frozen-lockfile --store-dir /tmp/pnpm-store && pnpm turbo run build --filter=@krizaka/ui... && pnpm --filter storybook storybook:build && pnpm --filter storybook test:update",
  ],
  { stdio: "inherit" },
);
