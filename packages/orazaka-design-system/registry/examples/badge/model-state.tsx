import { Badge } from "@krizaka/orazaka-design-system";

// A model's state in the console: `tone`, never the deprecated `variant`.
export default function ModelState() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge tone="success" dot>
        Local · ready
      </Badge>
      <Badge tone="accent" dot pulse>
        Loading
      </Badge>
      <Badge tone="danger">Failed</Badge>
    </div>
  );
}
