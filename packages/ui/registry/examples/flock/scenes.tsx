import { Flock } from "@krizaka/ui/flock";

// The scenes: each bird does what it promises, one thing at a time and never twice the same. The owl reads a book, the
// flamingo speaks and its neighbour answers, the crane steps out and bows, the beaver taps a log, the magpie takes a
// shiny point — and the pigeon hands its parcel over, which the receiver opens in its own way.
export default function FlockScenes() {
  return (
    <Flock
      className="max-w-4xl"
      ratio={16 / 5}
      scenes
      tempo={1.4}
      birds={[
        { bird: "pigeon", x: 10, y: 96, size: 11 },
        { bird: "owl", x: 24, y: 96, size: 11 },
        { bird: "lovebird", x: 38, y: 96, size: 11 },
        { bird: "flamingo", x: 52, y: 96, size: 13 },
        { bird: "crane", x: 66, y: 96, size: 11 },
        { bird: "magpie", x: 79, y: 96, size: 11 },
        { bird: "beaver", x: 92, y: 96, size: 11 },
      ]}
    />
  );
}
