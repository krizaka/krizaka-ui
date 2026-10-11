import { Candlestick } from "@krizaka/charts/candlestick";

// Bids in cents per hour on an auctioned video; a deterministic walk.
let price = 12_000;
const hours = Array.from({ length: 24 }, (_, i) => {
  const open = price;
  const close = open + ((i * 37) % 23) * 60 - 480 + (i > 15 ? 900 : 0);
  const high = Math.max(open, close) + ((i * 11) % 7) * 90;
  const low = Math.min(open, close) - ((i * 5) % 6) * 70;
  price = close;
  return { at: `2026-10-11T${String(i).padStart(2, "0")}:00Z`, open, high, low, close, bids: 4 + ((i * 17) % 13) };
});

export default function AuctionBids() {
  return (
    <Candlestick
      title="“Northern lights over Tadoussac” — bids per hour"
      data={hours}
      x="at"
      xFormat="time"
      open="open"
      high="high"
      low="low"
      close="close"
      volume="bids"
      volumeFormat="integer"
      format={{ style: "money", currency: "CAD" }}
      thresholds={[{ value: 15_000, label: "Reserve price", tone: "warning" }]}
      columnLabels={{ open: "Open", high: "High", low: "Low", close: "Close", volume: "Bids" }}
    />
  );
}
