// Server-safe. The blocks of a product's public page (krizaka-internal#4693, the approved design of #4692), styled by
// blocks.css `.kz-pp-*`: no product name, no product colour — the words and the media come in as data, the colour from the
// brand scope (`.brand-<id>` on an ancestor). The client parts (the pointer's depth, the loops, the bird) come through
// their package entries, so their boundary stays where it is.
import { Badge } from "@krizaka/ui/badge";
import { buttonVariants } from "@krizaka/ui/button";
import { Mascot, type MascotBird } from "@krizaka/ui/mascots";
import { DepthField } from "@krizaka/ui/motion-tier";
import { focusStyle, type LoopFocus, type LoopLabels, type LoopSources, PausableLoop } from "@krizaka/ui/pausable-loop";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { SiteFooter, type SiteFooterProps } from "@krizaka/ui/site-footer";
import { Stamp } from "@krizaka/ui/specimen-tag";
import { DeviceFrame, type DeviceKind } from "@krizaka/ui/step-showcase";
import type * as React from "react";

import { cn } from "../cn";
import { CahierSheet, type SheetLine } from "./cahier-sheet";

/** A way in: an address and its words. */
export type ProductLink = { href: string; label: string };

/** The main way in (filled, its arrow moving on hover) and the quiet one (the pen's underline). */
export type ProductActionsProps = {
  /** The main way in: filled, its arrow. */
  primary: ProductLink;
  /** The quiet way in: a link with the pen's underline. */
  secondary?: ProductLink;
};

export function ProductActions({ primary, secondary }: Readonly<ProductActionsProps>) {
  return (
    <div className="kz-pp-actions">
      <a href={primary.href} className={buttonVariants({ className: "kz-pp-cta" })}>
        {primary.label}
        <span className="kz-pp-arrow" aria-hidden>
          →
        </span>
      </a>
      {secondary && (
        <a href={secondary.href} className="kz-pp-link">
          {secondary.label}
          <span className="kz-pp-arrow" aria-hidden>
            →
          </span>
        </a>
      )}
    </div>
  );
}

export type ProductHeroProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The promise: the page's `h1` (at most eight words). */
  title: React.ReactNode;
  /** How, in one line. */
  lead?: React.ReactNode;
  /** The way in (`ProductActions`). */
  actions?: React.ReactNode;
  /** The product moment beside the words (`ProductMoment`). Absent: one column. */
  visual?: React.ReactNode;
  /** A still of the product, far behind and out of focus (an image address). */
  backdrop?: string;
  /** The glyph nearest the eye, out of focus. @default "§" */
  mark?: React.ReactNode;
};

/** The hero in layers of depth: a still far behind, the grid under the brand's light, the moment, a § nearest the eye. */
export function ProductHero({ title, lead, actions, visual, backdrop, mark = "§", className, ...props }: Readonly<ProductHeroProps>) {
  return (
    <header className={cn("kz-pp-hero", className)} {...props}>
      <DepthField>
        {backdrop && <img src={backdrop} alt="" className="kz-pp-l kz-pp-l-back" fetchPriority="low" />}
        <span className="kz-pp-l kz-pp-l-grid" aria-hidden />
        <span className="kz-pp-l kz-pp-l-light" aria-hidden />
        <span className="kz-pp-l kz-pp-l-front" aria-hidden>
          {mark}
        </span>
        <div className="kz-pp-hero-grid" data-split={visual ? "" : undefined}>
          <div className="kz-pp-hero-text">
            <h1>{title}</h1>
            {lead && <p>{lead}</p>}
            {actions}
          </div>
          {visual && <div className="kz-pp-stage">{visual}</div>}
        </div>
      </DepthField>
    </header>
  );
}

/** What the product found: its verdict (data), the finding and the reference it cites. */
export type ProductFinding = { verdict: string; tone: "danger" | "warning" | "success" | "neutral"; title: string; reference: string };

/** The finding as a card: the answer that leaves the document. */
export type FindingCardProps = {
  /** What the product found: its verdict (the product's words), the finding, its reference. */
  finding: ProductFinding;
};

