import jsQR from "jsqr";
import { describe, expect, it } from "vitest";

import { encodeQr, type QrLevel, qrPath,QrTooLongError } from "./encode";

/** Draws the matrix as RGBA pixels (dark on light, with a quiet zone) and reads it back with an independent decoder. */
function decode(matrix: readonly (readonly boolean[])[], scale = 4): string | undefined {
  const quiet = 4;
  const side = (matrix.length + quiet * 2) * scale;
  const data = new Uint8ClampedArray(side * side * 4).fill(255);
  matrix.forEach((row, y) =>
    row.forEach((on, x) => {
      if (!on) return;
      for (let dy = 0; dy < scale; dy++)
        for (let dx = 0; dx < scale; dx++) {
          const i = (((y + quiet) * scale + dy) * side + (x + quiet) * scale + dx) * 4;
          data[i] = data[i + 1] = data[i + 2] = 0;
        }
    }),
  );
  return jsQR(data, side, side)?.data;
}

const sample = (n: number) => Array.from({ length: n }, (_, i) => String.fromCharCode(97 + ((i * 7) % 26))).join("");

describe("encodeQr", () => {
  it("round-trips a private feed address at every level", () => {
    const url = "https://akinaza.com/ical/7f3c9a1e-4b2d-4c8e-9a51-0d6f2b8e3c17.ics?token=Zk3pQw9sLm2Xv8Rt";
    for (const level of ["L", "M", "Q", "H"] as QrLevel[]) expect(decode(encodeQr(url, level))).toBe(url);
  });

  it("round-trips accents and emoji (UTF-8)", () => {
    const text = "Réservé à l’équipe — café ☕ 日本";
    expect(decode(encodeQr(text))).toBe(text);
  });

  it("grows by version and stays readable, with the block structure of each (lengths cross every size class)", () => {
    for (const level of ["L", "M", "Q", "H"] as QrLevel[]) {
      for (const length of [1, 14, 40, 90, 160, 280, 420, 640, 900]) {
        const text = sample(length);
        const matrix = encodeQr(text, level);
        expect((matrix.length - 17) % 4).toBe(0);
        expect(decode(matrix, 3), `${level} ${length}`).toBe(text);
      }
    }
  });

  it("uses the smallest version that holds the text", () => {
    expect(encodeQr("a").length).toBe(21); // version 1
    expect(encodeQr("a".repeat(15), "M").length).toBe(25); // 14 bytes fit version 1-M, 15 need version 2
    expect(encodeQr("a".repeat(14), "M").length).toBe(21);
  });

  it("is deterministic and refuses what cannot fit", () => {
    expect(encodeQr("https://krizaka.com")).toEqual(encodeQr("https://krizaka.com"));
    expect(() => encodeQr("x".repeat(3000), "H")).toThrow(QrTooLongError);
  });
});

describe("qrPath", () => {
  it("draws a rectangle per run of dark modules, offset by the quiet zone", () => {
    expect(qrPath([[true, true, false], [false, true, false]], 2)).toBe("M2 2h2v1h-2zM3 3h1v1h-1z");
  });
});
