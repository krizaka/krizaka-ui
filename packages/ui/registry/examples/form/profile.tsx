"use client";

import { KrizakaQueryProvider, useMutation } from "@krizaka/query";
import { Button } from "@krizaka/ui/button";
import { createKrizakaForm } from "@krizaka/ui/form";
import { z } from "zod";

const profile = createKrizakaForm({
  schema: z.object({ displayName: z.string().min(2).max(40), bio: z.string().max(160), categories: z.array(z.string()).min(1).max(3), tags: z.array(z.string()).max(10), links: z.array(z.object({ url: z.url() })).max(3) }),
  defaultValues: { displayName: "Elena Varga", bio: "Night skies over the Tatras.", categories: ["travel"], tags: ["astro", "mountains"], links: [{ url: "https://elena.example" }] },
});
const CATEGORIES = [{ value: "travel", label: "Travel" }, { value: "music", label: "Music" }, { value: "science", label: "Science" }, { value: "sport", label: "Sport" }];

function ProfileForm() {
  const mutation = useMutation({ mutationFn: (values: unknown) => new Promise((done) => setTimeout(() => done(values), 400)) });
  const form = profile.useForm({ onSubmit: (values) => mutation.mutateAsync(values) });
  return (
    <form.Form aria-label="Your profile" className="flex w-96 flex-col gap-4">
      <form.TextField name="displayName" label="Display name" autoComplete="name" />
      <form.TextArea name="bio" label="Bio" rows={3} maxLength={160} hint="Up to 160 characters." />
      <form.Combobox name="categories" label="Categories" multiple options={CATEGORIES} hint="Up to three." />
      <form.TagInput name="tags" label="Tags" max={10} normalize={(t) => t.toLowerCase().replace(/^#/, "")} />
      <form.FieldArray name="links">
        {(links) => (
          <fieldset className="flex flex-col gap-2">
            <legend className="text-xs font-semibold text-fg-secondary">Links</legend>
            {links.items.map((_, i) => <form.TextField key={i} name={`links[${i}].url`} label={`Link ${i + 1}`} type="url" />)}
            {links.items.length < 3 ? <Button type="button" size="sm" variant="ghost" onClick={() => links.push({ url: "" })}>Add a link</Button> : null}
          </fieldset>
        )}
      </form.FieldArray>
      <form.Submit>Save the profile</form.Submit>
    </form.Form>
  );
}

// A profile saved by a mutation of @krizaka/query: categories, tags, a list of links that grows.
export default function FormProfile() {
  return <KrizakaQueryProvider><ProfileForm /></KrizakaQueryProvider>;
}
