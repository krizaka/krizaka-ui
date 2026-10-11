import { Chart } from "@krizaka/charts/chart";

const uploads = [3, 2, 1, 1, 2, 4, 9, 18, 26, 31, 34, 37, 41, 39, 36, 38, 44, 52, 58, 61, 49, 33, 17, 8];
const hours = uploads.map((_, h) => `${String(h).padStart(2, "0")}:00`);

// Only what the option needs: polar bars and the tooltip (not all of ECharts).
const modules = async () => {
  const [{ use: register }, { BarChart }, { PolarComponent, TooltipComponent }] = await Promise.all([import("echarts/core"), import("echarts/charts"), import("echarts/components")]);
  register([BarChart, PolarComponent, TooltipComponent]);
};

export default function PolarUploads() {
  return (
    <Chart
      title="Uploads by hour of the day"
      modules={modules}
      option={(theme) => ({
        polar: { radius: ["18%", "80%"] },
        angleAxis: { type: "category", data: hours, axisLabel: { color: theme.text2, interval: 2 }, axisLine: { lineStyle: { color: theme.axis } } },
        radiusAxis: { axisLabel: { show: false }, splitLine: { lineStyle: { color: theme.grid } }, axisLine: { show: false } },
        tooltip: { trigger: "item" },
        series: [{ type: "bar", coordinateSystem: "polar", data: uploads, itemStyle: { color: theme.palette[0], borderRadius: 3 } }],
      })}
      summaryText={`Uploads by hour: quietest at 02:00 (1), busiest at 19:00 (61).`}
      table={{ columns: ["Hour", "Uploads"], rows: hours.map((h, i) => [h, String(uploads[i])]) }}
      items={uploads.map((u, i) => ({ seriesIndex: 0, dataIndex: i, text: `${hours[i]}: ${u}` }))}
      height={340}
    />
  );
}
