import { Badge } from "@krizaka/ui/badge";
import { QueueStatus, TaskTray, UploadQueue } from "@krizaka/ui/upload-queue";

// The non-blocking tray: the user keeps browsing; it folds away from its header.
export default function TaskTrayExample() {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-xl border border-border-default">
      <TaskTray title="Vérifications" summary="1 en cours · 1 terminée" toggleLabel="Réduire" openLabel="Afficher" className="!absolute">
        <UploadQueue
          label="Vérifications"
          items={[
            { id: "a", name: "bail-2026.pdf", status: QueueStatus.Checking, statusText: "Vérification des règles…", progress: 0.4 },
            { id: "c", name: "avenant.pdf", status: QueueStatus.Done, statusText: "Terminé", result: <Badge tone="success">Conforme</Badge> },
          ]}
        />
      </TaskTray>
    </div>
  );
}
