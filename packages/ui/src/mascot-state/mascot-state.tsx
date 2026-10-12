// The moments a product speaks to a person — nothing yet, a long wait, done, it failed, welcome — told by a bird of
// the flock beside the words. Every word is a prop; the bird never carries the message alone.
import type * as React from "react";
import { tv } from "tailwind-variants";

import type { MascotBird, MascotMood, MascotTone } from "../mascots/geometry";
import { Mascot } from "../mascots/mascot";

// Staged: the bird arrives, then the words, then the action — once, and not at all under reduced motion.
const CSS = `
@keyframes kzms-in { from { opacity: 0; transform: translateY(6px); } }
@media (prefers-reduced-motion: no-preference) {
  [data-kzms-staged] > [data-kzms-part] { animation: kzms-in .42s cubic-bezier(.2,.8,.2,1) both; }
  [data-kzms-staged] > [data-kzms-part="words"] { animation-delay: .12s; }
  [data-kzms-staged] > [data-kzms-part="action"] { animation-delay: .24s; }
}
`;

export const mascotState = tv({
  slots: {
    root: "flex items-center gap-4 text-fg",
    bird: "shrink-0",
    words: "flex flex-col gap-1.5",
    title: "text-base font-semibold text-fg",
    description: "max-w-sm text-sm text-fg-secondary",
    action: "flex flex-wrap items-center gap-2",
  },
  variants: {
    layout: {
      stacked: { root: "flex-col justify-center px-6 py-10 text-center", words: "items-center", action: "justify-center" },
      inline: { root: "flex-row text-left", action: "mt-1" },
    },
    framed: { true: { root: "rounded-xl border border-dashed border-border-default bg-surface-1" }, false: {} },
  },
  compoundVariants: [{ layout: "inline", framed: true, class: { root: "p-4" } }],
  defaultVariants: { layout: "stacked", framed: false },
});

const SIZE = { sm: 64, md: 96, lg: 128 } as const;

export type MascotStateProps = Omit<React.ComponentProps<"div">, "title"> & {
  /**
   * The bird whose job the moment is about: `owl` (documents, reading), `falcon` (security, verification), `duck`
   * (code, building), `flamingo` (answers, payments), `pigeon` (delivery, notifications), `lovebird` (introductions). One bird per idea.
   */
  bird?: MascotBird;
  /** The moment: `empty` (nothing yet), `thinking` (a long task runs), `success` (done), `error` (it failed), `welcome`. */
  mood?: MascotMood;
  /** What happened, in a few words ("No videos yet", "Payment received"). */
  title: React.ReactNode;
  /** Why, or what comes next. */
  description?: React.ReactNode;
  /** What to do next: a Button, a link. One, at most two. */
  action?: React.ReactNode;
  /** The bird's size: `sm` 64 px, `md` 96 px (default), `lg` 128 px. */
  size?: keyof typeof SIZE;
  /** `stacked` (default): the bird above centred words — a page, a panel. `inline`: the bird beside the words — a card, a row of a form. */
  layout?: "stacked" | "inline";
  /** A dashed frame on the raised surface, for an empty list or panel. */
  framed?: boolean;
  /** `brand` (default): the product's accent. `own`: the bird's colours of the Krizaka story. */
  tone?: MascotTone;
  /** The bird's gesture and the staged arrival. Off with `false`; always off under `prefers-reduced-motion`. */
  animated?: boolean;
  /** The level of the title (default `p`): `h1` on a full page (a 404), `h2`/`h3` inside a page. */
  titleAs?: "p" | "h1" | "h2" | "h3";
};

/**
 * A moment told by a bird of the flock: an empty list, a long wait, a success, an error, a welcome. Announced to
 * assistive technology — `role="alert"` for an error, `role="status"` otherwise (`aria-busy` while thinking).
 */
export function MascotState({
  bird = "owl",
  mood = "empty",
  title,
  description,
  action,
  size = "md",
  layout,
  framed,
  tone,
  animated = true,
  titleAs: Title = "p",
  className,
  ...props
}: MascotStateProps) {
  const s = mascotState({ layout, framed });
  return (
    <div
      role={mood === "error" ? "alert" : "status"}
      aria-busy={mood === "thinking" ? true : undefined}
      data-mood={mood}
      data-kzms-staged={animated ? "" : undefined}
      className={s.root({ className })}
      {...props}
    >
      {animated && <style>{CSS}</style>}
      <span data-kzms-part="bird" className={s.bird()}>
        <Mascot bird={bird} mood={mood} tone={tone} size={SIZE[size]} animated={animated} />
      </span>
      <div data-kzms-part="words" className={s.words()}>
        <Title className={s.title()}>{title}</Title>
        {description && <p className={s.description()}>{description}</p>}
        {layout === "inline" && action && <div className={s.action()}>{action}</div>}
      </div>
      {layout !== "inline" && action && (
        <div data-kzms-part="action" className={s.action()}>
          {action}
        </div>
      )}
    </div>
  );
}

type PresetProps = Omit<MascotStateProps, "mood">;

/** It failed: what went wrong and what to do (`role="alert"`). `MascotState` with `mood="error"`. */
export function ErrorState(props: PresetProps) {
  return <MascotState mood="error" {...props} />;
}

/** It is done: a payment, a verification, a delivery, a sent message. `MascotState` with `mood="success"`. */
export function SuccessState(props: PresetProps) {
  return <MascotState mood="success" {...props} />;
}

/** A long task runs (`aria-busy`): what runs, beside the bird. `MascotState` with `mood="thinking"`. */
export function LoadingState(props: PresetProps) {
  return <MascotState mood="thinking" {...props} />;
}

/** A first screen, an onboarding step. `MascotState` with `mood="welcome"`. */
export function WelcomeState(props: PresetProps) {
  return <MascotState mood="welcome" {...props} />;
}
