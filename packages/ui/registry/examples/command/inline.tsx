import { Command } from "@krizaka/ui/command";

export default function CommandInline() {
  return (
    <Command.Root label="Commands" className="w-[28rem] max-w-full rounded-xl border border-border-default shadow-lg">
      <Command.Input placeholder="Type a command or search" />
      <Command.List label="Suggestions" emptyLabel="Nothing matches.">
        <Command.Group heading="Pages">
          <Command.Item>
            Home
            <Command.Shortcut>G H</Command.Shortcut>
          </Command.Item>
          <Command.Item>
            Wallet
            <Command.Shortcut>G W</Command.Shortcut>
          </Command.Item>
          <Command.Item disabled>Studio</Command.Item>
        </Command.Group>
        <Command.Separator />
        <Command.Group heading="Actions">
          <Command.Item keywords={["video", "new"]}>Upload a video</Command.Item>
          <Command.Item>Switch the theme</Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Root>
  );
}
