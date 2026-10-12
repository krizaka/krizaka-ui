import { focusManager, onlineManager } from "@tanstack/react-query";

import { bindNativeLifecycle, nativeQueryDefaults, PERSIST_MAX_AGE } from "../src/native";

describe("bindNativeLifecycle", () => {
  it("follows the app state and the network, then unbinds", () => {
    let appListener: (state: string) => void = () => undefined;
    let netListener: (state: { isConnected: boolean | null; isInternetReachable?: boolean | null }) => void = () => undefined;
    const removed = vi.fn();
    const unsubscribed = vi.fn();
    const unbind = bindNativeLifecycle({
      appState: { addEventListener: (_type, listener) => ((appListener = listener), { remove: removed }) },
      netInfo: { addEventListener: (listener) => ((netListener = listener), unsubscribed) },
    });
    appListener("background");
    expect(focusManager.isFocused()).toBe(false);
    appListener("active");
    expect(focusManager.isFocused()).toBe(true);
    netListener({ isConnected: false });
    expect(onlineManager.isOnline()).toBe(false);
    netListener({ isConnected: true, isInternetReachable: null });
    expect(onlineManager.isOnline()).toBe(true);
    netListener({ isConnected: true, isInternetReachable: false });
    expect(onlineManager.isOnline()).toBe(false);
    netListener({ isConnected: null });
    expect(onlineManager.isOnline()).toBe(true);
    unbind();
    expect(removed).toHaveBeenCalled();
    expect(unsubscribed).toHaveBeenCalled();
    bindNativeLifecycle({})();
  });

  it("reads the cache first on a device", () => {
    expect(nativeQueryDefaults.queries).toMatchObject({ networkMode: "offlineFirst", gcTime: PERSIST_MAX_AGE });
    expect(nativeQueryDefaults.mutations).toMatchObject({ networkMode: "offlineFirst" });
  });
});
