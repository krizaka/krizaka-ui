"use client";

import { createKrizakaForm } from "@krizaka/ui/form";
import { z } from "zod";

const report = createKrizakaForm({
  schema: z.object({ reason: z.enum(["spam", "harassment", "minor", "copyright", "other"], { message: "report.reason.required" }), details: z.string().max(500), block: z.boolean() }),
  defaultValues: { reason: "" as unknown as "spam", details: "", block: false },
  i18n: { t: (key) => (key === "report.reason.required" ? "Choose what is wrong." : undefined) },
});
const REASONS = [
  { value: "spam", label: "Spam or a scam" },
  { value: "harassment", label: "Harassment" },
  { value: "minor", label: "It may involve a minor" },
  { value: "copyright", label: "It uses my work" },
  { value: "other", label: "Something else" },
];

// A report: one reason among a few, details, and blocking the account in the same step.
export default function FormReport() {
  const form = report.useForm({ onSubmit: (values) => new Promise((done) => setTimeout(() => done(values), 400)) });
  return (
    <form.Form aria-label="Report this video" className="flex w-80 flex-col gap-4">
      <form.RadioGroup name="reason" label="What is wrong?" options={REASONS} />
      <form.TextArea name="details" label="Details" hint="Optional. What should our team look at?" rows={3} maxLength={500} />
      <form.Checkbox name="block" label="Also block this account" />
      <form.Submit variant="danger">Send the report</form.Submit>
    </form.Form>
  );
}
