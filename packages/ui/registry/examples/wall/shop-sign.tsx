import { ShopSign } from "@krizaka/ui/wall";

export default function ShopSignExample() {
  return <div className="grid gap-8 p-8">
    <ShopSign logo="Atelier du coin" variant="enamel" rotation={-1} />
    <ShopSign logo="Encore ouvert" variant="neon" />
    <ShopSign logo="Depuis toujours" variant="painted" rotation={1} />
  </div>;
}
