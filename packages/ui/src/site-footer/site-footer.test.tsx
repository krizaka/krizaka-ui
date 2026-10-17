import { render, screen, within } from "@testing-library/react";

import { familyLabels, sites } from "../sites";
import { axeViolations } from "../test/axe";
import { SiteFooter } from "./index";

function Footer(props: Partial<React.ComponentProps<typeof SiteFooter>>) {
  return (
    <SiteFooter current="orazaka" env="DEV" version="1.2.3" {...props}>
      <SiteFooter.Column title="Orazaka">
        <SiteFooter.Link href="#how" active>How it works</SiteFooter.Link>
        <SiteFooter.Link href="#docs">Docs</SiteFooter.Link>
      </SiteFooter.Column>
    </SiteFooter>
  );
}

describe("SiteFooter", () => {
  it("is a footer with the family as a named navigation, every site linked once, and no axe violation", async () => {
    const { container } = render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeTruthy();
    const family = screen.getByRole("navigation", { name: "Krizaka family" });
    const links = within(family).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(sites.map((s) => s.url));
    for (const name of ["Krizaka", "Products", "Open source", "GitHub"]) expect(within(family).getByRole("list", { name })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("marks the current site and says the statuses in words", () => {
    render(<Footer />);
    const family = screen.getByRole("navigation", { name: "Krizaka family" });
    const current = within(family).getByRole("link", { name: /Orazaka/ });
    expect(current.getAttribute("aria-current")).toBe("true");
    expect(current.textContent).toContain("You are here");
    expect(within(family).getByRole("link", { name: /Yasakia/ }).textContent).toContain("In development");
    expect(within(family).getByRole("link", { name: /Yororis/ }).textContent).toContain("Under construction");
  });

  it("renders the site's own columns, the signature by kind, the version and Montréal", () => {
    render(<Footer />);
    expect(screen.getByRole("list", { name: "Orazaka" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "How it works" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: /A Krizaka product/ }).getAttribute("href")).toBe("https://www.krizaka.com");
    expect(screen.getByText("DEV · v1.2.3")).toBeTruthy();
    expect(screen.getByText("Made in Montréal")).toBeTruthy();
  });

  it.each([
    ["krizaka", "A Krizaka company"],
    ["ui", "A Krizaka open-source project"],
  ] as const)("signs %s “%s”", (current, signature) => {
    render(<Footer current={current} version={undefined} env={undefined} />);
    expect(screen.getByRole("link", { name: new RegExp(signature) })).toBeTruthy();
    expect(screen.queryByText(/v1\.2\.3/)).toBeNull();
  });

  it("speaks French with familyLabels.fr", () => {
    render(<Footer current="ui" labels={familyLabels.fr} legal={<SiteFooter.Link href="#privacy">Confidentialité</SiteFooter.Link>} />);
    const family = screen.getByRole("navigation", { name: "Famille Krizaka" });
    expect(within(family).getByRole("list", { name: "Produits" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Un projet open source de Krizaka/ })).toBeTruthy();
    expect(screen.getByText("Fait à Montréal")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Confidentialité" })).toBeTruthy();
  });

  it("with family={false} holds no family column and no link to another site, only the publisher line", async () => {
    const { container } = render(<Footer family={false} legal={<SiteFooter.Link href="#privacy">Privacy</SiteFooter.Link>} />);
    expect(screen.queryByRole("navigation", { name: "Krizaka family" })).toBeNull();
    expect(screen.getByRole("list", { name: "Orazaka" })).toBeTruthy();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const other of ["orochia", "yasakia", "yororis", "ui.krizaka", "java.krizaka", "github.com"]) {
      expect(hrefs.filter((h) => h?.includes(other))).toEqual([]);
    }
    expect(screen.getByRole("link", { name: /A Krizaka product/ }).getAttribute("href")).toBe("https://www.krizaka.com");
    expect(screen.getByText("DEV · v1.2.3")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Privacy" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("publisher line in French", () => {
    render(<Footer family={false} labels={familyLabels.fr} />);
    expect(screen.getByRole("link", { name: /Un produit Krizaka/ }).getAttribute("href")).toBe("https://www.krizaka.com");
  });

  it("renders no column for a group with no link (empty, null or false children), and no wrapper when no group is left", () => {
    const { container } = render(
      <SiteFooter current="kachizaka" family={false}>
        <SiteFooter.Column title="Empty">{null}</SiteFooter.Column>
        <SiteFooter.Column title="Falsy">{[false, undefined]}</SiteFooter.Column>
      </SiteFooter>,
    );
    expect(screen.queryByText("Empty")).toBeNull();
    expect(screen.queryByText("Falsy")).toBeNull();
    expect(container.querySelectorAll("footer ul")).toHaveLength(0);
  });

  it("keeps a column with at least one link, and drops the falsy ones around it", () => {
    render(
      <SiteFooter current="kachizaka" family={false}>
        <SiteFooter.Column title="Kachizaka">
          {false}
          <SiteFooter.Link href="#privacy">Privacy</SiteFooter.Link>
          {null}
        </SiteFooter.Column>
      </SiteFooter>,
    );
    expect(within(screen.getByRole("list", { name: "Kachizaka" })).getAllByRole("listitem")).toHaveLength(1);
  });

  it("the site's own columns share the row (auto-fit), never a fixed 2/3-column grid that leaves empty cells", () => {
    const { container } = render(<Footer family={false} />);
    const own = container.querySelector("footer ul")!.parentElement!.parentElement!;
    expect(own.className).toContain("auto-fit");
    expect(own.className).not.toMatch(/grid-cols-2|sm:grid-cols-3/);
  });

  it("footer text uses the readable tokens only (fg / fg-secondary), never the muted or an unset colour", () => {
    const { container } = render(<Footer />);
    const cls = Array.from(container.querySelectorAll("footer, footer *")).map((e) => e.getAttribute("class") ?? "").join(" ");
    expect(cls).not.toMatch(/text-fg-muted|text-muted/);
    expect(container.querySelector("footer")!.className).toMatch(/bg-surface-0/);
    expect(container.querySelector("footer")!.className).toMatch(/text-fg\b/);
  });
});
