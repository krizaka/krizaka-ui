# Example — Expo (React Native)

@krizaka/query on a device: the bearer token injected by `krizakaFetch`, the cache saved to AsyncStorage (or MMKV
through `mmkvStorage`) and restored at launch, focus and network wired to `AppState` and NetInfo, the cache read first
(`offlineFirst`). Type-checked by `pnpm --filter @krizaka/query typecheck`; copy `App.tsx` into an Expo app that
depends on `@krizaka/query`, `zod`, `@react-native-async-storage/async-storage` and `@react-native-community/netinfo`.
For live invalidation, pass react-native-sse's `EventSource` to `eventSourceLive(url, { EventSource })`.
