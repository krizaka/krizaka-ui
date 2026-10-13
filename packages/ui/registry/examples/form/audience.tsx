"use client";

import { createKrizakaForm } from "@krizaka/ui/form";
import { z } from "zod";

const audience = createKrizakaForm({
  schema: z
    .object({ audience: z.enum(["everyone", "followers", "subscribers"]), price: z.number().int().nullable(), publishOn: z.iso.date().or(z.literal("")), comments: z.boolean() })
    .refine((v) => v.audience !== "subscribers" || (v.price ?? 0) >= 100, { path: ["price"], message: "audience.price.min" }),
  defaultValues: { audience: "subscribers" as "everyone" | "followers" | "subscribers", price: 499 as number | null, publishOn: "", comments: true },
  i18n: { t: (key) => (key === "audience.price.min" ? "Subscribers pay at least $1." : undefined) },
});
const AUDIENCES = [
  { value: "everyone", label: "Everyone", description: "Free, in the feed" },
  { value: "followers", label: "Followers", description: "Free, for them" },
  { value: "subscribers", label: "Subscribers", description: "Paid, once" },
];

// Who sees a video: cards to choose from, the price only when it is for subscribers, a publication date.
export default function FormAudience() {
  const form = audience.useForm({ onSubmit: (values) => new Promise((done) => setTimeout(() => done(values), 400)) });
  return (
    <form.Form aria-label="Audience" className="flex w-[28rem] max-w-full flex-col gap-4">
      <form.RadioGroup name="audience" label="Who can watch" variant="cards" options={AUDIENCES} />
      <form.Watch name="audience">{(value) => (value === "subscribers" ? <form.Money name="price" label="Price" currency="USD" /> : null)}</form.Watch>
      <form.DateField name="publishOn" label="Publish on" hint="Empty: at once." />
      <form.Switch name="comments" label="Comments" hint="Viewers can comment under the video." />
      <form.Submit>Save</form.Submit>
    </form.Form>
  );
}
