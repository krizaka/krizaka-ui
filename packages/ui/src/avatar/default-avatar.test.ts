import {
  DEFAULT_AVATAR_BRANDS,
  DEFAULT_AVATAR_TONES,
  defaultAvatarFile,
  defaultAvatarSvg,
  defaultAvatarTone,
  defaultAvatarToneOf,
  defaultAvatarUrl,
} from "./default-avatar";

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
const contrastWithWhite = (hex: string) => 1.05 / (luminance(hex) + 0.05);

describe("default avatars", () => {
  it("name their files by kind, tone and size, under the brand", () => {
    expect(defaultAvatarFile("person", 3, 256)).toBe("person-3-256.webp");
    expect(defaultAvatarFile("plain", 1, "svg")).toBe("plain-1.svg");
    expect(defaultAvatarUrl({ brand: "orochia", tone: 4 })).toBe("https://krizaka-assets.b-cdn.net/people/defaults/v1/orochia/person-4-256.webp");
    expect(defaultAvatarUrl({ brand: "yasakia", tone: 2, kind: "plain" }, { size: 512, base: "https://cdn.example/x/" })).toBe("https://cdn.example/x/yasakia/plain-2-512.webp");
  });

  it("give a person the same tone everywhere, spread over all six", () => {
    expect(defaultAvatarToneOf("user-1")).toBe(defaultAvatarToneOf("user-1"));
    expect(defaultAvatarToneOf(undefined)).toBe(1);
    const seen = new Set(Array.from({ length: 200 }, (_, i) => defaultAvatarToneOf(`user-${i}`)));
    expect([...seen].sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("keep every tone of every brand readable under the white silhouette (3:1) and distinct", () => {
    for (const brand of DEFAULT_AVATAR_BRANDS) {
      const stops = new Set<string>();
      for (let tone = 1; tone <= DEFAULT_AVATAR_TONES; tone++) {
        const pair = defaultAvatarTone(brand, tone);
        stops.add(pair.join());
        for (const hex of pair) expect(contrastWithWhite(hex), `${brand} tone ${tone} ${hex}`).toBeGreaterThanOrEqual(3);
      }
      expect(stops.size).toBe(DEFAULT_AVATAR_TONES);
    }
  });

  it("draw a square SVG, with a silhouette only for the person kind", () => {
    const person = defaultAvatarSvg({ brand: "orazaka", tone: 2 });
    const plain = defaultAvatarSvg({ brand: "orazaka", tone: 2, kind: "plain" });
    expect(person).toContain('viewBox="0 0 512 512"');
    expect(person).toContain("<circle");
    expect(plain).not.toContain("<circle");
  });

  it("trims the trailing slashes of a base in linear time", () => {
    const start = performance.now();
    const url = defaultAvatarUrl({ brand: "orochia", tone: 1 }, { base: `https://cdn.example/${"/".repeat(200_000)}x` });
    expect(url.startsWith("https://cdn.example/")).toBe(true);
    expect(performance.now() - start).toBeLessThan(500);
    expect(defaultAvatarUrl({ brand: "orochia", tone: 1 }, { base: "https://cdn.example/a///" })).toBe("https://cdn.example/a/orochia/person-1-256.webp");
  });
});
