import { SectionBackdrop } from "@krizaka/ui/section-backdrop";

// Two sections in a row: the first ends where the second begins.
export default function SectionBackdropSequence() {
  return (
    <div>
      <SectionBackdrop grid className="px-8 py-14">
        <p className="text-xl font-semibold text-fg">One section</p>
      </SectionBackdrop>
      <SectionBackdrop dome={false} className="px-8 py-14">
        <p className="text-xl font-semibold text-fg">The next one</p>
      </SectionBackdrop>
    </div>
  );
}
