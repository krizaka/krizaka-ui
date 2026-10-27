// The QR encoder: a string in, a square of dark/light modules out. Pure, offline, no dependency, shared by the web
// and the native drawing. Byte mode (UTF-8), versions 1-40, the four error-correction levels, the eight masks chosen
// by the standard's penalty rules (ISO/IEC 18004). `qr-code.test.tsx` decodes what it draws, version by version.

export type QrLevel = "L" | "M" | "Q" | "H";

/** The square of modules, row by row: `true` is dark. */
export type QrMatrix = readonly (readonly boolean[])[];

const LEVEL_INDEX: Record<QrLevel, number> = { L: 0, M: 1, Q: 2, H: 3 };
const LEVEL_BITS: Record<QrLevel, number> = { L: 1, M: 0, Q: 3, H: 2 };

// Error-correction codewords per block, and number of blocks, by level (L, M, Q, H) then version (index 0 is unused).
const ECC_PER_BLOCK = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
] as const;
const BLOCKS = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
] as const;

/** Data modules of a version (everything but the finder, timing, alignment, format and version patterns). */
function rawModules(version: number): number {
  let result = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const align = Math.floor(version / 7) + 2;
    result -= (25 * align - 10) * align - 55;
    if (version >= 7) result -= 36;
  }
  return result;
}

function dataCodewords(version: number, level: QrLevel): number {
  const l = LEVEL_INDEX[level];
  return Math.floor(rawModules(version) / 8) - ECC_PER_BLOCK[l]![version]! * BLOCKS[l]![version]!;
}

export function utf8(text: string): number[] {
  return [...new TextEncoder().encode(text)];
}

// Reed-Solomon over GF(256), polynomial 0x11D.
function gfMultiply(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function divisor(degree: number): number[] {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMultiply(result[j]!, root);
      if (j + 1 < degree) result[j] = result[j]! ^ result[j + 1]!;
    }
    root = gfMultiply(root, 0x02);
  }
  return result;
}

function remainder(data: readonly number[], div: readonly number[]): number[] {
  const result = div.map(() => 0);
  for (const b of data) {
    const factor = b ^ result.shift()!;
    result.push(0);
    div.forEach((coef, i) => {
      result[i] = result[i]! ^ gfMultiply(coef, factor);
    });
  }
  return result;
}

function pushBits(bits: number[], value: number, count: number) {
  for (let i = count - 1; i >= 0; i--) bits.push((value >>> i) & 1);
}

/** The codewords of the message: mode, length, bytes, terminator, padding, then blocks interleaved with their ECC. */
function codewords(bytes: readonly number[], version: number, level: QrLevel): number[] {
  const bits: number[] = [];
  pushBits(bits, 0b0100, 4);
  pushBits(bits, bytes.length, version <= 9 ? 8 : 16);
  for (const b of bytes) pushBits(bits, b, 8);
  const capacity = dataCodewords(version, level) * 8;
  pushBits(bits, 0, Math.min(4, capacity - bits.length));
  pushBits(bits, 0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) pushBits(bits, pad, 8);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2));

  const l = LEVEL_INDEX[level];
  const blocks = BLOCKS[l]![version]!;
  const eccLen = ECC_PER_BLOCK[l]![version]!;
  const shortBlocks = blocks - (Math.floor(rawModules(version) / 8) % blocks);
  const shortLen = Math.floor(rawModules(version) / 8 / blocks) - eccLen;
  const div = divisor(eccLen);
  const parts: { data: number[]; ecc: number[] }[] = [];
  for (let i = 0, k = 0; i < blocks; i++) {
    const chunk = data.slice(k, k + shortLen + (i < shortBlocks ? 0 : 1));
    k += chunk.length;
    parts.push({ data: chunk, ecc: remainder(chunk, div) });
  }
  const out: number[] = [];
  for (let i = 0; i <= shortLen; i++) parts.forEach((p) => i < p.data.length && out.push(p.data[i]!));
  for (let i = 0; i < eccLen; i++) parts.forEach((p) => out.push(p.ecc[i]!));
  return out;
}

function alignmentPositions(version: number): number[] {
  if (version === 1) return [];
  const count = Math.floor(version / 7) + 2;
  const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2;
  const result = [6];
  for (let pos = version * 4 + 10; result.length < count; pos -= step) result.splice(1, 0, pos);
  return result;
}

type Grid = { size: number; dark: boolean[][]; fn: boolean[][] };

function drawFunctionPatterns(version: number, level: QrLevel): Grid {
  const size = version * 4 + 17;
  const dark = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const fn = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const set = (x: number, y: number, on: boolean) => {
    dark[y]![x] = on;
    fn[y]![x] = true;
  };
  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  const finder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || x >= size || y < 0 || y >= size) continue;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        set(x, y, dist !== 2 && dist !== 4);
      }
  };
  finder(3, 3);
  finder(size - 4, 3);
  finder(3, size - 4);
  const align = alignmentPositions(version);
  align.forEach((cx, i) =>
    align.forEach((cy, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === align.length - 1) || (i === align.length - 1 && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }),
  );
  drawFormat(dark, fn, size, level, 0);
  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const on = ((bits >>> i) & 1) !== 0;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      set(a, b, on);
      set(b, a, on);
    }
  }
  return { size, dark, fn };
}

