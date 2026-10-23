// The « who is here » contract, the same for every product: `GET /api/me` answers 200 `{ signedIn, signupOpen, account? }`
// with `Cache-Control: private, no-store` and `Vary: Cookie`. A public page asking who is there is not an error: signed
// out is a 200 with `signedIn: false`, never a 401.

/** The body of `GET /api/me`. `account` is the product's own shape, present only when `signedIn`. */
export interface MeResponse<TAccount = unknown> {
  signedIn: boolean;
  /** Whether the product accepts new accounts (its `signupOpen` setting). */
  signupOpen: boolean;
  account?: TAccount;
}

/** The headers of the answer: per-visitor, never cached, varying with the session cookie. */
export const meHeaders = { "Cache-Control": "private, no-store", Vary: "Cookie" } as const;

/** The 200 answer of `GET /api/me` for a route handler. A signed-out visitor never gets an `account`. */
export function meResponse<TAccount>({ signedIn, signupOpen, account }: MeResponse<TAccount>): Response {
  const body: MeResponse<TAccount> = signedIn && account !== undefined ? { signedIn, signupOpen, account } : { signedIn: false, signupOpen };
  return new Response(JSON.stringify(body), { status: 200, headers: { ...meHeaders, "Content-Type": "application/json" } });
}

/** A Standard Schema of the body, for `krizakaFetch`: refuses anything that is not the contract. */
export const meSchema = {
  "~standard": {
    version: 1,
    vendor: "krizaka",
    validate(value: unknown) {
      const v = value as Partial<MeResponse> | null;
      if (v && typeof v === "object" && typeof v.signedIn === "boolean" && typeof v.signupOpen === "boolean") return { value: v as MeResponse };
      return { issues: [{ message: "Expected { signedIn: boolean, signupOpen: boolean, account?: … }." }] };
    },
  },
} as const;
