import { configureKrizakaFetch, createQueryClient, QueryClientProvider } from "@krizaka/query";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { meHeaders, meResponse } from "./me";
import { NavBar } from "./nav-bar";

let restore = () => {};
afterEach(() => restore());

function setup(answer: Response) {
  restore = configureKrizakaFetch({ fetch: (async () => answer) as typeof fetch });
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <NavBar.Session<{ name: string }> hint="Checking your session…" signedOut={({ signupOpen }) => <a href="/sign-in">{signupOpen ? "Try" : "Sign in"}</a>} signedIn={(a) => <button>{a.name}</button>} />
    </QueryClientProvider>,
  );
}

describe("meResponse: the one « who is here » contract", () => {
  it("answers 200, private, varying with the cookie, and never a 401 or an account when signed out", async () => {
    const res = meResponse({ signedIn: false, signupOpen: true, account: { name: "x" } });
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe(meHeaders["Cache-Control"]);
    expect(res.headers.get("Vary")).toBe("Cookie");
    expect(await res.json()).toEqual({ signedIn: false, signupOpen: true });
  });
});

describe("NavBar.Session", () => {
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
