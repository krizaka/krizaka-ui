import { NumberTicker } from "@krizaka/ui/number-ticker";

// Figures that climb once as they scroll into view. The server renders the final values: nothing jumps, and a reader
// who lands with them already on screen sees them still.
export default function NumberTickerStats() {
  const stats = [
    { value: 90, label: "of every support goes to the creator", format: { style: "unit", unit: "percent" } as const },
    { value: 12480, label: "creators paid this month" },
    { value: 1.2, label: "seconds to the first token", format: { maximumFractionDigits: 1 } },
  ];
  return (
    <dl className="grid gap-6 sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-1">
          <dt className="text-sm text-fg-secondary">{s.label}</dt>
          <dd className="order-first font-display text-4xl font-semibold text-fg">
            <NumberTicker value={s.value} locale="en" format={s.format} align="start" />
          </dd>
        </div>
      ))}
    </dl>
  );
}
