// Server-safe. The owner's words (ADR-007 §3): `quote` — a pull quote and a paragraph; `owner` — the owner's face, a
// paragraph, and a way to call or write. The words are the owner's, in the visitor's language; nothing is invented.
import { Avatar } from "@krizaka/ui/avatar";
import * as React from "react";

import { ShopSection } from "../frame";

export type StoryVariant = "quote" | "owner";

export type StorySectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** @default "quote" */
  variant?: StoryVariant;
  title: React.ReactNode;
  /** `quote`: the pull quote. */
  quote?: string;
  /** The paragraph. */
  body: string;
  /** `owner`: who speaks. */
  owner?: { name: string; photo?: string };
  /** `owner`: call or write (`ButtonLink`s). */
  actions?: React.ReactNode;
};

/** The owner's story, as a pull quote or a face and a paragraph. */
export function StorySection({ variant = "quote", title, quote, body, owner, actions, className, ...props }: StorySectionProps) {
  if (!body && !quote) return null;
  return (
    <ShopSection title={title} className={className} data-variant={variant} {...props}>
      {variant === "owner" ? (
        <div className="flex max-w-3xl items-start gap-4">
          {owner && <Avatar src={owner.photo} alt="" fallback={owner.name.slice(0, 1)} size="xl" />}
          <div className="min-w-0">
            {owner && <p className="m-0 font-semibold text-fg">{owner.name}</p>}
            <p className="m-0 mt-1 text-base leading-relaxed text-fg-secondary">{body}</p>
            {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
          </div>
        </div>
      ) : (
        <div className="grid max-w-4xl gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
          {quote && <blockquote className="m-0 border-s-2 border-accent ps-4 font-display text-2xl leading-snug text-fg">{quote}</blockquote>}
          <p className="m-0 text-base leading-relaxed text-fg-secondary">{body}</p>
        </div>
      )}
    </ShopSection>
  );
}
