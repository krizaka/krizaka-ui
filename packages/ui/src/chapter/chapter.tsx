// Server-safe. The chapters of a story on the Cahier (ADR-004, blocks.css, krizaka-ui#617): a sober timeline, never a
// stack of boxes. The rows sit on the notebook's ruled lines (`data-paper="lines"`, the ruling of `Page`), the number
// hangs in the margin beside its red rule (`data-margin`), the serif title is the link, the period is quiet.
// - `ChapterIndex` — the chapters in reading order, one ruled line each (two at most), the latest marked « New »;
// - `ChapterHead` — the head of a chapter's page: number in the margin, title, one quiet meta line, the standfirst;
// - `ChapterFoot` — its foot: the previous and next chapters on the lines, then one line back to the story.
// No border per row, no card, no button: the paper carries the rhythm. Every word arrives as a prop.
// `ChapterIndex variant="album"` (#621): each row is the chapter's cover as a `TapedPhoto`, the prints facing each other
// from left to right, and beside it the same number, title, line and period — light, on the same lines.
import type * as React from "react";

import { BlockLink, type LinkComponent } from "../block-link";
import { cn } from "../cn";
import { TapedPhoto } from "../taped-photo";

/** The notebook under the rows: `lines` (the ruling of `Page`, aligned on the rows) or `false` (the page's own paper). */
type ChapterPaper = "lines" | false;

export interface ChapterEntry {
  /** Its number, hung in the margin: `01`, `§ 1`. */
  number: React.ReactNode;
  /** The title, in the serif: the link. */
  title: React.ReactNode;
  /** Where it leads. */
  href: string;
  /** When it happened, quiet on the right (under the title on a phone): `janv. – mars 2026`, or a `<time>`. */
  period?: React.ReactNode;
  /** One more line under the title (what was faced → what was built). Off unless given: the chapter's page says it. */
  detail?: React.ReactNode;
  /** The latest chapter: a small mark after the title, in the hue (`newLabel`). */
  isNew?: boolean;
  /** The page the reader is on. */
  current?: boolean;
  /** Its cover, drawn by the `album` variant as a taped print. Decorative there (`alt=""`): the title carries the link. */
  cover?: ChapterCover;
}

/** A chapter's cover: its intrinsic size gives the print its aspect-ratio, so nothing shifts while it loads. */
export interface ChapterCover {
  src: string;
  width: number;
  height: number;
  srcSet?: string;
  /** @default "(max-width: 34rem) 60vw, 26rem" */
  sizes?: string;
}

/** The covers above the fold load at once; the rest wait for the reader. */
const EAGER_COVERS = 2;
/** The prints face each other: the left one leans left, the right one leans right (TapedPhoto's practice). */
const ALBUM_TILT = 1.4;

function ChapterPrint({ cover, index }: { cover: ChapterCover; index: number }) {
  return (
    <TapedPhoto className="kz-chapter-print" tilt={index % 2 === 0 ? -ALBUM_TILT : ALBUM_TILT} aria-hidden>
      <img
        src={cover.src}
        srcSet={cover.srcSet}
        sizes={cover.srcSet ? (cover.sizes ?? "(max-width: 34rem) 60vw, 26rem") : undefined}
        width={cover.width}
        height={cover.height}
        alt=""
        loading={index < EAGER_COVERS ? "eager" : "lazy"}
        decoding="async"
      />
    </TapedPhoto>
  );
}

/** One ruled row: number in the margin, the title as the link (its hit area the whole row), an aside on the right. */
function ChapterRow({
  number,
  title,
  href,
  aside,
  mark,
  detail,
  current,
  rel,
  linkAs,
}: {
  number?: React.ReactNode;
  title: React.ReactNode;
  href: string;
  aside?: React.ReactNode;
  mark?: React.ReactNode;
  detail?: React.ReactNode;
  current?: boolean;
  rel?: string;
  linkAs?: LinkComponent;
}) {
  return (
    <>
      <span className="kz-chapter-no">{number}</span>
      <BlockLink href={href} linkAs={linkAs} rel={rel} className="kz-chapter-link" aria-current={current ? "page" : undefined}>
        <span className="kz-chapter-title">{title}</span>
        {mark && (
          <>
            {" "}
            <span className="kz-chapter-new">{mark}</span>
          </>
        )}
      </BlockLink>
      {aside && (
        <>
          {/* A space, not a margin: in a narrow column the period runs on after the title, and starts flush when it wraps. */}{" "}
          <span className="kz-chapter-period">{aside}</span>
        </>
      )}
      {detail && <span className="kz-chapter-detail">{detail}</span>}
    </>
  );
}

export type ChapterIndexProps = Omit<React.OlHTMLAttributes<HTMLOListElement>, "children"> & {
  /** The chapters, in reading order. */
  chapters: readonly ChapterEntry[];
  /** The word of the latest chapter's mark. @default "New" */
  newLabel?: React.ReactNode;
  /** The accessible name of the list, when no heading names it (`aria-labelledby`). */
  label?: string;
  /** The ruling under the rows. `false` when the page is ruled already and the list starts on its module. @default "lines" */
  paper?: ChapterPaper;
  /** The app's router link (Next's `Link`), so internal chapters prefetch. */
  linkAs?: LinkComponent;
  /**
   * `lines` — one ruled line per chapter (the compact index); `album` — each chapter's `cover` as a taped print beside
   * its title, its `detail` (one short line) and its period, the rows alternating left and right.
   * @default "lines"
   */
  variant?: "lines" | "album";
};

