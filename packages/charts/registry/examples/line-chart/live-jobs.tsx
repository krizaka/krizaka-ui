"use client";
import { LineChart } from "@krizaka/charts/line";
import { useSlidingWindow } from "@krizaka/charts/provider";

type Minute = { at: string; completed: number };
const start: Minute[] = [18, 22, 19, 25, 31, 28, 26, 33, 37, 35].map((completed, i) => ({ at: `2026-10-11T14:${String(20 + i).padStart(2, "0")}Z`, completed }));

export default function LiveJobs() {
  // The last 10 minutes; in an app, `push` is called by a server-sent event.
  const { data, push } = useSlidingWindow<Minute>(10, start);
  const next = () => {
    const last = new Date(data[data.length - 1]!.at);
    push({ at: new Date(last.getTime() + 60_000).toISOString(), completed: 20 + ((data.length * 7) % 19) });
  };
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <LineChart title="Jobs completed per minute" data={data} x="at" xFormat="time" y="completed" yLabel="Jobs" format="integer" live dots />
      <button type="button" onClick={next} style={{ justifySelf: "start", padding: "4px 10px", borderRadius: 8, border: "1px solid var(--kz-border-default)", background: "var(--kz-surface-2)", color: "var(--kz-text-primary)" }}>
        Next minute
      </button>
    </div>
  );
}
