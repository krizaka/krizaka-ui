import { GeoMap } from "@krizaka/charts/geo";

const countries = [
  { code: "FR", viewers: 48_200 }, { code: "CA", viewers: 31_500 }, { code: "BE", viewers: 9_800 },
  { code: "CH", viewers: 7_400 }, { code: "MA", viewers: 12_900 }, { code: "SN", viewers: 6_100 },
  { code: "US", viewers: 15_300 }, { code: "DE", viewers: 4_200 }, { code: "TN", viewers: 5_600 },
  { code: "CI", viewers: 4_900 }, { code: "BR", viewers: 2_300 }, { code: "JP", viewers: 1_800 },
];
const cities = [
  { label: "Paris", lon: 2.35, lat: 48.86, value: 21_400 },
  { label: "Montréal", lon: -73.57, lat: 45.5, value: 17_800 },
  { label: "Casablanca", lon: -7.59, lat: 33.57, value: 6_300 },
  { label: "Dakar", lon: -17.45, lat: 14.69, value: 3_900 },
];

export default function Viewers() {
  return (
    <GeoMap
      title="Viewers by country, last 90 days"
      data={countries}
      region="code"
      value="viewers"
      points={cities}
      format="compact"
      regionLabel="Country"
      valueLabel="Viewers"
    />
  );
}
