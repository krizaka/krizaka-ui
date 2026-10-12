// Server-safe. The last call of a page or a flow (story.css): a short question, a figure that counts (days, seats,
// seconds), what to say before leaving, and the one action that continues — “Keep your studio? · 3 days left”.
import type * as React from "react";

import { Button } from "../button/button";
import { cn } from "../cn";
import { brandClass, type StoryVariant, storyVariantClass } from "../story-variant";

export type ContinuePromptProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  /** The question (“Keep your studio?”, arcade “Continue?”). */
  title: React.ReactNode;
  /** What counts, beside the question: a figure, or a live `Countdown` for a real deadline. Decorative: say it in words too. */
  count?: React.ReactNode;
  /**
   * A count that ticks down once when its scene plays (`{ from: 9, to: 7 }`), then waits; still under reduced motion.
   * Use `count` for anything else.
   */
  countdown?: { readonly from: number; readonly to: number };
  /** Inside the screen, under the question: a heading, a line, links — the closing call itself. */
  children?: React.ReactNode;
  /** The action's words. */
  actionLabel: React.ReactNode;
  /** Runs the action (a client handler). Without `href`, the action is a `button`. */
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  /** Makes the action a link. */
  href?: string;
  /** A key-cap before the action's words (“Enter”, arcade “1P Start”). Decorative. */
  actionKey?: React.ReactNode;
  /** The action's glyph after its words; default an arrow. Decorative. */
  actionIcon?: React.ReactNode;
  /** A small line at the top of the card (where it comes from). */
  caption?: React.ReactNode;
  /** In the deck, in the accent: the call (“Last places”, arcade “Insert coin”). */
  highlight?: React.ReactNode;
  /** Beside the highlight: how (“One click, no card”). */
  hint?: React.ReactNode;
  /** A status with a green dot (“All features on”, “Credit 01”). */
  status?: React.ReactNode;
  /**
   * `default`: a calm card. `arcade`: the cabinet — screws, a dark CRT that switches on, a coin deck.
   * @default "default"
   */
  variant?: StoryVariant;
  /** A brand scope (`krizaka` → `.brand-krizaka`). */
  brand?: string;
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** One countdown's keyframes, named by its range: the digit steps from `from` to `to`, once. */
function countdownCss(from: number, to: number) {
  const steps = Math.max(1, Math.abs(from - to));
  const frames = Array.from({ length: steps + 1 }, (_, i) => {
    const n = from > to ? from - i : from + i;
    return `${Math.round((i / steps) * 100)}% { content: "${n}"; }`;
  }).join(" ");
  return `@keyframes kzs-count-${from}-${to} { ${frames} }
@media (prefers-reduced-motion: no-preference) {
  [data-in] .kzs-prompt-count[data-from="${from}"][data-to="${to}"] { color: transparent; }
  [data-in] .kzs-prompt-count[data-from="${from}"][data-to="${to}"]::after { content: "${to}"; animation: kzs-count-${from}-${to} ${steps}s steps(1) 1s both; }
}`;
}

/** A last call: a question, what counts, the closing words, the one action that continues — a `button`, or a link. */
export function ContinuePrompt({
  title,
  count,
  countdown,
  children,
  actionLabel,
  onAction,
  href,
  actionKey,
  actionIcon,
  caption,
  highlight,
  hint,
  status,
  variant,
  brand,
  className,
  ...props
}: ContinuePromptProps) {
  const arcade = variant === "arcade";
  const inner = (
    <>
      {actionKey && (
        <span className="kzs-prompt-key" aria-hidden>
          {actionKey}
        </span>
      )}
      {actionLabel}
      <span className="kzs-prompt-icon" aria-hidden>
        {actionIcon ?? <Arrow />}
      </span>
    </>
  );
  const button = { variant: arcade ? ("secondary" as const) : ("primary" as const), size: "md" as const, shape: arcade ? ("cut" as const) : undefined, className: "kzs-prompt-action" };
  return (
    <div data-kzs-scene="" className={cn("kzs-prompt", storyVariantClass(variant), brandClass(brand), className)} {...props}>
      {countdown && <style>{countdownCss(countdown.from, countdown.to)}</style>}
      {(caption || arcade) && (
        <div className="kzs-prompt-top">
          <span className="kzs-prompt-screw" aria-hidden />
          {caption && <span>{caption}</span>}
          <span className="kzs-prompt-screw" aria-hidden />
        </div>
      )}
      <div className={cn("kzs-prompt-screen", arcade && "theme-dark", brandClass(brand))}>
        <span className="kzs-texture" aria-hidden />
        <span className="kzs-scan kzs-loop" aria-hidden />
        <span className="kzs-prompt-glass" aria-hidden />
        <div className="kzs-prompt-content">
          <div className="kzs-prompt-head">
            <span className="kzs-prompt-title">{title}</span>
            {countdown ? (
              <span className="kzs-prompt-count" data-from={countdown.from} data-to={countdown.to} aria-hidden>
                {countdown.from}
              </span>
            ) : (
              count !== undefined && (
                <span className="kzs-prompt-count" aria-hidden>
                  {count}
                </span>
              )
            )}
          </div>
          {children}
        </div>
      </div>
      <div className="kzs-prompt-deck">
        {(highlight || hint || status) && (
          <div className="kzs-prompt-coin">
            {highlight && <span className="kzs-prompt-highlight">{highlight}</span>}
            {hint && <span className="kzs-prompt-hint">{hint}</span>}
            {status && (
              <span className="kzs-prompt-status">
                <span className="kzs-prompt-led" aria-hidden />
                {status}
              </span>
            )}
          </div>
        )}
        {href ? (
          <Button asChild {...button}>
            <a href={href}>{inner}</a>
          </Button>
        ) : (
          <Button type="button" onClick={onAction} {...button}>
            {inner}
          </Button>
        )}
      </div>
    </div>
  );
}
