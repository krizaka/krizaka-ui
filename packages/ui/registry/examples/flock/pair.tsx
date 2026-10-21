import { Flock } from "@krizaka/ui/flock";

// Two birds, no delivery: they look at each other now and then; one looks up when you come near.
export default function FlockPair() {
  return (
    <Flock
      className="max-w-sm"
      ratio={1.6}
      courier={false}
      birds={[
        { bird: "owl", x: 35, y: 94, size: 30 },
        { bird: "duck", x: 65, y: 94, size: 30 },
      ]}
    />
  );
}
