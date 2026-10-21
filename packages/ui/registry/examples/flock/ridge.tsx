import { Flock } from "@krizaka/ui/flock";

// The five of the story on a ridge: the falcon watches, the owl reads, the duck builds, the flamingo answers and the
// pigeon delivers. Places are percents of the stage, so they hold at any width.
export default function FlockRidge() {
  return (
    <Flock
      className="max-w-3xl"
      ratio={16 / 6}
      birds={[
        { bird: "falcon", x: 20, y: 96, size: 13 },
        { bird: "owl", x: 35, y: 96, size: 13 },
        { bird: "duck", x: 50, y: 96, size: 13 },
        { bird: "flamingo", x: 65, y: 96, size: 13 },
        { bird: "pigeon", x: 80, y: 96, size: 13 },
      ]}
    />
  );
}
