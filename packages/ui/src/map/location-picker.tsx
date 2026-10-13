// Client. A place chosen by moving the map under a fixed pin — a meeting point, a delivery address, the centre of a
// search — with its distance from where the person is (a chip) and "near me": the browser asks for the position only when
// the button is pressed, and every answer has its words (locating, refused, unavailable). The value is a position.
import * as React from "react";

import { tv } from "../tv";
import { distanceMeters, formatDistance, type LngLat } from "./geo";
import { Map, type MapProps, RadiusCircle, UserPosition } from "./map";

export const locationPicker = tv({
  slots: {
    root: "flex flex-col gap-2",
    frame: "relative",
    pin: "pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full text-accent drop-shadow-md",
    bar: "absolute inset-x-3 bottom-8 z-10 flex flex-wrap items-center justify-between gap-2",
    chip: "rounded-full border border-border-default bg-surface-1 px-3 py-1.5 text-xs font-semibold tabular-nums text-fg shadow-floating",
    near:
      "inline-flex h-10 items-center gap-2 rounded-full border border-border-default bg-surface-1 bg-sheen px-4 text-sm font-semibold text-fg shadow-floating inset-shadow-edge " +
      "transition-colors hover:border-border-strong focus-visible:outline-hidden focus-visible:focus-ring disabled:opacity-60",
    status: "text-xs text-fg-secondary data-[tone=danger]:text-fg-danger",
  },
});

export type LocationPickerLabels = {
  /** The button that centres the map on the person ("Near me"). */
  nearMe: string;
  /** While the position is asked ("Finding you…"). */
  locating: string;
  /** The person refused ("Location is off for this site. Move the map instead."). */
  denied: string;
  /** No position (no GPS, a timeout) ("We could not find you. Move the map instead."). */
  unavailable: string;
  /** The person's place in the list of places ("You are here"). */
  you: string;
  /** The distance chip, from a written distance ("1.2 km from you"). */
  distance: (distance: string) => string;
};

export const locationPickerLabels: LocationPickerLabels = {
  nearMe: "Near me",
  locating: "Finding you…",
  denied: "Location is off for this site. Move the map instead.",
  unavailable: "We could not find you. Move the map instead.",
  you: "You are here",
  distance: (d) => `${d} from you`,
};

export type LocationPickerProps = Pick<MapProps, "scheme" | "brand" | "lang" | "region" | "world" | "fallback" | "className"> & {
  /** The picker's accessible name ("Meeting point"), passed translated. */
  label: string;
  /** The chosen position (controlled): the centre of the map. */
  value: LngLat;
  /** Called when the map rests on a new position. */
  onValueChange: (value: LngLat) => void;
  /** The BCP 47 locale of the distance. */
  locale: string;
  /** The zoom at first. Default 14. */
  zoom?: number;
  /** A radius in metres drawn around the chosen position (a delivery zone, a search radius). */
  radius?: number;
  /** Where the person is, when the app already knows it (the distance chip shows at once). */
  origin?: LngLat | null;
  /** The words, passed translated; English by default. */
  labels?: Partial<LocationPickerLabels>;
};

type Status = "idle" | "locating" | "denied" | "unavailable";

/** A position picked by moving the map under a pin; its distance from the person; "near me" on request. */
export function LocationPicker({ label, value, onValueChange, locale, zoom = 14, radius, origin: originProp = null, labels: given, className, ...map }: LocationPickerProps) {
  const labels = { ...locationPickerLabels, ...given };
  const s = locationPicker();
  const [origin, setOrigin] = React.useState<LngLat | null>(originProp);
  const [camera, setCamera] = React.useState<LngLat>(value);
  const [status, setStatus] = React.useState<Status>("idle");
  const statusId = React.useId();
  const nearMe = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return setStatus("unavailable");
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const here: LngLat = [p.coords.longitude, p.coords.latitude];
        setOrigin(here);
        setCamera(here);
        onValueChange(here);
        setStatus("idle");
      },
      (e) => setStatus(e.code === 1 ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
  };
  const distance = origin ? formatDistance(distanceMeters(origin, value), locale) : null;
  const message = status === "locating" ? labels.locating : status === "denied" ? labels.denied : status === "unavailable" ? labels.unavailable : "";
  return (
    <div className={s.root({ className })} role="group" aria-label={label}>
      <div className={s.frame()}>
        <Map {...map} label={label} center={camera} zoom={zoom} controlled onMoveEnd={(v) => onValueChange(v.center)} className="h-80">
          {radius ? <RadiusCircle center={value} radius={radius} /> : null}
          {origin ? <UserPosition position={origin} label={labels.you} /> : null}
        </Map>
        <svg aria-hidden viewBox="0 0 24 32" className={s.pin()} width="30" height="40">
          <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 32 12 32s12-11.6 12-20.3C24 5.2 18.6 0 12 0Z" fill="currentColor" />
          <circle cx="12" cy="11.5" r="4.5" fill="var(--kz-on-accent)" />
        </svg>
        <div className={s.bar()}>
          {distance ? (
            <span className={s.chip()} aria-live="polite">
              {labels.distance(distance)}
            </span>
          ) : (
            <span />
          )}
          <button type="button" className={s.near()} onClick={nearMe} disabled={status === "locating"} aria-describedby={message ? statusId : undefined}>
            <svg aria-hidden viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3.5" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
            {status === "locating" ? labels.locating : labels.nearMe}
          </button>
        </div>
      </div>
      <p id={statusId} className={s.status()} data-tone={status === "denied" || status === "unavailable" ? "danger" : undefined} aria-live="polite">
        {message}
      </p>
    </div>
  );
}
