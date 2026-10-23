import { PinnedNote } from "@krizaka/ui/wall";

export default function PinnedNoteExample() {
  const m = { patientNote: "Good things take time.", signature: "Sam", thanksNote: "Thanks for stopping by. See you soon!", sunnySignature: "Nour" };
  return <div className="grid gap-8 p-8 sm:grid-cols-2">
    <PinnedNote text={m.patientNote} signature={m.signature} attachment="pin" rotation={-2} />
    <PinnedNote text={m.thanksNote} signature={m.sunnySignature} attachment="tape" attachmentRotation={-6} rotation={2} />
  </div>;
}
