import { ProductLogo } from "@krizaka/ui";
import { ActionBar } from "@krizaka/ui/action-bar";
import { ArgumentCard } from "@krizaka/ui/argument-card";
import { Mascot } from "@krizaka/ui/mascots";

const talk = (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M4 5h16v11H9l-5 4V5Z" />
  </svg>
);

// A building block, compact: who (the duck in the corner: its rule is on the detail page), the trap in one line,
// the facts, one short action — and discreet icon actions.
export default function ArgumentCardBuildingBlock() {
  return (
    <ArgumentCard
      className="max-w-md"
      id="krizaka-java"
      icon={<ProductLogo id="krizaka" size={22} animated={false} />}
      title="Krizaka Java"
      meta="krizaka/krizaka-build"
      mark={<Mascot bird="duck" mood="thinking" size={40} animated={false} />}
      hook={{ label: "The trap", text: "Every service pins its own versions, and drifts." }}
      facts={[{ label: "Maven Central 0.1.0", tone: "ok" }, { label: "Gradle plugin", tone: "wip" }]}
      more={{ href: "#krizaka-java", label: "Details" }}
      actions={<ActionBar variant="icons" size="sm" label="Talk about Krizaka Java" actions={[{ href: "https://github.com/krizaka", label: "Discuss", icon: talk }]} />}
    />
  );
}
