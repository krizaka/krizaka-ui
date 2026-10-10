import { SectionBackdrop } from "@krizaka/ui/section-backdrop";

export default function SectionBackdropDemo() {
  return (
    <SectionBackdrop grid className="rounded-xl px-8 py-16">
      <h2 className="font-display text-3xl font-semibold text-fg">Sovereign by design</h2>
      <p className="mt-2 max-w-md text-fg-secondary">Your models, your data, your servers.</p>
    </SectionBackdrop>
  );
}
