import { LineChart } from "@krizaka/charts/line";

const series = [{ key: "views", label: "Views" }] as const;

export default function States() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <LineChart title="Views (loading)" data={[]} x="day" series={series} height={140} loading />
      <LineChart title="Views (no data yet)" data={[]} x="day" series={series} height={140} />
      <LineChart title="Views (failed)" data={[]} x="day" series={series} height={140} error />
    </div>
  );
}
