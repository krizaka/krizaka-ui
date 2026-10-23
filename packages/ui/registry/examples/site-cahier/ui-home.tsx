import { CardGrid } from "@krizaka/ui/card-grid";
import { Doodle } from "@krizaka/ui/doodle";
import { GradeStamp } from "@krizaka/ui/grade-stamp";
import { LinkCard } from "@krizaka/ui/link-card";
import { Section } from "@krizaka/ui/page";
import { SiteCahier, SiteCahierHero } from "@krizaka/ui/site-cahier";

// TEMPLATE — a tool site's home, the duck's: its print taped beside the title, an arrow doodle and a grade from real data.
const coverage = { percent: 94.1, source: "Vitest coverage report, lines, 2026-10-23" };

export default function SiteCahierUiHome() {
  return (
    <SiteCahier
      site="ui"
      name="Krizaka UI"
      bird="duck"
      hue={215}
      nav={[{ href: "/installation", label: "Get started", current: true }, { href: "/components", label: "Components" }, { href: "/templates", label: "Templates" }]}
      footer={{ version: "2.0.0" }}
    >
      <SiteCahierHero
        bird="duck"
        birdCaption="Plate III · the duck builds"
        eyebrow="Open source · design system"
        title="Build every Krizaka screen from one set of pieces"
        lead="Tokens, components and templates, published once and read by every product."
        doodle={<Doodle kind="arrow" flip label="Start with the installation" />}
      >
        <GradeStamp value={Math.round((coverage.percent / 100) * 20 * 10) / 10} remark="Très bien, continue" source={coverage.source} />
      </SiteCahierHero>
      <Section id="ways-in" number="§ 1" title="Three ways in" margin paper="ruled">
        <CardGrid>
          <LinkCard href="/installation" title="Install" description="The packages, the stylesheet, the first component." />
          <LinkCard href="/components" title="Components" description="Every piece, with its examples and its rules." />
          <LinkCard href="/templates" title="Templates" description="Whole pages to copy as a starting point." />
        </CardGrid>
      </Section>
    </SiteCahier>
  );
}
