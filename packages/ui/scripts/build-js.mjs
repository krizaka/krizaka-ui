// The JavaScript and declaration build of @krizaka/ui (`pnpm build`): tsup's configs one after another. tsup alone
// builds every config of the array at once, each declaration build with its own TypeScript program; the two largest
// (9 GB and 6 GB) side by side passed 15 GB, the 16 GB of a CI runner (exit 137). In turn, the peak is the largest one.
// tsup.config.ts is read by Node's type stripping (Node ≥ 22.18). Guard: scripts/build-js.test.mjs.
import { fileURLToPath } from "node:url";

/** Builds the configs one at a time; `config: false` keeps tsup from loading the file again (it would build them all). */
export async function buildInTurn(configs, build) {
  for (const options of configs) await build({ ...options, config: false });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [{ build }, { default: configs }] = await Promise.all([import("tsup"), import("../tsup.config.ts")]);
  await buildInTurn(configs, build);
}
