/**
 * The two calls of `@tauri-apps/api` the package uses, passed by the app (`import { invoke } from "@tauri-apps/api/core"`,
 * `import { listen } from "@tauri-apps/api/event"`), so the package imports no Tauri module and is tested without a window.
 */
export interface TauriBridge {
  invoke<T>(command: string, args?: Record<string, unknown>): Promise<T>;
  listen<T>(event: string, handler: (event: { payload: T }) => void): Promise<() => void>;
}

/** The plugin's name in `tauri-plugin-krizaka` (krizaka-tauri-kit): its commands are `plugin:krizaka|<command>`. */
export const PLUGIN = "krizaka";

/**
 * Every command of `tauri-plugin-krizaka` this package calls — the contract with the plugin's `build.rs`. A window's
 * capability lists `krizaka:default`, which allows exactly these.
 */
export const COMMANDS = [
  "folders",
  "grant_folder",
  "revoke_folder",
  "list_folder",
  "watch_folder",
  "unwatch_folder",
  "secret_get",
  "secret_set",
  "secret_remove",
  "set_menu",
  "take_links",
  "update_channel",
  "set_update_channel",
] as const;

export type Command = (typeof COMMANDS)[number];

/** The events the plugin sends to the page. */
export const EVENTS = {
  /** Paths dropped on the window, already allowed by the folder gate: `string[]`. */
  dropped: "krizaka://dropped",
  /** Files are being dragged over the window (`true`), or no longer are (`false`). */
  dragging: "krizaka://dragging",
  /** A deep link's route inside the app (`/app/rapports`): `string`. */
  open: "krizaka://open",
  /** The id of a menu item the person chose: `string`. */
  menu: "krizaka://menu",
  /** A watched folder whose content changed: its path, `string`. */
  folderChanged: "krizaka://folder-changed",
} as const;

export const call = <T>(bridge: Pick<TauriBridge, "invoke">, command: Command, args?: Record<string, unknown>) =>
  bridge.invoke<T>(`plugin:${PLUGIN}|${command}`, args);
