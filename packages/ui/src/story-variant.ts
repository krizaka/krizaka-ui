// The two looks of the storytelling kit (story.css), shared by its entries. Server-safe.

/** The look of the storytelling kit: `default` (sober, for any app) or `arcade` (the opt-in cabinet flavour). */
export type StoryVariant = "default" | "arcade";

/** The class a storytelling component adds for its look (`kzs-arcade` for the arcade flavour). */
export const storyVariantClass = (variant: StoryVariant | undefined) => (variant === "arcade" ? "kzs-arcade" : undefined);

/** The class of a brand scope (`brand-yomizaka`): the accent and the gradient become that brand's. */
export const brandClass = (brand: string | undefined) => (brand ? `brand-${brand}` : undefined);
