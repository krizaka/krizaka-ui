"use client";

// A map behind a button on a phone (ADR-007 §3, §7). Until it is asked for, the page holds a still drawing of the place
// (SVG, nothing requested) and a button: no engine, no tile, no request. From `sm` up the live map shows at once, because a
// laptop can afford it. The tiles are the Krizaka CDN's: no third party.
import { Map as LiveMap, type MapProps, StaticMap, type StaticMapProps } from "@krizaka/ui/map";
import * as React from "react";

export type MapGateProps = {
  /** The map's accessible name (`Where the salon is`). */
  label: string;
  /** Longitude, latitude. */
  center: StaticMapProps["center"];
  zoom?: number;
  /** Places drawn on the still and listed in its name. */
  places?: StaticMapProps["places"];
  /** The button's words (`Show the map`). */
  showLabel: string;
  /** More props of the live map (`brand`, `lang`, `labels`). */
  map?: Partial<Omit<MapProps, "label" | "center" | "zoom" | "fallback">>;
  className?: string;
};

const WIDE = "(min-width: 40rem)";
function subscribeWide(notify: () => void) {
  const q = window.matchMedia(WIDE);
  q.addEventListener("change", notify);
  return () => q.removeEventListener("change", notify);
}

/** The place as a still, the live map on a click — or at once on a screen that can afford it. */
export function MapGate({ label, center, zoom = 14, places, showLabel, map, className }: MapGateProps) {
  const [asked, setAsked] = React.useState(false);
  // A screen that can afford it shows the live map at once; the server and a phone start with the still.
  const wide = React.useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => false);
  const live = asked || wide;
  const still = <StaticMap label={label} center={center} zoom={zoom} places={places} />;
  return (
    <div className={className} data-live={live ? "" : undefined}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border-default sm:aspect-[16/9]">
        {live ? <LiveMap label={label} center={center} zoom={zoom} fallback={still} {...map} /> : still}
        {!live && (
          <button
            type="button"
            onClick={() => setAsked(true)}
            className="absolute bottom-3 left-3 inline-flex min-h-11 items-center rounded-md border border-border-control bg-surface-1 px-4 text-sm font-semibold text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {showLabel}
          </button>
        )}
      </div>
    </div>
  );
}
