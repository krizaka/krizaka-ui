// Runs the Storybook test-runner against the static build (storybook-static/), never a dev server:
// a tiny static server on a free port, the runner pointed at it, the server closed with the runner's exit code.
// `--update` rewrites the screenshots of the current platform (jest -u).
import { spawn } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..", "storybook-static");
if (!existsSync(join(ROOT, "index.json"))) {
  console.error("storybook-static/ is missing: run `pnpm --filter storybook storybook:build` first.");
  process.exit(1);
}

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname)).replace(/^([/\\])+/, "");
  let file = join(ROOT, path);
  if (!file.startsWith(ROOT)) return void res.writeHead(403).end();
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) return void res.writeHead(404).end();
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
});

server.listen(0, "127.0.0.1", () => {
  const { port } = server.address();
  const update = process.argv.includes("--update");
  const args = ["--url", `http://127.0.0.1:${port}`, "--index-json", "--maxWorkers=2", update ? "-u" : "--ci"];
  const runner = spawn("test-storybook", args, { stdio: "inherit", shell: process.platform === "win32" });
  runner.on("exit", (code) => server.close(() => process.exit(code ?? 1)));
});
