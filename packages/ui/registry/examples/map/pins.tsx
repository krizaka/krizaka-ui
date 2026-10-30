import { MapPin, type MapPinShape, type MapPinState } from "@krizaka/ui/map";

const SHAPES: MapPinShape[] = ["drop", "disc", "tag"];
const STATES: MapPinState[] = ["default", "selected", "visited", "closed"];

// The pins of a map, in their three shapes and four states: the state is said by shape too (hollow = visited,
// dashed = closed, larger = selected), so it never rests on colour alone.
export default function MapPins() {
  return (
    <div className="grid w-full max-w-xl grid-cols-[auto_repeat(4,1fr)] items-end gap-x-6 gap-y-5 rounded-xl border border-border-subtle bg-surface-1 p-5 text-xs text-fg-secondary">
      <span />
      {STATES.map((state) => (
        <span key={state}>{state}</span>
      ))}
      {SHAPES.map((shape) => (
        <div key={shape} className="contents">
          <span>{shape}</span>
          {STATES.map((state) => (
            <span key={state} className="flex h-12 items-end">
              <MapPin shape={shape} state={state} size={26} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
