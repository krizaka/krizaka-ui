import { ProductLogo } from "@krizaka/ui";
import { AppShell } from "@krizaka/ui/app-shell";
import { Button } from "@krizaka/ui/button";

const dot = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="7" /></svg>;

// The shell alone: the sidebar (it collapses to its icons on a desktop, opens as a drawer on a phone), the header, the
// content. Your router's links go in `AppShell.Item asChild`.
export default function AppShellBasic() {
  return (
    <AppShell.Root className="min-h-[32rem]">
      <AppShell.Sidebar
        label="Studio"
        brand={<><ProductLogo id="orochia" size={24} animated={false} /> Studio</>}
        collapseLabels={["Collapse", "Expand"]}
        closeLabel="Close the menu"
      >
        <AppShell.Item href="#home" icon={dot} label="Home" current />
        <AppShell.Item href="#videos" icon={dot} label="Videos" badge={3} />
        <AppShell.Group>Money</AppShell.Group>
        <AppShell.Item href="#earnings" icon={dot} label="Earnings" />
      </AppShell.Sidebar>
      <AppShell.Body>
        <AppShell.Header title="Home" menuLabel="Open the menu" actions={<Button size="sm" variant="primary" shape="cut">Upload</Button>} />
        <AppShell.Main>
          <p className="text-sm text-fg-secondary">The screen's content.</p>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
