// Server-safe. Reaching the team (blocks.css `.kz-tpl-contact`): the hero, then the ways to reach us as cards beside
// the form — the form in its own panel — and what happens after sending, as numbered steps. The form is yours.
import { Page } from "@krizaka/ui/page";
import type { LinkComponent } from "@krizaka/ui/page-hero";
import { PageHero } from "@krizaka/ui/page-hero";
import type * as React from "react";

export type ContactPageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** A mono line above the title. */
  eyebrow?: React.ReactNode;
  /** The page's `h1`. */
  title: React.ReactNode;
  /** One or two sentences: who answers, how fast. */
  lead?: React.ReactNode;
  /** Beside the hero: the bird that answers (the flamingo). */
  aside?: React.ReactNode;
  /** The ways to reach us: LinkCards (discussions, issues, email). */
  channels: React.ReactNode;
  /** The form (fields, the cut primary action). */
  form: React.ReactNode;
  /** What happens after sending: steps with a title and a sentence. */
  next?: { title: React.ReactNode; steps: readonly { title: React.ReactNode; text: React.ReactNode }[] };
  /** The app's link component (Next's `Link`). */
  linkAs?: LinkComponent;
};

/** A contact page: hero, the channels beside the form, then what happens next. */
export function ContactPage({ eyebrow, title, lead, aside, channels, form, next, linkAs, ...props }: ContactPageProps) {
  return (
    <div {...props}>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} aside={aside} linkAs={linkAs} />
      <Page className="kz-tpl-longform">
        <div className="kz-tpl-contact">
          <div className="kz-tpl-stack">
            {channels}
            {next && (
              <div className="kz-tpl-stack">
                <h2 className="kz-heading-title kz-tpl-h2">{next.title}</h2>
                <ol className="kz-tpl-next">
                  {next.steps.map((s, i) => (
                    <li key={i}>
                      <span>
                        <strong>{s.title}</strong>
                        {s.text}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          <div className="kz-tpl-form">{form}</div>
        </div>
      </Page>
    </div>
  );
}