function drawFormat(dark: boolean[][], fn: boolean[][], size: number, level: QrLevel, mask: number) {
  const data = (LEVEL_BITS[level] << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  const bits = ((data << 10) | rem) ^ 0x5412;
  const bit = (i: number) => ((bits >>> i) & 1) !== 0;
  const set = (x: number, y: number, on: boolean) => {
    dark[y]![x] = on;
    fn[y]![x] = true;
  };
  for (let i = 0; i <= 5; i++) set(8, i, bit(i));
  set(8, 7, bit(6));
  set(8, 8, bit(7));
  set(7, 8, bit(8));
  for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
  for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
  set(8, size - 8, true);
}

function placeData(grid: Grid, data: readonly number[]) {
  const { size, dark, fn } = grid;
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++)
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
        if (!fn[y]![x] && i < data.length * 8) {
          dark[y]![x] = ((data[i >>> 3]! >>> (7 - (i & 7))) & 1) !== 0;
          i++;
        }
      }
  }
}

const MASKS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

function penalty(dark: readonly (readonly boolean[])[]): number {
  const size = dark.length;
  let score = 0;
  // Rule 1 (runs of five or more) and rule 3 (the finder-like pattern 1011101 with four light modules beside it).
  const lines = (get: (a: number, b: number) => boolean) => {
    for (let a = 0; a < size; a++) {
      let run = 1;
      for (let b = 1; b < size; b++) {
        if (get(a, b) === get(a, b - 1)) {
          run++;
          if (run === 5) score += 3;
          else if (run > 5) score++;
        } else run = 1;
      }
      const line = Array.from({ length: size }, (_, b) => (get(a, b) ? "1" : "0")).join("");
      for (const pattern of ["00001011101", "10111010000"]) {
        for (let at = line.indexOf(pattern); at >= 0; at = line.indexOf(pattern, at + 1)) score += 40;
      }
    }
  };
  lines((a, b) => dark[a]![b]!);
  lines((a, b) => dark[b]![a]!);
  for (let y = 0; y < size - 1; y++)
    for (let x = 0; x < size - 1; x++) {
      const c = dark[y]![x]!;
      if (c === dark[y]![x + 1] && c === dark[y + 1]![x] && c === dark[y + 1]![x + 1]) score += 3;
    }
  const total = dark.reduce((n, row) => n + row.filter(Boolean).length, 0);
  const k = Math.ceil(Math.abs(total * 20 - size * size * 10) / (size * size)) - 1;
  return score + k * 10;
}

/** Thrown when the text does not fit the biggest code (version 40) at the asked level. */
export class QrTooLongError extends Error {
  constructor(length: number, level: QrLevel) {
    super(`The text (${length} bytes) is too long for a QR code at level ${level}.`);
    this.name = "QrTooLongError";
  }
}

/** Encodes a text as a QR code: the smallest version that holds it at `level`, the best of the eight masks. */
export function encodeQr(text: string, level: QrLevel = "M"): QrMatrix {
  const bytes = utf8(text);
  let version = 1;
  for (; ; version++) {
    if (version > 40) throw new QrTooLongError(bytes.length, level);
    const used = 4 + (version <= 9 ? 8 : 16) + bytes.length * 8;
    if (used <= dataCodewords(version, level) * 8) break;
  }
  const data = codewords(bytes, version, level);
  const base = drawFunctionPatterns(version, level);
  placeData(base, data);
  let best: boolean[][] | undefined;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    const dark = base.dark.map((row) => [...row]);
    const fn = base.fn.map((row) => [...row]);
    for (let y = 0; y < base.size; y++) for (let x = 0; x < base.size; x++) if (!fn[y]![x] && MASKS[mask]!(x, y)) dark[y]![x] = !dark[y]![x];
    drawFormat(dark, fn, base.size, level, mask);
    const score = penalty(dark);
    if (score < bestScore) {
      best = dark;
      bestScore = score;
    }
  }
  return best!;
}

/**
 * The drawing of a matrix as one SVG path: a rectangle per horizontal run of dark modules, in module units, offset by
 * the quiet zone. Shared by the web `<svg>` and the native `<Path>`.
 */
export function qrPath(matrix: QrMatrix, quiet: number): string {
  const parts: string[] = [];
  matrix.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (!row[x]) continue;
      let end = x;
      while (end + 1 < row.length && row[end + 1]) end++;
      parts.push(`M${x + quiet} ${y + quiet}h${end - x + 1}v1h${x - end - 1}z`);
      x = end;
    }
  });
  return parts.join("");
}
