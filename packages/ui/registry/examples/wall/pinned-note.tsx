import { PinnedNote } from "@krizaka/ui/wall";

import { messages } from "./messages";

export default function PinnedNoteExample() {
  const m = messages.en;
  return <div className="grid gap-8 p-8 sm:grid-cols-2">
    <PinnedNote text={m.patientNote} signature={m.signature} attachment="pin" rotation={-2} />
    <PinnedNote text={m.thanksNote} signature={m.sunnySignature} attachment="tape" attachmentRotation={-6} rotation={2} />
  </div>;
}
