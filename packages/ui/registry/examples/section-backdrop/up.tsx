import { SectionBackdrop } from "@krizaka/ui/section-backdrop";

// `direction="up"`: the tint at the bottom, for a closing call to action.
export default function SectionBackdropUp() {
  return (
    <SectionBackdrop direction="up" className="px-8 py-12">
      <p className="text-fg">Start in minutes.</p>
    </SectionBackdrop>
  );
}
