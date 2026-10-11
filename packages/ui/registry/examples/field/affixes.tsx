import { Field, Input } from "@krizaka/ui/field";
import { Kbd } from "@krizaka/ui/kbd";

// `start` / `end`: affixes inside the field — an icon, a unit, a shortcut. The focus lights the whole field.
export default function FieldAffixes() {
  return (
    <div className="grid gap-4">
      <Field.Root>
        <Field.Label htmlFor="price">Price</Field.Label>
        <Input id="price" inputMode="decimal" defaultValue="24.00" start="€" end="per month" />
      </Field.Root>
      <Field.Root>
        <Field.Label htmlFor="search-docs">Search the docs</Field.Label>
        <Input
          id="search-docs"
          type="search"
          placeholder="Components, tokens…"
          start={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          }
          end={<Kbd size="sm">⌘K</Kbd>}
        />
      </Field.Root>
    </div>
  );
}
