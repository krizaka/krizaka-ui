// Client (a tooltip). The teacher's red-ink grade of the Cahier (blocks.css): « 18/20 » and a short remark, stamped slightly
// askew. A grade is a fact, never a decoration: `value` and `source` are required, the host passes a measured value (test
// coverage, Lighthouse, a bundle size) and says where it comes from, which the tooltip and the screen reader both read. A value
// that is not a finite number within 0 and `outOf`, or a missing source, renders nothing — never a made-up score.
import type * as React from "react";

import { cn } from "../cn";
import { Tooltip } from "../tooltip/tooltip";

export type GradeStampProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** The measured grade, from `0` to `outOf`. Never invented: it comes from the host's data. */
  value: number;
  /** The scale. @default 20 */
  outOf?: number;
  /** The remark in the margin, written like a teacher (`Très bien, continue`). */
  remark?: React.ReactNode;
  /** Where the number comes from (`Vitest coverage, 2026-10-23`): shown in the tooltip and read by assistive technology. */
  source: string;
  /** The word before the source for assistive technology. @default "Source" */
  sourceLabel?: string;
  /** The locale of the number (`17,5` in French). @default "en" */
  locale?: string;
  /** The tilt in degrees. @default -4 */
  tilt?: number;
};

/** A teacher's red-ink grade, `18/20` with a remark, only from real data: its source is in a tooltip. */
export function GradeStamp({ value, outOf = 20, remark, source, sourceLabel = "Source", locale = "en", tilt = -4, className, style, ...props }: GradeStampProps) {
  if (!Number.isFinite(value) || !Number.isFinite(outOf) || outOf <= 0 || value < 0 || value > outOf || !source.trim()) return null;
  const format = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  return (
    <Tooltip content={source}>
      <span
        className={cn("kz-grade", className)}
        tabIndex={0}
        style={{ ...style, ["--kz-grade-tilt" as string]: `${tilt}deg` }}
        {...props}
      >
        <span className="kz-grade-score">
          {format.format(value)}
          <span className="kz-grade-out">/{format.format(outOf)}</span>
        </span>
        {remark ? <span className="kz-grade-remark">{remark}</span> : null}
        <span className="kz-sr-only">
          {sourceLabel}: {source}
        </span>
      </span>
    </Tooltip>
  );
}
