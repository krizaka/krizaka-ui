import {
  DEFAULT_AVATAR_BRANDS,
  DEFAULT_AVATAR_ENTITY_KINDS,
  DEFAULT_AVATAR_TONES,
  defaultAvatarDataUrl,
  defaultAvatarFile,
  defaultAvatarSeedHash,
  defaultAvatarSvg,
  defaultAvatarTone,
  defaultAvatarToneOf,
  defaultAvatarUrl,
  pickDefaultPicture,
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
    expect(defaultAvatarUrl({ brand: "yomizaka", tone: 4 })).toBe("https://krizaka-assets.b-cdn.net/people/defaults/v1/yomizaka/person-4-256.webp");
    expect(defaultAvatarUrl({ brand: "akinaza", tone: 2, kind: "plain" }, { size: 512, base: "https://cdn.example/x/" })).toBe("https://cdn.example/x/akinaza/plain-2-512.webp");
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
    const url = defaultAvatarUrl({ brand: "yomizaka", tone: 1 }, { base: `https://cdn.example/${"/".repeat(200_000)}x` });
    expect(url.startsWith("https://cdn.example/")).toBe(true);
    expect(performance.now() - start).toBeLessThan(500);
    expect(defaultAvatarUrl({ brand: "yomizaka", tone: 1 }, { base: "https://cdn.example/a///" })).toBe("https://cdn.example/a/yomizaka/person-1-256.webp");
  });
});

describe("default pictures of a folder, an organisation and a shop", () => {
  it("are drawn here, as a data URL: nothing to fetch", () => {
    for (const kind of ["folder", "organisation", "shop"] as const) {
      const url = defaultAvatarUrl({ brand: "krizaka", kind, tone: 2 });
      expect(url).toBe(defaultAvatarDataUrl({ brand: "krizaka", kind, tone: 2 }));
      expect(url.startsWith("data:image/svg+xml,")).toBe(true);
    }
  });

  it("never draw the silhouette of a person", () => {
    const person = defaultAvatarSvg({ brand: "krizaka", kind: "person", tone: 1 });
    expect(person).toContain("<circle");
    for (const kind of ["folder", "organisation", "shop"] as const) expect(defaultAvatarSvg({ brand: "krizaka", kind, tone: 1 })).not.toContain("<circle");
  });

  it("differ from each other, and keep the tones of the brand", () => {
    const svgs = DEFAULT_AVATAR_ENTITY_KINDS.map((kind) => defaultAvatarSvg({ brand: "krizaka", kind, tone: 3 }));
    expect(new Set(svgs).size).toBe(4);
    expect(defaultAvatarSvg({ brand: "krizaka", kind: "shop", tone: 3 })).toContain(defaultAvatarTone("krizaka", 3)[0]);
  });

  it("are the same for the same seed", () => {
    expect(defaultAvatarUrl({ brand: "yomizaka", kind: "folder", seed: "f-1" })).toBe(defaultAvatarUrl({ brand: "yomizaka", kind: "folder", seed: "f-1" }));
  });
});

describe("the family's central set (krizaka-ui#598)", () => {
  const picture = (id: string, disabled = false) => ({ id, ...(disabled ? { disabled: true as const } : {}), urls: { webp: { "256": `https://cdn.example.test/${id}-256.webp`, "512": `https://cdn.example.test/${id}-512.webp` } } });
  const set = [picture("a"), picture("b"), picture("gone", true), picture("c")];

  it("gives the same person the same picture, from the set, at the size asked", () => {
    const avatar = { brand: "akinaza", seed: "account-1", set } as const;
    expect(defaultAvatarUrl(avatar)).toBe(defaultAvatarUrl({ ...avatar, brand: "orazaka" }));
    expect(defaultAvatarUrl(avatar)).toMatch(/\/(a|b|c)-256\.webp$/);
    expect(defaultAvatarUrl(avatar, { size: 512 })).toMatch(/\/(a|b|c)-512\.webp$/);
  });

  it("draws the silhouette when the picture is not served in the size asked", () => {
    const only512 = [{ id: "z", urls: { webp: { "512": "https://cdn.example.test/z-512.webp" } } }];
    expect(defaultAvatarUrl({ brand: "akinaza", seed: "x", set: only512 }, { size: 512 })).toBe("https://cdn.example.test/z-512.webp");
    expect(defaultAvatarUrl({ brand: "akinaza", seed: "x", set: only512 })).toBe(defaultAvatarUrl({ brand: "akinaza", seed: "x" }));
  });

  it("never picks a disabled picture and spreads people over the set", () => {
    const ids = Array.from({ length: 60 }, (_, i) => pickDefaultPicture(set, `person-${i}`)!.id);
    expect(ids).not.toContain("gone");
    expect(new Set(ids)).toEqual(new Set(["a", "b", "c"]));
  });

  it("draws the brand's silhouette when there is no set, an empty one, no seed, or the vector is asked", () => {
    const silhouette = defaultAvatarUrl({ brand: "akinaza", seed: "x" });
    expect(defaultAvatarUrl({ brand: "akinaza", seed: "x", set: [] })).toBe(silhouette);
    expect(defaultAvatarUrl({ brand: "akinaza", set })).toBe(defaultAvatarUrl({ brand: "akinaza" }));
    expect(defaultAvatarUrl({ brand: "akinaza", seed: "x", set }, { size: "svg" })).toBe(defaultAvatarUrl({ brand: "akinaza", seed: "x" }, { size: "svg" }));
  });

  it("follows the org rule: fnv1a modulo the usable pictures", () => {
    expect(defaultAvatarSeedHash("eric")).toBe(defaultAvatarSeedHash("eric"));
    expect(pickDefaultPicture(set, "eric")!.id).toBe(["a", "b", "c"][defaultAvatarSeedHash("eric") % 3]);
  });
});
