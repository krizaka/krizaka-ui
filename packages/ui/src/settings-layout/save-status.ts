import * as React from "react";

/** Where an inline save is: nothing to say, in flight, done (for a moment), or failed. */
export const SaveStatus = { Idle: "idle", Saving: "saving", Saved: "saved", Error: "error" } as const;
export type SaveStatus = (typeof SaveStatus)[keyof typeof SaveStatus];

/** How long « Saved » stays before the section goes quiet again. */
// @fixed: an interface timing (how long a confirmation reads), not a business setting.
export const SAVED_VISIBLE_MS = 4000;

export interface SaveTracker {
  status: SaveStatus;
  /** The failure of the last try, for the message beside the button. */
  error: unknown;
  /** Runs a save: `saving`, then `saved` (back to `idle` after a moment) or `error`. Never rejects. */
  track: (save: () => Promise<unknown>) => Promise<boolean>;
  /** Clears the status (the form was edited again, or the save was undone). */
  reset: () => void;
}

/** The status of one section's save. Feed it to `SettingsSection`'s `save.status`. */
export function useSaveStatus(): SaveTracker {
  const [status, setStatus] = React.useState<SaveStatus>(SaveStatus.Idle);
  const [error, setError] = React.useState<unknown>(undefined);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clear = React.useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = undefined;
  }, []);
  React.useEffect(() => clear, [clear]);
  const reset = React.useCallback(() => {
    clear();
    setStatus(SaveStatus.Idle);
    setError(undefined);
  }, [clear]);
  const track = React.useCallback(
    async (save: () => Promise<unknown>) => {
      clear();
      setStatus(SaveStatus.Saving);
      setError(undefined);
      try {
        await save();
        setStatus(SaveStatus.Saved);
        timer.current = setTimeout(() => setStatus(SaveStatus.Idle), SAVED_VISIBLE_MS);
        return true;
      } catch (failure) {
        setError(failure);
        setStatus(SaveStatus.Error);
        return false;
      }
    },
    [clear],
  );
  return { status, error, track, reset };
}
