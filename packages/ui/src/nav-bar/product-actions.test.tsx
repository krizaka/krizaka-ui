import { readFileSync } from "node:fs";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NavBarRoot } from "./nav-bar";
import { ProductBarAction, ProductBarActions, productBarActions } from "./product-actions";

const signIn = { href: "/sign-in", label: "Se connecter" };
const attempt = { href: "/sign-up", label: "Essayer gratuitement" };

describe("productBarActions: the one rule of every product's bar", () => {
  it.each([
    [{ signupOpen: false, hasTry: true }, ProductBarAction.SignIn, null],
    [{ signupOpen: false, hasTry: false }, ProductBarAction.SignIn, null],
    [{ signupOpen: true, hasTry: false }, ProductBarAction.SignIn, null],
    [{ signupOpen: true, hasTry: true }, ProductBarAction.Try, ProductBarAction.SignIn],
  ])("%j → primary %s, secondary %s", (state, primary, secondary) => {
    expect(productBarActions(state)).toEqual({ primary, secondary });
  });
});

describe("ProductBarActions", () => {
  it("shows « Sign in » as the one primary action while sign-up is closed, and no contact", () => {
    render(
      <NavBarRoot label="Menu">
        <ProductBarActions signIn={signIn} tryIt={attempt} signupOpen={false} />
      </NavBarRoot>,
    );
    const link = screen.getByRole("link", { name: "Se connecter" });
    expect(link.getAttribute("data-variant")).toBe("primary");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.queryByText(/contact|talk/i)).toBeNull();
  });

  it("makes « Try » primary once sign-up opens, with « Sign in » beside it as a quiet link", () => {
    render(
      <NavBarRoot label="Menu">
        <ProductBarActions signIn={signIn} tryIt={attempt} signupOpen />
      </NavBarRoot>,
    );
    expect(screen.getByRole("link", { name: "Essayer gratuitement" }).getAttribute("data-variant")).toBe("primary");
    expect(screen.getByRole("link", { name: "Se connecter" }).getAttribute("data-variant")).toBe("ghost");
  });

  it("marks every sign-in and try action signed-out-only, so an app can hide them for a hinted visitor (krizaka-ui#827)", () => {
    render(
      <NavBarRoot label="Menu">
        <ProductBarActions signIn={signIn} tryIt={attempt} signupOpen />
      </NavBarRoot>,
    );
    for (const name of ["Essayer gratuitement", "Se connecter"]) expect(screen.getByRole("link", { name }).hasAttribute("data-signed-out-only")).toBe(true);
  });

  it("ships the rule that hides them under html[data-session], beating the buttons' own display", () => {
    const css = readFileSync(new URL("../blocks.css", import.meta.url), "utf8");
    expect(css).toMatch(/html\[data-session\] \[data-signed-out-only\]\s*\{\s*display:\s*none\s*!important/);
  });
});
