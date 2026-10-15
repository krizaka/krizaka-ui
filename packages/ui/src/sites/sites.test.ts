import { familyLabels, siteById, siteGroups, sites, sitesByGroup } from "./index";

describe("sites — the Krizaka family", () => {
  it("lists every site once, with an https address and a repository on GitHub", () => {
    expect(sites.map((s) => s.id)).toEqual(["krizaka", "orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza", "ui", "java", "github"]);
    for (const site of sites) {
      expect(site.url).toMatch(/^https:\/\//);
      expect(site.repo).toMatch(/^https:\/\/github\.com\/krizaka(\/[a-z-]+)?$/);
      expect(site.host).toBe(site.url.replace("https://", ""));
    }
    expect(new Set(sites.map((s) => s.url)).size).toBe(sites.length);
  });

  it("names the family's addresses: www, dev.<product>, ui., java., GitHub", () => {
    expect(sites.map((s) => s.host)).toEqual([
      "www.krizaka.com",
      "dev.orazaka.com",
      "dev.orochia.com",
      "dev.yasakia.com",
      "dev.yororis.com",
      "dev.yomizaka.com",
      "github.com/krizaka/kachizaka",
      "github.com/krizaka/akinaza",
      "ui.krizaka.com",
      "java.krizaka.com",
      "github.com/krizaka",
    ]);
  });

  it("says each kind and status: the company, five products (Yasakia and Yomizaka upcoming, Yororis under construction), open source", () => {
    expect(siteById("krizaka").kind).toBe("company");
    expect(sites.filter((s) => s.kind === "product").map((s) => s.id)).toEqual(["orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza"]);
    expect(siteById("yasakia").status).toBe("upcoming");
    expect(siteById("yororis").status).toBe("construction");
    expect(siteById("yomizaka").status).toBe("upcoming");
    // In development: nothing deployed — the address is the repository, never a dead dev link.
    for (const id of ["kachizaka", "akinaza"] as const) {
      expect(siteById(id).status).toBe("development");
      expect(siteById(id).url).toBe(siteById(id).repo);
    }
    expect(siteById("ui").kind).toBe("open-source");
    expect(siteById("java").repo).toBe("https://github.com/krizaka/krizaka-build");
  });

  it("groups them in reading order: Krizaka · Products · Open source · GitHub", () => {
    expect(siteGroups).toEqual(["krizaka", "products", "open-source", "github"]);
    expect(sitesByGroup().map((g) => [g.group, g.sites.map((s) => s.id)])).toEqual([
      ["krizaka", ["krizaka"]],
      ["products", ["orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza"]],
      ["open-source", ["ui", "java"]],
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

  it("keeps Orochia's line neutral and Yororis' within its lexicon (never care, therapy or a waiting list)", () => {
    for (const t of Object.values(familyLabels)) {
      expect(t.descriptions.orochia).not.toMatch(/18\+|adult|adulte|explicit|nsfw|sex/i);
      const yororis = `${t.descriptions.yororis} ${t.status.construction}`;
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
