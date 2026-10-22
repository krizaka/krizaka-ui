// Client (the Button). The right side of a product's bar, decided once for every product (« the objective is to use the app,
// not to talk to us »): the primary action is using the app — « Sign in » while sign-up is closed, « Try » once it opens —
// never a duplicate « Sign in » beside it, never « Contact » (that is a plain link in the footer).
import type * as React from "react";

import { Button } from "../button/button";

/** The two ways into a product. */
export const ProductBarAction = { SignIn: "sign-in", Try: "try" } as const;
export type ProductBarAction = (typeof ProductBarAction)[keyof typeof ProductBarAction];

export interface ProductBarState {
  /** Whether the product accepts new accounts (its `signupOpen` setting). */
  signupOpen: boolean;
  /** Whether the product has a « try it » action (a free first audit, a founder offer). */
  hasTry: boolean;
}

/** What the bar shows: one primary, and « Sign in » beside it only when it is not the primary. */
export function productBarActions({ signupOpen, hasTry }: ProductBarState): { primary: ProductBarAction; secondary: ProductBarAction | null } {
  return signupOpen && hasTry ? { primary: ProductBarAction.Try, secondary: ProductBarAction.SignIn } : { primary: ProductBarAction.SignIn, secondary: null };
}

export interface ProductBarLink {
  href: string;
  /** Passed translated. */
  label: string;
}

export type ProductBarActionsProps = {
  /** Where « Sign in » leads, and its words. */
  signIn: ProductBarLink;
  /** « Try for free » (the first audit is free), the founder offer: absent when the product has none. */
  tryIt?: ProductBarLink;
  /** Whether the product accepts new accounts (its `signupOpen` setting): « Try » is the primary action only then. */
  signupOpen: boolean;
  /** The app's link component (Next's `Link`); an `<a>` otherwise. */
  linkAs?: React.ElementType;
  /**
   * `bar` (from `md`, the buttons of the bar) or `panel` (the mobile panel: full-width, the primary last).
   * @default "bar"
   */
  placement?: "bar" | "panel";
};

/** The product bar's actions: use the app. Put it in `NavBar.Actions` (`placement="bar"`) or in `NavBar.Mobile` (`placement="panel"`). */
export function ProductBarActions({ signIn, tryIt, signupOpen, linkAs: Link = "a", placement = "bar" }: ProductBarActionsProps) {
  const { primary, secondary } = productBarActions({ signupOpen, hasTry: Boolean(tryIt) });
  const link = (kind: ProductBarAction) => (kind === ProductBarAction.Try && tryIt ? tryIt : signIn);
  const panel = placement === "panel";
  const button = (kind: ProductBarAction, variant: "primary" | "ghost") => (
    <Button key={kind} asChild variant={variant} size={panel ? "md" : "sm"} className={panel ? (variant === "primary" ? "mt-2 w-full font-bold" : "w-full") : variant === "primary" ? "ml-1 hidden font-bold md:inline-flex" : "hidden md:inline-flex"}>
      <Link href={link(kind).href}>{link(kind).label}</Link>
    </Button>
  );
  return (
    <>
      {secondary ? button(secondary, "ghost") : null}
      {button(primary, "primary")}
    </>
  );
}
