import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Schema form",
  summary: "A form drawn from a JSON Schema: typed fields, the schema's own rules, the words of the language (`x-i18n`) and the rarely needed fields folded (`x-advanced`).",
  status: "beta",
  category: "forms",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#527", reason: "The native twin draws the same `fieldsFromSchema` on the native fields; it follows with the first phone screen that needs it." }, desktop: "web" },
  whenToUse: ["When the fields are data: a studio's input schema, a shop's setup, a product's settings described by a schema.", "When the host checks the same schema on the server."],
  whenNotToUse: [{ when: "For a form you write field by field, with its own zod schema.", use: "form" }],
  bestPractices: [
    "Pass the schema as it arrives; unknown or nested properties are left out, never guessed.",
    "`onSubmit` receives a typed payload (numbers, lists, integer cents); empty answers are left out. Re-check it on the server.",
    "Keep what is the host's own (an upload, a picker) with `renderField`: return a node for that field, `undefined` for the default.",
    "Pass `submitting` while the request runs: the fields are blocked so a second click cannot start a second run.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves through the fields in the schema's order; the fold of advanced options is a native disclosure." },
      { keys: "Enter", action: "Submits; the first failing field takes focus and its message is read." },
    ],
    notes: ["Each control is named by its label; the help and the refusal are linked by `aria-describedby`.", "A refusal is shown after the field is left, or on submit, never while the person is still typing.", "Required fields carry `aria-required` and an asterisk hidden from screen readers."],
  },
  related: ["form", "field", "money-input"],
  web: {
    imports: ["SchemaForm", "fieldsFromSchema", "checkValues", "payloadOf"],
    examples: [{ name: "default", title: "From a schema", description: "A title, a closed list, a price in cents, a bounded integer and an advanced note; the payload is shown." }],
  },
} satisfies ComponentMeta;
