import { createKrizakaForm } from "@krizaka/ui/native/form";
import { z } from "zod";

const settings = createKrizakaForm({
  schema: z.object({ language: z.enum(["en", "fr", "es"]), emailDigest: z.boolean(), pushMessages: z.boolean(), quality: z.enum(["auto", "data-saver", "best"]) }),
  defaultValues: { language: "en" as "en" | "fr" | "es", emailDigest: true, pushMessages: false, quality: "auto" as "auto" | "data-saver" | "best" },
});
const LANGUAGES = [{ value: "en", label: "English" }, { value: "fr", label: "Français" }, { value: "es", label: "Español" }];
const QUALITY = [{ value: "auto", label: "Automatic" }, { value: "data-saver", label: "Data saver" }, { value: "best", label: "Best" }];

// The app's settings: the system's switches, chips for a choice — saved in one go.
export default function NativeFormSettings() {
  const form = settings.useForm({ onSubmit: (values) => new Promise((done) => setTimeout(() => done(values), 400)) });
  return (
    <form.Form aria-label="Settings" style={{ width: 312 }}>
      <form.Select name="language" label="Language" options={LANGUAGES} />
      <form.Switch name="emailDigest" label="Weekly e-mail" hint="What happened on your channel." />
      <form.Switch name="pushMessages" label="Message notifications" />
      <form.RadioGroup name="quality" label="Video quality" options={QUALITY} />
      <form.Submit label="Save the settings" />
    </form.Form>
  );
}
