import { Signature } from "@krizaka/ui/signature";

// The mark alone, then the name alone.
export default function SignatureVariants() {
  return (
    <div className="flex flex-wrap items-center gap-10 p-4">
      <Signature variant="stamp" />
      <Signature variant="script" />
    </div>
  );
}