export function FindingCard({ finding }: Readonly<FindingCardProps>) {
  return (
    <div className="kz-pp-finding">
      <Badge tone={finding.tone} className="self-start">
        {finding.verdict}
      </Badge>
      <p className="kz-pp-finding-title">{finding.title}</p>
      <p className="kz-pp-finding-ref">{finding.reference}</p>
    </div>
  );
}

export type ProductMomentProps = {
  /** The figure's accessible name (`A lease, read, one clause found`). */
  label: string;
  /** The document's lines, read in turn; the `flagged` one is the finding's. */
  lines: readonly SheetLine[];
  /** A tag on the paper (`Fictional lease`). */
  tag?: React.ReactNode;
  /** What leaves the page towards the visitor (`FindingCard`). */
  answer: React.ReactNode;
  /** The figure's id: the anchor a menu points to. */
  id?: string;
};

/** A tilted Cahier document, read line by line, and the finding that leaves it. On a phone: the lines around the finding. */
export function ProductMoment({ label, lines, tag, answer, id }: Readonly<ProductMomentProps>) {
  return (
    <figure id={id} className="kz-pp-moment" aria-label={label}>
      <CahierSheet lines={lines} tag={tag} reading />
      <div className="kz-pp-card">{answer}</div>
    </figure>
  );
}

/** The neutral stamp of a decision (`Decision noted`), in the brand's colour: no signature. */
export type DecisionStampProps = {
  /** The stamp's words (`Decision noted`). */
  children: React.ReactNode;
  /** Classes of the stamp, merged last. */
  className?: string;
};

export function DecisionStamp({ children, className }: Readonly<DecisionStampProps>) {
  return (
    <Stamp tone="hue" className={cn("kz-pp-stamp", className)}>
      {children}
    </Stamp>
  );
}

export type DocumentSceneProps = {
  /** The document's lines; the `flagged` one lights up (`cue: "light"`). */
  lines: readonly SheetLine[];
  /** The reference the flagged line attaches to (`cue: "attach"`). */
  reference: string;
  /** The decision (`cue: "decide"`): the finding, the two choices, the stamp's words. */
  decision: { title: string; primary: string; secondary: string; stamp: string };
};

/** The scene of a `StoryScroll` about a document: it arrives, is read, a line lights up, its reference attaches, you decide. */
export function DocumentScene({ lines, reference, decision }: Readonly<DocumentSceneProps>) {
  return (
    <div className="kz-pp-doc">
      <span className="kz-pp-file" data-n="2" />
      <span className="kz-pp-file" data-n="1" />
      <CahierSheet lines={lines} className="kz-pp-doc-sheet" />
      <div className="kz-pp-attach">
        <svg className="kz-pp-tie" viewBox="0 0 120 60" preserveAspectRatio="none" aria-hidden>
          <path d="M2 4 C 40 6, 30 50, 118 56" pathLength={1} />
        </svg>
        <span className="kz-pp-ref">{reference}</span>
      </div>
      <div className="kz-pp-decision">
        <span className="kz-pp-decision-title">{decision.title}</span>
        <span className="kz-pp-decision-choices">
          <span data-main="">{decision.primary}</span>
          <span>{decision.secondary}</span>
        </span>
        <DecisionStamp>{decision.stamp}</DecisionStamp>
      </div>
    </div>
  );
}

/** One scene: one useful action of the product, its recording and a few words. */
export type ProductScene = {
  id: string;
  title: string;
  line?: string;
  /** The device the recording plays in; `none` when the recording already carries its own frame (shown alone). @default framed by its kind */
  device: DeviceKind | "none";
  /** What the recording shows, in the reader's language: the media's alt text. Absent: the still is decorative. */
  alt?: string;
  poster: string;
  sources: LoopSources;
  width: number;
  height: number;
  /** The excerpt shown enlarged on a phone (`PausableLoop`'s `focus`). */
  focus?: LoopFocus;
};

export type SceneRowProps = {
  /** The scene: its words, its device and its recording. */
  scene: ProductScene;
  /** Its place in the list, from 0: its § number, its side and its tint. */
  index: number;
  /** The loop's pause / play words, passed translated. */
  labels?: LoopLabels;
};

