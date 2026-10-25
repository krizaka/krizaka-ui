import { Card } from "@krizaka/ui/card";
import { Doodle } from "@krizaka/ui/doodle";
import { Stuck } from "@krizaka/ui/stuck";

// A card held by one strip of tape, an arrow in the margin beside it (from 1360 px; hidden below).
export default function StuckCard() {
  return (
    <Stuck className="max-w-sm" hold="tape" seed="yomizaka" doodle={<Doodle kind="arrow" seed="yomizaka" top="24px" />}>
      <Card.Root className="p-5">
        <p className="m-0">Leases, contracts and invoices, read and checked.</p>
      </Card.Root>
    </Stuck>
  );
}
