import { PriceTicker } from "@krizaka/charts/ticker";

// An Orochia auction: the bids in cents, as they arrived.
const bids = [
  { at: "2026-10-11T18:02:00Z", amount: 25_00 },
  { at: "2026-10-11T18:05:00Z", amount: 30_00 },
  { at: "2026-10-11T18:11:00Z", amount: 35_00 },
  { at: "2026-10-11T18:12:00Z", amount: 42_00 },
  { at: "2026-10-11T18:20:00Z", amount: 50_00 },
  { at: "2026-10-11T18:26:00Z", amount: 55_00 },
  { at: "2026-10-11T18:31:00Z", amount: 65_00 },
  { at: "2026-10-11T18:33:00Z", amount: 72_00 },
];

export default function AuctionRoom() {
  return <PriceTicker title="Signed first take" bids={bids} opening={20_00} openedAt="2026-10-11T18:00:00Z" currency="USD" reserve={60_00} height={220} />;
}
