import { Stuck } from "@krizaka/ui/stuck";

const note = { background: "var(--kz-surface-1)", padding: 16, minWidth: 140 };

// The four ways a block is held: tape, a pin, photo corners, a lifted edge.
export default function StuckHolds() {
  return (
    <div className="flex flex-wrap gap-8 p-4">
      {(["tape", "pin", "corner", "glue"] as const).map((hold) => (
        <Stuck key={hold} hold={hold} seed={hold}>
          <p style={note}>{hold}</p>
        </Stuck>
      ))}
    </div>
  );
}
