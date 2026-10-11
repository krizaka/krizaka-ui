import { Sparkline } from "@krizaka/charts/sparkline";

// p95 latency (ms) over the last 12 hours: down is good, hence `trendTone="inverse"`.
const models = [
  { name: "Chat · Mistral Large", p95: [820, 790, 805, 760, 742, 731, 720, 704, 699, 688, 690, 676] },
  { name: "Image · Flux", p95: [2_400, 2_380, 2_520, 2_610, 2_590, 2_700, 2_760, 2_810, 2_790, 2_880, 2_910, 2_950] },
  { name: "Speech · Whisper", p95: [310, 305, 312, 309, 300, 311, 306, 304, 308, 302, 307, 305] },
];

export default function TableRows() {
  return (
    <table style={{ borderCollapse: "collapse", fontSize: 13, color: "var(--kz-text-primary)" }}>
      <tbody>
        {models.map((m) => (
          <tr key={m.name} style={{ borderTop: "1px solid var(--kz-border-subtle)" }}>
            <th scope="row" style={{ padding: "8px 16px 8px 0", textAlign: "left", fontWeight: 500 }}>{m.name}</th>
            <td style={{ padding: 8 }}>
              <Sparkline title={`${m.name}, p95 latency`} data={m.p95} trendTone="inverse" width={120} height={28} format={{ style: "unit", unit: "millisecond" }} />
            </td>
            <td style={{ padding: 8, textAlign: "right" }}>{m.p95[m.p95.length - 1]} ms</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
