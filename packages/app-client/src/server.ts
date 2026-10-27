// The server's side of the bearer session: what a Next.js route reads to know who calls. A native app sends the token it
// holds as `Authorization: Bearer` (`createApiClient`); the web sends its httpOnly cookie. Pure: headers in, a token out —
// no framework, no cookie jar, so the two apps that carried a copy (Yomizaka, Akinaza) share one tested rule.

/** `Bearer <token>`, any case of the scheme, a single token. */
const bearerOf = (header: string | null): string | undefined => /^bearer (\S+)$/i.exec(header ?? "")?.[1];

/** The value of the cookie `name` in a `Cookie` header. */
export function cookieValue(header: string | null, name: string): string | undefined {
  const prefix = `${name}=`;
  return header
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);
}

/**
 * The session token of a request: the native app's `Authorization: Bearer` first — an app never replays a stale cookie —,
 * else the web's cookie `cookieName`. `undefined` when there is neither.
 */
export function sessionTokenOf(requestHeaders: Headers, cookieName: string): string | undefined {
  return bearerOf(requestHeaders.get("authorization")) ?? cookieValue(requestHeaders.get("cookie"), cookieName);
}

/** How a sign-in call asks for its session: `native` gets the token in the response body (the app keeps it), `web` gets the cookie. */
export type SignInClient = "web" | "native";

/** The client a sign-in body declares (`{ client: "native" }`); anything else is the web. */
export function signInClientOf(body: unknown): SignInClient {
  return typeof body === "object" && body !== null && (body as { client?: unknown }).client === "native" ? "native" : "web";
}
