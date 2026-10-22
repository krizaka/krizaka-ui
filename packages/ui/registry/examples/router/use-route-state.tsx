import { Chip } from "@krizaka/ui/chip";
import { useRouteState } from "@krizaka/ui/router";

const TYPES = ["auto", "lease", "contract", "invoice", "other"] as const;

// The URL is the state: `?type=lease`. The default (`auto`) is never written; an unknown value reads as the default.
export default function UseRouteState() {
  const [type, setType] = useRouteState("type", { values: TYPES, default: "auto" });
  return (
    <div className="grid gap-3">
      <Chip.Group type="single" required label="Document type" value={type} onValueChange={(next) => setType(next as (typeof TYPES)[number])}>
        {TYPES.map((value) => (
          <Chip key={value} value={value}>{value}</Chip>
        ))}
      </Chip.Group>
      <p className="text-sm text-fg-secondary">Type: {type}</p>
      {/* The same, with no hook in your page: <Chip.Group type="single" routeKey="type" routeValues={TYPES} …> */}
    </div>
  );
}
