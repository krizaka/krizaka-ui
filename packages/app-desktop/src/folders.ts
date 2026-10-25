import { call, EVENTS, type TauriBridge } from "./bridge";

export interface FolderEntry {
  name: string;
  path: string;
  isDir: boolean;
  size: number;
  /** Seconds since the epoch. */
  modified: number;
  /** `pdf`, `image`, `text`, `other`… as the kit's `files` module names it. */
  kind: string;
}

export interface Listing {
  entries: FolderEntry[];
  /** True when the folder holds more entries than the kit lists at once. */
  truncated: boolean;
}

export interface Folders {
  /** The folders the person granted. */
  list(): Promise<string[]>;
  /** The native folder picker; the granted folder, or `null` when the person closed the picker. */
  grant(): Promise<string | null>;
  /** Revokes a grant; the folders still granted. */
  revoke(path: string): Promise<string[]>;
  /** A granted folder's entries (folders first). */
  read(path: string): Promise<Listing>;
  /** Watches a granted folder; `onChanged` is called (debounced) when its content changes. */
  watch(path: string): Promise<string>;
  unwatch(path: string): Promise<void>;
  onChanged(handler: (folder: string) => void): Promise<() => void>;
  /** Files dropped on the window (the gate already allowed them, for this session). */
  onDropped(handler: (paths: string[]) => void): Promise<() => void>;
  /** Files are being dragged over the window, or no longer are: the page shows where to drop. */
  onDragging(handler: (dragging: boolean) => void): Promise<() => void>;
}

/** The folder grants of a Mac app: every path goes through the kit's folder scope on the native side. */
export function createFolders(bridge: TauriBridge): Folders {
  return {
    list: () => call<string[]>(bridge, "folders"),
    grant: () => call<string | null>(bridge, "grant_folder"),
    revoke: (path) => call<string[]>(bridge, "revoke_folder", { path }),
    read: (path) => call<Listing>(bridge, "list_folder", { path }),
    watch: (path) => call<string>(bridge, "watch_folder", { path }),
    unwatch: (path) => call<void>(bridge, "unwatch_folder", { path }),
    onChanged: (handler) => bridge.listen<string>(EVENTS.folderChanged, (event) => handler(event.payload)),
    onDropped: (handler) => bridge.listen<string[]>(EVENTS.dropped, (event) => handler(event.payload)),
    onDragging: (handler) => bridge.listen<boolean>(EVENTS.dragging, (event) => handler(event.payload)),
  };
}
