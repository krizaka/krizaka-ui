import type { Tone } from "../core/types";

/** A status of a job: the field holding its count per period, its name, its tone, and its part in the success rate. */
export interface JobStatus {
  /** The field of the row holding the count (`"completed"`). */
  readonly key: string;
  /** Its name, passed translated (`"Completed"`). */
  readonly label: string;
  /** Its tone: the status colours (`success`, `danger`, `info`, `neutral`). */
  readonly tone: Tone;
  /** `succeeded` or `failed`: counted in the success rate. Absent: still running or waiting. */
  readonly outcome?: "succeeded" | "failed";
}

/** The four statuses of an Orazaka job, in English: pass your own (translated) `statuses`. */
export const DEFAULT_STATUSES: readonly JobStatus[] = [
  { key: "completed", label: "Completed", tone: "success", outcome: "succeeded" },
  { key: "failed", label: "Failed", tone: "danger", outcome: "failed" },
  { key: "running", label: "Running", tone: "info" },
  { key: "queued", label: "Queued", tone: "neutral" },
];
