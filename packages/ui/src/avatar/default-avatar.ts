// The default profile pictures of the Krizaka family: what a product shows when a person has no photo.
// They are generated from this file (tools/export-brand.mjs renders them to SVG and WebP and uploads them to Bunny,
// `people/defaults/v1/<brand>/…`), so the pictures and the URLs that name them cannot drift apart.

export type DefaultAvatarBrand = "krizaka" | "orazaka" | "orochia" | "yasakia" | "yororis" | "yomizaka" | "kachizaka" | "akinaza";
/** `person`: a neutral silhouette. `plain`: the brand's gradient alone, ready for initials. */
export type DefaultAvatarKind = "person" | "plain";
export type DefaultAvatarSize = 256 | 512;

export const DEFAULT_AVATAR_BRANDS: readonly DefaultAvatarBrand[] = ["krizaka", "orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza"];
export const DEFAULT_AVATAR_KINDS: readonly DefaultAvatarKind[] = ["person", "plain"];
export const DEFAULT_AVATAR_SIZES: readonly DefaultAvatarSize[] = [256, 512];
/** How many tones each brand has: a person always gets the same one from their seed, so a list is not one colour. */
export const DEFAULT_AVATAR_TONES = 6;

/** Where the set lives. `v1` is the set's version: a changed picture is a new version folder, never an overwrite. */
export const DEFAULT_AVATAR_BASE = "https://krizaka-assets.b-cdn.net/people/defaults/v1";

export interface DefaultAvatar {
  /** The brand of the product showing the avatar: its gradient, its hues. */
  brand: DefaultAvatarBrand;
  /** Any stable text or number of the person (their id): the same seed gives the same tone everywhere. */
  seed?: string | number;
  /** Force a tone, 1 to 6, instead of deriving it from `seed`. */
  tone?: number;
  /**
   * `person` (default): a silhouette. `plain`: the gradient alone.
   * @default "person"
   */
  kind?: DefaultAvatarKind;
}

/** The mark gradient of each brand (BRAND.md, `$extensions["com.krizaka"].mark`) as [hue, saturation %, lightness %] and the hue spread of its tones. */
const BRANDS: Record<DefaultAvatarBrand, { from: [number, number, number]; to: [number, number, number]; spread: number }> = {
  krizaka: { from: [217, 92, 53], to: [217, 92, 68], spread: 14 },
  orazaka: { from: [26, 90.5, 37.1], to: [26, 92, 45], spread: 7 },
  orochia: { from: [262.1, 83.3, 57.8], to: [328.6, 85.5, 70.2], spread: 12 },
  yasakia: { from: [156, 92, 32], to: [178, 90, 32], spread: 12 },
  yororis: { from: [34, 46, 44], to: [104, 28, 42], spread: 10 },
  yomizaka: { from: [232, 50, 55], to: [248, 50, 58], spread: 10 },
  kachizaka: { from: [226, 80, 56], to: [44, 92, 33], spread: 10 },
  akinaza: { from: [140, 48, 34], to: [22, 60, 46], spread: 10 },
};

/** White on top of a stop must stay visible: a stop is darkened until the contrast reaches this (WCAG 1.4.11, non-text). */
const MIN_CONTRAST = 3.2;
const OFFSETS = [0, -1, 1, -2, 2, 3] as const;

function hslToHex([h, s, l]: [number, number, number]): string {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + (((h % 360) + 360) % 360) / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const channel = (n: number) => Math.round(255 * (light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return `#${[0, 8, 4].map((n) => channel(n).toString(16).padStart(2, "0")).join("")}`;
}

const channelLuminance = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const whiteContrast = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => channelLuminance(Number.parseInt(hex.slice(i, i + 2), 16) / 255));
  return 1.05 / (0.2126 * r! + 0.7152 * g! + 0.0722 * b! + 0.05);
};
/** The stop, darkened one point of lightness at a time until white reads on it. */
function readable([h, s, l]: [number, number, number]): string {
  let hex = hslToHex([h, s, l]);
  for (let light = l; whiteContrast(hex) < MIN_CONTRAST && light > 10; light -= 1) hex = hslToHex([h, s, light]);
  return hex;
}

/** The two stops (hex) of tone `tone` (1 to 6) of a brand. */
export function defaultAvatarTone(brand: DefaultAvatarBrand, tone: number): readonly [string, string] {
  const b = BRANDS[brand];
  const o = OFFSETS[(clampTone(tone) - 1) % OFFSETS.length] * b.spread;
  return [readable([b.from[0] + o, b.from[1], b.from[2]]), readable([b.to[0] + o, b.to[1], b.to[2]])];
}

const clampTone = (tone: number) => Math.min(DEFAULT_AVATAR_TONES, Math.max(1, Math.round(tone)));

/** 1 to 6 from a seed (FNV-1a): stable across renders, devices and products. */
export function defaultAvatarToneOf(seed: string | number | undefined): number {
  if (seed === undefined) return 1;
  let h = 0x811c9dc5;
  for (const ch of String(seed)) {
    h ^= ch.codePointAt(0) ?? 0;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return (h % DEFAULT_AVATAR_TONES) + 1;
}

const resolveTone = (a: DefaultAvatar) => (a.tone === undefined ? defaultAvatarToneOf(a.seed) : clampTone(a.tone));

/** The file name of a picture in the set: `person-3` + 256 → `person-3-256.webp`; `svg` has no size. */
export function defaultAvatarFile(kind: DefaultAvatarKind, tone: number, size: DefaultAvatarSize | "svg"): string {
  return size === "svg" ? `${kind}-${tone}.svg` : `${kind}-${tone}-${size}.webp`;
}

/**
 * The URL of a default avatar: `defaultAvatarUrl({ brand: "orochia", seed: user.id })`.
 * @param size 256 for lists, 512 for a profile; `"svg"` for the vector.
 * @param base Another host or version of the set (a self-hosted copy); the default is the Krizaka CDN.
 */
export function defaultAvatarUrl(avatar: DefaultAvatar, { size = 256, base = DEFAULT_AVATAR_BASE }: { size?: DefaultAvatarSize | "svg"; base?: string } = {}): string {
  return `${base.replace(/\/+$/, "")}/${avatar.brand}/${defaultAvatarFile(avatar.kind ?? "person", resolveTone(avatar), size)}`;
}

/** The SVG source of a default avatar, 512 × 512 and square (the Avatar clips it round). */
export function defaultAvatarSvg(avatar: DefaultAvatar): string {
  const [from, to] = defaultAvatarTone(avatar.brand, resolveTone(avatar));
  const person =
    (avatar.kind ?? "person") === "person"
      ? `<circle cx="256" cy="200" r="86" fill="#fff" fill-opacity=".92"/><path d="M84 512c0-108 78-182 172-182s172 74 172 182z" fill="#fff" fill-opacity=".92"/>`
      : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient><radialGradient id="l" cx=".28" cy=".18" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".24"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="512" height="512" fill="url(#g)"/><rect width="512" height="512" fill="url(#l)"/>${person}</svg>`;
}
