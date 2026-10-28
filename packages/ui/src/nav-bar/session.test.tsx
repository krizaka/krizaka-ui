import { configureKrizakaFetch, createQueryClient, QueryClientProvider } from "@krizaka/query";
import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { meHeaders, meResponse, meSchema } from "./me";
import { NavBar } from "./nav-bar";
import { sessionKey } from "./session";

let restore = () => {};
afterEach(() => restore());

function setup(answer: Response | typeof fetch, config: { baseUrl?: string; credentials?: RequestCredentials } = {}) {
  restore = configureKrizakaFetch({ ...config, fetch: typeof answer === "function" ? answer : async () => answer });
  const client = createQueryClient();
  render(
    <QueryClientProvider client={client}>
      <NavBar.Session<{ name: string }> hint="Checking your session…" signedOut={({ signupOpen }) => <a href="/sign-in">{signupOpen ? "Try" : "Sign in"}</a>} signedIn={(a) => <button>{a.name}</button>} />
    </QueryClientProvider>,
  );
  return client;
}

describe("meResponse: the one « who is here » contract", () => {
  it("rejects signed-out payloads carrying an account", () => {
    expect(meSchema["~standard"].validate({ signedIn: false, signupOpen: true, account: { name: "Ada" } })).toHaveProperty("issues");
  });

  it("answers 200, private, varying with the cookie, and never a 401 or an account when signed out", async () => {
    const res = meResponse({ signedIn: false, signupOpen: true, account: { name: "x" } });
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe(meHeaders["Cache-Control"]);
    expect(res.headers.get("Vary")).toBe("Cookie");
    expect(await res.json()).toEqual({ signedIn: false, signupOpen: true });
  });
});

