// Server-safe. A promise, the keys that call it, and who carries it (story.css): a product's guarantee, a shortcut and
// what it does, a rule of the house — “Your data never leaves home”, called by ← ↙ ↓ ↘ → K, carried by the owl.
import type * as React from "react";

import { cn } from "../cn";
import { warnDeprecated } from "../deprecated";
import { brandClass, type StoryVariant, storyVariantClass } from "../story-variant";

export type PromiseCardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  /** What kind of promise (“Our promise”, “Shortcut”, arcade “Special move”). */
  label: React.ReactNode;
  /** The promise itself, in a few words. */
  promise: React.ReactNode;
  /** The keys that call it, in order (`["⌘", "K"]`); in a stage they light one by one before the promise lands. Decorative. */
  keys?: readonly string[];
  /** Who carries it: a bird of the flock (`Mascot`, 48 px), an avatar. Decorative. */
  bearer?: React.ReactNode;
  /** Above the bearer's name (“In the corner”, “Kept by”). */
  bearerLabel?: React.ReactNode;
  /** The bearer's name and role. */
  bearerName?: React.ReactNode;
  /**
   * `default`: a calm card with its keys as key-caps. `arcade`: the combo card — the keys pressed one by one, a flash.
   * @default "default"
   */
  variant?: StoryVariant;
  /** A brand scope (`orazaka` → `.brand-orazaka`). */
  brand?: string;
};

/**
 * A promise, the keys that call it and who carries it.
 * @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0.
 */
export function PromiseCard({ label, promise, keys, bearer, bearerLabel, bearerName, variant, brand, className, ...props }: PromiseCardProps) {
  warnDeprecated("promise-card");
  return (
    <div className={cn("kzs-promise", storyVariantClass(variant), brandClass(brand), className)} {...props}>
      <span className="kzs-promise-flash" aria-hidden />
      <div className="kzs-promise-head">
        <span className="kzs-promise-label">{label}</span>
        {keys && keys.length > 0 && (
          <span className="kzs-promise-keys" aria-hidden>
            {keys.map((k, i) => (
              <kbd key={i} className="kzs-key" style={{ "--k": i } as React.CSSProperties}>
                {k}
              </kbd>
            ))}
          </span>
        )}
      </div>
      <p className="kzs-promise-text">{promise}</p>
      {(bearer || bearerName) && (
        <div className="kzs-promise-bearer">
          {bearer && (
            <span className="kzs-promise-bird" aria-hidden>
              {bearer}
            </span>
          )}
          <span className="kzs-promise-who">
            {bearerLabel && <span className="kzs-promise-bearer-label">{bearerLabel}</span>}
            {bearerName && <span className="kzs-promise-name">{bearerName}</span>}
          </span>
        </div>
      )}
    </div>
  );
}
