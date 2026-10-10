import { cn } from "@krizaka/ui/cn";

export default function CnMerge({ selected = true }: { selected?: boolean }) {
  return (
    <p className={cn("rounded-lg border border-border-default px-3 py-2 text-sm text-fg-secondary", selected && "border-accent text-fg", "px-4")}>
      The last class wins: <code>px-4</code> replaces <code>px-3</code>, and the selected colours replace the idle ones.
    </p>
  );
}
