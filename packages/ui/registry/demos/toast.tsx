"use client";

import { Button } from "@krizaka/ui/button";
import { toast, Toaster } from "@krizaka/ui/toast";
import { useEffect } from "react";

// Each toaster has its own `id`: the toasts of this demo stay in this demo's toaster.
const toasterId = "tones";
const show = () => {
  toast("Draft saved", { toasterId, description: "Autosaved a moment ago." });
  toast.success("Payment received", { toasterId, description: "€12.00 from @maya." });
  toast.warning("Your balance is low", { toasterId, description: "Two tips left before a top-up." });
  toast.error("Upload failed", { toasterId, description: "The connection dropped at 64 %.", action: { label: "Retry", onClick: () => {} } });
};

/** `defaultOpen`: the toasts show at once and stay (the screenshot); otherwise the button shows them. */
export default function ToastDemo({ defaultOpen = false }: { defaultOpen?: boolean }) {
  useEffect(() => {
    if (!defaultOpen) return;
    toast.dismiss();
    show();
  }, [defaultOpen]);
  return (
    <>
      <Toaster id={toasterId} label="Notifications" closeLabel="Dismiss" position="bottom-right" expand visibleToasts={4} duration={defaultOpen ? Number.POSITIVE_INFINITY : undefined} />
      <Button variant="outline" onClick={show}>
        Show again
      </Button>
    </>
  );
}
