---
"@krizaka/ui": minor
---

Desktop (ADR-002: desktop is the web components in the Orazaka Mac app's Tauri window). `AppShell.Root desktop`: the shell is a desktop app's window — the header, its title and the sidebar's top are the title bar (`data-tauri-drag-region`, never on a control), the top clears the traffic lights (`--kz-titlebar-inset`), no drawer, the desktop's density (32 px rows, 13 px text, a 48 px header), the chrome not selectable, the content scrolling under a fixed header (`--kz-window-height`). `acceleratorOf` (from `@krizaka/ui/app-shell`) writes a shortcut as a native menu accelerator (`mod+k` → `CmdOrCtrl+K`) so the menu bar answers the shell's keys. AppShell is the first component with `desktop: "desktop"` in the parity matrix.
