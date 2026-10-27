// Server-safe. The people of the shop (ADR-007 §3): `row` — avatars and first names in a line; `cards` — a card each with a
// role. Faces are the members' own photos, or the default avatar of @krizaka/ui: never a stock face.
import { Avatar } from "@krizaka/ui/avatar";
import * as React from "react";

import { ShopSection } from "../frame";

export type TeamVariant = "row" | "cards";

export type ShopMember = {
  id: string;
  /** The first name. */
  name: string;
  /** What they do (`Colourist`): `cards` only. */
  role?: string;
  /** Their own photo. Without one the default avatar is drawn. */
  photo?: string;
};

export type TeamSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** @default "row" */
  variant?: TeamVariant;
  members: readonly ShopMember[];
  title: React.ReactNode;
  lead?: React.ReactNode;
};

/** The people of the shop. */
export function TeamSection({ variant = "row", members, title, lead, className, ...props }: TeamSectionProps) {
  if (members.length === 0) return null;
  const list =
    variant === "cards" ? (
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((m) => (
          <li key={m.id} className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-1 p-3">
            <Avatar src={m.photo} fallback={m.name.slice(0, 1)} size="lg" />
            <div className="min-w-0">
              <p className="m-0 truncate font-semibold text-fg">{m.name}</p>
              {m.role && <p className="m-0 truncate text-[13px] text-fg-secondary">{m.role}</p>}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-3 p-0">
        {members.map((m) => (
          <li key={m.id} className="flex items-center gap-2.5">
            <Avatar src={m.photo} fallback={m.name.slice(0, 1)} size="md" />
            <span className="font-semibold text-fg">{m.name}</span>
          </li>
        ))}
      </ul>
    );
  return (
    <ShopSection title={title} lead={lead} className={className} data-variant={variant} {...props}>
      {list}
    </ShopSection>
  );
}
