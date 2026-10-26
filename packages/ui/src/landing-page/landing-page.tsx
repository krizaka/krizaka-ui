// Server-safe. A landing page (blocks.css `.kz-tpl-*`): a split hero — the promise and its actions beside the product
// alive (a recording, a demo) — a band of proofs, the features as a bento where the main one takes the room, then the
// closing call. The blocks come through their package entries, so their client parts keep their boundary.
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { Page, Section } from "@krizaka/ui/page";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import type * as React from "react";

export interface LandingFeature {
  /** A stable key. */
  id: string;
  /** Its name. */
  title: React.ReactNode;
  /** One or two sentences. */
  text: React.ReactNode;
  /** A signature icon above the title. */
  icon?: React.ReactNode;
  /** A visual at the bottom of the tile (a chart, a screenshot, a code line). */
  visual?: React.ReactNode;
  /**
   * Its weight in the bento: `lg` (four columns, two rows — the main one), `md` (three), `sm` (two).
   * @default "sm"
   */
  size?: "lg" | "md" | "sm";
}

export type LandingPageProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** A mono line above the title. */
  eyebrow?: React.ReactNode;
  /** The promise: the page's `h1`. */
  title: React.ReactNode;
  /** One or two sentences under it. */
  lead?: React.ReactNode;
  /** The hero's actions (the main one cut, with shimmer). */
  actions?: React.ReactNode;
  /** The product, alive, beside the words: a recording, a live demo (framed as a window). */
  visual: React.ReactNode;
  /** The window's caption (`studio.app — studio`). */
  visualLabel?: React.ReactNode;
  /** Figures or facts in a band under the hero: `{ value, label }`. */
  proofs?: readonly { value: React.ReactNode; label: React.ReactNode }[];
  /** The features' section: its eyebrow, title and lead. */
  featuresHeading?: { eyebrow?: React.ReactNode; title: React.ReactNode; lead?: React.ReactNode };
  /** The features, as a bento. */
  features: readonly LandingFeature[];
  /** Between the features and the closing call: a story, a quote, testimonials. */
  children?: React.ReactNode;
  /** The closing call: its title, body and actions. */
  closing?: { title: React.ReactNode; body?: React.ReactNode; actions: React.ReactNode };
};

/** A landing page: split hero with the product alive, proofs, a bento of features, the closing call. */
export function LandingPage({ eyebrow, title, lead, actions, visual, visualLabel, proofs, featuresHeading, features, closing, children, ...props }: LandingPageProps) {
  return (
    <div {...props}>
      <SectionBackdrop as="header" grid className="kz-hero">
        <Page className="kz-tpl-hero-frame">
          <div className="kz-tpl-split">
            <div className="kz-hero-text">
              {eyebrow && <p className="kz-eyebrow">{eyebrow}</p>}
              <h1 className="kz-hero-title">{title}</h1>
              {lead && <p className="kz-hero-lead">{lead}</p>}
              {actions && <div className="kz-tpl-actions kz-hero-extra">{actions}</div>}
            </div>
            <figure className="kz-tpl-stage">
              <div className="kz-tpl-stage-bar" aria-hidden>
                {visualLabel && <span>{visualLabel}</span>}
              </div>
              {visual}
            </figure>
          </div>
        </Page>
      </SectionBackdrop>
      {proofs && proofs.length > 0 && (
        <Page>
          <dl className="kz-tpl-band">
            {proofs.map((p, i) => (
              <div key={i}>
                <dt>{p.value}</dt>
                <dd>{p.label}</dd>
              </div>
            ))}
          </dl>
        </Page>
      )}
      <Section id="features" eyebrow={featuresHeading?.eyebrow} title={featuresHeading?.title} lead={featuresHeading?.lead} reveal aria-label={featuresHeading ? undefined : "Features"}>
        <ul className="kz-tpl-bento">
          {features.map((f) => (
            <li key={f.id} data-size={f.size === "sm" ? undefined : f.size} data-reveal="">
              {f.icon && <span className="kz-block-icon" aria-hidden>{f.icon}</span>}
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              {f.visual && <div className="kz-tpl-bento-visual">{f.visual}</div>}
            </li>
          ))}
        </ul>
      </Section>
      {children}
      {closing && (
        <Section spacing="sm" aria-labelledby="landing-closing">
          <CtaPanel id="landing-closing" title={closing.title} body={closing.body} reveal>
            {closing.actions}
          </CtaPanel>
        </Section>
      )}
    </div>
  );
}
