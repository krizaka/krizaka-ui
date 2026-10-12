import { Phoenix } from "@krizaka/ui/mascots";

// The phoenix stands for a comeback — a relaunch, a recovered account: its own colours, then the product's accent.
export default function MascotPhoenix() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      <Phoenix size={112} title="The phoenix" />
      <Phoenix size={112} tone="brand" title="The phoenix in the brand's colours" />
    </div>
  );
}
