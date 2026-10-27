// Server-safe: no hook. The services of a shop (ADR-007 §3). `menu` — the compact price board, the default of every preset:
// one row per service (an optional 56 px square thumbnail of the service's own photo, the name, « Popular », a dotted leader,
// the price in tabular figures, the duration and one line, a « Choose » button that names the service), grouped by category
// under a lower-case typewriter note, in one column beside an `aside` or in two. `cards` (4:3, six at most), `index` (the
// Cahier's stamped cards), `carousel` (a snap strip, phone first). The section receives resolved services; it never fetches.
import { Badge } from "@krizaka/ui/badge";
import { buttonVariants } from "@krizaka/ui/button";
import { ServiceCard } from "@krizaka/ui/service-card";
import * as React from "react";

import { BlockLink, type LinkComponent } from "../../block-link";
import { cn } from "../../cn";
import type { ShopPhoto } from "../frame";
import { ShopSection } from "../frame";
import { SHOP_LIMITS } from "../limits";
import { Photo } from "../photo";

export type ServicesVariant = "menu" | "cards" | "index" | "carousel";

/** A service as the product resolved it: its own photo (or none), its price already formatted. */
export type ShopService = {
  id: string;
  name: string;
  /** Formatted by the app (`$45`): the section never formats money. */
  price: string;
  /** The word before a varying price (`from`). */
  priceFrom?: string;
  /** `30 min`. */
  duration?: string;
  /** `Up to 5 dogs`. */
  capacity?: string;
  /** One line: what it is (truncated in the menu). */
  description?: string;
  /** What is included, one short line each (cards and index). */
  included?: readonly string[];
  /** The shop's category (`cuts`): the menu's group. */
  category?: string;
  /** The service's OWN photo. Never a default: without one the menu draws no thumbnail. */
  photo?: ShopPhoto;
  /** Booked most often (a real count): wears « Popular ». */
  popular?: boolean;
  /** The booking page with this service chosen. */
  href?: string;
};

export type ServicesSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** @default "menu" */
  variant?: ServicesVariant;
  services: readonly ShopService[];
  /** The section's `h2` (`Services`). */
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** `menu`: group by the services' `category`. @default "category" */
  groupBy?: "category" | "none";
  /** `menu` with no `aside`: one or two columns. @default 1 */
  columns?: 1 | 2;
  /** `menu`: the hours, the team and the address, beside the list from `lg` (sticky), below it on a phone. */
  aside?: React.ReactNode;
  /** The button's words (`Choose`); its accessible name is « Choose Short cut ». */
  chooseLabel: string;
  /** « Popular ». */
  popularLabel: string;
  /** The list's accessible name when there is no group (`Services`). */
  listLabel?: string;
  /** The app's link component for the booking addresses. */
  linkAs?: LinkComponent;
};

const GROUP_NOTE = "m-0 font-mono text-[13px] lowercase text-fg-secondary";

function groupsOf(services: readonly ShopService[], by: "category" | "none") {
  if (by === "none") return [{ name: undefined as string | undefined, items: services }];
  const groups: { name: string | undefined; items: ShopService[] }[] = [];
  for (const s of services) {
    const name = s.category;
    const group = groups.find((g) => g.name === name);
    if (group) group.items.push(s);
    else groups.push({ name, items: [s] });
  }
  return groups;
}

