// The guard of krizaka-ui#597: a component the package exports has a story (axe + dark/light screenshots in the Storybook
// tests), a unit test and a committed Linux baseline in both themes. Today's gaps are listed in `coverage-exceptions.json`
// and only go down: a new gap fails here, and so does an exception that has been closed (remove it from the file).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import exceptions from "../coverage-exceptions.json";
import pkg from "../package.json";

const src = import.meta.dirname;
const baselines = join(src, "..", "..", "..", "apps", "storybook", "__screenshots__", "linux");

/** Where an export's code lives: `./media-player` is in `media-gallery/`, `./map/pin` in `map/`. */
const FOLDER_OF: Record<string, string> = { "media-player": "media-gallery", "media-carousel": "media-gallery", "pausable-loop": "media-gallery", "media-guard": "media-gallery" };

const folders = [
  ...new Set(
    Object.keys(pkg.exports)
      .filter((key) => key.startsWith("./") && !/native|package\.json|css|registry/.test(key))
      .map((key) => key.slice(2).split("/")[0] ?? "")
      .map((name) => FOLDER_OF[name] ?? name)
      .filter((name) => existsSync(join(src, name)) && readdirSync(join(src, name), { withFileTypes: true }).length > 0 && !existsSync(join(src, `${name}.ts`))),
  ),
].sort((a, b) => a.localeCompare(b));

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? filesUnder(join(dir, entry.name)) : [join(dir, entry.name)]));
}

/** Storybook's id of a title: lower case, anything but a letter or a digit becomes a dash. */
const idOf = (title: string) => title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-|-$/g, "");

const gaps = { noStory: [] as string[], noTest: [] as string[], noBaseline: [] as string[] };
const baselineNames = existsSync(baselines) ? readdirSync(baselines) : [];
for (const folder of folders) {
  const files = filesUnder(join(src, folder));
  const stories = files.filter((file) => file.endsWith(".stories.tsx"));
  if (stories.length === 0) gaps.noStory.push(folder);
  if (!files.some((file) => /\.test\.tsx?$/.test(file))) gaps.noTest.push(folder);
  const ids = stories.map((file) => /title:\s*"([^"]+)"/.exec(readFileSync(file, "utf8"))?.[1]).filter((title): title is string => title !== undefined).map(idOf);
  const shot = (theme: string) => ids.some((id) => baselineNames.some((name) => name.startsWith(`${id}--`) && name.endsWith(`--${theme}.png`)));
  if (stories.length > 0 && !(shot("dark") && shot("light"))) gaps.noBaseline.push(folder);
}

describe("coverage guard (krizaka-ui#597)", () => {
  it("finds the exported components", () => expect(folders.length).toBeGreaterThan(150));

  for (const [kind, label] of [
    ["noStory", "a story (axe + visual run by the Storybook tests)"],
    ["noTest", "a unit test"],
    ["noBaseline", "a Linux baseline in dark and light (apps/storybook/__screenshots__/linux)"],
  ] as const) {
    it(`every exported component has ${label}, but the listed exceptions`, () => {
      const allowed = new Set(exceptions[kind]);
      expect(gaps[kind].filter((name) => !allowed.has(name))).toEqual([]);
    });
    it(`no exception of "${kind}" is already closed (the list only goes down)`, () => {
      expect(exceptions[kind].filter((name) => !gaps[kind].includes(name))).toEqual([]);
    });
  }
});
