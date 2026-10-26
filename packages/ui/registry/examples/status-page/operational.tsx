import { StatusPage } from "@krizaka/ui/status-page";

// TEMPLATE — a status page: the overall state in words and colour, each service on its line.
export default function StatusPageOperational() {
  return (
    <StatusPage
      eyebrow="Status"
      title="How things are running"
      state="operational"
      stateLabel="All systems operational"
      checked="Checked 2 min ago"
      servicesLabel="Services"
      services={[
        { id: "web", name: "krizaka.com", state: "operational", label: "Operational" },
        { id: "orazaka", name: "Orazaka", state: "operational", label: "Operational" },
        { id: "cdn", name: "Video delivery", state: "degraded", label: "Slower than usual" },
      ]}
    />
  );
}
