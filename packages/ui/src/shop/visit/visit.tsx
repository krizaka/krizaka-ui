// Server-safe (the map is a client island). How to come and when (ADR-007 §3): `card` — the hours, the address and a call;
// `map` — the place on a map (on a phone behind a button), the address under it; `split` — the hours beside the map. The
// hours are the shop's own, the status is its own words: the section draws them, it never reads the clock.
import { type OpeningDay, OpeningHours, type OpeningStatus } from "@krizaka/ui/opening-hours";
import { MapGate, type MapGateProps } from "@krizaka/ui/shop/map-gate";
import * as React from "react";

import { ShopSection } from "../frame";

export type VisitVariant = "card" | "map" | "split";

export type VisitSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** @default "card" */
  variant?: VisitVariant;
  title: React.ReactNode;
  hours: readonly OpeningDay[];
  /** Today's day id: its row is marked. */
  today?: string;
  status: OpeningStatus;
  /** The name of the hours list (`Hours`). */
  hoursLabel: string;
  address?: string;
  /** `tel:` target and its text; `showPhone: false` of the document leaves both out. */
  phone?: { href: string; label: string };
  /** `map` and `split`: the place. Without it these draw as a `card`. */
  map?: Omit<MapGateProps, "className">;
};

/** Where and when: hours, address, call, and the place on a map. */
export function VisitSection({ variant = "card", title, hours, today, status, hoursLabel, address, phone, map, className, ...props }: VisitSectionProps) {
  const details = (
    <div className="flex flex-col gap-2 text-sm text-fg-secondary">
      {address && <p className="m-0">{address}</p>}
      {phone && (
        <p className="m-0">
          <a href={phone.href} className="font-semibold text-fg-accent underline">{phone.label}</a>
        </p>
      )}
    </div>
  );
  const opening = <OpeningHours label={hoursLabel} days={hours} today={today} status={status} />;
  const drawn: VisitVariant = map ? variant : "card";
  return (
    <ShopSection title={title} className={className} data-variant={drawn} {...props}>
      {drawn === "card" && (
        <div className="grid max-w-xl gap-3">
          {opening}
          {details}
        </div>
      )}
      {drawn === "map" && (
        <div className="grid gap-3">
          <MapGate {...map!} />
          {details}
        </div>
      )}
      {drawn === "split" && (
        <div className="grid items-start gap-4 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-8">
          <div className="grid gap-3">
            {opening}
            {details}
          </div>
          <MapGate {...map!} />
        </div>
      )}
    </ShopSection>
  );
}
