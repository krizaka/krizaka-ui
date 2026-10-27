import { ShopFrame } from "@krizaka/ui/shop";
import { demoSalon } from "@krizaka/ui/shop/demo";
import { TeamSection } from "@krizaka/ui/shop/team";

// Team · row: first names, and the face the member chose (the default avatar otherwise — never a stock face).
export default function ShopTeamRow() {
  return (
    <ShopFrame>
      <TeamSection variant="row" title="Your team" members={demoSalon.team.map((t, i) => ({ id: t.id, name: t.name, role: ["Colourist", "Barber", "Stylist", "Reception"][i] }))} />
    </ShopFrame>
  );
}
