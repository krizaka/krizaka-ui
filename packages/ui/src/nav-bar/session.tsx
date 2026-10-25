// Client. The bar's « who is here » island, the same for every product: it asks `GET /api/me` (the contract of ./me)
// through @krizaka/query and shows the product's account menu or its sign-in actions. It needs a QueryClient above it.
import { krizakaFetch, useQuery } from "@krizaka/query";
import type * as React from "react";

import { type MeResponse, meSchema } from "./me";

export type NavBarSessionProps<TAccount = unknown> = {
  /**
   * Where the contract is served.
   * @default "/api/me"
   */
  endpoint?: string;
  /** Signed out: the product's `ProductBarActions`, told whether sign-up is open. */
  signedOut: (state: { signupOpen: boolean }) => React.ReactNode;
  /** Signed in: the product's `AccountMenu`, given the account. */
  signedIn: (account: TAccount, state: { signupOpen: boolean }) => React.ReactNode;
  /** The hint's words while the answer is on its way (“Checking your session…”) — passed translated. */
  hint: string;
  /** Classes of the loading placeholder. */
  className?: string;
};

export const sessionKey = (endpoint: string) => ["krizaka", "session", endpoint] as const;

/**
 * The bar's session island: put it in `NavBar.Actions`. While the answer is on its way it reserves the place and says
 * `hint` politely; if the request fails it shows the signed-out actions (the visitor can still sign in).
 */
export function NavBarSession<TAccount = unknown>({ endpoint = "/api/me", signedOut, signedIn, hint, className }: NavBarSessionProps<TAccount>) {
  const { data, isPending, isError } = useQuery({
    queryKey: sessionKey(endpoint),
    queryFn: ({ signal }) => krizakaFetch(endpoint, { schema: meSchema, signal, cache: "no-store" }),
    staleTime: 30_000,
    retry: false,
    throwOnError: false,
  });
  if (isPending) {
    return (
      <span role="status" aria-live="polite" data-state="loading" className={className}>
        <span className="sr-only">{hint}</span>
      </span>
    );
  }
  const me = (!isError && data ? data : { signedIn: false, signupOpen: false }) as MeResponse<TAccount>;
  const state = { signupOpen: me.signupOpen };
  return <>{me.signedIn && me.account !== undefined ? signedIn(me.account, state) : signedOut(state)}</>;
}
