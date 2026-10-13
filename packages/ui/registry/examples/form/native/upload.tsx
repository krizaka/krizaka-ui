import { createKrizakaForm } from "@krizaka/ui/native/form";
import { z } from "zod";

// What describes a video picked from the library (the picker is the app's: expo-image-picker): title, description, audience.
const upload = createKrizakaForm({
  schema: z.object({ title: z.string().min(3).max(100), description: z.string().max(2000), visibility: z.enum(["public", "followers", "private"]) }),
  defaultValues: { title: "Sunrise over Rysy", description: "", visibility: "public" as "public" | "followers" | "private" },
});
const VISIBILITY = [{ value: "public", label: "Everyone" }, { value: "followers", label: "Followers" }, { value: "private", label: "Only me" }];

// The details of an upload, then the button that publishes them with the file.
export default function NativeFormUpload() {
  const form = upload.useForm({ onSubmit: (values) => new Promise((done) => setTimeout(() => done(values), 600)) });
  return (
    <form.Form aria-label="Publish a video" style={{ width: 312 }}>
      <form.TextField name="title" label="Title" maxLength={100} />
      <form.TextArea name="description" label="Description" placeholder="What happens in it?" />
      <form.RadioGroup name="visibility" label="Who can watch" options={VISIBILITY} />
      <form.Submit label="Publish" />
    </form.Form>
  );
}