describe("NavBar.Session", () => {
  it("honors the application's cross-origin credential policy", async () => {
    const fetch = vi.fn<() => Promise<Response>>().mockResolvedValue(meResponse({ signedIn: true, signupOpen: false, account: { name: "Ada" } }));
    setup(fetch, { baseUrl: "https://api.example.com", credentials: "include" });
    expect(await screen.findByRole("button", { name: "Ada" })).toBeTruthy();
    expect(fetch).toHaveBeenCalledWith("https://api.example.com/api/me", expect.objectContaining({ credentials: "include" }));
  });

  it("keeps the last known state after a failed refetch: a throttled or failing /api/me never signs a signed-in person out (krizaka-ui#800)", async () => {
    const fetch = vi.fn<() => Promise<Response>>()
      .mockResolvedValueOnce(meResponse({ signedIn: true, signupOpen: true, account: { name: "Ada" } }))
      .mockResolvedValueOnce(new Response("{}", { status: 500 }));
    const client = setup(fetch);
    expect(await screen.findByRole("button", { name: "Ada" })).toBeTruthy();
    await act(async () => { await client.refetchQueries({ queryKey: sessionKey("/api/me") }); });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("button", { name: "Ada" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Sign in" })).toBeNull();
  });

  it("signs out when the server SAYS so (a 200 signedIn:false after a signed-in answer)", async () => {
    const fetch = vi.fn<() => Promise<Response>>()
      .mockResolvedValueOnce(meResponse({ signedIn: true, signupOpen: true, account: { name: "Ada" } }))
      .mockResolvedValueOnce(meResponse({ signedIn: false, signupOpen: true }));
    const client = setup(fetch);
    expect(await screen.findByRole("button", { name: "Ada" })).toBeTruthy();
    await act(async () => { await client.refetchQueries({ queryKey: sessionKey("/api/me") }); });
    expect(await screen.findByRole("link", { name: "Try" })).toBeTruthy();
  });

  it("never draws the signed-out actions while the answer is pending (first paint is neither state)", () => {
    setup(() => new Promise<Response>(() => {}));
    expect(screen.getByRole("status").textContent).toBe("Checking your session…");
    expect(screen.queryByRole("link", { name: "Sign in" })).toBeNull();
  });

  it("draws the server's answer at the FIRST render when given `initial`: signed in, then signed out, no placeholder", () => {
    restore = configureKrizakaFetch({ fetch: () => new Promise<Response>(() => {}) });
    const signedOut = ({ signupOpen }: { signupOpen: boolean }) => <a href="/sign-in">{signupOpen ? "Try" : "Sign in"}</a>;
    const signedIn = (a: { name: string }) => <button>{a.name}</button>;
    const first = (initial: Parameters<typeof NavBar.Session<{ name: string }>>[0]["initial"]) => {
      const { container, unmount } = render(
        <QueryClientProvider client={createQueryClient()}>
          <NavBar.Session<{ name: string }> hint="Checking…" initial={initial} signedOut={signedOut} signedIn={signedIn} />
        </QueryClientProvider>,
      );
      const html = container.innerHTML; // read synchronously: nothing has been fetched or awaited yet
      unmount();
      return html;
    };
    const inHtml = first({ signedIn: true, signupOpen: false, account: { name: "Ada" } });
    expect(inHtml).toContain("Ada");
    expect(inHtml).not.toContain("Sign in");
    expect(inHtml).not.toContain('data-state="loading"');
    const outHtml = first({ signedIn: false, signupOpen: false });
    expect(outHtml).toContain("Sign in");
    expect(outHtml).not.toContain("Ada");
  });

  it("says the hint while the answer is on its way, then shows the account menu when signed in", async () => {
    setup(meResponse({ signedIn: true, signupOpen: false, account: { name: "Ada" } }));
    expect(screen.getByRole("status").textContent).toBe("Checking your session…");
    expect(await screen.findByRole("button", { name: "Ada" })).toBeTruthy();
  });

  it("shows the sign-in actions, told whether sign-up is open, when signed out", async () => {
    setup(meResponse({ signedIn: false, signupOpen: true }));
    expect(await screen.findByRole("link", { name: "Try" })).toBeTruthy();
  });

  it("falls back to the signed-out actions when the request fails", async () => {
    setup(new Response("{}", { status: 500 }));
    expect(await screen.findByRole("link", { name: "Sign in" })).toBeTruthy();
  });
});

describe("the session hint: a signed-in person never sees « Sign in » while the answer is on its way (krizaka-ui#827)", () => {
  const pending = (props: { sessionHint?: boolean }) => {
    restore = configureKrizakaFetch({ fetch: () => new Promise<Response>(() => {}) });
    render(
      <QueryClientProvider client={createQueryClient()}>
        <NavBar.Session<{ name: string }> hint="Checking your session…" {...props} signedOut={() => <a href="/sign-in">Sign in</a>} signedIn={(a) => <button>{a.name}</button>} />
      </QueryClientProvider>,
    );
  };
  afterEach(() => {
    document.cookie = "kz-session=; Max-Age=0; Path=/";
  });

  it("the server's hint draws the signed-in placeholder, never the sign-in action", () => {
    pending({ sessionHint: true });
    expect(document.querySelector('[data-state="signed-in-pending"]')).not.toBeNull();
    expect(screen.queryByRole("link", { name: "Sign in" })).toBeNull();
  });

  it("without a hint, the place is only reserved (and « Sign in » still waits for the answer)", () => {
    pending({});
    expect(document.querySelector('[data-state="loading"]')).not.toBeNull();
    expect(document.querySelector('[data-state="signed-in-pending"]')).toBeNull();
    expect(screen.queryByRole("link", { name: "Sign in" })).toBeNull();
  });

  it("reads the readable flag cookie when no prop is given", () => {
    document.cookie = "kz-session=1; Path=/";
    pending({});
    expect(document.querySelector('[data-state="signed-in-pending"]')).not.toBeNull();
  });

  it("the first server render with the hint holds no « Sign in »", async () => {
    const { renderToString } = await import("react-dom/server");
    const html = renderToString(
      <QueryClientProvider client={createQueryClient()}>
        <NavBar.Session hint="Checking…" sessionHint signedOut={() => <a href="/sign-in">Sign in</a>} signedIn={() => <button>Account</button>} />
      </QueryClientProvider>,
    );
    expect(html).toContain("signed-in-pending");
    expect(html).not.toContain("Sign in");
  });

  it("names the same flag cookie as @krizaka/auth", async () => {
    const { SESSION_HINT_COOKIE } = await import("./session");
    expect(SESSION_HINT_COOKIE).toBe("kz-session");
  });
});
