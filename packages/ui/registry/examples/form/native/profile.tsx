import { KrizakaQueryProvider, useMutation } from "@krizaka/query";
import { Button } from "@krizaka/ui/native";
import { createKrizakaForm } from "@krizaka/ui/native/form";
import { z } from "zod";

const profile = createKrizakaForm({
  schema: z.object({ displayName: z.string().min(2).max(40), bio: z.string().max(160), category: z.enum(["travel", "music", "science", "sport"]), links: z.array(z.object({ url: z.url() })).max(3) }),
  defaultValues: { displayName: "Elena Varga", bio: "Night skies over the Tatras.", category: "travel" as "travel" | "music" | "science" | "sport", links: [{ url: "https://elena.example" }] },
});
const CATEGORIES = [{ value: "travel", label: "Travel" }, { value: "music", label: "Music" }, { value: "science", label: "Science" }, { value: "sport", label: "Sport" }];

function ProfileForm() {
  const mutation = useMutation({ mutationFn: (values: unknown) => new Promise((done) => setTimeout(() => done(values), 400)) });
  const form = profile.useForm({ onSubmit: (values) => mutation.mutateAsync(values) });
  return (
    <form.Form aria-label="Your profile" style={{ width: 312 }}>
      <form.TextField name="displayName" label="Display name" autoComplete="name" />
      <form.TextArea name="bio" label="Bio" maxLength={160} />
      <form.RadioGroup name="category" label="Category" options={CATEGORIES} />
      <form.FieldArray name="links">
        {(links) => (
          <>
            {links.items.map((_, i) => <form.TextField key={i} name={`links[${i}].url`} label={`Link ${i + 1}`} keyboardType="url" autoCapitalize="none" />)}
            {links.items.length < 3 ? <Button label="Add a link" variant="ghost" size="sm" onPress={() => links.push({ url: "" })} /> : null}
          </>
        )}
      </form.FieldArray>
      <form.Submit label="Save the profile" />
    </form.Form>
  );
}

// A profile saved by a mutation of @krizaka/query; the list of links grows.
export default function NativeFormProfile() {
  return <KrizakaQueryProvider><ProfileForm /></KrizakaQueryProvider>;
}
