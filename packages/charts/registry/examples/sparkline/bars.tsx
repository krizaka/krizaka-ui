import { Sparkline } from "@krizaka/charts/sparkline";

const jobsPerHour = [12, 8, 5, 3, 2, 4, 9, 21, 38, 52, 61, 58, 64, 70, 66, 59, 63, 55, 47, 41, 33, 26, 19, 14];

export default function Bars() {
  return <Sparkline title="Jobs per hour, today" data={jobsPerHour} variant="bar" width={180} height={36} format="integer" color={2} />;
}
