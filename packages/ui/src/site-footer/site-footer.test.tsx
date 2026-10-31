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


// The organisation's facts as `@krizaka/org` publishes them (the part the footer and the bar read).
const org = {
  brand: { name: "Krizaka" },
  footer: {
    line: { fr: "Une entreprise de Technologies Krizaka · Fait à Montréal", en: "A Technologies Krizaka company · Made in Montréal" },
    legal: [
      { id: "privacy", label: { fr: "Confidentialité", en: "Privacy" }, url: { fr: "https://www.krizaka.com/fr/privacy", en: "https://www.krizaka.com/en/privacy" } },
      { id: "terms", label: { fr: "Conditions", en: "Terms" }, url: { fr: "https://www.krizaka.com/fr/terms", en: "https://www.krizaka.com/en/terms" } },
    ],
  },
};

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
    // Compact (krizaka/krizaka-internal#754): at most three lines — the site's links, the family, the signature line.
    expect(footer.firstElementChild!.children).toHaveLength(3);
  });

  it("the company's pages open in the reader's language", () => {
    render(<Footer labels={familyLabels.fr} />);
    const company = screen.getByRole("list", { name: "Krizaka" });
    expect(within(company).getByRole("link", { name: "Notre histoire" }).getAttribute("href")).toBe("https://www.krizaka.com/fr/story");
    expect(within(company).getByRole("link", { name: "Nous écrire" }).getAttribute("href")).toBe("https://www.krizaka.com/fr/contact");
  });

  it("marks the current site in words, and lists names only (the statuses live in the switcher and the product pages)", () => {
    render(<Footer />);
    const family = screen.getByRole("navigation", { name: "Krizaka family" });
    const current = within(family).getByRole("link", { name: /Orazaka/ });
    expect(current.getAttribute("aria-current")).toBe("true");
    expect(current.textContent).toContain("You are here");
    expect(within(family).getByRole("link", { name: /Yomizaka/ }).textContent).toBe("Yomizaka");
    expect(within(family).getByRole("link", { name: /Akinaza/ }).textContent).toBe("Akinaza");
  });

  it("renders the site's own columns, the signature by kind, the version and Montréal", () => {
    render(<Footer />);
    expect(screen.getByRole("list", { name: "Orazaka" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "How it works" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: /A Krizaka product/ }).getAttribute("href")).toBe("https://www.krizaka.com");
    expect(screen.getByText("DEV · v1.2.3")).toBeTruthy();
    expect(screen.getByRole("link", { name: "A Krizaka product · Made in Montréal" })).toBeTruthy();
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
    expect(screen.getByRole("link", { name: "Un projet open source de Krizaka · Fait à Montréal" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Confidentialité" })).toBeTruthy();
  });

  it("shows the family by default on krizaka.com only (founder rule: links to the other sites live there)", () => {
    const { unmount } = render(<SiteFooter current="orazaka" />);
    expect(screen.queryByRole("navigation", { name: "Krizaka family" })).toBeNull();
    unmount();
    render(<SiteFooter current="krizaka" />);
    expect(screen.getByRole("navigation", { name: "Krizaka family" })).toBeTruthy();
  });

  it("with family={false} holds no family column and no link to another site, only the publisher line", async () => {
    const { container } = render(<Footer family={false} legal={<SiteFooter.Link href="#privacy">Privacy</SiteFooter.Link>} />);
    expect(screen.queryByRole("navigation", { name: "Krizaka family" })).toBeNull();
    expect(screen.getByRole("list", { name: "Orazaka" })).toBeTruthy();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const other of ["ui.krizaka", "java.krizaka", "github.com"]) {
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
      <SiteFooter current="akinaza" family={false}>
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
      <SiteFooter current="akinaza" family={false}>
        <SiteFooter.Column title="Akinaza">
          {false}
          <SiteFooter.Link href="#privacy">Privacy</SiteFooter.Link>
          {null}
        </SiteFooter.Column>
      </SiteFooter>,
    );
    expect(within(screen.getByRole("list", { name: "Akinaza" })).getAllByRole("listitem")).toHaveLength(1);
  });

  it("the site's own groups sit inline on one wrapping line, never in stacked columns (« des footers de 10 lignes », #754)", () => {
    const { container } = render(<Footer family={false} />);
    const group = container.querySelector("footer ul")!.parentElement!;
    const row = group.parentElement!;
    expect(row.className).toMatch(/flex-wrap/);
    expect(group.className).toMatch(/inline-flex/);
    expect(container.querySelector("footer ul")!.className).toMatch(/flex-wrap/);
  });

  it("folds the family's groups on a phone (details/summary) and opens them as one line on a desktop", () => {
    const { container } = render(<Footer />);
    const groups = Array.from(container.querySelectorAll("nav details"));
    expect(groups.map((d) => d.querySelector("summary")!.textContent)).toEqual(["Products", "Open source", "Krizaka"]);
    for (const d of groups) {
      expect(d.hasAttribute("open")).toBe(false);
      expect(d.className).toMatch(/lg:\[&::details-content\]:\[content-visibility:visible\]/);
    }
  });

  it("reads the family's names and addresses from `org.family` when the host passes it", () => {
    const family = [
      { id: "krizaka", name: "Krizaka", group: "krizaka", status: "released", url: "https://www.krizaka.com" },
      { id: "yomizaka", name: "Yomizaka", group: "products", status: "development", url: "https://www.yomizaka.com" },
      { id: "ts", name: "Krizaka TypeScript", group: "open-source", status: "released", url: "https://ts.krizaka.com" },
      { id: "lab", name: "Krizaka Lab", group: "open-source", status: "development", url: "https://lab.krizaka.com" },
    ] as const;
    render(<SiteFooter current="motion" family org={{ ...org, family }} />);
    const nav = screen.getByRole("navigation", { name: "Krizaka family" });
    expect(within(within(nav).getByRole("list", { name: "Open source" })).getAllByRole("link").map((a) => a.textContent)).toEqual([
      "Krizaka TypeScript",
      "Krizaka Lab (You are here)",
    ]);
    expect(within(nav).queryByRole("link", { name: /Orazaka/ })).toBeNull();
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

    it("docs: the same three lines as a site (the family included, #754), one contentinfo", async () => {
      const { container } = render(<Footer variant="docs" family legal={legal} />);
      expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
      expect(screen.getByRole("list", { name: "Orazaka" })).toBeTruthy();
      expect(screen.getByRole("navigation", { name: "Krizaka family" })).toBeTruthy();
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

  it("an opted-in site lists the family; without it only the link back to krizaka.com remains", () => {
    const { unmount } = render(<SiteFooter current="ui" family />);
    expect(screen.getAllByRole("navigation", { name: "Krizaka family" })).toHaveLength(1);
    unmount();
    render(<SiteFooter current="ui" />);
    expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["https://www.krizaka.com"]);
  });

  it("filters the hub's Products column with `products` (the focus products), the current site always kept", () => {
    render(<SiteFooter current="krizaka" products={["orazaka", "yomizaka"]} />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.some((h) => h.includes("orazaka"))).toBe(true);
    expect(hrefs.some((h) => h.includes("yomizaka"))).toBe(true);
  });

  describe("with the organisation's facts (@krizaka/org)", () => {
    it("writes the org line as the signature, in the language of the labels, and not the place twice", () => {
      render(<SiteFooter current="ui" labels={familyLabels.fr} org={org} />);
      const footer = screen.getByRole("contentinfo");
      expect(footer.textContent).toContain("Une entreprise de Technologies Krizaka · Fait à Montréal");
      expect(footer.textContent).not.toContain("Un projet open source de Krizaka");
      expect(footer.textContent?.match(/Fait à Montréal/g)).toHaveLength(1);
      expect(within(footer).getByRole("link", { name: /Une entreprise de Technologies Krizaka/ }).getAttribute("href")).toBe("https://www.krizaka.com");
    });

    it("links the org's legal pages when no `legal` is given, and lets an explicit `legal` win", () => {
      const { unmount } = render(<SiteFooter current="ui" labels={familyLabels.fr} org={org} />);
      expect(screen.getByRole("link", { name: "Confidentialité" }).getAttribute("href")).toBe("https://www.krizaka.com/fr/privacy");
      expect(screen.getByRole("link", { name: "Conditions" }).getAttribute("href")).toBe("https://www.krizaka.com/fr/terms");
      unmount();
      render(<SiteFooter current="ui" org={org} legal={<SiteFooter.Link href="#mine">Mine</SiteFooter.Link>} />);
      expect(screen.queryByRole("link", { name: "Privacy" })).toBeNull();
      expect(screen.getByRole("link", { name: "Mine" })).toBeTruthy();
    });

    it("keeps the English line and the slim app variant working, with no axe violation", async () => {
      const { container } = render(<SiteFooter current="orazaka" variant="app" org={org} version="1.2.3" />);
      expect(container.textContent).toContain("A Technologies Krizaka company · Made in Montréal");
      expect(container.textContent).toContain("v1.2.3");
      expect(await axeViolations(container)).toEqual([]);
    });

    it("without `org`, nothing changes: the kind's signature and the place line", () => {
      render(<SiteFooter current="ui" />);
      expect(screen.getByRole("contentinfo").textContent).toContain("A Krizaka open-source project");
      expect(screen.getByRole("contentinfo").textContent).toContain("Made in Montréal");
    });
  });
});
