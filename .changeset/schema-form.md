---
"@krizaka/ui": minor
---

New `@krizaka/ui/schema-form` (`SchemaForm`, web, beta; krizaka/krizaka-ui#527), extracted from Orazaka's `RunForm` / `useInputSchema`: a form drawn from a JSON Schema. Its pure parts are exported too (`fieldsFromSchema`, `checkValues`, `payloadOf`). Types become `Input`, `Select`, `Textarea`, `Switch`, `MoneyInput` (integer cents, `x-money`) and a date; `required`, `minimum`/`maximum`, lengths, `pattern` and `maxItems` are checked (shown after the field is left or on submit, the first failing field takes focus); `x-i18n` gives the title, help, placeholder and option labels by language; `x-advanced` fields fold under « more options »; `renderField` keeps the host's own fields (uploads, pickers); `submitting` blocks the fields. Words are props.
