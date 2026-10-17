import { useCallback, useEffect, useSyncExternalStore } from "react";

import type { AppConfigClient, AppConfigState } from "./client";

export type { AppConfigClient, AppConfigState, Decision } from "./client";

/** A source of "the app came back": call the callback each time, return the unsubscribe. */
export type ResumeSource = (callback: () => void) => () => void;

/** React Native: `appStateResume(AppState)` — fires when the app returns to the foreground. */
export function appStateResume(appState: {
  addEventListener(type: "change", listener: (state: string) => void): { remove(): void };
}): ResumeSource {
  return (callback) => {
    const subscription = appState.addEventListener("change", (state) => {
      if (state === "active") callback();
    });
    return () => subscription.remove();
  };
}

/** Web and desktop (a WebView): fires when the tab or window becomes visible again. */
export function visibilityResume(target: {
  addEventListener(type: "visibilitychange", listener: () => void): void;
  removeEventListener(type: "visibilitychange", listener: () => void): void;
  visibilityState: string;
}): ResumeSource {
  return (callback) => {
    const listener = () => {
      if (target.visibilityState === "visible") callback();
    };
    target.addEventListener("visibilitychange", listener);
    return () => target.removeEventListener("visibilitychange", listener);
  };
}

export interface UseAppConfig extends AppConfigState {
  /** Dismiss the soft prompt for this `latestVersion`. */
  dismissSoft(): void;
  /** Check now, ignoring the minimum interval. */
  refresh(): void;
}

/**
 * The app's version state: checks at launch, again on every `resume`, and follows the 426 that any
 * request made through `client.fetch` reports.
 */
export function useAppConfig(client: AppConfigClient, resume?: ResumeSource): UseAppConfig {
  const state = useSyncExternalStore(client.subscribe, client.getState, client.getState);
  useEffect(() => {
    void client.check({ force: true });
    return resume ? client.attach(resume) : undefined;
  }, [client, resume]);
  const dismissSoft = useCallback(() => void client.dismissSoft(), [client]);
  const refresh = useCallback(() => void client.check({ force: true }), [client]);
  return { ...state, dismissSoft, refresh };
}
