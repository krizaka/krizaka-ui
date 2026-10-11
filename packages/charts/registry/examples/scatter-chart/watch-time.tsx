import { ScatterChart } from "@krizaka/charts/scatter";

const formats = ["Short", "Tutorial", "Documentary"] as const;
// 36 deterministic videos: longer videos are watched longer, documentaries most.
const videos = Array.from({ length: 36 }, (_, i) => {
  const format = formats[i % 3]!;
  const minutes = format === "Short" ? 1 + (i % 4) : format === "Tutorial" ? 8 + ((i * 7) % 18) : 22 + ((i * 5) % 30);
  const watched = minutes * (format === "Documentary" ? 0.62 : format === "Tutorial" ? 0.48 : 0.81) + ((i * 13) % 5) - 2;
  return { title: `Video ${i + 1}`, format, minutes, watched: Math.max(0.5, watched), views: 800 + ((i * 977) % 9_000) };
});

export default function WatchTime() {
  return (
    <ScatterChart
      title="Length and watch time"
      description="Last 36 videos · bubble area = views"
      data={videos}
      x="minutes"
      y="watched"
      size="views"
      group="format"
      name="title"
      xLabel="Length (min)"
      yLabel="Average watch (min)"
      sizeLabel="Views"
      xFormat="integer"
      yFormat={{ style: "number", options: { maximumFractionDigits: 1 } }}
      sizeFormat="compact"
    />
  );
}
