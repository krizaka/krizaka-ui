import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

import type { SessionStore } from "./session";

/** Who is using the app: `loading` while the stored session is read, then one of the two. */
export const AUTH = { loading: "loading", signedOut: "signedOut", signedIn: "signedIn" } as const;
export type AuthStatus = (typeof AUTH)[keyof typeof AUTH];

/**
 * The session's status, followed: read once from the store, then again whenever a session starts or ends — a sign-in, a
 * sign-out, or the server refusing the token (the API client's 401 clears it). A store that cannot be read is signed out.
 */
export function useSessionStatus(session: Pick<SessionStore, "readToken" | "onChange">): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>(AUTH.loading);
  useEffect(() => {
    let live = true;
    const read = () =>
      void session
        .readToken()
        .catch(() => null)
        .then((token) => live && setStatus(token ? AUTH.signedIn : AUTH.signedOut));
    read();
    const stop = session.onChange(read);
    return () => {
      live = false;
      stop();
    };
  }, [session]);
  return status;
}

/** The product's two moves: its API's sign-in (which saves the bearer in the session) and sign-out (which clears it). */
export interface AuthActions {
  signIn(email: string, password: string): Promise<unknown>;
  signOut(): Promise<unknown>;
}

export interface AuthState {
  status: AuthStatus;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}

/**
 * The auth context of an app, bound once to its session and its API: `const { AuthProvider, useAuth } =
 * createAuth(session, { signIn: api.signIn, signOut: api.signOut })`. Screens read `useAuth().status` and never the store.
 */
export function createAuth(session: Pick<SessionStore, "readToken" | "onChange">, actions: AuthActions) {
  const Context = createContext<AuthState | null>(null);
  Context.displayName = "AuthContext";

  function AuthProvider({ children }: { children: ReactNode }) {
    const status = useSessionStatus(session);
    const value = useMemo<AuthState>(
      () => ({
        status,
        signIn: async (email, password) => void (await actions.signIn(email, password)),
        signOut: async () => void (await actions.signOut()),
      }),
      [status],
    );
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useAuth(): AuthState {
    const value = useContext(Context);
    if (!value) throw new Error("@krizaka/app-client/react: useAuth() must be used inside <AuthProvider>.");
    return value;
  }

  return { AuthProvider, useAuth };
}
