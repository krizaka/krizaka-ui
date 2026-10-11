import { PriceTicker } from "@krizaka/charts/ticker";

// The auction has just opened: the opening price, the reserve ahead.
export default function NoBidYet() {
  return <PriceTicker title="Studio session, one hour" bids={[]} opening={40_00} openedAt="2026-10-11T18:00:00Z" currency="USD" reserve={90_00} height={180} />;
}
