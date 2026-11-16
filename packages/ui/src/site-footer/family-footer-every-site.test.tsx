import { footerFor, org } from "@krizaka/org";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { familyLabels, siteById, type SiteId } from "../sites";
import { FamilyFooter } from "./index";

// krizaka-internal#4008: one footer for every family site, all read from `@krizaka/org`.
const columnsOf = () =>
  within(screen.getByRole("navigation", { name: "Krizaka family" }))
    .getAllByRole("list")
    .map((list) => [document.getElementById(list.getAttribute("aria-labelledby")!)!.textContent, within(list).getAllByRole("link").map((a) => [a.textContent!.replace(" (You are here)", ""), a.getAttribute("href")])]);

const draw = (id: string) =>
  render(<FamilyFooter footer={footerFor(id)} current={id as SiteId} labels={familyLabels.en} sourceLabel="Source code" version="1.2.3" contact={org.contact.page} />);

describe("FamilyFooter for every site id of the org", () => {
  it("knows every site of the org", () => {
    for (const s of org.sites) expect(() => siteById(s.id as SiteId), s.id).not.toThrow();
  });

  it("draws the same family columns, legal line and accounts on every site", () => {
    let reference: ReturnType<typeof columnsOf> | undefined;
    for (const s of org.sites) {
      const { container, unmount } = draw(s.id);
      const columns = columnsOf();
      reference ??= columns;
      expect(columns, s.id).toEqual(reference);
      expect(screen.getByText(org.footer.line.en), s.id).toBeTruthy();
      for (const l of org.footer.legal) expect(screen.getByRole("link", { name: l.label.en }).getAttribute("href"), s.id).toBe(l.url.en);
      for (const a of org.links.social) expect(screen.getByRole("link", { name: a.label }).getAttribute("href"), s.id).toBe(a.url);
      expect(container.querySelectorAll("footer"), s.id).toHaveLength(1);
      unmount();
    }
  });

  it("lists Kridoc and the coming-soon products, and the company's blog and contact page, from the org", () => {
    draw("verikora");
    const columns = Object.fromEntries(columnsOf() as [string, string[][]][]);
    expect(columns.Products!.map(([name]) => name)).toEqual(expect.arrayContaining(["Kridoc", "Sovkora", "Verikora", "Folioviv"]));
    expect(columns.Krizaka).toEqual([
      ["Blog", "https://blog.krizaka.com"],
      ["Contact us", org.contact.page.en],
    ]);
  });

  it("adds the source, the licence and the version only where the org says so", () => {
    for (const s of org.sites) {
      const { unmount } = draw(s.id);
      const dev = footerFor(s.id).version;
      expect(screen.queryByText("Version")?.parentElement?.textContent ?? null, s.id).toBe(dev ? "Version v1.2.3" : null);
      expect(screen.queryByRole("link", { name: "Source code" }) !== null, s.id).toBe(footerFor(s.id).source !== null);
      unmount();
    }
  });
});
