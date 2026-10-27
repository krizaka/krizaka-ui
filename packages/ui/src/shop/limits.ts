// The bounds of a shop page (ADR-007 §3): the schema, the database and the composer read the same numbers.

/**
 * The most a page, a section or a card list may hold. A salon page that stays a page that sells: bounded on purpose.
 * @fixed: ADR-007 §3 — product limits of the document, never a business setting.
 */
export const SHOP_LIMITS = {
  /** Sections on a page, the hero included. */
  sections: 16,
  /** Blocks in one section. */
  blocks: 24,
  /** Photos in a gallery. */
  photos: 12,
  /** Cards in `services · cards`. */
  cards: 6,
  /** Flyers on a bulletin board. */
  flyers: 3,
  /** Reels in `video · shorts`. */
  reels: 6,
} as const;
