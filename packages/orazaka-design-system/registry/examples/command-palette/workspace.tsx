"use client";

import { CommandPalette } from "@krizaka/orazaka-design-system";

// Eric's workspace: ⌘K / Ctrl+K opens it; entries and words are props.
export default function Workspace() {
  return (
    <div className="flex flex-col items-start gap-2 text-sm text-fg-secondary">
      <p>Press ⌘K (Ctrl+K) to open the palette.</p>
      <CommandPalette
        onNavigate={() => {}}
        labels={{
          label: "Command palette",
          placeholder: "Go to…",
          results: "Results",
          empty: "Nothing matches.",
          navigate: "move",
          open: "open",
          close: "close",
        }}
        commands={[
          { id: "studios", label: "Studios", icon: "studio", href: "/studios", section: "Go to" },
          { id: "chat", label: "Contracts assistant", icon: "chat", href: "/chat/contracts", section: "Go to" },
          { id: "new-chat", label: "New chat", icon: "newChat", href: "/chat/new", section: "Actions" },
          { id: "models", label: "Local models", icon: "model", href: "/settings/models", section: "Settings" },
        ]}
      />
    </div>
  );
}
