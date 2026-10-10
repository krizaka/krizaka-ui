import { Kbd } from "@krizaka/ui/kbd";

// A shortcut in a sentence: one `Kbd` per key.
export default function KbdShortcut() {
  return (
    <p className="flex items-center gap-1.5 text-sm text-fg-secondary">
      Search with <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </p>
  );
}
