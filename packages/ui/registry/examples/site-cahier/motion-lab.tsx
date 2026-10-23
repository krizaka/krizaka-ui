import { Doodle } from "@krizaka/ui/doodle";
import { Section } from "@krizaka/ui/page";
import { SiteCahier, SiteCahierHero } from "@krizaka/ui/site-cahier";
import { SpeedLines } from "@krizaka/ui/speed-lines";
import { TapedPhoto } from "@krizaka/ui/taped-photo";

// TEMPLATE — the motion lab's home, the flamingo's: the hero is a live demo in speed lines, the prints below lean the other way.
export default function SiteCahierMotionLab() {
  return (
    <SiteCahier site="motion" name="Krizaka Motion" bird="flamingo" hue={335} nav={[{ href: "/primitives", label: "Primitives", current: true }, { href: "/easing", label: "Easing" }]} footer={{ version: "1.4.0" }}>
      <SiteCahierHero
        eyebrow="Open source · motion lab"
        title={<>Motion that <Doodle kind="underline">answers</Doodle></>}
        lead="Play every primitive with live knobs, then copy the code."
        aside={
          <SpeedLines kind="horizontal" count={26} style={{ minHeight: 220, minWidth: 260 }}>
            <output style={{ padding: "10px 22px", fontFamily: "var(--kz-font-mono)", background: "var(--kz-surface-1)", border: "1px solid var(--kz-border-default)" }}>ease-kz · 200 ms</output>
          </SpeedLines>
        }
      />
      <Section id="prints" number="§ 1" title="Kept in the notebook" margin paper="ruled">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
          <TapedPhoto tilt={-2} caption="The arrival of a card"><div role="img" aria-label="A card sliding into place" style={{ width: 240, aspectRatio: "4 / 3", background: "var(--kz-surface-0)" }} /></TapedPhoto>
          <TapedPhoto tilt={2.2} tape="top" caption="A number climbing"><div role="img" aria-label="A counter ticking up" style={{ width: 240, aspectRatio: "4 / 3", background: "var(--kz-surface-0)" }} /></TapedPhoto>
        </div>
      </Section>
    </SiteCahier>
  );
}
