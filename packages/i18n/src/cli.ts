/**
 * `krizaka-i18n` — the i18n gates of every Krizaka app, one implementation:
 *
 *   krizaka-i18n check <dir> [--reference en] [--unused <src>]… [--json]
 *   krizaka-i18n scan <path>… [--allow <word,…>]… [--skip <regex>]… [--summary] [--json]
 *
 * Exit 0 when clean, 1 when problems are found, 2 on a usage error.
 */
import path from "node:path";
import { parseArgs } from "node:util";

import { checkMessages, formatReport } from "./check";
import { type Offender, scanHardcoded } from "./scan";

export const USAGE = `Usage:
  krizaka-i18n check <dir> [--reference en] [--unused <src>]… [--json]
      The catalogues of <dir> (<locale>.json) against the reference: same keys, no empty string, same {placeholders},
      same markup (<b>, <a> only). --unused <src> also fails on keys no source under <src> reads.
  krizaka-i18n scan <path>… [--allow <word,…>]… [--skip <regex>]… [--summary] [--json]
      Hard-coded user-facing strings in .tsx sources (needs the typescript package). --allow lists brand names,
      --skip leaves files out (regular expression on the path), --summary counts per file.
  --json prints a machine-readable report on stdout (for CI).`;

export interface CliIO {
  stdout: (line: string) => void;
  stderr: (line: string) => void;
  cwd: string;
  /** Loads the TypeScript compiler (an optional peer dependency) for `scan`. */
  loadTypeScript: () => Promise<typeof import("typescript")>;
}

const defaultIO: CliIO = {
  stdout: (line) => console.log(line),
  stderr: (line) => console.error(line),
  cwd: process.cwd(),
  loadTypeScript: async () => (await import("typescript")).default,
};

/** Runs the CLI and returns its exit code. */
export async function main(argv: readonly string[], io: CliIO = defaultIO): Promise<number> {
  const [command, ...rest] = argv;
  if (command === undefined || command === "--help" || command === "-h" || command === "help") {
    io.stdout(USAGE);
    return command === undefined ? 2 : 0;
  }

  let parsed;
  try {
    parsed = parseArgs({
      args: [...rest],
      allowPositionals: true,
      options: {
        json: { type: "boolean" },
        reference: { type: "string" },
        unused: { type: "string", multiple: true },
        allow: { type: "string", multiple: true },
        skip: { type: "string", multiple: true },
        summary: { type: "boolean" },
      },
    });
  } catch (error) {
    io.stderr(`${(error as Error).message}\n\n${USAGE}`);
    return 2;
  }
  const { values, positionals } = parsed;
  const resolve = (p: string) => path.resolve(io.cwd, p);

  if (command === "check") {
    if (positionals.length !== 1) {
      io.stderr(`check takes one folder of catalogues.\n\n${USAGE}`);
      return 2;
    }
    const result = checkMessages({
      dir: resolve(positionals[0] as string),
      reference: values.reference,
      unused: values.unused?.map(resolve),
    });
    if (values.json) io.stdout(JSON.stringify(result, null, 2));
    else (result.ok ? io.stdout : io.stderr)(formatReport(result));
    return result.ok ? 0 : 1;
  }

  if (command === "scan") {
    if (!positionals.length) {
      io.stderr(`scan takes at least one folder.\n\n${USAGE}`);
      return 2;
    }
    let ts;
    try {
      ts = await io.loadTypeScript();
    } catch {
      io.stderr("scan needs the typescript package: npm install -D typescript");
      return 2;
    }
    const offenders = scanHardcoded(ts, {
      paths: positionals.map(resolve),
      allow: values.allow?.flatMap((list) => list.split(",")).map((w) => w.trim()).filter(Boolean),
      skip: values.skip,
      root: io.cwd,
    });
    if (values.json) io.stdout(JSON.stringify({ ok: offenders.length === 0, offenders }, null, 2));
    else printScan(offenders, Boolean(values.summary), io);
    return offenders.length ? 1 : 0;
  }

  io.stderr(`Unknown command "${command}".\n\n${USAGE}`);
  return 2;
}

function printScan(offenders: Offender[], summary: boolean, io: CliIO): void {
  if (!offenders.length) {
    io.stdout("✓ i18n: no hard-coded user-facing string.");
    return;
  }
  if (summary) {
    const byFile = new Map<string, number>();
    for (const o of offenders) byFile.set(o.file, (byFile.get(o.file) ?? 0) + 1);
    for (const [file, n] of [...byFile].sort((a, b) => b[1] - a[1])) io.stdout(`${String(n).padStart(4)} ${file}`);
  } else {
    for (const o of offenders) io.stdout(`${o.file}:${o.line}  [${o.kind}]  ${o.text}`);
  }
  io.stderr(`✗ i18n: ${offenders.length} hard-coded user-facing string(s): move them to the message catalogue.`);
}
