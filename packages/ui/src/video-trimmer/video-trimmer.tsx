// Client. The trim timeline of a video editor: the clip as a filmstrip (or any track content), the part kept framed
// between two edge handles — each a `slider` named by a prop, its value read as a time, never past the other one —
// the outside dimmed, and a playhead to scrub. The handles sit on their value by their outer edge (the start handle
// to the right of its value, the end handle to its left), so the frame encloses exactly what is kept. Every part
// takes its own classes (`classNames`) and the handles their own content (`renderHandle`).
import * as React from "react";
import { tv } from "tailwind-variants";

import { warnDeprecated } from "../deprecated";
import { clamp, formatClock } from "../media";

/** @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0. */
export const videoTrimmer = tv({
  slots: {
    root: "w-full select-none",
    header: "mb-2 flex items-center justify-between font-mono text-[11px] tabular-nums text-fg-secondary",
    kept: "rounded-sm bg-accent-soft px-2.5 py-0.5 font-sans text-xs font-semibold text-fg",
    track: "relative h-16 touch-none rounded-xl bg-surface-2 data-[disabled]:opacity-50",
    strip: "pointer-events-none absolute inset-0 flex overflow-hidden rounded-xl",
    frame: "h-full min-w-0 flex-1 object-cover",
    shade: "pointer-events-none absolute inset-y-0 bg-scrim-strong",
    range: "pointer-events-none absolute inset-y-0 border-y-[3px] border-accent",
    handle:
      "absolute inset-y-0 z-10 flex w-6 cursor-ew-resize items-center justify-center bg-accent text-on-accent shadow-md " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 " +
      "data-[edge=start]:rounded-l-xl data-[edge=end]:-translate-x-full data-[edge=end]:rounded-r-xl",
    grip: "flex gap-[3px] [&>span]:h-5 [&>span]:w-[2px] [&>span]:rounded-sm [&>span]:bg-on-accent/70",
    playhead:
      "absolute -inset-y-1.5 z-20 w-[3px] -translate-x-1/2 cursor-ew-resize rounded-full bg-fg shadow-md " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
  },
});

type Part = keyof ReturnType<typeof videoTrimmer>;

export type VideoTrimmerLabels = {
  /** The start handle ("Start"). */
  start: string;
  /** The end handle ("End"). */
  end: string;
  /** The playhead ("Playhead"). */
  playhead: string;
  /** The length kept, above the track: `(length) => length + " kept"` (the length already formatted). */
  kept: (length: string) => string;
};

/** @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0. */
export const videoTrimmerLabels: VideoTrimmerLabels = {
  start: "Start",
  end: "End",
  playhead: "Playhead",
  kept: (length) => `${length} kept`,
};

export type VideoTrimmerProps = {
  /** The length of the clip, in seconds. */
  duration: number;
  /** The part kept, `[start, end]` in seconds (controlled). */
  value?: readonly [number, number];
  /** The part kept at first, uncontrolled. Default: the whole clip. */
  defaultValue?: readonly [number, number];
  /** Called on every move of a handle. */
  onValueChange?: (value: [number, number]) => void;
  /** Called once a drag or a key press ends: render a preview, save. */
  onValueCommit?: (value: [number, number]) => void;
  /** The time played, in seconds: shows the playhead. */
  time?: number;
  /** Called when the playhead is moved (a drag on the track, the arrows on the playhead). */
  onSeek?: (time: number) => void;
  /** The shortest part that can be kept, in seconds. Default 0.5. */
  minLength?: number;
  /** One arrow press, in seconds. Default 0.1. */
  step?: number;
  /** Shift + arrow, Page Up / Page Down, in seconds. Default 1. */
  largeStep?: number;
  /** Pictures of the clip, in order: the filmstrip. */
  frames?: readonly string[];
  /** Track content instead of the filmstrip (a waveform, a coloured band). */
  children?: React.ReactNode;
  /** A time as read and shown. Default `m:ss` with tenths. */
  formatTime?: (seconds: number) => string;
  /** Shows the times and the length kept above the track. Default `true`. */
  showHeader?: boolean;
  /** Not available (a render is running). */
  disabled?: boolean;
  /** Classes per part: `root`, `header`, `kept`, `track`, `strip`, `frame`, `shade`, `range`, `handle`, `grip`, `playhead`. */
  classNames?: Partial<Record<Part, string>>;
  /** The content of a handle (default: two grip lines). */
  renderHandle?: (edge: "start" | "end") => React.ReactNode;
  /** The words, passed translated; English by default. */
  labels?: Partial<VideoTrimmerLabels>;
};

const tenths = (seconds: number) => `${formatClock(seconds)}.${Math.floor((Math.max(0, seconds) % 1) * 10)}`;

type Grip = "start" | "end" | "playhead";

/**
 * Keeps a part of a clip between two handles over its filmstrip, with a playhead to scrub — the keyboard included.
 * @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0.
 */