/** The chapters of a story as a sober timeline: one ruled line each (or a taped print each), the number in the margin, the title the link. */
export function ChapterIndex({ chapters, newLabel = "New", label, paper = "lines", linkAs, variant = "lines", className, ...props }: ChapterIndexProps) {
  const album = variant === "album";
  return (
    // `role="list"`: a list without bullets is still a list to VoiceOver.
    <ol
      role="list"
      aria-label={label}
      data-paper={paper || undefined}
      data-margin=""
      data-variant={album ? "album" : undefined}
      className={cn("kz-chapters", className)}
      {...props}
    >
      {chapters.map((c, i) => (
        <li key={i} className="kz-chapter-row" data-new={c.isNew ? "" : undefined} data-detail={c.detail ? "" : undefined}>
          {album && c.cover && <ChapterPrint cover={c.cover} index={i} />}
          <ChapterRow number={c.number} title={c.title} href={c.href} aside={c.period} mark={c.isNew ? newLabel : undefined} detail={c.detail} current={c.current} linkAs={linkAs} />
        </li>
      ))}
    </ol>
  );
}

export type ChapterHeadProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The chapter's number, hung in the margin: `01`, `Chapitre 1`. */
  number: React.ReactNode;
  /** The title: the page's `h1`. */
  title: React.ReactNode;
  /** When it happened: `janv. – mars 2026`. */
  period?: React.ReactNode;
  /** How long it reads: `8 min`. */
  readingTime?: React.ReactNode;
  /** What was faced: the first half of the standfirst. */
  faced?: React.ReactNode;
  /** What was built: its second half, after the arrow. */
  built?: React.ReactNode;
  /** The words a screen reader says before each half (the arrow is drawn, not read): `["What I faced", "What we built"]`. */
  versusLabels?: readonly [string, string];
  /** The level of the title. @default 1 */
  level?: 1 | 2;
};

/** The head of a chapter: the number in the margin, the title, the period and the reading time, the standfirst once. */
export function ChapterHead({ number, title, period, readingTime, faced, built, versusLabels, level = 1, className, children, ...props }: ChapterHeadProps) {
  const H = level === 1 ? "h1" : "h2";
  const meta = [period, readingTime].filter((m) => m !== undefined && m !== null && m !== "");
  return (
    <header data-margin="" className={cn("kz-chapter-head", className)} {...props}>
      <p className="kz-chapter-no">{number}</p>
      <H className="kz-chapter-head-title">{title}</H>
      {meta.length > 0 && (
        <p className="kz-chapter-meta">
          {meta.map((m, i) => (
            <span key={i}>
              {i > 0 && <span aria-hidden> · </span>}
              {m}
            </span>
          ))}
        </p>
      )}
      {faced && built && (
        <p className="kz-chapter-standfirst">
          {versusLabels && <span className="kz-sr-only">{versusLabels[0]}, </span>}
          {faced}
          <span className="kz-chapter-arrow" aria-hidden>
            {" → "}
          </span>
          {versusLabels && <span className="kz-sr-only">; {versusLabels[1]}, </span>}
          {built}
        </p>
      )}
      {children}
    </header>
  );
}

export interface ChapterLink {
  /** Its number, in the margin: `02`. */
  number?: React.ReactNode;
  /** Its title, the link. */
  title: React.ReactNode;
  /** Where it leads. */
  href: string;
}

export type ChapterFootProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** The chapter before this one (none on the first). */
  previous?: ChapterLink;
  /** The chapter after this one (none on the latest). */
  next?: ChapterLink;
  /** The line back to the story: `{ href: "/", label: "Back to the story" }`. */
  back?: { href: string; label: React.ReactNode };
  /** The quiet words beside each link. @default { previous: "Previous", next: "Next" } */
  labels?: { previous: React.ReactNode; next: React.ReactNode };
  /** The accessible name of the navigation. @default "Chapters" */
  label?: string;
  /** The ruling under the links. @default "lines" */
  paper?: ChapterPaper;
  /** The app's router link (Next's `Link`). */
  linkAs?: LinkComponent;
};

/** The foot of a chapter: the previous and the next on the ruled lines, then one line back to the story. */
export function ChapterFoot({
  previous,
  next,
  back,
  labels = { previous: "Previous", next: "Next" },
  label = "Chapters",
  paper = "lines",
  linkAs,
  className,
  ...props
}: ChapterFootProps) {
  return (
    <nav aria-label={label} data-paper={paper || undefined} data-margin="" className={cn("kz-chapters kz-chapter-foot", className)} {...props}>
      <ul role="list">
        {previous && (
          <li className="kz-chapter-row" data-dir="previous">
            <ChapterRow
              number={previous.number}
              title={previous.title}
              href={previous.href}
              rel="prev"
              linkAs={linkAs}
              aside={
                <>
                  <span aria-hidden>← </span>
                  {labels.previous}
                </>
              }
            />
          </li>
        )}
        {next && (
          <li className="kz-chapter-row" data-dir="next">
            <ChapterRow
              number={next.number}
              title={next.title}
              href={next.href}
              rel="next"
              linkAs={linkAs}
              aside={
                <>
                  {labels.next}
                  <span aria-hidden> →</span>
                </>
              }
            />
          </li>
        )}
      </ul>
      {back && (
        <p className="kz-chapter-back">
          <BlockLink href={back.href} linkAs={linkAs} className="kz-chapter-back-link">
            <span aria-hidden>↩ </span>
            {back.label}
          </BlockLink>
        </p>
      )}
    </nav>
  );
}
