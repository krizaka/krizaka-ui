"use client";

import { Dropzone } from "@krizaka/ui/file-upload";
import * as React from "react";

// Up to six pictures of 10 MB; each refusal says why.
export default function FileUploadImages() {
  const [names, setNames] = React.useState<string[]>([]);
  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <Dropzone
        title="Add pictures to the gallery"
        browseLabel="Choose pictures"
        hint="JPEG, PNG or WebP — up to 6 pictures of 10 MB"
        accept="image/jpeg,image/png,image/webp"
        multiple
        maxFiles={6}
        maxSize={10 * 1024 ** 2}
        onFiles={(files) => setNames(files.map((f) => f.name))}
        refusalLabel={(r) => `${r.file.name}: ${{ type: "not a JPEG, PNG or WebP", size: "larger than 10 MB", count: "more than 6 pictures" }[r.reason]}`}
      />
      {names.length > 0 && <p className="text-sm text-fg-secondary">Ready: {names.join(", ")}</p>}
    </div>
  );
}
