import { Heatmap } from "@krizaka/charts/heatmap";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["00", "03", "06", "09", "12", "15", "18", "21"];
// A deterministic week: evenings and weekends are busier.
const cells = days.flatMap((day, d) =>
  hours.map((hour, h) => ({ day, hour: `${hour}:00`, uploads: Math.round((h >= 5 ? 40 : h >= 3 ? 22 : 6) * (d >= 5 ? 1.6 : 1) + ((d * 7 + h * 3) % 11)) })),
);

export default function UploadActivity() {
  return (
    <Heatmap
      title="Uploads by day and hour"
      description="Last 4 weeks, Montréal time"
      data={cells}
      x="hour"
      y="day"
      value="uploads"
      yCategories={days}
      xLabel="Hour"
      yLabel="Day"
      format="integer"
    />
  );
}
