import { Doodle } from "@krizaka/ui/doodle";
import { Section } from "@krizaka/ui/page";
import { SiteCahier, SiteCahierHero } from "@krizaka/ui/site-cahier";
import { SpecimenTag } from "@krizaka/ui/specimen-tag";
import { VersusCard } from "@krizaka/ui/versus-card";

// TEMPLATE — Java's home, the owl's: no taped print, the hero is a versus card of two releases, then the modules as tags.
const match = {
  label: "Krizaka Java 3.1 versus 3.0",
  source: "Measured by JMH and JaCoCo on the tagged builds.",
  left: { name: "3.1", bird: "owl", caption: "The release that reads", stats: [{ label: "Startup", value: 180, max: 400, display: "180 ms" }, { label: "Coverage", value: 91, display: "91 %" }] },
  right: { name: "3.0", bird: "duck", caption: "The release that builds", stats: [{ label: "Startup", value: 240, max: 400, display: "240 ms" }, { label: "Coverage", value: 86, display: "86 %" }] },
} as const;

export default function SiteCahierJavaReleases() {
  return (
    <SiteCahier site="java" name="Krizaka Java" bird="owl" hue={35} nav={[{ href: "/modules", label: "Modules" }, { href: "/guides", label: "Guides" }, { href: "/changelog", label: "Releases", current: true }]} footer={{ version: "3.1.0" }}>
      <SiteCahierHero
        eyebrow="Open source · JVM"
        title="Read the release before you upgrade"
        lead="Two versions, face to face, on figures the build measured."
        aside={<VersusCard {...match} />}
        doodle={<Doodle kind="stars" />}
      />
      <Section id="modules" number="§ 1" title="The modules" margin paper="lines">
        <SpecimenTag code="KJ-01" title="krizaka-core" status={{ label: "stable", tone: "ok" }} fields={[{ label: "reads", value: "settings, secrets" }, { label: "since", value: "1.0" }]}>
          <p>Typed settings and secrets, read once at startup.</p>
        </SpecimenTag>
      </Section>
    </SiteCahier>
  );
}
