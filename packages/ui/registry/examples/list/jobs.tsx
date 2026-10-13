import { Badge } from "@krizaka/ui/badge";
import { List } from "@krizaka/ui/list";

type Job = { id: string; name: string; studio: string; status: "running" | "done" | "failed"; when: string };
const jobs: Job[] = [
  { id: "j1", name: "Dub “Sunset session” into English", studio: "Dubbing studio", status: "running", when: "now" },
  { id: "j2", name: "Transcribe the interview with Elena", studio: "Transcript studio", status: "done", when: "14:02" },
  { id: "j3", name: "Clip the five best moments", studio: "Clips studio", status: "failed", when: "12:15" },
];
const TONE = { running: "accent", done: "success", failed: "danger" } as const;

// Orazaka's jobs: each row opens its run; the status and the time beside it.
export default function ListJobs() {
  return (
    <List
      aria-label="Jobs"
      items={jobs}
      getId={(j) => j.id}
      chevrons
      row={(j) => ({
        title: j.name,
        description: j.studio,
        href: `#/jobs/${j.id}`,
        meta: (
          <>
            <Badge tone={TONE[j.status]}>{j.status}</Badge>
            <span>{j.when}</span>
          </>
        ),
      })}
    />
  );
}
