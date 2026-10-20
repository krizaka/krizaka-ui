import { AnatomyPlate } from "@krizaka/ui/anatomy-plate";
import { Button } from "@krizaka/ui/button";

// A component's anatomy: the live Button drawn large, each part numbered with the reason it is there.
export default function AnatomyPlateButton() {
  return (
    <AnatomyPlate
      title="Anatomy"
      subtitle="to scale × 1.6"
      parts={[
        { label: "the label", note: "a verb and its object, never « Submit »." },
        { label: "the fill", note: "the ink of the pen: one primary per view." },
        { label: "the loader", note: "turns in place while it waits; the width does not jump." },
        { label: "the focus", note: "2 px of the ring, 2 px away, always visible." },
      ]}
    >
      <Button>Publish the release</Button>
    </AnatomyPlate>
  );
}
