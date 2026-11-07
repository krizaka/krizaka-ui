"use client";

import { Command, CommandDialog } from "@krizaka/ui/command";
import { Kbd } from "@krizaka/ui/kbd";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Icon } from "../icon";
import type { CommandPaletteItem, CommandPaletteLabels } from "./CommandPalette.types";

export type { CommandPaletteItem, CommandPaletteLabels } from "./CommandPalette.types";

/** Props of {@link CommandPalette}. */
export interface CommandPaletteProps {
  /** The entries, grouped by `section` in their order. */
  commands: CommandPaletteItem[];
  /** The words, translated. */
  labels: CommandPaletteLabels;
  /** Where an entry's `href` goes. Default: the Next.js router (`router.push`). */
  onNavigate?: (href: string) => void;
  /** The letter that opens it with ⌘ / Ctrl. Default `k`. */
  shortcut?: string;
}

/** The entries grouped by section, in the order they first appear. */
function bySection(commands: CommandPaletteItem[]) {
  const groups = new Map<string, CommandPaletteItem[]>();
  for (const command of commands) groups.set(command.section, [...(groups.get(command.section) ?? []), command]);
  return [...groups];
}

/**
 * The Orazaka ⌘K palette: a product composite on `CommandDialog` from `@krizaka/ui/command` (cmdk + the platform's
 * dialog: the combobox and listbox roles, the arrows, Enter, the filtering, the focus trap, Escape). It adds what is
 * Orazaka's: the shortcut, the registry icons, the sections and the footer of hints. Words and entries arrive as
 * props (since 3.0 they are required: the 1.x English defaults are gone).
 *
 * @param props - {@link CommandPaletteProps}
 * @returns The palette, closed until ⌘K / Ctrl+K.
 */
export function CommandPalette({ commands, labels, onNavigate, shortcut = "k" }: Readonly<CommandPaletteProps>) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === shortcut) {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcut]);

  const run = (command: CommandPaletteItem) => {
    setOpen(false);
    if (command.href) (onNavigate ?? router.push)(command.href);
    command.onSelect?.();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      label={labels.label}
      footer={
        <footer className="flex items-center gap-3 border-t border-border-subtle bg-surface-2 px-4 py-2 text-xs text-fg-secondary">
          <span className="flex items-center gap-1">
            <Kbd>↑↓</Kbd>
            {labels.navigate}
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd>
            {labels.open}
          </span>
          <span className="flex items-center gap-1">
            <Kbd>esc</Kbd>
            {labels.close}
          </span>
        </footer>
      }
    >
      <Command.Input placeholder={labels.placeholder} />
      <Command.List label={labels.results} emptyLabel={labels.empty}>
        {bySection(commands).map(([section, items]) => (
          <Command.Group key={section} heading={section}>
            {items.map((command) => (
              <Command.Item
                key={command.id}
                value={`${command.label} ${command.id}`}
                keywords={command.keywords}
                onSelect={() => run(command)}
              >
                <Icon name={command.icon} size={16} className="text-fg-secondary" />
                <span className="flex-1">{command.label}</span>
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </CommandDialog>
  );
}
