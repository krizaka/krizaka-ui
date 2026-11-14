import { Grid } from "@krizaka/ui/columns";

const stats = [
  ["Files to decide", "58"],
  ["Checks this month", "412"],
  ["Credits left", "1 240"],
  ["Average time", "3 min"],
];

// Cards of equal height: two per row in a narrow container, four in a wide one, one when the text is at 200 %.
export default function ColumnsStats() {
  return (
    <Grid columns={{ compact: 2, expanded: 4 }} minItemWidth={140}>
      {stats.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-1 rounded-lg border border-border-subtle bg-surface-1 p-3.5">
          <span className="text-xs text-fg-muted">{label}</span>
          <span className="text-title-md font-semibold text-fg">{value}</span>
        </div>
      ))}
    </Grid>
  );
}
