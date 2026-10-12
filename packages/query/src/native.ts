/**
 * The device wiring of Query (Expo / React Native): focus follows the app state (a refetch when the app comes back),
 * online follows NetInfo (queries pause offline and resume), and `nativeQueryDefaults` reads the cache first.
 *
 * ```ts
 * import { AppState } from "react-native";
 * import NetInfo from "@react-native-community/netinfo";
 * bindNativeLifecycle({ appState: AppState, netInfo: NetInfo });
 * ```
 * Pass the modules in: this package imports neither React Native nor NetInfo.
 */
import { type DefaultOptions, focusManager, onlineManager } from "@tanstack/react-query";

import { PERSIST_MAX_AGE } from "./constants";

/** The parts of React Native's `AppState` used here. */
export interface AppStateLike {
  addEventListener(type: "change", listener: (state: string) => void): { remove(): void };
}

/** The parts of NetInfo used here. */
export interface NetInfoLike {
  addEventListener(listener: (state: { isConnected: boolean | null; isInternetReachable?: boolean | null }) => void): () => void;
}

/** Ties Query's focus and online managers to the device. Returns the function that unties them. */
export function bindNativeLifecycle({ appState, netInfo }: { appState?: AppStateLike; netInfo?: NetInfoLike }): () => void {
  if (appState) focusManager.setEventListener((setFocused) => {
    const subscription = appState.addEventListener("change", (state) => setFocused(state === "active"));
    return () => subscription.remove();
  });
  if (netInfo) onlineManager.setEventListener((setOnline) =>
    netInfo.addEventListener((state) => setOnline(state.isConnected !== false && state.isInternetReachable !== false)),
  );
  return () => {
    // the managers stop listening to the device (a test, a hot reload): they keep their last state
    if (appState) focusManager.setEventListener(() => undefined);
    if (netInfo) onlineManager.setEventListener(() => undefined);
  };
}

/**
 * Defaults for a device (`createQueryClient({ gcTime: PERSIST_MAX_AGE, defaultOptions: nativeQueryDefaults })`): the
 * cache answers first, the network refreshes when there is one; a mutation made offline waits for the network.
 */
export const nativeQueryDefaults: DefaultOptions = Object.freeze({
  queries: { networkMode: "offlineFirst", gcTime: PERSIST_MAX_AGE },
  mutations: { networkMode: "offlineFirst" },
}) as DefaultOptions;

export { PERSIST_MAX_AGE };
