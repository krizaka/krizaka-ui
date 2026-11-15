import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { axeViolations } from "../test/axe";
import { PlatformBar } from "./index";

const brand = <a href="#home">Folioviv</a>;
const notice = { title: "Boutique de démonstration.", message: "Les données sont fictives.", link: { label: "En savoir plus", href: "#demo" } };

describe("PlatformBar", () => {
  it("is a named region with the mark, the one notice line and the end slot, and no axe violation", async () => {
    const { container } = render(<PlatformBar label="Folioviv" brand={brand} notice={notice} end={<a href="#en">EN</a>} />);
    const region = screen.getByRole("region", { name: "Folioviv" });
    expect(region.textContent).toContain("Boutique de démonstration. Les données sont fictives. En savoir plus");
    expect(screen.getAllByRole("link").map((l) => l.textContent)).toEqual(["Folioviv", "En savoir plus", "EN"]);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is not sticky, not fixed: it scrolls away with the page", () => {
    render(<PlatformBar label="Folioviv" brand={brand} notice={notice} />);
    const classes = screen.getByRole("region").outerHTML;
    expect(classes).not.toMatch(/\b(sticky|fixed|absolute)\b/);
  });

  it("draws only what it is given: no Explorer link, no « Se connecter », no navigation", () => {
    const { container } = render(<PlatformBar label="Folioviv" brand={brand} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(container.querySelector("nav, button")).toBeNull();
    expect(container.textContent).not.toMatch(/Explorer|Explorateur|Se connecter|Sign in|Log in/i);
  });

  it("renders no notice without one, and no dot", () => {
    const { container } = render(<PlatformBar label="Folioviv" brand={brand} />);
    expect(container.querySelector("p")).toBeNull();
  });

  it("renders on the server with no client code: static markup, no hook, no \"use client\"", () => {
    const html = renderToStaticMarkup(<PlatformBar label="Folioviv" brand={brand} notice={notice} />);
    expect(html).toContain("Boutique de démonstration.");
    const source = readFileSync(join(process.cwd(), "src/platform-bar/platform-bar.tsx"), "utf8");
    expect(source).not.toMatch(/"use client"|useState|useEffect|useRef|useId|onClick/);
  });
});
