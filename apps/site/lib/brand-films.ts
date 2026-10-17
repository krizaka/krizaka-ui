/* The loops of the flock on the Krizaka CDN (Bunny, site/brand-films/loops/), rendered from the code of @krizaka/ui by
   tools/brand-films and uploaded by krizaka-com (scripts/cdn-assets.mjs, its lib/cdn-manifest.json names them). A file's
   name carries the first 10 hex of its SHA-256: a new render is a new name — copy the new hashes here
   (`node tools/brand-films/hashes.mjs <krizaka-com>/lib/cdn-manifest.json`). */

export const FLOCK = ["falcon", "owl", "duck", "flamingo", "pigeon", "lovebird", "crane", "magpie", "beaver"] as const;
export type FlockBird = (typeof FLOCK)[number];
export type LoopTheme = "dark" | "light";

const CDN = "https://krizaka-assets.b-cdn.net/site";

/** `<bird>-square-<theme>.<ext>` → its hash, per the krizaka-com manifest. */
export const LOOP_HASHES: Record<string, string> = {
  "beaver-square-dark.jpg": "e91344e509",
  "beaver-square-dark.mp4": "452c9efc4b",
  "beaver-square-light.jpg": "7f9ff4d388",
  "beaver-square-light.mp4": "366bf802da",
  "crane-square-dark.jpg": "427b84bfdc",
  "crane-square-dark.mp4": "b6821732f5",
  "crane-square-light.jpg": "b768893e40",
  "crane-square-light.mp4": "4b8693a9cc",
  "duck-square-dark.jpg": "8a4e873de3",
  "duck-square-dark.mp4": "db86e1b25b",
  "duck-square-light.jpg": "77bd2374dd",
  "duck-square-light.mp4": "02125533bf",
  "falcon-square-dark.jpg": "6d2b96c4ac",
  "falcon-square-dark.mp4": "0b286f60aa",
  "falcon-square-light.jpg": "4747ed5a49",
  "falcon-square-light.mp4": "f9789dfcb7",
  "flamingo-square-dark.jpg": "283c1127ad",
  "flamingo-square-dark.mp4": "249aee4235",
  "flamingo-square-light.jpg": "1f0a92e3cf",
  "flamingo-square-light.mp4": "7761f1f236",
  "lovebird-square-dark.jpg": "3ababd9bbc",
  "lovebird-square-dark.mp4": "9799c62875",
  "lovebird-square-light.jpg": "ca001e2ae3",
  "lovebird-square-light.mp4": "1cb28c4daf",
  "magpie-square-dark.jpg": "17b31d6c3c",
  "magpie-square-dark.mp4": "0c9ddf51d7",
  "magpie-square-light.jpg": "f304f07542",
  "magpie-square-light.mp4": "478158395d",
  "owl-square-dark.jpg": "0c97ff15d2",
  "owl-square-dark.mp4": "74b283937e",
  "owl-square-light.jpg": "f7035857dc",
  "owl-square-light.mp4": "8ac173f7b0",
  "pigeon-square-dark.jpg": "648439a6d8",
  "pigeon-square-dark.mp4": "eaa5ebb556",
  "pigeon-square-light.jpg": "47cdb3f97c",
  "pigeon-square-light.mp4": "5ffe14d15b",
};

/** The square loop of a bird in a theme: the MP4 and its poster (the promise kept). */
export function loopOf(bird: FlockBird, theme: LoopTheme): { mp4: string; poster: string } {
  const url = (ext: string) => {
    const name = `${bird}-square-${theme}`;
    const hash = LOOP_HASHES[`${name}.${ext}`];
    if (!hash) throw new Error(`brand-films/loops/${name}.${ext} is not on the CDN — render it, upload it from krizaka-com, run tools/brand-films/hashes.mjs`);
    return `${CDN}/brand-films/loops/${name}.${hash}.${ext}`;
  };
  return { mp4: url("mp4"), poster: url("jpg") };
}
