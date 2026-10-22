import { Elephant } from "@krizaka/ui/elephant";

// Standing, then flying: the ear folded down, then spread like a wing.
export default function ElephantPoses() {
  return (
    <div className="flex items-end gap-8">
      <Elephant size={96} title="An elephant, standing" />
      <Elephant size={96} pose="flying" title="An elephant, flying" />
    </div>
  );
}
