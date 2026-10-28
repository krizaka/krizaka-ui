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
  /**
   * The session the server already knows (a dynamic page reading its cookie): the first paint then IS the answer, with no
   * placeholder and no swap. Leave it out on a static page; the bar reserves its place until the answer comes.
   */
  initial?: MeResponse<TAccount>;
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

/** What the bar knows of the visitor: `pending` is NOT « signed out » — nothing is drawn as either until the answer comes. */
export type NavSession<TAccount = unknown> = { status: "pending" } | { status: "in"; account: TAccount; signupOpen: boolean } | { status: "out"; signupOpen: boolean };

/**
 * The one « who is here » reading of the family (the bar, a hero's action, a closing call all read this and so never
 * disagree). Three rules, krizaka-ui#800: (1) `pending` is its own state, never drawn as signed out; (2) only an answer
 * (`GET /api/me` 200) changes the state — a failed or throttled refetch keeps the last known state instead of flipping a
 * signed-in person to « Sign in »; (3) with no answer at all (the first request failed) the visitor can still sign in.
 */
export function useNavSession<TAccount = unknown>(endpoint = "/api/me", initial?: MeResponse<TAccount>): NavSession<TAccount> {
  const { data, isPending, isError } = useQuery({
    queryKey: sessionKey(endpoint),
    queryFn: ({ signal }) => krizakaFetch(endpoint, { schema: meSchema, signal, cache: "no-store" }),
    staleTime: 30_000,
    retry: false,
    throwOnError: false,
    ...(initial ? { initialData: initial as MeResponse } : {}),
  });
  if (data) {
    const me = data as MeResponse<TAccount>;
    return me.signedIn && me.account !== undefined ? { status: "in", account: me.account, signupOpen: me.signupOpen } : { status: "out", signupOpen: me.signupOpen };
  }
  if (isPending && !isError) return { status: "pending" };
  return { status: "out", signupOpen: false };
}

/**
 * The bar's session island: put it in `NavBar.Actions`. While the answer is on its way it reserves the place and says
 * `hint` politely (or, given `initial`, draws the server's answer at once); if the first request fails it shows the
 * signed-out actions (the visitor can still sign in).
 */
export function NavBarSession<TAccount = unknown>({ endpoint = "/api/me", initial, signedOut, signedIn, hint, className }: NavBarSessionProps<TAccount>) {
  const session = useNavSession<TAccount>(endpoint, initial);
  if (session.status === "pending") {
    return (
      <span role="status" aria-live="polite" data-state="loading" className={className}>
        <span className="sr-only">{hint}</span>
      </span>
    );
  }
  const state = { signupOpen: session.signupOpen };
  return <>{session.status === "in" ? signedIn(session.account, state) : signedOut(state)}</>;
}
