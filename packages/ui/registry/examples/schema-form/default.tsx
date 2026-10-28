"use client";

import { SchemaForm, type SchemaFormMessages } from "@krizaka/ui/schema-form";
import { useState } from "react";

const schema = {
  type: "object",
  required: ["title", "format"],
  properties: {
    title: { type: "string", maxLength: 80, "x-i18n": { en: { title: "Title", description: "Shown on the card.", placeholder: "A short title" } } },
    format: { enum: ["square", "wide"], default: "square", "x-i18n": { en: { title: "Format", options: { square: "Square", wide: "Wide" } } } },
    price: { type: "integer", "x-money": { currency: "CAD" }, "x-i18n": { en: { title: "Price" } } },
    copies: { type: "integer", minimum: 1, maximum: 10, default: 1, "x-i18n": { en: { title: "Copies" } } },
    notes: { type: "string", maxLength: 600, "x-advanced": true, "x-i18n": { en: { title: "Notes" } } },
  },
};
const messages: SchemaFormMessages = { required: "Required.", tooShort: "At least {min} characters.", tooLong: "At most {max} characters.", belowMin: "Not below {min}.", aboveMax: "Not above {max}.", notANumber: "Not a number.", badPattern: "Not in the expected form.", tooMany: "At most {max} items." };

export default function SchemaFormDefault() {
  const [sent, setSent] = useState<string>("");
  return (
    <div className="grid gap-3">
      <SchemaForm schema={schema} locale="en-CA" words={{ submit: "Create", advanced: "More options" }} messages={messages} onSubmit={(payload) => setSent(JSON.stringify(payload))} />
      {sent && <output className="text-xs text-fg-secondary">{sent}</output>}
    </div>
  );
}
