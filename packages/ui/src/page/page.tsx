// Server-safe. The frame of every page (blocks.css): one width, one pair of gutters, one vertical rhythm — so the
// navigation, the hero and every section line up on the same edges, at any width.
import * as React from "react";

import { cn } from "../cn";
import { SectionBackdrop, type SectionBackdropProps } from "../section-backdrop/section-backdrop";

export type PageSize = "narrow" | "default" | "wide" | "full";

export type PageProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * The width of the content: `default` (72rem, `--kz-page-max`), `narrow` (48rem, a reading column), `wide`
   * (88rem, documentation with a sidebar), `full` (the gutters only).
   * @default "default"
   */
  size?: PageSize;
  /** The element: `div` (default), `main`, `header`, `footer`, `section` or `article`. */
  as?: "div" | "main" | "header" | "footer" | "section" | "article";
};

/** The page frame: centred, at most `--kz-page-max` wide, with the gutters of `--kz-page-gutter` (16 → 32 px). */
export function Page({ size = "default", as: Tag = "div", className, ...props }: PageProps) {
  return <Tag data-size={size === "default" ? undefined : size} className={cn("kz-page", className)} {...props} />;
}

export type SectionHeadingProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  /** The id of the title: the section's anchor and its accessible name. */
  id?: string;
  /** A short mono line above the title (the section's subject). */
  eyebrow?: React.ReactNode;
  /** The title. */
  title: React.ReactNode;
  /** One or two sentences under the title. */
  lead?: React.ReactNode;
  /** Actions on the right of the heading (a link to everything, a filter). */
  actions?: React.ReactNode;
  /**
   * The level of the title.
   * @default 2
   */
  level?: 2 | 3;
  /**
   * `md` for a section that argues, `sm` for a section of a reading page.
   * @default "md"
   */
  size?: "sm" | "md";
  /**
   * `center` for a heading that stands alone above a grid.
   * @default "start"
   */
  align?: "start" | "center";
  /** Rises into place once, as it enters the viewport (`[data-reveal]`, MotionObserver). Never on the first screen. */
  reveal?: boolean;
};

/** The head of a section: eyebrow (mono, the accent), title, lead — and its actions on the right. */
export function SectionHeading({ id, eyebrow, title, lead, actions, level = 2, size = "md", align = "start", reveal, className, ...props }: SectionHeadingProps) {
  const H = level === 2 ? "h2" : "h3";
  return (
    <div
      className={cn("kz-heading", className)}
      data-size={size === "md" ? undefined : size}
      data-align={align === "start" ? undefined : align}
      data-actions={actions ? "" : undefined}
      data-reveal={reveal ? "" : undefined}
      {...props}
    >
      {eyebrow && <p className="kz-eyebrow">{eyebrow}</p>}
      <H id={id} className="kz-heading-title">
        {title}
      </H>
      {lead && <p className="kz-heading-lead">{lead}</p>}
      {actions && <div className="kz-heading-actions">{actions}</div>}
    </div>
  );
}

export type SectionProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The id of the title (and the anchor of the section). Required with a `title`. */
  id?: string;
  /** The heading's eyebrow. */
  eyebrow?: React.ReactNode;
  /** The section's title: an `h2` (a `SectionHeading`), which names the section for assistive technology. */
  title?: React.ReactNode;
  /** The heading's lead. */
  lead?: React.ReactNode;
  /** The heading's actions. */
  actions?: React.ReactNode;
  /**
   * The heading's size: `md` for a page that argues, `sm` for a reading page.
   * @default "md"
   */
  headingSize?: "sm" | "md";
  /**
   * The heading's alignment.
   * @default "start"
   */
  headingAlign?: "start" | "center";
  /** The heading rises into place once (never on the first screen). */
  reveal?: boolean;
  /** A hairline above the section, inside the gutters: the transition between two sections of the same surface. */
  divider?: boolean;
  /**
   * The vertical space above and below: `sm` (a reading page), `md`, `lg` (a page's main moments).
   * @default "md"
   */
  spacing?: "sm" | "md" | "lg";
  /**
   * The width of the content.
   * @default "default"
   */
  size?: PageSize;
  /** The brand's colour transition behind the section (SectionBackdrop): `true`, or its props (`direction`, `grid`…). */
  backdrop?: boolean | Omit<SectionBackdropProps, "as" | "children">;
};

/**
 * A section of a page: full-bleed (its backdrop reaches the edges), its content in the page frame, its heading on top.
 * Sections follow each other on one rhythm; a `divider` or a `backdrop` marks the transition.
 */
export function Section({
  id,
  eyebrow,
  title,
  lead,
  actions,
  headingSize,
  headingAlign,
  reveal,
  divider,
  spacing = "md",
  size,
  backdrop,
  className,
  children,
  ...props
}: SectionProps) {
  const body = (
    <Page size={size}>
      {title && <SectionHeading id={id} eyebrow={eyebrow} title={title} lead={lead} actions={actions} size={headingSize} align={headingAlign} reveal={reveal} />}
      {children}
    </Page>
  );
  const shared = {
    "aria-labelledby": title && id ? id : undefined,
    "data-divider": divider ? "" : undefined,
    "data-spacing": spacing === "md" ? undefined : spacing,
    ...props,
  };
  if (backdrop) {
    const backdropProps = backdrop === true ? {} : backdrop;
    return (
      <SectionBackdrop {...backdropProps} {...shared} className={cn("kz-section", className)}>
        {body}
      </SectionBackdrop>
    );
  }
  return (
    <section {...shared} className={cn("kz-section", className)}>
      {body}
    </section>
  );
}

export type TicksProps = {
  /** A sentence where words between backticks are code: "Every request carries a `requestId`." */
  children: string;
};

/** A sentence of a message catalogue where words between backticks read as code — no markup in the translations. */
export function Ticks({ children }: TicksProps) {
  const parts = children.split("`");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <code key={i} className="kz-ic">
            {part}
          </code>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

export interface Fact {
  /** A few words: `npm 2.5.0`, `Maven Central`, `in progress`. */
  label: string;
  /**
   * `ok` — published, usable today; `wip` — in progress, said honestly; `neutral` — a fact.
   * @default "neutral"
   */
  tone?: "ok" | "wip" | "neutral";
  /** Where the fact is proven (a registry page): the fact becomes a link. */
  href?: string;
}

export type FactsProps = React.HTMLAttributes<HTMLUListElement> & {
  /** The facts, in reading order. */
  items: readonly Fact[];
};

/** Compact facts on one line — a dot that says the state, a few mono words. Links open in a new tab. */
export function Facts({ items, className, ...props }: FactsProps) {
  return (
    <ul className={cn("kz-facts", className)} {...props}>
      {items.map((fact) => {
        const body = (
          <>
            <span className="kz-fact-dot" aria-hidden /> {fact.label}
          </>
        );
        const tone = fact.tone && fact.tone !== "neutral" ? fact.tone : undefined;
        return (
          <li key={fact.label}>
            {fact.href ? (
              <a href={fact.href} target="_blank" rel="noopener noreferrer" className="kz-fact" data-tone={tone}>
                {body}
              </a>
            ) : (
              <span className="kz-fact" data-tone={tone}>
                {body}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
