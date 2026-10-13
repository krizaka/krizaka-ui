import { createKrizakaForm } from "@krizaka/ui/native/form";
import { z } from "zod";

const audience = createKrizakaForm({
  schema: z
    .object({ audience: z.enum(["everyone", "followers", "subscribers"]), price: z.number().int().nullable(), comments: z.boolean() })
    .refine((v) => v.audience !== "subscribers" || (v.price ?? 0) >= 100, { path: ["price"], message: "audience.price.min" }),
  defaultValues: { audience: "subscribers" as "everyone" | "followers" | "subscribers", price: 499 as number | null, comments: true },
  i18n: { t: (key) => (key === "audience.price.min" ? "Subscribers pay at least $1." : undefined) },
});
const AUDIENCES = [{ value: "everyone", label: "Everyone" }, { value: "followers", label: "Followers" }, { value: "subscribers", label: "Subscribers" }];

// Who sees a video: the price only when it is for subscribers (`Watch`), comments on or off.
export default function NativeFormAudience() {
  const form = audience.useForm({ onSubmit: (values) => new Promise((done) => setTimeout(() => done(values), 400)) });
  return (
    <form.Form aria-label="Audience" style={{ width: 312 }}>
      <form.RadioGroup name="audience" label="Who can watch" options={AUDIENCES} />
      <form.Watch name="audience">{(value) => (value === "subscribers" ? <form.Money name="price" label="Price" currency="USD" /> : null)}</form.Watch>
      <form.Switch name="comments" label="Comments" hint="Viewers can comment under the video." />
      <form.Submit label="Save" />
    </form.Form>
  );
}
