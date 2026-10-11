import { JobThroughput } from "@krizaka/charts/native";

const days = [
  { day: "2026-10-05", completed: 1_240, failed: 38, running: 0, queued: 0 },
  { day: "2026-10-06", completed: 1_612, failed: 41, running: 0, queued: 0 },
  { day: "2026-10-07", completed: 1_505, failed: 95, running: 0, queued: 0 },
  { day: "2026-10-08", completed: 1_788, failed: 27, running: 0, queued: 0 },
  { day: "2026-10-09", completed: 1_934, failed: 33, running: 0, queued: 0 },
  { day: "2026-10-10", completed: 1_102, failed: 19, running: 0, queued: 0 },
  { day: "2026-10-11", completed: 986, failed: 12, running: 24, queued: 63 },
];

// The mobile Jobs screen: the total and the success rate first.
export default function NativeWeekOfJobs() {
  return <JobThroughput title="Jobs this week" data={days} height={160} labels={{ total: "jobs over {count} days" }} />;
}
