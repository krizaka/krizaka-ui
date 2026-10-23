import { familyLabels, siteById, siteGroups, sites, sitesByGroup } from "./index";

describe("sites — the Krizaka family", () => {
  it("lists every site once, with an https address and a repository on GitHub", () => {
    expect(sites.map((s) => s.id)).toEqual(["krizaka", "orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza", "ui", "java", "ts", "motion", "github"]);
    for (const site of sites) {
      expect(site.url).toMatch(/^https:\/\//);
      expect(site.repo).toMatch(/^https:\/\/github\.com\/krizaka(\/[a-z-]+)?$/);
      expect(site.host).toBe(site.url.replace("https://", ""));
    }
    expect(new Set(sites.map((s) => s.url)).size).toBe(sites.length);
  });

  it("names the family's addresses: www, www.<product>, ui., java., ts., GitHub", () => {
    expect(sites.map((s) => s.host)).toEqual([
      "www.krizaka.com",
      "www.orazaka.com",
      "www.orochia.com",
      "www.yasakia.com",
      "www.yororis.com",
      "www.yomizaka.com",
      "www.kachizaka.com",
      "www.akinaza.com",
      "ui.krizaka.com",
      "java.krizaka.com",
      "ts.krizaka.com",
      "krizaka.github.io/krizaka-motion",
      "github.com/krizaka",
    ]);
  });

  it("says each kind and status: the company, five products (Yasakia, Yororis and Yomizaka in development), open source", () => {
    expect(siteById("krizaka").kind).toBe("company");
    expect(sites.filter((s) => s.kind === "product").map((s) => s.id)).toEqual(["orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza"]);
    expect(siteById("yasakia").status).toBe("development");
    expect(siteById("yororis").status).toBe("development");
    expect(siteById("yomizaka").status).toBe("development");
    // In development, with a www site each.
    for (const id of ["kachizaka", "akinaza"] as const) {
      expect(siteById(id).status).toBe("development");
      expect(siteById(id).url).toBe(`https://www.${id}.com`);
    }
    expect(siteById("ui").kind).toBe("open-source");
    expect(siteById("java").repo).toBe("https://github.com/krizaka/krizaka-build");
    expect(siteById("ts")).toMatchObject({ kind: "open-source", status: "released", url: "https://ts.krizaka.com", repo: "https://github.com/krizaka/krizaka-ts" });
    // The motion lab: Krizaka UI's motion played live, built in the open (GitHub Pages).
    expect(siteById("motion")).toMatchObject({ kind: "open-source", group: "open-source", status: "development", url: "https://krizaka.github.io/krizaka-motion", repo: "https://github.com/krizaka/krizaka-motion" });
  });

  it("groups them in reading order: Krizaka · Products · Open source · GitHub", () => {
    expect(siteGroups).toEqual(["krizaka", "products", "open-source", "github"]);
    expect(sitesByGroup().map((g) => [g.group, g.sites.map((s) => s.id)])).toEqual([
      ["krizaka", ["krizaka"]],
      ["products", ["orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza"]],
      ["open-source", ["ui", "java", "ts", "motion"]],
      ["github", ["github"]],
    ]);
  });

  it("refuses an unknown site", () => {
    expect(() => siteById("nope" as never)).toThrow(/Unknown Krizaka site/);
  });

  it.each(["en", "fr"] as const)("writes every word of the family in %s", (locale) => {
    const t = familyLabels[locale];
    for (const site of sites) expect(t.descriptions[site.id].trim().length).toBeGreaterThan(8);
    for (const group of siteGroups) expect(t.groups[group].length).toBeGreaterThan(0);
    for (const word of [t.family, t.current, t.status.upcoming, t.status.construction, t.place, t.version, ...Object.values(t.signature)]) expect(word.trim().length).toBeGreaterThan(0);
    expect(t.place).toMatch(/Montréal/);
  });

  it("makes the product the subject of its line: no product line but Orazaka's names Orazaka (the engine, never the subject)", () => {
    for (const t of Object.values(familyLabels)) {
      for (const site of sites) {
        if (site.id === "orazaka") continue;
        expect(t.descriptions[site.id], `${site.id} must not name Orazaka`).not.toMatch(/orazaka/i);
      }
    }
    expect(familyLabels.fr.descriptions.yomizaka).toBe("Yomizaka lit vos baux, contrats et factures.");
  });

  it("keeps Orochia's line neutral and Yororis' within its lexicon (never care, therapy or a waiting list)", () => {
    for (const t of Object.values(familyLabels)) {
      expect(t.descriptions.orochia).not.toMatch(/18\+|adult|adulte|explicit|nsfw|sex/i);
      const yororis = `${t.descriptions.yororis} ${t.status.development}`;
      expect(yororis).not.toMatch(/th[ée]rap|psy|soin|care|sant[ée] mentale|mental health|clini|m[ée]dic|traitement|treatment|coach|beta|bêta|waiting list|liste d.attente|sign.?up|inscri|coming soon|bientôt/i);
    }
    expect(familyLabels.en.status.construction).toBe("Under construction");
    expect(familyLabels.en.status.development).toBe("In development");
    expect(familyLabels.en.status.upcoming).toBe("Coming soon");
  });

  it("keeps Kachizaka to points (never a bet, a stake or money) and Akinaza to preparing, never filing", () => {
    for (const t of Object.values(familyLabels)) {
      expect(t.descriptions.kachizaka).not.toMatch(/\bbet|pari|mise|gambl|stake|money|argent|\$/i);
      expect(t.descriptions.akinaza).not.toMatch(/e-?fil|t[ée]l[ée]transm|transmission|file your|produire/i);
      expect(t.status.development.trim().length).toBeGreaterThan(0);
    }
  });
});
