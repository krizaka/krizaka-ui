import { List } from "@krizaka/ui/list";

const payouts = Array.from({ length: 2_000 }, (_, i) => ({ id: `p${i}`, amount: `$${(120 + ((i * 37) % 900)).toFixed(2)}`, day: `Payout #${2_000 - i}` }));

// 2,000 payouts: only the rows in view are rendered, in a region the keyboard scrolls.
export default function ListVirtualized() {
  return (
    <List
      aria-label="Payouts"
      density="compact"
      items={payouts}
      getId={(p) => p.id}
      virtualize={{ rowHeight: 44, height: 264 }}
      row={(p) => ({ title: p.day, meta: p.amount })}
    />
  );
}
