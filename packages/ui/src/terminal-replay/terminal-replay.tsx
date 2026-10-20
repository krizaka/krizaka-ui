// Client (a timer, an observer). A terminal session played back: each command is typed at the prompt, its output
// arrives line by line, the screen follows the last line like a real terminal. What a reader sees without the motion
// is the session itself: the server renders it whole (no JavaScript, reduced motion and assistive technology all get
// the full transcript), the screen has a fixed height (no layout shift while it plays), the replay starts when it
// scrolls into view, waits while it is off screen, and pauses or replays on demand (WCAG 2.2.2). A bounded chain of
// timeouts, never a permanent animation frame.
import * as React from "react";

import { cn } from "../cn";
import { CheckGlyph, PauseGlyph, PlayGlyph, RetryGlyph } from "../glyphs";

/** The colour of an output line — the tokens' text roles, all AA on the screen: secondary, accent, success, warning, danger. */
export type TerminalTone = "muted" | "accent" | "success" | "warning" | "danger";

export interface TerminalLine {
  /** The line as the program printed it (no colour codes). */
  text: string;
  /** Its colour, when the program coloured it. */
  tone?: TerminalTone;
}

export interface TerminalStep {
  /** What is typed at the prompt (`npx orazaka install`). */
  command: string;
  /** What it printed, line by line. */
  output?: readonly (string | TerminalLine)[];
}

export type TerminalReplayProps = Omit<React.ComponentProps<"figure">, "children" | "title"> & {
  /** The session, in order. */
  steps: readonly TerminalStep[];
  /** The accessible name of the screen (“Terminal session: install, start, dev”) — passed translated. */
  label: string;
  /** The window's title, shown in its bar (`~/projects — zsh`). */
  title?: React.ReactNode;
  /**
   * What the prompt shows before each command.
   * @default "$"
   */
  prompt?: string;
  /** The play button's words (the replay is waiting or paused). */
  playLabel: string;
  /** The pause button's words (the replay is running). */
  pauseLabel: string;
  /** The replay button's words (the session is shown whole). */
  replayLabel: string;
  /** The copy button's words: it copies the commands, one per line. Without it, no copy button. */
  copyLabel?: string;
  /** What the copy button says once the commands are copied (announced politely). */
  copiedLabel?: string;
  /**
   * Milliseconds per typed character.
   * @default 34
   */
  typingSpeed?: number;
  /**
   * Milliseconds between two output lines.
   * @default 70
   */
  lineDelay?: number;
  /**
   * Milliseconds between a command's last line and the next command.
   * @default 900
   */
  stepDelay?: number;
  /**
   * A multiplier on every delay (the motion vocabulary's `speed`): 2 plays twice as fast, 0.5 half as fast.
   * @default 1
   */
  speed?: number;
  /**
   * The screen's height, in lines; longer sessions scroll.
   * @default 18
   */
  rows?: number;
  /**
   * Plays the first time it scrolls into view. `false`: the session rests whole until the reader presses play.
   * @default true
   */
  autoPlay?: boolean;
};

type Phase = "final" | "idle" | "playing" | "paused" | "done";
interface Position {
  step: number;
  chars: number;
  lines: number;
}

const TONE: Record<TerminalTone, string> = {
  muted: "text-fg-secondary",
  accent: "text-fg-accent",
  success: "text-fg-success",
  warning: "text-fg-warning",
  danger: "text-fg-danger",
};

const line = (entry: string | TerminalLine): TerminalLine => (typeof entry === "string" ? { text: entry } : entry);

/** The next position of the replay and how long to wait for it; null at the end of the session. */
function advance(steps: readonly TerminalStep[], pos: Position, timing: { typing: number; line: number; step: number }): [Position, number] | null {
  const current = steps[pos.step];
  if (!current) return null;
  const output = current.output ?? [];
  if (pos.chars < current.command.length) {
    // A space is a beat longer: the rhythm of someone typing, not of a printer.
    const pause = current.command[pos.chars] === " " ? timing.typing * 2 : timing.typing;
    return [{ ...pos, chars: pos.chars + 1 }, pause];
  }
  if (pos.lines < output.length) return [{ ...pos, lines: pos.lines + 1 }, pos.lines === 0 ? timing.line * 4 : timing.line];
  if (pos.step < steps.length - 1) return [{ step: pos.step + 1, chars: 0, lines: 0 }, timing.step];
  return null;
}

