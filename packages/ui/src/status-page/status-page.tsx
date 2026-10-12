// Server-safe. Where things stand (blocks.css `.kz-tpl-state`, `.kz-tpl-services`): the overall state in words and
// colour, each service on its line, the incidents under them — or, for something not built yet (`state="building"`),
// what is coming, its progress and how to hear about it, the bird beside it. A state is always said in words.
import { Page, Section } from "@krizaka/ui/page";
import type { LinkComponent } from "@krizaka/ui/page-hero";
import { PageHero } from "@krizaka/ui/page-hero";
import type * as React from "react";

export type ServiceState = "operational" | "degraded" | "outage" | "building";

export type StatusPageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The way back. */
  back?: { href: string; label: string };
  /** A mono line above the title. */
  eyebrow?: React.ReactNode;
  /** The page's `h1` (`Status`, `Yazakia is on its way`). */
  title: React.ReactNode;
  /** One sentence under it. */
  lead?: React.ReactNode;
  /** Beside the hero: a bird (the pigeon that delivers, the duck that builds). */
  aside?: React.ReactNode;
  /** The overall state. */
  state: ServiceState;
  /** The overall state, in words (`All systems operational`). */
  stateLabel: React.ReactNode;
  /** When it was checked (`Checked 2 min ago`). */
  checked?: React.ReactNode;
  /** The services and their states, in words: `{ id, name, state, label }`. */
  services?: readonly { id: string; name: React.ReactNode; state: ServiceState; label: React.ReactNode }[];
  /** The services list's accessible name (`Services`). */
  servicesLabel?: string;
  /** Under the services: the incidents (a ChangelogPage's entries, a list), or for `building` the progress and the way to follow. */
  children?: React.ReactNode;
  /** The app's link component (Next's `Link`). */
  linkAs?: LinkComponent;
};

/** A status page — or an « under construction » one: the overall state, each service, then incidents or progress. */
export function StatusPage({ back, eyebrow, title, lead, aside, state, stateLabel, checked, services, servicesLabel = "Services", linkAs, children, ...props }: StatusPageProps) {
  return (
    <div {...props}>
      <PageHero back={back} linkAs={linkAs} eyebrow={eyebrow} title={title} lead={lead} aside={aside} backdrop="plain" />
      <Page className="kz-tpl-longform">
        <div className="kz-tpl-state" data-state={state} role="status">
          <span className="kz-tpl-dot" aria-hidden />
          <strong>{stateLabel}</strong>
          {checked && <span className="kz-tpl-count">{checked}</span>}
        </div>
        {services && services.length > 0 && (
          <ul className="kz-tpl-services" aria-label={servicesLabel}>
            {services.map((s) => (
              <li key={s.id}>
                <span>{s.name}</span>
                <small>
                  <span className="kz-tpl-dot" data-state={s.state} aria-hidden />
                  {s.label}
                </small>
              </li>
            ))}
          </ul>
        )}
      </Page>
      {children && <Section spacing="sm">{children}</Section>}
    </div>
  );
}
