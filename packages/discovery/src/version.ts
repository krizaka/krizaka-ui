const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

export const isVersion = (text: string): boolean => SEMVER.test(text);

function compareIdentifiers(a: string, b: string): number {
  const numeric = (s: string) => /^\d+$/.test(s);
  if (numeric(a) && numeric(b)) return Math.sign(Number(a) - Number(b));
  if (numeric(a)) return -1;
  if (numeric(b)) return 1;
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Semantic-version order (`-1 | 0 | 1`), `null` when either side is not `x.y.z[-pre]`. A pre-release is below its release. */
export function compareVersions(a: string, b: string): -1 | 0 | 1 | null {
  const x = SEMVER.exec(a);
  const y = SEMVER.exec(b);
  if (!x || !y) return null;
  for (let i = 1; i <= 3; i++) {
    const d = Math.sign(Number(x[i]) - Number(y[i]));
    if (d !== 0) return d as -1 | 1;
  }
  const pa = x[4];
  const pb = y[4];
  if (pa === undefined && pb === undefined) return 0;
  if (pa === undefined) return 1;
  if (pb === undefined) return -1;
  const ia = pa.split(".");
  const ib = pb.split(".");
  for (let i = 0; i < Math.max(ia.length, ib.length); i++) {
    if (ia[i] === undefined) return -1;
    if (ib[i] === undefined) return 1;
    const d = compareIdentifiers(ia[i]!, ib[i]!);
    if (d !== 0) return d as -1 | 1;
  }
  return 0;
}