function MenuRow({ service, chooseLabel, popularLabel, linkAs }: { service: ShopService; chooseLabel: string; popularLabel: string; linkAs?: LinkComponent }) {
  const facts = [service.duration, service.capacity].filter(Boolean).join(" · ");
  return (
    <li className="flex items-center gap-3 border-b border-border-subtle py-2.5 last:border-b-0" data-service={service.id}>
      {service.photo && (
        <Photo photo={service.photo} ratio="1/1" sizes="56px" className="h-12 w-12 shrink-0 rounded-md sm:h-14 sm:w-14" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className="m-0 shrink truncate text-[15px] font-semibold leading-tight text-fg">{service.name}</h3>
          {service.popular && <Badge tone="accent" size="sm" className="hidden shrink-0 self-center sm:inline-flex">{popularLabel}</Badge>}
          <span aria-hidden className="min-w-4 flex-1 -translate-y-0.5 border-b border-dotted border-border-control" />
          <span className="shrink-0 whitespace-nowrap text-[15px] font-bold tabular-nums text-fg">
            {service.priceFrom && <span className="mr-1 text-xs font-medium text-fg-secondary">{service.priceFrom}</span>}
            {service.price}
          </span>
        </div>
        <p className="m-0 mt-0.5 truncate text-[13px] leading-snug text-fg-secondary">
          {service.popular && <Badge tone="accent" size="sm" className="mr-1.5 sm:hidden">{popularLabel}</Badge>}
          <span className="font-mono tabular-nums">{facts}</span>
          {facts && service.description && <span aria-hidden> · </span>}
          {service.description}
        </p>
      </div>
      {service.href && (
        <BlockLink
          href={service.href}
          linkAs={linkAs}
          aria-label={`${chooseLabel} ${service.name}`}
          className={cn(buttonVariants({ variant: "secondary", size: "md" }), "min-h-11 shrink-0 no-underline")}
        >
          {chooseLabel}
        </BlockLink>
      )}
    </li>
  );
}

function Menu({ services, groupBy, columns, aside, chooseLabel, popularLabel, listLabel, linkAs }: Required<Pick<ServicesSectionProps, "services" | "groupBy" | "columns" | "chooseLabel" | "popularLabel">> & Pick<ServicesSectionProps, "aside" | "listLabel" | "linkAs">) {
  const groups = groupsOf(services, groupBy);
  const uid = React.useId();
  const list = (
    <div className={cn("grid gap-x-12", !aside && columns === 2 && "lg:grid-cols-2")}>
      {groups.map((g, i) => (
        <div key={g.name ?? i} className="mb-3 min-w-0 last:mb-0">
          {g.name && <p className={GROUP_NOTE} id={`${uid}-grp-${i}`}>{g.name}</p>}
          <ul aria-label={g.name ? undefined : listLabel} aria-labelledby={g.name ? `${uid}-grp-${i}` : undefined} className="m-0 list-none p-0">
            {g.items.map((s) => (
              <MenuRow key={s.id} service={s} chooseLabel={chooseLabel} popularLabel={popularLabel} linkAs={linkAs} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
  if (!aside) return list;
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
      {list}
      <aside className="kz-shop-aside flex flex-col gap-4">{aside}</aside>
    </div>
  );
}

/** The services of a shop: the price board by default, or cards, index cards, a carousel. */
export function ServicesSection({ variant = "menu", services, title, lead, groupBy = "category", columns = 1, aside, chooseLabel, popularLabel, listLabel, linkAs, className, ...props }: ServicesSectionProps) {
  const card = (s: ShopService, i: number, extra?: string) => (
    <ServiceCard
      key={s.id}
      name={s.name}
      price={s.price}
      priceFrom={s.priceFrom}
      duration={s.duration}
      capacity={s.capacity}
      description={s.description}
      included={s.included}
      tag={s.popular ? popularLabel : undefined}
      media={s.photo ? <img src={s.photo.src} srcSet={s.photo.srcSet} sizes="(min-width: 64rem) 18rem, 90vw" alt={s.photo.alt} loading="lazy" decoding="async" /> : undefined}
      mediaRatio="photo"
      variant={variant === "index" ? "index" : "default"}
      actionLabel={chooseLabel}
      href={s.href}
      linkAs={linkAs}
      className={extra}
      data-index={i}
    />
  );
  let body: React.ReactNode;
  if (variant === "menu") {
    body = <Menu services={services} groupBy={groupBy} columns={columns} aside={aside} chooseLabel={chooseLabel} popularLabel={popularLabel} listLabel={listLabel} linkAs={linkAs} />;
  } else if (variant === "carousel") {
    body = (
      <div role="group" aria-label={listLabel ?? (typeof title === "string" ? title : undefined)} tabIndex={0} className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:mx-0 sm:px-0">
        {services.map((s, i) => card(s, i, "w-[78vw] max-w-72 shrink-0 snap-start sm:w-72"))}
      </div>
    );
  } else {
    const shown = variant === "cards" ? services.slice(0, SHOP_LIMITS.cards) : services;
    body = <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">{shown.map((s, i) => card(s, i, "h-auto"))}</div>;
  }
  return (
    <ShopSection title={title} lead={lead} className={className} data-variant={variant} {...props}>
      {body}
    </ShopSection>
  );
}
