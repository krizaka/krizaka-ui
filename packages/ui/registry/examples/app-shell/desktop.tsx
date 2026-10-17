import { ProductLogo } from "@krizaka/ui";
import { AppShell } from "@krizaka/ui/app-shell";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { Progress } from "@krizaka/ui/progress";

const dot = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="7" /></svg>;

// The Mac app's window (Tauri 2, ADR-002): `desktop` — the title bar moves the window and clears the traffic lights, no
// drawer, desktop density. The menu bar answers the same keys (`acceleratorOf("mod+1")` → `CmdOrCtrl+1`).
export default function AppShellDesktop() {
  return (
    <AppShell.Root desktop style={{ ["--kz-window-height" as string]: "34rem" }}>
      <AppShell.Sidebar label="Orazaka" brand={<><ProductLogo id="orazaka" size={22} animated={false} /> Orazaka</>} collapseLabels={["Collapse", "Expand"]} closeLabel="Close">
        <AppShell.Item href="#workspace" icon={dot} label="Workspace" shortcut="mod+1" />
        <AppShell.Item href="#models" icon={dot} label="Models" shortcut="mod+2" current />
        <AppShell.Item href="#jobs" icon={dot} label="Jobs" shortcut="mod+3" badge={2} />
        <AppShell.Group>Machine</AppShell.Group>
        <AppShell.Item href="#backups" icon={dot} label="Backups" />
        <AppShell.Item href="#logs" icon={dot} label="Logs" />
      </AppShell.Sidebar>
      <AppShell.Body>
        <AppShell.Header title="Models" menuLabel="Open the menu" actions={<Button size="sm" variant="primary" shape="cut">Add a model</Button>} />
        <AppShell.Main className="space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface-1 p-4">
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-sm font-semibold">qwen2.5 7B · chat</p>
              <Progress value={64} label="Downloading qwen2.5 7B" />
            </div>
            <Badge tone="accent">3.1 of 4.8 GB</Badge>
          </div>
          <p className="text-[13px] text-fg-secondary">Models run on this Mac (Metal). Nothing leaves your network.</p>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
