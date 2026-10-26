import { createContext, type ReactNode, useContext, useEffect, useState, useSyncExternalStore } from "react";

import type { Discovery, Gate, ResolvedService } from "./client";

const Context = createContext<Discovery | null>(null);

export interface DiscoveryProviderProps {
  discovery: Discovery;
  /** Shown until the first resolution (the cache, or the fetch bounded by its timeout). Default: nothing. */
  loading?: ReactNode;
  /** Subscribes to « the app came back to the foreground » and returns the unsubscribe: refreshes the manifest each time. React Native: `AppState`. */
  subscribeForeground?: (onForeground: () => void) => () => void;
  /** Background refresh period in ms (default 15 min); 0 turns it off. */
  refreshEveryMs?: number;
  children: ReactNode;
}

/** Starts discovery once, keeps it fresh, and re-renders its readers when an address or a gate changes. */
export function DiscoveryProvider({ discovery, loading = null, subscribeForeground, refreshEveryMs, children }: DiscoveryProviderProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    void discovery.start().then(() => alive && setReady(true));
    const stop = refreshEveryMs === 0 ? () => undefined : discovery.startBackgroundRefresh(refreshEveryMs);
    const stopForeground = subscribeForeground?.(() => void discovery.refresh());
    return () => {
      alive = false;
      stop();
      stopForeground?.();
    };
  }, [discovery, refreshEveryMs, subscribeForeground]);
  return <Context.Provider value={discovery}>{ready ? children : loading}</Context.Provider>;
}

export function useDiscovery(): Discovery {
  const discovery = useContext(Context);
  if (!discovery) throw new Error("useDiscovery must be used inside <DiscoveryProvider>");
  return discovery;
}

/** `useService("yomizaka").apiBase`: re-renders when the manifest moves it. */
export function useService(product: string): ResolvedService {
  const discovery = useDiscovery();
  useSyncExternalStore(discovery.subscribe, discovery.version, discovery.version);
  return discovery.getService(product);
}

export function useGate(product: string): Gate {
  const discovery = useDiscovery();
  useSyncExternalStore(discovery.subscribe, discovery.version, discovery.version);
  return discovery.getGate(product);
}

export interface DiscoveryGateProps {
  product: string;
  /** The « please update » screen of the app (its own components). */
  update: (gate: Extract<Gate, { state: "update-required" }>) => ReactNode;
  /** The maintenance screen of the app. */
  maintenance: (gate: Extract<Gate, { state: "maintenance" }>) => ReactNode;
  children: ReactNode;
}

/** Renders the app, or its update / maintenance screen when the verified manifest says so. */
export function DiscoveryGate({ product, update, maintenance, children }: DiscoveryGateProps) {
  const gate = useGate(product);
  if (gate.state === "update-required") return <>{update(gate)}</>;
  if (gate.state === "maintenance") return <>{maintenance(gate)}</>;
  return <>{children}</>;
}
