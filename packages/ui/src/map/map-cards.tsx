"use client";

import * as React from "react";

import { tv } from "../tv";
import type { LngLat } from "./geo";
import { ROUTE_APPS, type RouteApp, routeLinks } from "./route-links";

export const mapCard = tv({
  slots: {
    root: "flex flex-col gap-2 text-fg",
    photo: "aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-2 [&>img]:h-full [&>img]:w-full [&>img]:object-cover",
    title: "text-base font-semibold leading-snug",
    meta: "text-sm text-fg-secondary",
    status: "w-fit rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-fg-secondary",
    action: "mt-1 flex",
    times: "grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-2 text-sm",
    time: "flex flex-col rounded-lg bg-surface-2 px-2.5 py-1.5",
    timeLabel: "text-xs text-fg-secondary",
    menu: "flex flex-wrap gap-2",
    link: "rounded-md border border-border-default px-3 py-1.5 text-sm font-medium text-fg hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-border-focus",
  },
});

export type MapInfoCardProps = Omit<React.ComponentProps<"article">, "title"> & {
  title: React.ReactNode;
  /** The heading level of the title. Default 3. */
  titleLevel?: 2 | 3 | 4;
  /** A picture (an img or next/image); supply its alt text. Absent: no photo area. */
  photo?: React.ReactNode;
  /** One line under the title: category, distance, hours. */
  meta?: React.ReactNode;
  /** A short honest status ("Open now", "In development"). */
  status?: React.ReactNode;
  /** The one action (a Button or a link); the card carries no second one. */
  action?: React.ReactNode;
};

/** What a place says about itself on a map: photo, title, one meta line, a status and ONE action — every field optional. */
export function MapInfoCard({ title, titleLevel = 3, photo, meta, status, action, className, ...props }: MapInfoCardProps) {
  const s = mapCard();
  const Heading = `h${titleLevel}` as "h3";
  return (
    <article {...props} className={s.root({ className })}>
      {photo ? <div className={s.photo()}>{photo}</div> : null}
      <Heading className={s.title()}>{title}</Heading>
      {meta ? <p className={s.meta()}>{meta}</p> : null}
      {status ? <p className={s.status()}>{status}</p> : null}
      {action ? <div className={s.action()}>{action}</div> : null}
    </article>
  );
}

export type RouteTime = { /** "On foot", "By bike" — translated. */ label: string; /** "12 min" — formatted by the host from a real source. */ value: string };

export type RouteCardProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** The destination's name. */
  destination: React.ReactNode;
  /** Where it is, for the links. */
  position: LngLat;
  /** Where the person is, when known: the links then start there. */
  origin?: LngLat;
  /** The heading of the links ("Directions"). */
  directionsLabel: string;
  /** The apps' names, translated or not ("Apple Maps", "Google Maps", "OpenStreetMap", "Waze", "Transit"). */
  appLabels: Record<RouteApp, string>;
  /** Honest times, computed by the host from a real source (never invented here). Absent: no row. */
  times?: readonly RouteTime[];
  /** The apps shown, in order. Default all five. */
  apps?: readonly RouteApp[];
};

/** A destination, the times the host knows, and the « Directions » links to the person's own navigation app. */
export function RouteCard({ destination, position, origin, directionsLabel, appLabels, times, apps = ROUTE_APPS, className, ...props }: RouteCardProps) {
  const s = mapCard();
  const links = routeLinks(position, origin);
  const id = React.useId();
  return (
    <section {...props} aria-labelledby={id} className={s.root({ className })}>
      <h3 id={id} className={s.title()}>{destination}</h3>
      {times?.length ? (
        <dl className={s.times()}>
          {times.map((t) => (
            <div key={t.label} className={s.time()}>
              <dt className={s.timeLabel()}>{t.label}</dt>
              <dd>{t.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <nav aria-label={directionsLabel}>
        <ul className={s.menu()}>
          {apps.map((app) => (
            <li key={app}>
              <a className={s.link()} href={links[app]} target="_blank" rel="noopener noreferrer">
                {appLabels[app]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
