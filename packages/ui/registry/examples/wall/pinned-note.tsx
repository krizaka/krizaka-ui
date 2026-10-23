import { PinnedNote } from "@krizaka/ui/wall";

export default function PinnedNoteExample() {
  return <div className="grid gap-8 p-8 sm:grid-cols-2">
    <PinnedNote text="Good things take time." signature="Sam" attachment="pin" rotation={-2} />
    <PinnedNote text="Thanks for stopping by. See you soon!" signature="Nour" attachment="tape" attachmentRotation={-6} rotation={2} />
  </div>;
}
