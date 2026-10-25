import { Badge } from "@krizaka/ui/badge";
import { QueueStatus, tally, UploadQueue } from "@krizaka/ui/upload-queue";

const ITEMS = [
  { id: "a", name: "bail-2026.pdf", status: QueueStatus.Checking, statusText: "Vérification des règles…", progress: 0.6 },
  { id: "b", name: "annexe-b.pdf", status: QueueStatus.Reading, statusText: "Lecture…" },
  { id: "c", name: "avenant.pdf", status: QueueStatus.Done, statusText: "Terminé", result: <Badge tone="warning">3 constats</Badge> },
  { id: "d", name: "scan.pdf", status: QueueStatus.Failed, statusText: "Illisible : essayez un PDF texte" },
];

// Rows appear at once, say what they do, shimmer only while they work, and end in a chip.
export default function UploadQueueExample() {
  const t = tally(ITEMS);
  return (
    <div className="w-full max-w-md">
      <p className="mb-2 text-sm text-fg-secondary">{`${t.working} en cours · ${t.done} terminé · ${t.failed} en échec`}</p>
      <UploadQueue label="Vérifications" items={ITEMS} />
    </div>
  );
}
