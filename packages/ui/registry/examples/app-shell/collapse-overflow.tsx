import { YomizakaLogo } from "@krizaka/ui";
import { AppShell } from "@krizaka/ui/app-shell";

const dot = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="7" /></svg>;

// A shell whose brand is a mark and a name (as in Yomizaka) and whose footer is plain text: collapsed, only the mark
// shows; nothing flows out of the sidebar, during the transition or after it.
export default function AppShellCollapseOverflow() {
  return (
    <AppShell.Root className="min-h-[32rem]">
      <AppShell.Sidebar
        label="Yomizaka"
        brand={<a href="#home" className="inline-flex items-center gap-2"><YomizakaLogo size={24} animated={false} /> Yomizaka</a>}
        collapseLabels={["Collapse", "Expand"]}
        closeLabel="Close the menu"
        footer={<div className="flex flex-col gap-1 px-3 pb-2 text-xs text-fg-secondary"><span>Signed in as someone@example.com</span><span>Dev build 0.1.0</span></div>}
      >
        <AppShell.Item href="#home" icon={dot} label="Library" current />
        <AppShell.Item href="#search" icon={dot} label="Search" />
      </AppShell.Sidebar>
      <AppShell.Body>
        <AppShell.Main>
          <p className="text-sm text-fg-secondary">The content.</p>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
