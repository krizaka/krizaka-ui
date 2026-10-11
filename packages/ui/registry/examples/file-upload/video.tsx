"use client";

import { Dropzone, UploadList, useUploadQueue } from "@krizaka/ui/file-upload";

// A stand-in for your client (Tus, multipart…): it reports progress and stops when the signal aborts.
function fakeUpload(file: File, { signal, onProgress }: { signal: AbortSignal; onProgress: (sent: number) => void }) {
  return new Promise<void>((resolve) => {
    let sent = 0;
    const timer = setInterval(() => {
      sent = Math.min(file.size, sent + file.size / 40);
      onProgress(sent);
      if (sent < file.size) return;
      clearInterval(timer);
      resolve();
    }, 150);
    signal.addEventListener("abort", () => clearInterval(timer));
  });
}

export default function FileUploadVideo() {
  const queue = useUploadQueue({ upload: fakeUpload });
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Dropzone
        title="Drop your video here"
        browseLabel="Choose a video"
        hint="MP4, MOV or WebM, up to 4 GB"
        accept="video/*"
        maxSize={4 * 1024 ** 3}
        onFiles={queue.add}
        refusalLabel={(r) => `${r.file.name}: ${r.reason === "size" ? "larger than 4 GB" : "not a video"}`}
      />
      {queue.items.length > 0 && <UploadList items={queue.items} onPause={queue.pause} onResume={queue.resume} onCancel={queue.cancel} onRemove={queue.remove} onRetry={queue.retry} />}
    </div>
  );
}
