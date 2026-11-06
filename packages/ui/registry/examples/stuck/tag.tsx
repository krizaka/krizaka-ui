import { SpecimenTag } from "@krizaka/ui/specimen-tag";
import { Stuck } from "@krizaka/ui/stuck";

// A specimen tag pinned to the page: its lean is read from its slug, so it is the same on every render.
export default function StuckTag() {
  return (
    <Stuck className="max-w-sm" hold="pin" seed="folioviv">
      <SpecimenTag code="KZ-05" title="Folioviv" status={{ label: "in development", tone: "wip" }} fields={[{ label: "for", value: "shops and salons" }]}>
        <p>Appointments and a shop window, kept simple.</p>
      </SpecimenTag>
    </Stuck>
  );
}
