"use client";

import { createKrizakaForm, type FormActionResult } from "@krizaka/ui/form";
import { z } from "zod";

const settings = createKrizakaForm({
  schema: z.object({ language: z.enum(["en", "fr", "es"]), emailDigest: z.boolean(), pushMessages: z.boolean(), autoplayVolume: z.number().min(0).max(100), quality: z.enum(["auto", "data-saver", "best"]) }),
  defaultValues: { language: "en" as "en" | "fr" | "es", emailDigest: true, pushMessages: false, autoplayVolume: 40, quality: "auto" as "auto" | "data-saver" | "best" },
});
const LANGUAGES = [{ value: "en", label: "English" }, { value: "fr", label: "Français" }, { value: "es", label: "Español" }];
const QUALITY = [{ value: "auto", label: "Automatic" }, { value: "data-saver", label: "Data saver" }, { value: "best", label: "Best" }];
// What a Server Action answers (`"use server"` in the app): done, or a refusal the form shows.
async function saveSettings(): Promise<FormActionResult> {
  await new Promise((done) => setTimeout(done, 400));
  return { ok: true };
}

// Settings sent by a Server Action (`useFormWithAction`): switches, a menu, a slider, a choice.
export default function FormSettings() {
  const form = settings.useFormWithAction(saveSettings);
  return (
    <form.Form aria-label="Settings" className="flex w-96 flex-col gap-5">
      <form.Select name="language" label="Language" options={LANGUAGES} />
      <form.Switch name="emailDigest" label="Weekly e-mail" hint="What happened on your channel." />
      <form.Switch name="pushMessages" label="Message notifications" />
      <form.Slider name="autoplayVolume" label="Autoplay volume" step={10} formatValue={(v) => `${v} %`} />
      <form.RadioGroup name="quality" label="Video quality" options={QUALITY} orientation="horizontal" />
      <form.Submit>Save the settings</form.Submit>
    </form.Form>
  );
}
