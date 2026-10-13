import { Badge } from "@krizaka/ui/badge";
import { DescriptionList } from "@krizaka/ui/description-list";

// A job's details, stacked: what a side panel shows.
export default function DescriptionListJobDetails() {
  return (
    <DescriptionList
      className="max-w-sm"
      items={[
        { term: "Status", details: <Badge tone="accent">Running</Badge> },
        { term: "Studio", details: "Dubbing · English, Spanish" },
        { term: "Started", details: "Oct 11, 2026, 14:02", hint: "by Elena Ruiz" },
        { term: "Credits", details: "120", hint: "estimated, charged at the end" },
      ]}
    />
  );
}
