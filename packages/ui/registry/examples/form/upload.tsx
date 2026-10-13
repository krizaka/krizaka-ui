"use client";

import { createKrizakaForm } from "@krizaka/ui/form";
import { z } from "zod";

const upload = createKrizakaForm({
  schema: z.object({
    video: z.array(z.instanceof(Blob)).length(1, "upload.video.required"),
    title: z.string().min(3).max(100),
    description: z.string().max(2000),
    tags: z.array(z.string()).max(10),
    visibility: z.enum(["public", "followers", "private"]),
  }),
  defaultValues: { video: [] as Blob[], title: "", description: "", tags: [] as string[], visibility: "public" as const },
  i18n: { t: (key) => (key === "upload.video.required" ? "Choose the video to publish." : undefined) },
});
const VISIBILITY = [{ value: "public", label: "Everyone" }, { value: "followers", label: "My followers" }, { value: "private", label: "Only me" }];

// A video and what describes it: the file, a title, a description, tags and who sees it — sent once, together.
export default function FormUpload() {
  const form = upload.useForm({ onSubmit: (values) => new Promise((done) => setTimeout(() => done(values), 600)) });
  return (
    <form.Form aria-label="Publish a video" className="flex w-96 flex-col gap-4">
      <form.FileUpload name="video" label="Video" title="Drop your video here" browseLabel="Choose a file" hint="MP4 or MOV, up to 4 GB." accept="video/*" maxSize={4 * 1024 ** 3} removeLabel={(file) => `Remove ${file}`} />
      <form.TextField name="title" label="Title" maxLength={100} />
      <form.TextArea name="description" label="Description" rows={3} />
      <form.TagInput name="tags" label="Tags" max={10} hint="Up to 10, separated by commas." />
      <form.Select name="visibility" label="Who can watch" options={VISIBILITY} />
      <form.Submit>Publish</form.Submit>
    </form.Form>
  );
}
