import { VisuallyHidden } from "@krizaka/ui/slot";

// A name for assistive technology only: the icon is seen, the words are read.
export default function SlotVisuallyHidden() {
  return (
    <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-default text-fg">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
      <VisuallyHidden>Close</VisuallyHidden>
    </button>
  );
}
