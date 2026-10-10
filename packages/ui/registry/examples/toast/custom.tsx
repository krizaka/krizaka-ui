"use client";

import { Avatar } from "@krizaka/ui/avatar";
import { Button } from "@krizaka/ui/button";
import { toast, Toaster } from "@krizaka/ui/toast";
import { useEffect } from "react";

// `toast.custom`: your JSX in the platform's shell — a live notification. One `Toaster` per app, in the root layout.
const show = () =>
  toast.custom(
    () => (
      <div className="flex items-center gap-3">
        <Avatar fallback="MA" size="sm" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-fg">Maya started following you</span>
          <span className="text-xs font-normal text-fg-secondary">Just now</span>
        </div>
      </div>
    ),
    { toasterId: "custom" },
  );

export default function ToastCustom({ defaultOpen = false }: { defaultOpen?: boolean }) {
  useEffect(() => {
    if (defaultOpen) show();
  }, [defaultOpen]);
  return (
    <>
      <Toaster id="custom" label="Notifications" closeLabel="Dismiss" position="bottom-right" duration={defaultOpen ? Number.POSITIVE_INFINITY : undefined} />
      <Button variant="outline" onClick={show}>
        Show a notification
      </Button>
    </>
  );
}
