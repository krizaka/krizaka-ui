// The catalogue of section types (ADR-007 §3): each with its variants, its settings and the blocks it allows, as zod
// schemas — the renderer, the validator and the composer's forms read the same definitions. The first variant of a type is
// its default. Settings hold references and rules (ids, a source, a count), never a price or a text of the shop.
import * as z from "zod/mini";

import { defineSection } from "./define";
import { SHOP_LIMITS } from "./limits";
import { localizedText } from "./text";

/** A reference to something the product holds (a service, a photo, a member): an opaque id. */
const ref = z.string().check(z.minLength(1), z.maxLength(80));
const short = z.string().check(z.minLength(1), z.maxLength(140));
const url = z.string().check(z.maxLength(300), z.regex(/^https:\/\//, "an https address"));
const isoDay = z.string().check(z.regex(/^\d{4}-\d{2}-\d{2}$/, "a day (YYYY-MM-DD)"));
const source = z.enum(["all", "pick"]);
/** One of a few numbers. */
const oneOf = <const N extends readonly [number, number, ...number[]]>(...n: N) => z.union(n.map((v) => z.literal(v)) as unknown as [z.ZodMiniLiteral<N[number]>, z.ZodMiniLiteral<N[number]>]);

export const platforms = ["tiktok", "youtube-shorts", "instagram"] as const;

export const heroSection = defineSection({
  type: "hero",
  variants: ["poster", "split", "banner", "tv"],
  settings: z.object({
    /** The cover: a media id. Absent, the product's default for the trade. */
    media: z.optional(ref),
    /** Where the photo is cropped to when the box is not its ratio. */
    focus: z.enum(["center", "top", "bottom"]),
  }),
  settingsDefault: { focus: "center" },
  blocks: { fact: z.object({ kind: z.enum(["open-now", "area", "score"]) }) },
});

export const servicesSection = defineSection({
  type: "services",
  variants: ["menu", "cards", "index", "carousel"],
  settings: z.object({
    /** `all` the shop's services, or `pick` the ones the `service` blocks name, in their order. */
    source,
    groupBy: z.enum(["category", "none"]),
    /** `menu` only: two columns when nothing sits beside it. */
    columns: oneOf(1, 2),
    /** `menu` only: the shop's hours, team and address beside the list (the host draws them from its own data). */
    aside: z.enum(["hours", "none"]),
  }),
  settingsDefault: { source: "all", groupBy: "category", columns: 1, aside: "hours" },
  blocks: { service: z.object({ serviceId: ref }) },
  refine: (section, issue) => {
    if (section.settings.source === "pick" && (section.blocks ?? []).length === 0) issue(["blocks"], "pick at least one service");
    if (section.variant === "cards" && (section.blocks ?? []).length > SHOP_LIMITS.cards) issue(["blocks"], `at most ${SHOP_LIMITS.cards} cards`);
  },
});

export const bookingSection = defineSection({
  type: "booking",
  variants: ["strip", "panel", "closing", "sticky"],
  settings: z.object({
    /** A service the times are for; absent, the next free times of any service. */
    serviceId: z.optional(ref),
    /** `strip`: how many times it shows. */
    count: oneOf(3, 4, 6),
  }),
  settingsDefault: { count: 4 },
});

export const gallerySection = defineSection({
  type: "gallery",
  variants: ["mosaic", "filmstrip", "wall", "grid"],
  settings: z.object({
    source,
    /** `wall` only. */
    texture: z.enum(["plaster", "brick", "ridge", "zellige"]),
  }),
  settingsDefault: { source: "all", texture: "plaster" },
  blocks: {
    photo: z.object({ mediaId: ref, caption: z.optional(short) }),
    note: z.object({ text: short, signature: z.optional(z.string().check(z.maxLength(40))) }),
    sign: z.object({}),
  },
  refine: (section, issue) => {
    const photos = (section.blocks ?? []).filter((b) => b.type === "photo").length;
    if (photos > SHOP_LIMITS.photos) issue(["blocks"], `at most ${SHOP_LIMITS.photos} photos`);
  },
});

export const videoSection = defineSection({
  type: "video",
  variants: ["tv", "shorts"],
  settings: z.object({ cabinet: z.enum(["cabinet", "portable"]), channel: z.optional(z.string().check(z.maxLength(32))) }),
  settingsDefault: { cabinet: "cabinet" },
  blocks: { reel: z.object({ platform: z.enum(platforms), url }) },
});

export const reviewsSection = defineSection({
  type: "reviews",
  variants: ["summary-cards", "quote", "strip"],
  settings: z.object({ rule: z.enum(["best", "latest"]), count: oneOf(1, 2, 3) }),
  settingsDefault: { rule: "best", count: 2 },
});

export const bulletinSection = defineSection({
  type: "bulletin",
  variants: ["board", "banner"],
  settings: z.object({}),
  settingsDefault: {},
  blocks: { flyer: z.object({ text: short, signature: z.optional(z.string().check(z.maxLength(40))), until: z.optional(isoDay) }) },
  refine: (section, issue) => {
    if ((section.blocks ?? []).length > SHOP_LIMITS.flyers) issue(["blocks"], `at most ${SHOP_LIMITS.flyers} flyers`);
  },
});

export const teamSection = defineSection({
  type: "team",
  variants: ["row", "cards"],
  settings: z.object({ source }),
  settingsDefault: { source: "all" },
  blocks: { member: z.object({ memberId: ref }) },
});

export const visitSection = defineSection({
  type: "visit",
  variants: ["card", "map", "split"],
  settings: z.object({ showPhone: z.boolean() }),
  settingsDefault: { showPhone: true },
});

export const storySection = defineSection({
  type: "story",
  variants: ["quote", "owner"],
  settings: z.object({ body: localizedText }),
  settingsDefault: { body: {} },
});

export const socialSection = defineSection({
  type: "social",
  variants: ["links", "facade"],
  settings: z.object({}),
  settingsDefault: {},
  blocks: { link: z.object({ platform: z.enum(platforms), url }) },
});

export const faqSection = defineSection({
  type: "faq",
  variants: ["list"],
  settings: z.object({}),
  settingsDefault: {},
  blocks: { question: z.object({ question: localizedText, answer: localizedText }) },
});

export const policiesSection = defineSection({
  type: "policies",
  variants: ["inline"],
  settings: z.object({ show: z.array(z.enum(["cancellation", "prices", "booking-window"])).check(z.maxLength(3)) }),
  settingsDefault: { show: ["cancellation", "prices", "booking-window"] },
});

/** Every section type, in the order the composer lists them. */
export const SECTION_DEFINITIONS = [
  heroSection, servicesSection, bookingSection, gallerySection, videoSection, reviewsSection, bulletinSection,
  teamSection, visitSection, storySection, socialSection, faqSection, policiesSection,
] as const;

export type SectionDefinition = (typeof SECTION_DEFINITIONS)[number];
export type SectionType = SectionDefinition["type"];
export const SECTION_TYPES = SECTION_DEFINITIONS.map((d) => d.type) as readonly SectionType[];

/** The definition of a type. */
export function sectionDefinition<T extends SectionType>(type: T): Extract<SectionDefinition, { type: T }> {
  return SECTION_DEFINITIONS.find((d) => d.type === type) as Extract<SectionDefinition, { type: T }>;
}
