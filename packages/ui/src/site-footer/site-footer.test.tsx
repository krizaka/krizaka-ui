import { fireEvent, render, screen, within } from "@testing-library/react";

import { companyLinks, familyLabels, sites } from "../sites";

const labelsDescription = () => familyLabels.en.descriptions.orazaka;
import { axeViolations } from "../test/axe";
import { SiteFooter } from "./index";

function Footer(props: Partial<React.ComponentProps<typeof SiteFooter>>) {
  return (
    <SiteFooter current="orazaka" family env="DEV" version="1.2.3" {...props}>
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
    // Products · Open source (GitHub closes it) · Krizaka — the company's pages; the brand's home is the signature's link.
    expect(links.map((a) => a.getAttribute("href"))).toEqual([...sites.filter((s) => s.id !== "krizaka").map((s) => s.url), ...companyLinks.map((l) => l.url.en)]);
    expect(within(family).getAllByRole("list").map((l) => l.getAttribute("aria-labelledby") && document.getElementById(l.getAttribute("aria-labelledby")!)?.textContent)).toEqual(["Products", "Open source", "Krizaka"]);
    expect(within(within(family).getByRole("list", { name: "Krizaka" })).getAllByRole("link").map((a) => a.textContent)).toEqual(["Our story", "Blog", "Contact us"]);
    expect(await axeViolations(container)).toEqual([]);
  });

  // Peer review (krizaka-ui#434): « too much, a double footer ». One band, one line, nothing twice.
  it("is one calm band: one contentinfo, no site block, no column that lists only Krizaka, no link twice", () => {
    const { container } = render(<Footer />);
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
    const footer = container.querySelector("footer")!;
    expect(footer.textContent).not.toContain(familyLabels.en.descriptions.orazaka);
    const hrefs = Array.from(footer.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(hrefs.filter((h, i) => hrefs.indexOf(h) !== i)).toEqual([]);
    for (const list of Array.from(footer.querySelectorAll("ul"))) {
      const only = Array.from(list.querySelectorAll("a")).map((a) => a.getAttribute("href"));
      expect(only).not.toEqual(["https://www.krizaka.com"]);
    }
    // The band, then the line: two children in the frame, not three bands.
    expect(footer.firstElementChild!.children).toHaveLength(2);
  });

  it("the company's pages open in the reader's language", () => {
    render(<Footer labels={familyLabels.fr} />);
    const company = screen.getByRole("list", { name: "Krizaka" });
    expect(within(company).getByRole("link", { name: "Notre histoire" }).getAttribute("href")).toBe("https://www.krizaka.com/fr/story");
    expect(within(company).getByRole("link", { name: "Nous écrire" }).getAttribute("href")).toBe("https://www.krizaka.com/fr/contact");
  });

  it("marks the current site and says the statuses in words", () => {
    render(<Footer />);
    const family = screen.getByRole("navigation", { name: "Krizaka family" });
    const current = within(family).getByRole("link", { name: /Orazaka/ });
    expect(current.getAttribute("aria-current")).toBe("true");
    expect(current.textContent).toContain("You are here");
    expect(within(family).getByRole("link", { name: /Yomizaka/ }).textContent).toContain("In development");
    expect(within(family).getByRole("link", { name: /Akinaza/ }).textContent).toContain("In development");
    for (const name of [/Orochia/, /Yasakia/, /Yororis/, /Kachizaka/]) expect(within(family).queryByRole("link", { name })).toBeNull();
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

  it("sits on the page frame's edges: --kz-page-max plus the gutters, the same formula as .kz-frame", () => {
    const { container, rerender } = render(<Footer />);
    const inner = () => container.querySelector("footer > div") as HTMLElement;
    expect(inner().className).toContain("max-w-[calc(var(--kz-page-max,72rem)_+_2*var(--kz-page-gutter,clamp(16px,3.2vw,32px)))]");
    expect(inner().className).toContain("px-[var(--kz-page-gutter,clamp(16px,3.2vw,32px))]");
    rerender(<Footer variant="docs" />);
    expect(inner().className).toContain("max-w-[calc(var(--kz-page-max-docs,88rem)_+_2*var(--kz-page-gutter,clamp(16px,3.2vw,32px)))]");
  });

  describe("variants", () => {
    const legal = <SiteFooter.Link href="#privacy">Privacy</SiteFooter.Link>;

    it("app: one slim contentinfo — the publisher line, the version and the legal links; no columns, no family, no site block", async () => {
      const { container } = render(<Footer variant="app" legal={legal} />);
      expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
      expect(screen.getByRole("link", { name: /A Krizaka product/ }).getAttribute("href")).toBe("https://www.krizaka.com");
      expect(screen.getByText("DEV · v1.2.3")).toBeTruthy();
      expect(screen.getByRole("link", { name: "Privacy" })).toBeTruthy();
      expect(screen.queryByRole("navigation")).toBeNull();
      expect(screen.queryByRole("list")).toBeNull();
      expect(screen.queryByText("Made in Montréal")).toBeNull();
      expect(await axeViolations(container)).toEqual([]);
    });

    it("app: never lists the family even when asked to", () => {
      render(<Footer variant="app" family />);
      expect(screen.queryByRole("navigation", { name: "Krizaka family" })).toBeNull();
    });

    it("docs: the site's columns without the site block, never the family, one contentinfo", async () => {
      const { container } = render(<Footer variant="docs" family legal={legal} />);
      expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
      expect(screen.getByRole("list", { name: "Orazaka" })).toBeTruthy();
      expect(screen.queryByRole("navigation", { name: "Krizaka family" })).toBeNull();
      expect(screen.queryByText(labelsDescription())).toBeNull();
      expect(screen.getByRole("link", { name: /A Krizaka product/ })).toBeTruthy();
      expect(await axeViolations(container)).toEqual([]);
    });

    it("site (default) renders exactly one contentinfo", () => {
      render(<Footer />);
      expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
    });
  });

  it("is one band: the only rule is the footer's own top edge, no hairline under the columns (a bottom bar read as a second footer)", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer")!;
    const ruled = [footer, ...footer.querySelectorAll("*")].filter((el) => /(^|\s)border-t(\s|$)/.test(el.getAttribute("class") ?? ""));
    expect(ruled).toEqual([footer]);
  });

  it("marks the company page you are on (aria-current) and a click on it scrolls to the top instead of reloading", () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
    render(<Footer current="krizaka" path="/en/story" />);
    const story = screen.getByRole("link", { name: familyLabels.en.company!.story });
    expect(story.getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: familyLabels.en.company!.contact }).getAttribute("aria-current")).toBeNull();
    expect(story.className).toMatch(/aria-\[current=page\]:font-semibold/);
    fireEvent.click(story);
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
  });

  it("marks no company page from another site (same path, other host) nor without a path", () => {
    render(<Footer current="orazaka" path="/story" />);
    expect(screen.getByRole("link", { name: familyLabels.en.company!.story }).getAttribute("aria-current")).toBeNull();
  });

  it("lists the family on the hub only: every other site links back to krizaka.com and nothing else (2026-10-22)", () => {
    const { unmount } = render(<SiteFooter current="ui" />);
    expect(screen.queryByRole("navigation", { name: /family|famille/i })).toBeNull();
    expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["https://www.krizaka.com"]);
    unmount();
    render(<SiteFooter current="krizaka" />);
    expect(screen.getAllByRole("navigation").length).toBe(1);
  });

  it("filters the hub's Products column with `products` (the focus products), the current site always kept", () => {
    render(<SiteFooter current="krizaka" products={["orazaka", "yomizaka"]} />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.some((h) => h.includes("orazaka"))).toBe(true);
    expect(hrefs.some((h) => h.includes("yomizaka"))).toBe(true);
    expect(hrefs.some((h) => h.includes("orochia"))).toBe(false);
    expect(hrefs.some((h) => h.includes("kachizaka"))).toBe(false);
  });
});