/** A terminal session played back: commands typed at the prompt, their output line by line — or the whole session at rest. */
export function TerminalReplay({
  steps,
  label,
  title,
  prompt = "$",
  playLabel,
  pauseLabel,
  replayLabel,
  copyLabel,
  copiedLabel,
  typingSpeed = 34,
  lineDelay = 70,
  stepDelay = 900,
  speed = 1,
  rows = 18,
  autoPlay = true,
  className,
  style,
  ...props
}: TerminalReplayProps) {
  const root = React.useRef<HTMLElement>(null);
  const screenRef = React.useRef<HTMLDivElement>(null);
  // The server renders the session whole; the client takes it over unless the reader asked for less motion.
  const [phase, setPhase] = React.useState<Phase>("final");
  const [pos, setPos] = React.useState<Position>({ step: 0, chars: 0, lines: 0 });
  const [visible, setVisible] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const el = root.current;
    if (!el || !autoPlay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("idle");
    // Starts the first time it is seen; off screen, it waits where it is.
    const io = new IntersectionObserver(
      ([entry]) => {
        const seen = Boolean(entry?.isIntersecting);
        setVisible(seen);
        if (seen) setPhase((current) => (current === "idle" ? "playing" : current));
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoPlay]);

  const rate = Math.max(0.1, speed);
  const timing = React.useMemo(() => ({ typing: typingSpeed / rate, line: lineDelay / rate, step: stepDelay / rate }), [typingSpeed, lineDelay, stepDelay, rate]);
  const ended = phase === "playing" && !advance(steps, pos, timing);
  // The end of the session is where the replay stands, not an event: derived, never set from an effect.
  const state: Phase = ended ? "done" : phase;

  React.useEffect(() => {
    if (phase !== "playing" || !visible) return;
    const next = advance(steps, pos, timing);
    if (!next) return;
    const timer = setTimeout(() => setPos(next[0]), next[1]);
    return () => clearTimeout(timer);
  }, [phase, visible, pos, steps, timing]);

  // The screen follows the last line while it plays, like a terminal.
  React.useEffect(() => {
    const el = screenRef.current;
    if (el && state === "playing") el.scrollTop = el.scrollHeight;
  }, [pos, state]);

  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const whole = state === "final" || state === "done";
  const shown = whole ? steps.length - 1 : pos.step;
  const toggle = () => {
    if (state === "playing") setPhase("paused");
    else if (state === "paused" || state === "idle") setPhase("playing");
    else {
      // Played on demand — also under reduced motion: the reader asked for it. Off screen it would wait: it is on screen.
      setVisible(true);
      setPos({ step: 0, chars: 0, lines: 0 });
      setPhase("playing");
    }
  };
  const control =
    state === "playing"
      ? { text: pauseLabel, Glyph: PauseGlyph }
      : state === "done"
        ? { text: replayLabel, Glyph: RetryGlyph }
        : { text: playLabel, Glyph: PlayGlyph };
  const commands = steps.map((s) => s.command).join("\n");
  const transcript = steps.map((s) => [`${prompt} ${s.command}`, ...(s.output ?? []).map((o) => line(o).text)].join("\n")).join("\n\n");

  return (
    <figure
      ref={root}
      data-state={state}
      data-autoplay={autoPlay ? "" : undefined}
      className={cn("kz-replay overflow-hidden rounded-xl border border-border-default bg-surface-1 shadow-md", className)}
      style={{ "--kz-replay-rows": rows, ...style } as React.CSSProperties}
      {...props}
    >
      <figcaption className="flex items-center gap-3 border-b border-border-subtle bg-surface-2 px-3 py-2 text-xs text-fg-secondary">
        <span aria-hidden className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        </span>
        <span className="min-w-0 flex-1 truncate font-mono">{title}</span>
        <button
          type="button"
          onClick={toggle}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-medium text-fg-secondary transition-colors hover:bg-surface-3 hover:text-fg focus-visible:outline-2 focus-visible:outline-ring"
        >
          <control.Glyph className="h-3.5 w-3.5" />
          {control.text}
        </button>
        {copyLabel && (
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(commands).then(() => setCopied(true))}
            data-copied={copied ? "" : undefined}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-medium text-fg-secondary transition-colors hover:bg-surface-3 hover:text-fg focus-visible:outline-2 focus-visible:outline-ring"
          >
            {copied ? <CheckGlyph className="h-3.5 w-3.5" /> : <CopyGlyph />}
            <span aria-live="polite">{copied ? (copiedLabel ?? copyLabel) : copyLabel}</span>
          </button>
        )}
      </figcaption>
      <div
        ref={screenRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="kz-replay-screen relative overflow-auto bg-surface-0 px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <div aria-hidden className="kz-replay-live">
          {steps.slice(0, state === "idle" ? 0 : shown + 1).map((step, i) => {
            const current = !whole && i === shown;
            const typed = current ? step.command.slice(0, pos.chars) : step.command;
            const output = (step.output ?? []).slice(0, current ? pos.lines : undefined);
            const typing = current && pos.chars < step.command.length;
            return (
              <div key={i} className={i > 0 ? "mt-3" : undefined}>
                <div className="whitespace-pre">
                  <span className="text-fg-accent select-none">{prompt} </span>
                  <span className="font-medium">{typed}</span>
                  {typing && <span className="kz-replay-caret" />}
                </div>
                {output.map((entry, j) => {
                  const { text, tone } = line(entry);
                  return (
                    <div key={j} className={cn("min-h-[1lh] whitespace-pre", tone ? TONE[tone] : "text-fg")}>
                      {text}
                    </div>
                  );
                })}
              </div>
            );
          })}
          {(state === "idle" || whole) && (
            <div className={cn("whitespace-pre", state !== "idle" && "mt-3")}>
              <span className="text-fg-accent select-none">{prompt} </span>
              <span className="kz-replay-caret" />
            </div>
          )}
        </div>
        <pre className="sr-only">{transcript}</pre>
      </div>
    </figure>
  );
}

/** Two sheets, one over the other: copy. Drawn here, like the other glyphs of the primitives (decorative). */
function CopyGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h8" />
    </svg>
  );
}
