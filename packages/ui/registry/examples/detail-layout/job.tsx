import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { DetailLayout } from "@krizaka/ui/detail-layout";

// Without tabs or side panel: an object's header and its content.
export default function DetailLayoutJob() {
  return (
    <DetailLayout
      className="w-full"
      back={<a href="#jobs">← Jobs</a>}
      eyebrow="Job · job-4822"
      title="Podcast transcript"
      status={<Badge tone="accent" dot>Running</Badge>}
      meta="Whisper large · started 5 min ago"
      actions={<Button size="sm" variant="danger">Cancel</Button>}
    >
      <p className="text-sm text-fg-secondary">The transcript appears here as it is written.</p>
    </DetailLayout>
  );
}
