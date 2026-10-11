import { JobThroughput } from "@krizaka/charts/throughput";

// The console, per hour and live: its own statuses, translated by the app.
const hours = [
  { hour: "2026-10-11T09:00:00Z", done: 212, rejected: 4, waiting: 9 },
  { hour: "2026-10-11T10:00:00Z", done: 268, rejected: 7, waiting: 14 },
  { hour: "2026-10-11T11:00:00Z", done: 301, rejected: 22, waiting: 31 },
  { hour: "2026-10-11T12:00:00Z", done: 244, rejected: 5, waiting: 12 },
  { hour: "2026-10-11T13:00:00Z", done: 190, rejected: 3, waiting: 40 },
];

export default function LiveHours() {
  return (
    <JobThroughput
      title="Requests per hour"
      data={hours}
      x="hour"
      period="time"
      live
      statuses={[
        { key: "done", label: "Done", tone: "success", outcome: "succeeded" },
        { key: "rejected", label: "Rejected", tone: "danger", outcome: "failed" },
        { key: "waiting", label: "Waiting", tone: "neutral" },
      ]}
      labels={{ total: "requests over {count} hours" }}
    />
  );
}
