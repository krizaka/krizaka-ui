// Server-safe. The rules of the shop, in the open (ADR-007 §3): cancellation, prices, the booking window — a real
// description list, the owner's own words.
import { DescriptionList } from "@krizaka/ui/description-list";
import * as React from "react";

import { ShopSection } from "../frame";

export type ShopPolicy = { id: string; term: string; details: React.ReactNode };

export type PoliciesSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** @default "inline" */
  variant?: "inline";
  title: React.ReactNode;
  items: readonly ShopPolicy[];
};

/** Cancellation, prices and the booking window, as term and value. */
export function PoliciesSection({ title, items, className, ...props }: PoliciesSectionProps) {
  if (items.length === 0) return null;
  return (
    <ShopSection title={title} className={className} data-variant="inline" {...props}>
      <DescriptionList layout="inline" className="max-w-3xl" items={items.map((p) => ({ id: p.id, term: p.term, details: p.details }))} />
    </ShopSection>
  );
}