/** A scene as a row: the words and the recording side by side (alternating), numbered in the margin, the tint shifting. */
export function SceneRow({ scene, index, labels }: Readonly<SceneRowProps>) {
  const heading = `kz-scene-${scene.id}`;
  const media = (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${scene.width} / ${scene.height}` }}>
      <div className="absolute inset-0 overflow-hidden" data-focus={scene.focus ? "" : undefined} style={scene.focus ? focusStyle(scene.focus) : undefined}>
        <img src={scene.poster} alt={scene.alt ?? ""} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <PausableLoop sources={scene.sources} poster={scene.poster} labels={labels} focus={scene.focus} />
    </div>
  );
  return (
    <section className="kz-pp-scene" data-tint={index % 2 === 0 ? "1" : "2"} data-flip={index % 2 === 1 ? "" : undefined} aria-labelledby={heading}>
      <div className="kz-pp-scene-grid">
        <div className="kz-pp-scene-text kz-pp-reveal">
          <span className="kz-pp-mark" aria-hidden>
            § {index + 1}
          </span>
          <h2 id={heading}>{scene.title}</h2>
          {scene.line && <p>{scene.line}</p>}
        </div>
        <div className="kz-pp-device kz-pp-reveal" data-device={scene.device}>
          {scene.device === "none" ? media : <DeviceFrame kind={scene.device}>{media}</DeviceFrame>}
        </div>
      </div>
    </section>
  );
}

/** The scenes of a page, one row each. */
export type SceneListProps = {
  /** The scenes, in reading order. */
  scenes: readonly ProductScene[];
  /** The loops' pause / play words, passed translated. */
  labels?: LoopLabels;
  /** The list's id: the anchor a menu points to. */
  id?: string;
};

export function SceneList({ scenes, labels, id }: Readonly<SceneListProps>) {
  return (
    <div id={id} className="kz-pp-scenes">
      {scenes.map((scene, i) => (
        <SceneRow key={scene.id} scene={scene} index={i} labels={labels} />
      ))}
    </div>
  );
}

export type LimitsBandProps = {
  /** `What it does not do`: the band's `h2`. */
  title: string;
  /** One to three limits, each a short sentence. */
  items: readonly string[];
  /** The product's bird, drawn as a specimen beside the list. */
  bird?: MascotBird;
  /** The specimen's caption: `Fig. 1 · the owl, reads what you give it`. */
  caption?: React.ReactNode;
};

/** What the product does not do: a ruled list beside the bird as a specimen. Trust before the call. */
export function LimitsBand({ title, items, bird, caption }: Readonly<LimitsBandProps>) {
  return (
    <section className="kz-pp-limits" aria-label={title}>
      <div className="kz-pp-limits-grid" data-single={bird ? undefined : ""}>
        {bird && (
          <figure className="kz-pp-specimen kz-pp-reveal">
            <Mascot bird={bird} size={132} life />
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        )}
        <div className="kz-pp-reveal">
          <h2>{title}</h2>
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export type ClosingBandProps = {
  /** The sentence before the inked words. */
  title: string;
  /** The words the pen underlines, at the end (`on a lease.`). */
  inked?: string;
  /** The one way in (`ProductActions`). */
  action: React.ReactNode;
};

/** The closing: the brand's light rising again, one sentence, its last words underlined by the pen, the one way in. */
export function ClosingBand({ title, inked, action }: Readonly<ClosingBandProps>) {
  return (
    <SectionBackdrop direction="up" className="kz-pp-closing" aria-label={inked ? `${title} ${inked}` : title}>
      <div className="kz-pp-closing-inner">
        <h2 className="kz-pp-reveal">
          {title}
          {inked && (
            <>
              {" "}
              <span className="kz-pp-ink">{inked}</span>
            </>
          )}
        </h2>
        {action}
      </div>
    </SectionBackdrop>
  );
}

export type PublicFooterProps = SiteFooterProps & Required<Pick<SiteFooterProps, "config">>;

/** The public footer, drawn from data (`config`: the columns, the legal line, the socials) with the pen's underline on its links. */
export function PublicFooter({ className, ...props }: Readonly<PublicFooterProps>) {
  return <SiteFooter className={cn("kz-pp-footer", className)} {...props} />;
}
