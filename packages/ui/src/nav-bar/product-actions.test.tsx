import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NavBarRoot } from "./nav-bar";
import { ProductBarAction, ProductBarActions, productBarActions } from "./product-actions";

const signIn = { href: "/sign-in", label: "Se connecter" };
const attempt = { href: "/sign-up", label: "Essayer gratuitement" };

const show = (props: Partial<Parameters<typeof ProductBarActions>[0]>) =>
  render(
    <NavBarRoot label="Menu">
      <ProductBarActions signupOpen {...props} />
    </NavBarRoot>,
  );

describe("productBarActions: the one rule of every product's bar", () => {
  it.each([
    [{ signupOpen: false, hasTry: true }, ProductBarAction.SignIn, null],
    [{ signupOpen: false, hasTry: false }, ProductBarAction.SignIn, null],
    [{ signupOpen: true, hasTry: false }, ProductBarAction.SignIn, null],
    [{ signupOpen: true, hasTry: true }, ProductBarAction.Try, ProductBarAction.SignIn],
    [{ signupOpen: true, hasTry: true, hasSignIn: false }, ProductBarAction.Try, null],
    [{ signupOpen: false, hasTry: true, hasSignIn: false }, ProductBarAction.Try, null],
    [{ signupOpen: true, hasTry: false, hasSignIn: false }, null, null],
    [{ signupOpen: false, hasTry: false, hasSignIn: false }, null, null],
  ])("%j → primary %s, secondary %s", (state, primary, secondary) => {
    expect(productBarActions(state)).toEqual({ primary, secondary });
  });
});

describe("ProductBarActions", () => {
  it("shows « Sign in » as the one primary action while sign-up is closed, and no contact", () => {
    show({ signIn, tryIt: attempt, signupOpen: false });
    const link = screen.getByRole("link", { name: "Se connecter" });
    expect(link.getAttribute("data-variant")).toBe("primary");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.queryByText(/contact|talk/i)).toBeNull();
  });

  it("marks every sign-in and try action signed-out-only, so an app can hide them for a hinted visitor (krizaka-ui#827)", () => {
    show({ signIn, tryIt: attempt });
    for (const name of ["Essayer gratuitement", "Se connecter"]) expect(screen.getByRole("link", { name }).hasAttribute("data-signed-out-only")).toBe(true);
  });

  it("ships the rule that hides them under html[data-session], beating the buttons' own display", () => {
    const css = readFileSync(join(import.meta.dirname, "..", "blocks.css"), "utf8");
    expect(css).toMatch(/html\[data-session\] \[data-signed-out-only\]\s*\{\s*display:\s*none\s*!important/);
  });

  describe.each(["bar", "panel"] as const)("in the %s placement", (placement) => {
    it("sign-in only: one primary « Sign in »", () => {
      show({ signIn, placement });
      expect(screen.getAllByRole("link")).toHaveLength(1);
      expect(screen.getByRole("link", { name: "Se connecter" }).getAttribute("data-variant")).toBe("primary");
    });

    it("try + sign-in: « Try » primary, « Sign in » quiet", () => {
      show({ signIn, tryIt: attempt, placement });
      expect(screen.getByRole("link", { name: "Essayer gratuitement" }).getAttribute("data-variant")).toBe("primary");
      expect(screen.getByRole("link", { name: "Se connecter" }).getAttribute("data-variant")).toBe("ghost");
    });

    it("try without sign-in: only « Try »", () => {
      show({ tryIt: attempt, placement });
      expect(screen.getAllByRole("link")).toHaveLength(1);
      expect(screen.getByRole("link", { name: "Essayer gratuitement" }).getAttribute("data-variant")).toBe("primary");
    });

    it("neither: nothing at all, no button and no wrapper", () => {
      const { container } = show({ placement });
      expect(screen.queryAllByRole("link")).toHaveLength(0);
      expect(container.querySelector("nav")?.childElementCount ?? 0).toBe(0);
    });
  });
});