export function VideoTrimmer({
  duration,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  time,
  onSeek,
  minLength = 0.5,
  step = 0.1,
  largeStep = 1,
  frames,
  children,
  formatTime = tenths,
  showHeader = true,
  disabled,
  classNames = {},
  renderHandle,
  labels: given,
}: VideoTrimmerProps) {
  warnDeprecated("video-trimmer");
  const labels = { ...videoTrimmerLabels, ...given };
  const s = videoTrimmer();
  const track = React.useRef<HTMLDivElement>(null);
  const grip = React.useRef<Grip | null>(null);
  const [inner, setInner] = React.useState<[number, number]>(() => [defaultValue?.[0] ?? 0, defaultValue?.[1] ?? duration]);
  const [start, end] = valueProp ?? inner;
  const total = duration > 0 ? duration : 1;
  const pct = (seconds: number) => (clamp(seconds, 0, total) / total) * 100;

  const set = (next: [number, number], commit = false) => {
    if (!valueProp) setInner(next);
    onValueChange?.(next);
    if (commit) onValueCommit?.(next);
  };
  const move = (edge: "start" | "end", to: number, commit = false) => {
    const next: [number, number] =
      edge === "start" ? [clamp(to, 0, end - minLength), end] : [start, clamp(to, start + minLength, duration)];
    set([Math.round(next[0] * 1000) / 1000, Math.round(next[1] * 1000) / 1000], commit);
  };
  const seek = (to: number) => onSeek?.(clamp(to, start, Math.max(start, end - 0.05)));

  const at = (clientX: number) => {
    const box = track.current?.getBoundingClientRect();
    if (!box || box.width === 0) return 0;
    return clamp(((clientX - box.left) / box.width) * duration, 0, duration);
  };

  const keys = (which: Grip) => (event: React.KeyboardEvent) => {
    const current = which === "start" ? start : which === "end" ? end : (time ?? start);
    const big = largeStep;
    const small = event.shiftKey ? largeStep : step;
    const target: Record<string, number> = {
      ArrowLeft: current - small,
      ArrowDown: current - small,
      ArrowRight: current + small,
      ArrowUp: current + small,
      PageDown: current - big,
      PageUp: current + big,
      Home: 0,
      End: duration,
    };
    const to = target[event.key];
    if (to === undefined || disabled) return;
    event.preventDefault();
    if (which === "playhead") seek(to);
    else move(which, to, true);
  };

  const handle = (edge: "start" | "end") => {
    const own = edge === "start" ? start : end;
    return (
      <div
        key={edge}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={edge === "start" ? labels.start : labels.end}
        aria-valuemin={edge === "start" ? 0 : Math.round((start + minLength) * 10) / 10}
        aria-valuemax={edge === "start" ? Math.round((end - minLength) * 10) / 10 : Math.round(duration * 10) / 10}
        aria-valuenow={Math.round(own * 10) / 10}
        aria-valuetext={formatTime(own)}
        aria-disabled={disabled || undefined}
        data-edge={edge}
        className={s.handle({ className: classNames.handle })}
        style={{ left: `${pct(own)}%` }}
        onPointerDown={(event) => {
          if (disabled) return;
          event.stopPropagation();
          track.current?.setPointerCapture?.(event.pointerId);
          grip.current = edge;
        }}
        onKeyDown={keys(edge)}
      >
        {renderHandle ? (
          renderHandle(edge)
        ) : (
          <span className={s.grip({ className: classNames.grip })}>
            <span />
            <span />
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={s.root({ className: classNames.root })}>
      {showHeader && (
        <div className={s.header({ className: classNames.header })}>
          <span>{formatTime(start)}</span>
          <span className={s.kept({ className: classNames.kept })}>{labels.kept(formatTime(end - start))}</span>
          <span>{formatTime(end)}</span>
        </div>
      )}
      <div
        ref={track}
        className={s.track({ className: classNames.track })}
        data-disabled={disabled ? "" : undefined}
        onPointerDown={(event) => {
          if (disabled) return;
          track.current?.setPointerCapture?.(event.pointerId);
          const t = at(event.clientX);
          grip.current = onSeek ? "playhead" : Math.abs(t - start) < Math.abs(t - end) ? "start" : "end";
          if (grip.current === "playhead") seek(t);
          else move(grip.current, t);
        }}
        onPointerMove={(event) => {
          if (!grip.current) return;
          const t = at(event.clientX);
          if (grip.current === "playhead") seek(t);
          else move(grip.current, t);
        }}
        onPointerUp={() => {
          if (grip.current && grip.current !== "playhead") onValueCommit?.([start, end]);
          grip.current = null;
        }}
        onPointerCancel={() => {
          grip.current = null;
        }}
      >
        <div className={s.strip({ className: classNames.strip })}>
          {children ?? frames?.map((src, i) => <img key={`${i}-${src}`} src={src} alt="" draggable={false} className={s.frame({ className: classNames.frame })} />)}
        </div>
        <div className={s.shade({ className: classNames.shade })} style={{ left: 0, width: `${pct(start)}%`, borderRadius: "0.75rem 0 0 0.75rem" }} />
        <div className={s.shade({ className: classNames.shade })} style={{ right: 0, width: `${100 - pct(end)}%`, borderRadius: "0 0.75rem 0.75rem 0" }} />
        <div className={s.range({ className: classNames.range })} style={{ left: `${pct(start)}%`, right: `${100 - pct(end)}%` }} />
        {time !== undefined && (
          <div
            role="slider"
            tabIndex={disabled || !onSeek ? -1 : 0}
            aria-label={labels.playhead}
            aria-valuemin={Math.round(start * 10) / 10}
            aria-valuemax={Math.round(end * 10) / 10}
            aria-valuenow={Math.round(time * 10) / 10}
            aria-valuetext={formatTime(time)}
            aria-readonly={!onSeek || undefined}
            className={s.playhead({ className: classNames.playhead })}
            style={{ left: `${pct(time)}%` }}
            onKeyDown={onSeek ? keys("playhead") : undefined}
          />
        )}
        {handle("start")}
        {handle("end")}
      </div>
    </div>
  );
}
