import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Form",
  summary:
    "A form = a schema (zod 4) + the package's fields, on TanStack Form v1: each error shows once the field is left and goes as soon as it is fixed, in the person's language (i18n keys, never the engine's English), a value can be checked on the server as it is typed, and the server's refusals land under their fields — web and React Native, the same schema.",
  status: "beta",
  category: "forms",
  platforms: "both",
  whenToUse: [
    "Any form that sends something: sign-up, profile, upload details, an amount, an audience, a report, settings.",
    "When the server must re-check the same rules: the schema is shared (a product keeps it in `packages/core`) and `@krizaka/ui/form/server` parses with it in a Server Action.",
    "When a value depends on the server (a username's availability): `validateAsync` on the field, debounced and aborted.",
  ],
  whenNotToUse: [
    { when: "For a single search box that filters as you type: no submit, no validation.", use: "search-field" },
    { when: "For a filter bar over a list: its state is the address, not a form.", use: "filter-bar" },
    { when: "For a setting that applies at once on its own (a theme switch): the control alone.", use: "switch" },
  ],
  bestPractices: [
    "Define the form once (`createKrizakaForm({ schema, defaultValues })`) beside the API's contract; use it in components with `form.useForm({ onSubmit })`.",
    "Name refusals with keys in the schema (`z.string().regex(re, \"signUp.username.format\")`) and give the words in `messages/*.json`; the generic ones are `form.errors.*` (required, tooShort {minimum}…).",
    "Send with a mutation of @krizaka/query (`onSubmit: (v) => mutation.mutateAsync(v)`) or a Server Action (`useFormWithAction`): a thrown `KrizakaApiError` or `{ ok: false, problem }` puts its `fields` under their fields.",
    "Never disable the submit button for an invalid form: a refused submit shows every error and focuses the first.",
    "Pick the field for the value: `DateField entry=\"parts\"` (typed) or `entry=\"wheel\"` for a memorable date (a birth date, bounded by `max`), the calendar for a date near today; `Money` stores cents; `RadioGroup` for two to five visible choices (`variant` list · cards · buttons · segmented), `Select` beyond.",
    "Need a control the package does not have? `form.Field` gives its value, setter, error and ids — never import @tanstack/* in a product.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter", action: "Sends the form from a text field (web); the keyboard's return key moves to the next field (native)." },
      { keys: "Tab", action: "Leaves a field: from then on its error shows, and goes as soon as it is fixed." },
    ],
    notes: [
      "Every control is named by its visible label; its hint and its error are in `aria-describedby`, and an invalid control has `aria-invalid`.",
      "Errors are announced (`role=\"alert\"`); a refused submit focuses the first invalid field on the web and announces the first error on native.",
      "An availability check names its wait (`checkingLabel`) and says when the value is free (`availableHint`): never by colour alone.",
      "A date of birth is three labelled boxes in the locale's order with numeric keypads and `bday` autofill, not a calendar to scroll through decades.",
    ],
  },
  related: ["field", "checkbox", "switch", "radio-group", "combobox", "date-picker", "tag-input", "file-upload", "slider"],
  web: {
    imports: ["createKrizakaForm", "useFormWithAction", "latestBirthDate", "useKrizakaField", "formMessage"],
    examples: [
      { name: "sign-up", title: "Sign-up", description: "Orochia's sign-up: a username checked as it is typed with a free one offered, an 18+ date of birth typed as day · month · year, a server refusal on its field." },
      { name: "profile", title: "Profile", description: "Saved by a mutation of @krizaka/query: categories, tags, a list of links that grows (`form.FieldArray`)." },
      { name: "upload", title: "Upload", description: "A video and what describes it — the file, a title, a description, tags, who can watch — sent together." },
      { name: "amount", title: "Amount", description: "A tip stored in cents (`Money`), typed the locale's way; presets set the field from outside." },
      { name: "audience", title: "Audience", description: "Cards to choose who watches, the price only for subscribers (`form.Watch`), a publication date." },
      { name: "settings", title: "Settings", description: "Sent by a Server Action (`useFormWithAction`): switches, a menu, a slider, a choice." },
      { name: "report", title: "Report", description: "One reason among a few, details, and blocking the account in the same step." },
    ],
  },
  native: {
    entry: "@krizaka/ui/native/form",
    imports: ["createKrizakaForm", "TextField", "DateField", "Switch", "RadioGroup", "Select", "Combobox", "Slider", "Money", "Submit", "FormError"],
    differences: [
      "Import `createKrizakaForm` from `@krizaka/ui/native/form`: the same definition (schema, defaults, i18n), the same `useForm`, `form.*` fields drawn with the native ones.",
      "`form.Form` is a View; `form.Submit` takes `label` and announces the first error of a refused submit (no focus to move).",
      "`DateField` is three wheels by default (`entry=\"parts\"`: typed day · month · year); `RadioGroup` has the native looks (`variant` list · cards · buttons · segmented); `Select` and `Combobox` open a `Sheet`; `Switch` is a settings row drawn by the theme; `Slider` floats its value; `Money` uses the decimal keypad. Each control plays its haptic when the app passes `haptics` to the `ThemeProvider`.",
      "No `Combobox`, `TagInput`, `FileUpload` or `Slider` field yet: a screen of its own (a picker) sets the value, or `form.Field` draws it.",
    ],
    examples: [
      { name: "sign-up", title: "Sign-up", description: "E-mail, a username checked as it is typed, the 18+ birth date as day · month · year, the terms." },
      { name: "profile", title: "Profile", description: "Saved by a mutation of @krizaka/query; a category as chips, the list of links grows." },
      { name: "upload", title: "Upload details", description: "Title, description and audience of a video picked from the library." },
      { name: "amount", title: "Amount", description: "A tip in cents on the decimal keypad, typed the French way; presets set the field." },
      { name: "audience", title: "Audience", description: "The price only when the video is for subscribers; comments on or off." },
      { name: "settings", title: "Settings", description: "The system's switches and chips for a choice, saved in one go." },
    ],
  },
} satisfies ComponentMeta;
