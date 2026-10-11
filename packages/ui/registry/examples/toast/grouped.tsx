"use client";

import { Button } from "@krizaka/ui/button";
import { groupedToast, Toaster } from "@krizaka/ui/toast";
import { useEffect } from "react";

const toasterId = "grouped";
// Five messages in a row fold into one toast that counts, instead of a pile of five.
const message = () => groupedToast("messages", "New message from @maya", { toasterId, countLabel: (n) => `${n} new messages` });

export default function ToastGrouped({ defaultOpen = false }: { defaultOpen?: boolean }) {
  useEffect(() => {
    if (defaultOpen) for (let i = 0; i < 5; i++) message();
  }, [defaultOpen]);
  return (
    <>
      <Toaster id={toasterId} label="Notifications" closeLabel="Dismiss" />
      <Button variant="outline" onClick={message}>
        Receive a message
      </Button>
    </>
  );
}
