"use client";

import { Button } from "@krizaka/ui/button";
import { Command, CommandDialog } from "@krizaka/ui/command";
import { Kbd } from "@krizaka/ui/kbd";
import { useState } from "react";

// The palette of an app, in the platform's Dialog: open it from a button or your own ⌘K shortcut.
export default function CommandDialogExample({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Search <Kbd size="sm">⌘K</Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        label="Search"
        footer={<p className="border-t border-border-subtle bg-surface-2 px-4 py-2.5 text-xs text-fg-secondary">↑↓ to move, ↵ to open</p>}
      >
        <Command.Input placeholder="Search creators, videos, tags" />
        <Command.List label="Results" emptyLabel="Nothing matches.">
          <Command.Group heading="Pages">
            <Command.Item onSelect={() => setOpen(false)}>Home</Command.Item>
            <Command.Item onSelect={() => setOpen(false)}>Wallet</Command.Item>
          </Command.Group>
          <Command.Group heading="Actions">
            <Command.Item keywords={["video", "new"]}>Upload a video</Command.Item>
          </Command.Group>
        </Command.List>
      </CommandDialog>
    </>
  );
}
