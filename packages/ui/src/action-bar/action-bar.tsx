// Server-safe. A row of actions that leave or move on (blocks.css): discuss · propose · report, read the docs, see the
// code. `buttons`: buttons with their words — the end of a page or a section. `icons`: icon buttons whose words are the
// accessible name and a tooltip on hover and focus (CSS only: no script, no portal) — the foot of a card.
import type * as React from "react";

import { BlockLink, isExternal, type LinkComponent } from "../block-link";
import { buttonVariants } from "../button/button";
import { cn } from "../cn";
import { ExternalGlyph } from "../glyphs";

export interface Action {
  /** Where it leads. An absolute URL opens in a new tab, with the external mark. */
  href: string;
  /** Its words (the accessible name, and the tooltip of an icon action). */
  label: string;
  /** Its icon (a signature icon): decorative. Required by `variant="icons"`. */
  icon?: React.ReactNode;
}

export type ActionBarProps = React.HTMLAttributes<HTMLUListElement> & {
  /** The actions, in order of importance. */
  actions: readonly Action[];
  /**
   * `buttons` (with their words) or `icons` (icon buttons, the words in a tooltip).
   * @default "buttons"
   */
  variant?: "buttons" | "icons";
  /**
   * The first action as the primary button (the one action a block is about); the others stay secondary.
   * @default false
   */
  primaryFirst?: boolean;
  /**
   * The buttons' size: `sm` in a card, `md` in a section, `lg` on a hero or a closing call.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /** What the actions are about (`Talk about Krizaka Java`): the list's accessible name. */
  label?: string;
  /** The app's link component for internal addresses (Next's `Link`); an `<a>` otherwise. */
  linkAs?: LinkComponent;
};

/** A row of link actions: buttons with their words, or icon buttons with a tooltip. */
export function ActionBar({ actions, variant = "buttons", primaryFirst = false, size = "md", label, linkAs, className, ...props }: ActionBarProps) {
  const icons = variant === "icons";
  return (
    <ul className={cn("kz-actions", className)} data-variant={icons ? "icons" : undefined} aria-label={label} {...props}>
      {actions.map((a, i) => {
        const external = isExternal(a.href);
        return (
          <li key={a.href}>
            {icons ? (
              <BlockLink
                href={a.href}
                linkAs={linkAs}
                external={external}
                aria-label={a.label}
                data-tip={a.label}
                className={buttonVariants({ variant: "ghost", size: "icon", shape: "cut", className: size === "sm" ? "h-9 w-9" : undefined })}
              >
                {a.icon}
              </BlockLink>
            ) : (
              <BlockLink
                href={a.href}
                linkAs={linkAs}
                external={external}
                className={buttonVariants({ variant: primaryFirst && i === 0 ? "primary" : "secondary", size, shape: "cut", className: "gap-2" })}
              >
                {a.icon}
                {a.label}
                {external && <ExternalGlyph className="h-3 w-3 opacity-70" />}
              </BlockLink>
            )}
          </li>
        );
      })}
    </ul>
  );
}
