"use client";

import { Button } from "@krizaka/ui/button";
import { AlertDialog } from "@krizaka/ui/dialog";

// An async `onConfirm`: the button loads until it settles; the dialog closes when it resolves, stays open when it rejects.
export default function DialogAlertDestructive({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <AlertDialog
      defaultOpen={defaultOpen}
      trigger={<Button variant="danger">Delete the video</Button>}
      title="Delete this video?"
      description="Its views, comments and earnings history go with it. This cannot be undone."
      confirmLabel="Delete"
      cancelLabel="Keep it"
      tone="danger"
      onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1200))}
    />
  );
}
