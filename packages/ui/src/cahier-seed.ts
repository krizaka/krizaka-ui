// The Cahier's small deterministic randomness: a string (an id, a slug, a title) becomes a number in [-1, 1], always the
// same one, so a tilt or a wobble drawn "by hand" is the same on the server, on the client and in every screenshot.
export function seedUnit(seed: string): number {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.codePointAt(0)!, 16777619);
  return ((h >>> 0) % 2001) / 1000 - 1;
}
