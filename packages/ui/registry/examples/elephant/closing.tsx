import { Elephant } from "@krizaka/ui/elephant";

// The closing of a chat: the small flying elephant beside one warm line, never alone and never decoration.
export default function ElephantClosing() {
  return (
    <div className="flex max-w-sm items-center gap-3 rounded-md border border-border-subtle bg-surface-1 p-4">
      <Elephant size={40} pose="flying" />
      <p className="text-body-md text-fg-primary">See you next Sunday, neighbour. The door stays open.</p>
    </div>
  );
}
