// Pure: the commands of a desktop window, written once and read by three things — the native menu bar (through
// `setNativeMenu` of @krizaka/app-desktop), the in-page shortcuts (`useShortcuts`, also the browser's), and the palette.
import { acceleratorOf } from "../app-shell/shortcuts";

export interface DesktopCommand {
  /** Sent back by the menu when chosen: lowercase letters, digits, `.` and `-` (`view.sidebar`). */
  id: string;
  /** The menu item's words, passed translated (`Hide sidebar`). */
  label: string;
  /** The menu it belongs to (`View`, `File`), passed translated: the product's menus sit between Edit and Window. */
  menu: string;
  /** A chord (`mod+b`): the menu shows it and the page answers it. A sequence (`g d`) is the page's only. */
  shortcut?: string;
  /** Runs the command. */
  run: () => void;
  /** A separator before it in its menu. */
  separated?: boolean;
  /** Dimmed in the menu while false (default true). */
  enabled?: boolean;
}

/** The shape `setNativeMenu` takes for its `menus` (structurally the same as `MenuSpec["menus"]` of @krizaka/app-desktop). */
export interface DesktopMenu {
  title: string;
  items: { id: string; label: string; accelerator?: string; enabled?: boolean; separated?: boolean }[];
}

const ID = /^[a-z0-9][a-z0-9.-]*$/;

export interface DesktopMenus {
  /** For `setNativeMenu(bridge, { labels, menus }, handlers)`. */
  menus: DesktopMenu[];
  /** For its `handlers`: the id of the chosen item → what it does. */
  handlers: Record<string, () => void>;
  /** For `useShortcuts`: the chords of the commands, answered in the page. */
  shortcuts: Record<string, () => void>;
}

/** Refuses an id the native side would refuse, or one already declared. */
function checkId(out: DesktopMenus, id: string): void {
  if (!ID.test(id)) throw new Error(`desktopMenus: "${id}" is not a menu id (lowercase letters, digits, "." and "-").`);
  if (out.handlers[id]) throw new Error(`desktopMenus: "${id}" is declared twice.`);
}

/** Records the chord of a command for the page, refusing one given to two commands. */
function addShortcut(out: DesktopMenus, shortcut: string, run: () => void): void {
  const key = shortcut.toLowerCase();
  if (out.shortcuts[key]) throw new Error(`desktopMenus: "${shortcut}" is the shortcut of two commands.`);
  out.shortcuts[key] = run;
}

/** The menu item of a command: its accelerator, and only the flags it sets. */
function itemOf(command: DesktopCommand): DesktopMenu["items"][number] {
  const accelerator = command.shortcut ? acceleratorOf(command.shortcut) : undefined;
  return {
    id: command.id,
    label: command.label,
    ...(accelerator ? { accelerator } : {}),
    ...(command.enabled === false ? { enabled: false } : {}),
    ...(command.separated ? { separated: true } : {}),
  };
}

/** Turns the commands into the menu bar's menus, its handlers and the page's shortcuts — one source for the three. Throws on a bad or repeated id, or a shortcut given twice. */
export function desktopMenus(commands: readonly DesktopCommand[]): DesktopMenus {
  const out: DesktopMenus = { menus: [], handlers: {}, shortcuts: {} };
  for (const command of commands) {
    checkId(out, command.id);
    out.handlers[command.id] = command.run;
    if (command.shortcut) addShortcut(out, command.shortcut, command.run);
    let menu = out.menus.find((m) => m.title === command.menu);
    if (!menu) out.menus.push((menu = { title: command.menu, items: [] }));
    menu.items.push(itemOf(command));
  }
  return out;
}
