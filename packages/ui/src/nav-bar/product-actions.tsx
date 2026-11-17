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
  /**
   * Whether the product has a sign-in at all: a public site (a shared export) has none.
   * @default true
   */
  hasSignIn?: boolean;
}

/** What the bar shows: one primary (none when there is no way in), and « Sign in » beside it only when it is not the primary. */
export function productBarActions({ signupOpen, hasTry, hasSignIn = true }: ProductBarState): { primary: ProductBarAction | null; secondary: ProductBarAction | null } {
  if (!hasSignIn) return { primary: hasTry ? ProductBarAction.Try : null, secondary: null };
  return signupOpen && hasTry ? { primary: ProductBarAction.Try, secondary: ProductBarAction.SignIn } : { primary: ProductBarAction.SignIn, secondary: null };
}

export interface ProductBarLink {
  href: string;
  /** Passed translated. */
  label: string;
}

export type ProductBarActionsProps = {
  /** Where « Sign in » leads, and its words. Absent on a public site: with no `tryIt` either, the block renders nothing. */
  signIn?: ProductBarLink;
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

/** The classes of an action: full width in the panel, a phone-hidden pill in the bar; the primary one is bold. */
function buttonClass(panel: boolean, primary: boolean): string {
  if (panel) return primary ? "mt-2 w-full font-bold" : "w-full";
  return primary ? "ml-1 hidden font-bold md:inline-flex" : "hidden md:inline-flex";
}

/** The product bar's actions: use the app. Put it in `NavBar.Actions` (`placement="bar"`) or in `NavBar.Mobile` (`placement="panel"`). */
export function ProductBarActions({ signIn, tryIt, signupOpen, linkAs: Link = "a", placement = "bar" }: Readonly<ProductBarActionsProps>) {
  const { primary, secondary } = productBarActions({ signupOpen, hasTry: Boolean(tryIt), hasSignIn: Boolean(signIn) });
  if (!primary) return null;
  const link = (kind: ProductBarAction) => (kind === ProductBarAction.Try ? tryIt : signIn);
  const panel = placement === "panel";
  const button = (kind: ProductBarAction, variant: "primary" | "ghost") => {
    const target = link(kind);
    if (!target) return null;
    return (
      <Button key={kind} asChild data-signed-out-only="" variant={variant} size={panel ? "md" : "sm"} className={buttonClass(panel, variant === "primary")}>
        <Link href={target.href}>{target.label}</Link>
      </Button>
    );
  };
  return (
    <>
      {secondary ? button(secondary, "ghost") : null}
      {button(primary, "primary")}
    </>
  );
}
