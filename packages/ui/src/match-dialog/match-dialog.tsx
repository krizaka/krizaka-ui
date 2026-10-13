// Client (a portal). The moment two people choose each other — a match, a pair, a deal: a dialog in the brand
// gradient, the two avatars meeting at a heart, the next step. The entrance plays once; still under reduced motion.
import * as React from "react";

import { Avatar } from "../avatar";
import { Button } from "../button";
import { Dialog } from "../dialog";

export type MatchDialogProps = {
  /** Shown (controlled). */
  open: boolean;
  /** Called when it closes. */
  onOpenChange: (open: boolean) => void;
  /** The headline (“It's a match!”) — passed translated; the dialog's name. */
  title: string;
  /** A line under it. */
  description?: string;
  /** The two people: avatar URLs and names. */
  people: readonly [{ src?: string | null; name: string }, { src?: string | null; name: string }];
  /** The main action (“Send a message”). */
  primaryLabel: string;
  /** What it does. */
  onPrimary: () => void;
  /** The way back (“Keep swiping”). */
  secondaryLabel: string;
};

/** Two people choose each other: the avatars meet at a heart in the brand gradient, the next step under them. */
export function MatchDialog({ open, onOpenChange, title, description, people, primaryLabel, onPrimary, secondaryLabel }: MatchDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content hideClose size="sm" className="overflow-hidden border-0 bg-gradient-to-br from-accent to-accent-2 text-center text-on-accent">
        <style href="krizaka-match" precedence="default">
          {"@media (prefers-reduced-motion:no-preference){[data-kz-match] [data-side=a]{animation:kz-match-a .55s cubic-bezier(.3,1.6,.5,1) both}[data-kz-match] [data-side=b]{animation:kz-match-b .55s cubic-bezier(.3,1.6,.5,1) both}[data-kz-match] [data-heart]{animation:kz-match-heart .45s .25s cubic-bezier(.3,1.6,.5,1) both}}@keyframes kz-match-a{from{transform:translateX(-60px) rotate(-8deg);opacity:0}}@keyframes kz-match-b{from{transform:translateX(60px) rotate(8deg);opacity:0}}@keyframes kz-match-heart{from{transform:scale(0)}}"}
        </style>
        <div data-kz-match="" className="flex flex-col items-center gap-3 px-2 pb-2 pt-6">
          <Dialog.Title className="font-display text-4xl font-black text-on-accent">{title}</Dialog.Title>
          {description ? <Dialog.Description className="max-w-xs text-sm text-on-accent">{description}</Dialog.Description> : null}
          <div className="relative my-6 flex h-36 w-64 items-center justify-center" aria-hidden>
            <span data-side="a" className="absolute left-6 -rotate-6 rounded-full ring-4 ring-on-accent">
              <Avatar src={people[0].src ?? null} alt="" fallback={people[0].name.charAt(0)} className="h-28 w-28 text-3xl" />
            </span>
            <span data-side="b" className="absolute right-6 rotate-6 rounded-full ring-4 ring-on-accent">
              <Avatar src={people[1].src ?? null} alt="" fallback={people[1].name.charAt(0)} className="h-28 w-28 text-3xl" />
            </span>
            <span data-heart="" className="absolute -bottom-1 flex h-12 w-12 items-center justify-center rounded-full bg-on-accent text-accent shadow-lg">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
              </svg>
            </span>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button
              size="lg"
              onClick={() => {
                onOpenChange(false);
                onPrimary();
              }}
            >
              {primaryLabel}
            </Button>
            <Dialog.Close asChild>
              <Button size="lg" variant="ghost" className="text-on-accent hover:bg-on-accent/15">
                {secondaryLabel}
              </Button>
            </Dialog.Close>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
