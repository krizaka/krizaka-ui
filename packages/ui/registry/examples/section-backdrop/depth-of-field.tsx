import { SectionBackdrop } from "@krizaka/ui/section-backdrop";

// `media`: a foreground blurred for depth of field, decorative, behind the content.
export default function SectionBackdropDepthOfField() {
  return (
    <SectionBackdrop
      className="px-8 py-16"
      media={<div className="absolute -bottom-10 left-6 h-40 w-40 rounded-xl border border-border-strong bg-accent-soft" />}
    >
      <p className="text-xl font-semibold text-fg">Depth of field</p>
    </SectionBackdrop>
  );
}
