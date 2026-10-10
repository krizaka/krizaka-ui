import { Slot, VisuallyHidden } from "@krizaka/ui/slot";

export default function SlotAsChild() {
  // Slot merges its props and classes into its only child: the link is rendered, styled by the Slot.
  return (
    <Slot className="text-sm font-semibold text-fg underline underline-offset-4">
      <a href="#docs">
        Read the docs
        <VisuallyHidden> about Slot</VisuallyHidden>
      </a>
    </Slot>
  );
}
