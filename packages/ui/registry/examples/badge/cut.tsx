import { Badge } from "@krizaka/ui/badge";

// `shape="cut"`: the Krizaka chamfer, like the cut buttons and cards.
export default function BadgeCut() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge shape="cut" tone="accent" dot>
        Beta
      </Badge>
      <Badge shape="cut" tone="success" dot pulse>
        Live
      </Badge>
      <Badge shape="cut">v2.5</Badge>
    </div>
  );
}
