import { ShopFrame } from "@krizaka/ui/shop";
import { demoSalon } from "@krizaka/ui/shop/demo";
import { TeamSection } from "@krizaka/ui/shop/team";

// Team · cards: first names, and the face the member chose (the default avatar otherwise — never a stock face).
export default function ShopTeamCards() {
  return (
    <ShopFrame>
      <TeamSection variant="cards" title="Your team" members={demoSalon.team.map((t, i) => ({ id: t.id, name: t.name, role: ["Colourist", "Barber", "Stylist", "Reception"][i] }))} />
    </ShopFrame>
  );
}
