// Server-safe. The Krizaka signature of the Cahier (ADR-004, blocks.css): at the end of a section or a page, the way an
// owner signs their notebook — the Krizaka mark as a small ink stamp and the house's name in the notebook's pen. It never
// imitates a person's hand: the pen is the `cahier` font role of the tokens, and the mark is the brand's. Both are inked
// with the host's text role, with a slight texture (an SVG filter, fixed seed: the same on every render).
import * as React from "react";

import { cn } from "../cn";

export type SignatureProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** `stamp` (the mark alone), `script` (the name alone) or `both`. @default "both" */
  variant?: "stamp" | "script" | "both";
  /** The words written by hand. @default "Krizaka · Montréal" */
  name?: string;
  /** The date, written small under the name (`23 octobre 2026`). */
  date?: string;
  /** The machine-readable date (`2026-10-23`) of the `time` element. */
  dateTime?: string;
};

// The cropped shield of KrizakaLogo (marks/krizaka-geometry.ts), in one ink: the open hexagon, its node, its core, a ring.
const SHIELD = "M259.7,134 L259.7,226 L180,272 L100.3,226 L100.3,134 L180,88 L212,106.5";

/** A small hand-signed mark: the Krizaka mark as an ink stamp, the house's name in the notebook's pen, an optional date. */
export function Signature({ variant = "both", name = "Krizaka · Montréal", date, dateTime, className, style, ...props }: SignatureProps) {
  const filter = `kz-ink-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const stamp = variant !== "script";
  const script = variant !== "stamp";
  return (
    <div className={cn("kz-signature", className)} data-variant={variant} style={{ ...style, filter: `url(#${filter})` }} {...props}>
      <svg width="0" height="0" aria-hidden focusable="false" className="kz-signature-defs">
        <filter id={filter} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.45" result="speckle" />
          <feComposite in="SourceGraphic" in2="speckle" operator="in" />
        </filter>
      </svg>
      {stamp ? (
        <svg className="kz-signature-stamp" viewBox="62 62 236 236" fill="none" {...(script ? { "aria-hidden": true } : { role: "img", "aria-label": name })} focusable="false">
          <circle cx="180" cy="180" r="112" stroke="currentColor" strokeWidth="6" />
          <circle cx="180" cy="180" r="100" stroke="currentColor" strokeWidth="2" strokeDasharray="4 7" />
          <path d={SHIELD} stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="259.7" cy="134" r="15" fill="currentColor" />
          <circle cx="180" cy="180" r="20" fill="currentColor" />
        </svg>
      ) : null}
      {script ? (
        <span className="kz-signature-text">
          <span className="kz-signature-name">{name}</span>
          {date ? <time className="kz-signature-date" dateTime={dateTime}>{date}</time> : null}
        </span>
      ) : null}
    </div>
  );
}
