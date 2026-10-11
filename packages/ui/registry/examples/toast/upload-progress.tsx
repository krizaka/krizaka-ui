"use client";

import { Button } from "@krizaka/ui/button";
import { progressToast, Toaster } from "@krizaka/ui/toast";
import { useEffect } from "react";

const toasterId = "upload";
// One toast updated in place as the upload advances (same `id`), turning into a success at 100 %.
const upload = (start = 0.1, step = 0.18, until = 1) => {
  let value = start;
  const id = progressToast("Uploading “Night walk.mp4”", { toasterId, value, doneMessage: "Video uploaded" });
  const timer = setInterval(() => {
    value = Math.min(until, value + step);
    progressToast("Uploading “Night walk.mp4”", { toasterId, id, value, doneMessage: "Video uploaded" });
    if (value >= until) clearInterval(timer);
  }, 800);
};

export default function ToastUploadProgress({ defaultOpen = false }: { defaultOpen?: boolean }) {
  useEffect(() => {
    if (defaultOpen) progressToast("Uploading “Night walk.mp4”", { toasterId, value: 0.64, description: "About 40 s left" });
  }, [defaultOpen]);
  return (
    <>
      <Toaster id={toasterId} label="Notifications" closeLabel="Dismiss" />
      <Button variant="outline" onClick={() => upload()}>
        Upload a video
      </Button>
    </>
  );
}
