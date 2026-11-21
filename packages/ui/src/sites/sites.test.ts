import { familyLabels, type OrgFacts, orgFamilyLabels, siteById, siteGroups, sites, sitesByGroup } from "./index";

describe("sites — the Krizaka family", () => {
  it("lists every site once, with an https address and a repository on GitHub", () => {
    expect(sites.map((s) => s.id)).toEqual(["krizaka", "blog", "sovkora", "verikora", "folioviv", "kridoc", "ui", "java", "ts", "rust", "motion", "github"]);
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
      "blog.krizaka.com",
      "www.sovkora.com",
      "www.verikora.com",
      "www.folioviv.com",
      "www.kridoc.com",
      "ui.krizaka.com",
      "java.krizaka.com",
      "ts.krizaka.com",
      "rust.krizaka.com",
      "lab.krizaka.com",
      "github.com/krizaka",
    ]);
  });

  it("says each kind and status: the company, the three products in focus (Verikora and Folioviv in development), open source", () => {
    expect(siteById("krizaka").kind).toBe("company");
    expect(sites.filter((s) => s.kind === "product").map((s) => s.id)).toEqual(["sovkora", "verikora", "folioviv", "kridoc"]);
    // In development, with a www site each.
    for (const id of ["verikora", "folioviv"] as const) {
      expect(siteById(id).status).toBe("development");
      expect(siteById(id).url).toBe(`https://www.${id}.com`);
    }
    expect(siteById("ui").kind).toBe("open-source");
    expect(siteById("java").repo).toBe("https://github.com/krizaka/krizaka-java");
    // Its full name, never « Krizaka TS » (#585).
    expect(siteById("ts")).toMatchObject({ name: "Krizaka TypeScript", kind: "open-source", status: "development", url: "https://ts.krizaka.com", repo: "https://github.com/krizaka/krizaka-ts" });
    // The family lab: Krizaka UI's motion played live, built in the open, served at lab.krizaka.com.
    expect(siteById("motion")).toMatchObject({ kind: "open-source", group: "open-source", status: "development", url: "https://lab.krizaka.com", repo: "https://github.com/krizaka/krizaka-lab" });
  });

  it("groups them in reading order: Krizaka · Products · Open source · GitHub", () => {
    expect(siteGroups).toEqual(["krizaka", "products", "open-source", "github"]);
    expect(sitesByGroup().map((g) => [g.group, g.sites.map((s) => s.id)])).toEqual([
      ["krizaka", ["krizaka", "blog"]],
      ["products", ["sovkora", "verikora", "folioviv", "kridoc"]],
      ["open-source", ["ui", "java", "ts", "rust", "motion"]],
      ["github", ["github"]],
    ]);
  });

  it("answers to `lab`, the org's id of the lab registered here as `motion`", () => {
    expect(siteById("lab")).toBe(siteById("motion"));
  });

  it("refuses an unknown site", () => {
    expect(() => siteById("nope" as never)).toThrow(/Unknown Krizaka site/);
  });

  it.each(["en", "fr"] as const)("writes every word of the family in %s", (locale) => {
    const t = familyLabels[locale];
    for (const site of sites) expect((t.descriptions[site.id] ?? "").trim().length).toBeGreaterThan(8);
    for (const group of siteGroups) expect(t.groups[group].length).toBeGreaterThan(0);
    for (const word of [t.family, t.current, t.status.upcoming, t.status.construction, t.place, t.version, ...Object.values(t.signature)]) expect(word.trim().length).toBeGreaterThan(0);
    expect(t.place).toMatch(/Montréal/);
  });

  it("makes the product the subject of its line: no product line but Sovkora's names Sovkora (the engine, never the subject)", () => {
    for (const t of Object.values(familyLabels)) {
      for (const site of sites) {
        if (site.id === "sovkora") continue;
        expect(t.descriptions[site.id], `${site.id} must not name Sovkora`).not.toMatch(/sovkora/i);
      }
    }
    expect(familyLabels.fr.descriptions.verikora).toBe("Verikora lit vos baux, contrats et factures.");
  });

  it("says the statuses in words", () => {
    expect(familyLabels.en.status.construction).toBe("Under construction");
    expect(familyLabels.en.status.development).toBe("In development");
    expect(familyLabels.en.status.upcoming).toBe("Coming soon");
  });

  it("keeps Folioviv to preparing, never filing", () => {
    for (const t of Object.values(familyLabels)) {
      expect(t.descriptions.folioviv).not.toMatch(/e-?fil|t[ée]l[ée]transm|transmission|file your|produire/i);
      expect(t.status.development.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("orgFamilyLabels", () => {
  const org = {
    brand: { name: "Krizaka" },
    footer: { line: { fr: "Une entreprise de Technologies Krizaka · Fait à Montréal", en: "A Technologies Krizaka company · Made in Montréal" }, legal: [] },
  };

  it("takes the place line from the org and keeps every other word of the language", () => {
    const fr = orgFamilyLabels(org, "fr");
    expect(fr.place).toBe("Une entreprise de Technologies Krizaka · Fait à Montréal");
    expect(fr.groups).toEqual(familyLabels.fr.groups);
    expect(fr.lang).toBe("fr");
    expect(orgFamilyLabels(org, "en").place).toBe("A Technologies Krizaka company · Made in Montréal");
  });
});

describe("the published @krizaka/org", () => {
  it("fits OrgFacts and gives the footer line in both languages", async () => {
    const { org } = await import("@krizaka/org");
    const facts: OrgFacts = org;
    expect(orgFamilyLabels(facts, "fr").place).toBe("Une entreprise de Technologies Krizaka · Fait à Montréal");
    expect(orgFamilyLabels(facts, "en").place).toBe("A Technologies Krizaka company · Made in Montréal");
    expect(facts.footer.legal.map((l) => l.id)).toEqual(["privacy", "terms"]);
  });

  it("guard: every product and open-source entry of one column says the same status (everything is in development, founder 2026-11-01)", () => {
    for (const group of ["products", "open-source"] as const) {
      const statuses = new Set(sites.filter((x) => x.group === group).map((x) => x.status));
      expect([...statuses], `${group} column`).toEqual(["development"]);
    }
  });

  it("never names a registry the site does not publish on (#4606)", () => {
    const registries = { "Maven Central": /maven central/i, "crates.io": /crates\.io/i, npm: /\bnpm\b/i } as const;
    for (const locale of ["en", "fr"] as const) {
      for (const site of sites) {
        const line = familyLabels[locale].descriptions[site.id];
        for (const [name, pattern] of Object.entries(registries)) {
          if (pattern.test(line)) expect(site.published ?? [], `${site.id} (${locale}) says "${name}"`).toContain(name);
        }
      }
    }
  });

  it("lists where each package family is published: npm for ts and ui, nowhere yet for java and rust", () => {
    expect(siteById("ui").published).toEqual(["npm"]);
    expect(siteById("ts").published).toEqual(["npm"]);
    expect(siteById("java").published ?? []).toEqual([]);
    expect(siteById("rust").published ?? []).toEqual([]);
  });
});
