import { FloatingInput } from "@krizaka/ui/field";

// `FloatingInput`: the label rests in the field and rises above the value on focus or once filled (CSS only).
export default function FieldFloatingLabel() {
  return (
    <div className="grid gap-4">
      <FloatingInput id="floating-name" label="Full name" autoComplete="name" />
      <FloatingInput id="floating-email" label="Email" type="email" defaultValue="elena@studio.tn" autoComplete="email" />
    </div>
  );
}
