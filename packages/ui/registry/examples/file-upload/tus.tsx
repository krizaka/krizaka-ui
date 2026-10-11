"use client";

import { Dropzone, UploadList, useUploadQueue } from "@krizaka/ui/file-upload";

// The shape of a Tus client (tus-js-client: new Upload(file, options), start(), abort()), kept out of the example.
type Resumable = { start(): void; abort(): void };
declare function createTusUpload(file: File, events: { onProgress: (sent: number) => void; onSuccess: () => void; onError: (e: Error) => void }): Resumable;

export default function FileUploadTus() {
  const queue = useUploadQueue({
    concurrency: 1,
    // `resumed`: Tus finds the offset by itself (its fingerprint); a multipart client would skip the parts sent.
    upload: (file, { signal, onProgress }) =>
      new Promise((resolve, reject) => {
        const upload = createTusUpload(file, { onProgress, onSuccess: resolve, onError: reject });
        signal.addEventListener("abort", () => upload.abort());
        upload.start();
      }),
  });
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Dropzone title="Drop documents to index" browseLabel="Choose documents" accept=".pdf,.docx,.md" multiple onFiles={queue.add} />
      <UploadList items={queue.items} onPause={queue.pause} onResume={queue.resume} onRetry={queue.retry} onCancel={queue.cancel} onRemove={queue.remove} />
    </div>
  );
}
