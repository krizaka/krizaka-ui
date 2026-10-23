# @krizaka/app-desktop

What every Krizaka **Mac app** (Tauri 2) calls on its native side, typed — the page half of `tauri-plugin-krizaka`
([krizaka-tauri-kit](https://github.com/krizaka/krizaka-tauri-kit)). Decision:
[ADR-005](https://github.com/krizaka/.github/blob/main/docs/adr/ADR-005-tauri-app-kit.md).

```bash
npm install @krizaka/app-desktop @krizaka/app-client
```

ESM only. The package imports no Tauri module: the app passes `invoke` and `listen`.

```ts
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { createApiClient, createSessionStore } from "@krizaka/app-client";
import { acceleratorOf } from "@krizaka/ui/app-shell";
import { createFolders, followLinks, keychainStorage, setNativeMenu } from "@krizaka/app-desktop";

const bridge = { invoke, listen };
export const folders = createFolders(bridge);
export const session = createSessionStore({ storage: keychainStorage(bridge), key: "yomizaka.session" });
export const api = createApiClient({ baseUrl: () => "https://www.yomizaka.com", session, /* … as on mobile */ });

await followLinks(bridge, (route) => router.navigate(route));          // yomizaka://app/rapports → /app/rapports
await setNativeMenu(bridge, { labels: t.menu.standard, menus: [
  { title: t.menu.file, items: [{ id: "library.add-folder", label: t.menu.addFolder, accelerator: acceleratorOf("mod+o") }] },
] }, { "library.add-folder": () => void folders.grant() });
```

| Export | What it does |
| :-- | :-- |
| `createFolders` | Grant (native picker), list, revoke, read and watch folders; `onDropped`, `onDragging`, `onChanged` |
| `keychainStorage` | The macOS Keychain as `@krizaka/app-client`'s `KeyValueStorage`: the same session store and API client as the mobile apps |
| `followLinks` | Deep links turned into routes by the native side; the ones that opened the app are not lost |
| `setNativeMenu` | The menu bar in the page's words; the chosen item's handler runs |
| `createUpdates` | The update channel, `stable` or `beta` |
| `COMMANDS`, `EVENTS`, `PLUGIN` | The contract with the plugin |

The window's capability lists `krizaka:default` and nothing that reads the disk: no `fs`, no `shell`, no `opener`.
