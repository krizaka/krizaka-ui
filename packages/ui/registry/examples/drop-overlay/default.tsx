import { DropOverlay } from "@krizaka/ui/drop-overlay";
import * as React from "react";

// Drag a file over the window: the overlay says where to drop, the files go to onFiles. The page keeps a real file input
// behind its primary action (the keyboard, a phone) — no dashed box in the page.
export default function DropOverlayExample() {
  const [names, setNames] = React.useState<string[]>([]);
  return (
    <div className="flex min-h-40 w-full flex-col items-start gap-3">
      <DropOverlay label="Déposez pour vérifier" hint="PDF ou texte" accept={[".pdf", ".txt"]} onFiles={(accepted) => setNames(accepted.map((file) => file.name))} />
      <label className="cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-semibold text-on-accent">
        Vérifier un document
        <input type="file" className="sr-only" multiple accept=".pdf,.txt" onChange={(event) => setNames(Array.from(event.target.files ?? []).map((file) => file.name))} />
      </label>
      <p className="text-sm text-fg-secondary">{names.length > 0 ? names.join(", ") : "Glissez un fichier n'importe où sur la fenêtre."}</p>
    </div>
  );
}
