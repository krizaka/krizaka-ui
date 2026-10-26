---
name: krizaka-form
description: Forms in a Krizaka app (Next.js or Expo) with @krizaka/ui/form and @krizaka/ui/native/form — createKrizakaForm({ schema, defaultValues }) on a zod 4 schema shared with the server, typed fields (TextField, TextArea, Checkbox, Switch, RadioGroup, Select, Combobox, DateField, TagInput, FileUpload, Money, Slider), Submit, FormError, FieldArray, Watch, async checks (username availability), server Problem Details mapped onto fields, useFormWithAction for Server Actions. Use it instead of a hand-made <form>, useState per field, react-hook-form or a direct @tanstack/react-form import.
---

# @krizaka/ui/form · @krizaka/ui/native/form

## Rules

1. A form = a schema (zod 4) + defaults, defined once beside the API contract (`packages/core` of a product):
   `const signUp = createKrizakaForm({ schema, defaultValues })`. Web imports from `@krizaka/ui/form`, Expo from
   `@krizaka/ui/native/form` — same definition, same `useForm`.
2. Never import `@tanstack/react-form`. Need a control the package lacks? `form.Field name="x">{(f) => …}` gives value,
   setter, error and ids (`useKrizakaField`).
3. Words are keys: name refusals in the schema (`z.string().regex(re, "signUp.username.format")`), give the words in
   `messages/*.json`, pass `i18n: { t, locale }`. Generic keys are `form.errors.*` (`required`, `tooShort {minimum}`,
   `tooLong {maximum}`, `invalidEmail`, `invalidUrl`, `invalidDate`, `invalidNumber`, `tooFew`, `tooMany`, `invalid`);
   the whole-form refusals are `apiErrors.<code>` (as `KrizakaApiError.messageKey()`).
4. Send with a mutation (`onSubmit: (v) => mutation.mutateAsync(v)`) or a Server Action (`form.useFormWithAction(action)`,
   the action answers `{ ok: true, data } | { ok: false, problem }`, re-validating with `validateForm(schema, input)` of
   `@krizaka/ui/form/server`). A thrown `KrizakaApiError` lands on its `fields`; `codeFields: { UNDERAGE: "dateOfBirth" }`
   puts a code under its field; the rest shows in `<form.FormError />`.
5. Never disable Submit for an invalid form. Errors show once a field is left (or on submit) and go as soon as fixed.

## Recipes

```tsx
const form = signUp.useForm({ i18n: { t }, codeFields: { USERNAME_RESERVED: "username" }, onSubmit: (v) => register.mutateAsync(v) });
<form.Form aria-label={t("signUp.title")}>
  <form.TextField name="email" label={t("signUp.email")} type="email" autoComplete="email" />
  <form.TextField name="username" label={t("signUp.username")} availableHint={t("signUp.free")}
    validateAsync={async (u, signal) => ((await checkUsername(u, signal)).available ? null : { key: "signUp.username.taken" })} />
  <form.DateField name="dateOfBirth" label={t("signUp.birth")} entry="parts" autoComplete="bday" />   {/* 18+: z.iso.date().refine((d) => d <= latestBirthDate(18), "form.errors.UNDERAGE") */}
  <form.Checkbox name="acceptTerms" label={t("signUp.terms")} />
  <form.FormError />
  <form.Submit>{t("signUp.submit")}</form.Submit>
</form.Form>
```

- Amounts: `form.Money name="amount" currency="EUR"` stores integer cents (`z.number().int()`).
- Lists: `<form.FieldArray name="links">{(a) => a.items.map((_, i) => <form.TextField name={`links[${i}].url`} … />)}</form.FieldArray>`.
- Conditional parts: `<form.Watch name="audience">{(v) => v === "subscribers" ? <form.Money name="price" … /> : null}</form.Watch>`.
- Controls (DS5): `form.RadioGroup variant="buttons" | "segmented" | "cards"`, `form.DateField entry="wheel" max={latestBirthDate(18)}`,
  `form.Slider ticks marks={…}` (the value floats while touched). Native: `DateField` is wheels by default, `Select` /
  `Combobox` open a sheet, `Switch` is a settings row; pass `haptics` to the native `ThemeProvider` for the haptics.
- Native: `<form.Form scroll>` makes the form the screen's scrolling content above the keyboard; the return key walks the
  text fields and the last one sends; `<form.Submit label=… brand="orazaka" />` turns the product's mark while sending.
