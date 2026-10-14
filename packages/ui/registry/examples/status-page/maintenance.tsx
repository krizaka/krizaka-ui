import { Mascot } from "@krizaka/ui/mascots";
import { StatusPage } from "@krizaka/ui/status-page";

// TEMPLATE — planned maintenance: what is paused, until when, and what still works — said before the visitor wonders.
// The state is in words and colour; the pigeon waits with the message.
export default function StatusPageMaintenance() {
  return (
    <StatusPage
      eyebrow="Maintenance"
      title="Back at 06:00"
      lead="We are moving the database to a bigger machine. Nothing is lost; writes are paused."
      aside={<Mascot bird="pigeon" mood="empty" size={112} />}
      state="degraded"
      stateLabel="Planned maintenance"
      checked="Until 06:00 (Montréal)"
      servicesLabel="Services"
      services={[
        { id: "watch", name: "Watching videos", state: "operational", label: "Works" },
        { id: "unlock", name: "Unlocks and tips", state: "degraded", label: "Paused" },
        { id: "upload", name: "Uploads", state: "degraded", label: "Paused" },
      ]}
    />
  );
}
