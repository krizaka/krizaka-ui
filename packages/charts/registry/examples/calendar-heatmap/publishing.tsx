import { CalendarHeatmap } from "@krizaka/charts/heatmap";

// A deterministic year: a rhythm of three videos a week, a summer break, a busy autumn.
const days = Array.from({ length: 365 }, (_, i) => {
  const date = new Date(Date.UTC(2025, 9, 12 + i));
  const weekday = date.getUTCDay();
  const summer = date.getUTCMonth() === 6;
  const videos = summer ? 0 : [1, 3, 5].includes(weekday) ? 1 + ((i * 7) % 3) : (i * 13) % 9 === 0 ? 1 : 0;
  return { date: date.toISOString().slice(0, 10), videos };
}).filter((d) => d.videos > 0);

export default function Publishing() {
  return (
    <CalendarHeatmap
      title="Videos published, last 12 months"
      data={days}
      date="date"
      value="videos"
      format="integer"
      valueLabel="Videos"
    />
  );
}
