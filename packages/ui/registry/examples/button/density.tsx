import { Button } from "@krizaka/ui/button";
import { Input } from "@krizaka/ui/field";

// `data-density="compact"` on an ancestor tightens every control under it (the --kz-control-* tokens): a dense
// admin toolbar next to the comfortable default.
export default function ButtonDensity() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <Input aria-label="Search the comfortable list" placeholder="Search" className="w-48" />
        <Button variant="primary">Comfortable</Button>
      </div>
      <div data-density="compact" className="flex items-center gap-2">
        <Input aria-label="Search the compact list" placeholder="Search" className="w-48" />
        <Button variant="primary">Compact</Button>
      </div>
    </div>
  );
}
