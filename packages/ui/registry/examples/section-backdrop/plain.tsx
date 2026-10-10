import { SectionBackdrop } from "@krizaka/ui/section-backdrop";

// Without the grid nor the dome: the gradient alone, ending on the page surface.
export default function SectionBackdropPlain() {
  return (
    <SectionBackdrop dome={false} className="px-8 py-12">
      <p className="text-fg">The gradient alone, ending on the page surface.</p>
    </SectionBackdrop>
  );
}
