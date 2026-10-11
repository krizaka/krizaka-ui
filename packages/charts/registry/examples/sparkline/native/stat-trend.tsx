import { Sparkline } from "@krizaka/charts/native";

const views = [820, 760, 910, 880, 1_020, 990, 1_130, 1_210, 1_090, 1_340, 1_280, 1_420, 1_390, 1_510, 1_620, 1_580, 1_700, 1_640, 1_810, 1_760, 1_930, 2_040, 1_980, 2_150, 2_090, 2_260, 2_340, 2_280, 2_410, 2_520];

export default function StatTrend() {
  return <Sparkline title="Views, last 30 days" data={views} variant="area" trendTone width={160} height={40} format="integer" />;
}
