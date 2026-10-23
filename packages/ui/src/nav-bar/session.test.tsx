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

  it("falls back to signed out after a failed refetch, even with a cached account", async () => {
    const fetch = vi.fn<() => Promise<Response>>()
      .mockResolvedValueOnce(meResponse({ signedIn: true, signupOpen: true, account: { name: "Ada" } }))
      .mockResolvedValueOnce(new Response("{}", { status: 500 }));
    const client = setup(fetch);
    expect(await screen.findByRole("button", { name: "Ada" })).toBeTruthy();
    await act(async () => { await client.refetchQueries({ queryKey: sessionKey("/api/me") }); });
    expect(await screen.findByRole("link", { name: "Sign in" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Ada" })).toBeNull();
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
