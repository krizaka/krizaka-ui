// Server-safe. A seal that says the person or the account was verified: the accent, named in words.
import type * as React from "react";

export type VerifiedBadgeProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Its words (“Verified”), read — and shown with `showLabel` — passed translated. */
  label: string;
  /** Show the words beside the seal. Default false: the seal alone, named. */
  showLabel?: boolean;
  /** The seal's size: sm (14 px), md (16 px, default), lg (20 px). */
  size?: "sm" | "md" | "lg";
  /** On a photo: a ring of the media around the seal. */
  onMedia?: boolean;
};

const SIZE = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" } as const;

/** A seal that says the person or the account was verified (a selfie check, an ID), named in words. */
export function VerifiedBadge({ label, showLabel, size = "md", onMedia, className, ...props }: VerifiedBadgeProps) {
  return (
    <span role="img" aria-label={label} className={["inline-flex items-center gap-1 text-xs font-bold", onMedia ? "text-fg-on-media" : "text-fg-accent", className].filter(Boolean).join(" ")} {...props}>
      <svg viewBox="0 0 24 24" className={[SIZE[size], "shrink-0"].join(" ")} aria-hidden>
        <path
          d="M12 2.5l2.4 1.7 2.9-.1.9 2.8 2.3 1.8-.9 2.8.9 2.8-2.3 1.8-.9 2.8-2.9-.1L12 21.5l-2.4-1.7-2.9.1-.9-2.8-2.3-1.8.9-2.8-.9-2.8 2.3-1.8.9-2.8 2.9.1z"
          className={onMedia ? "fill-accent stroke-fg-on-media" : "fill-accent"}
          strokeWidth="1.2"
        />
        <path d="M8.3 12.3l2.5 2.5 4.9-5.2" fill="none" className="stroke-on-accent" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showLabel ? <span aria-hidden>{label}</span> : null}
    </span>
  );
}
