import { PinnedNote } from "@krizaka/ui/wall";

// `paper` (a real post-it) and `action` (a link inside the note) too; `hold` (tape or pin, through Stuck), `ink` (blue, margin, hue) and `lines`: a fixed box, so a late font moves nothing.
export default function PinnedNoteExample() {
  const m = { patientNote: "Good things take time.", signature: "Sam", thanksNote: "Thanks for stopping by. See you soon!", sunnySignature: "Nour" };
  return <div className="grid gap-8 p-8 sm:grid-cols-2">
    <PinnedNote text={m.patientNote} signature={m.signature} hold="pin" ink="margin" rotation={-2} />
    <PinnedNote text={m.thanksNote} signature={m.sunnySignature} hold="tape" ink="hue" rotation={2} lines={3} />
    <PinnedNote text="Open day on Saturday" paper="butter" hold="pin" rotation={1.5} lines={2} action={<a href="#shop">See the shop</a>} />
  </div>;
}
