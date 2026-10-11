import { Button } from "@krizaka/ui/button";

// `soft`: a tint of the accent — a second action that still carries the brand, next to a primary.
export default function ButtonSoft() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Publish</Button>
      <Button variant="soft">Schedule</Button>
    </div>
  );
}
