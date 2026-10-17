import { ProductLogo } from "@krizaka/ui";
import { AppHeader } from "@krizaka/ui/app-header";
import { Badge } from "@krizaka/ui/badge";
import { RailNav } from "@krizaka/ui/rail-nav";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

// The mark lives in the rail; the header carries the name (and the mark on a phone, where the rail is the tab bar).
export default function RailNavStudio() {
  return (
    <RailNav.Shell>
      <RailNav.Root
        label="Orazaka"
        accent="orazaka"
        mark={<a href="#home" aria-label="Orazaka, home"><ProductLogo id="orazaka" size={26} animated={false} /></a>}
        footer={<RailNav.Item href="#settings" icon={icon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-2-4-2 1-2-1-1-2h-4l-1 2-2 1-2-1-2 4 2 1v2l-2 1 2 4 2-1 2 1 1 2h4l1-2 2-1 2 1 2-4-2-1z")} label="Settings" />}
      >
        <RailNav.Item href="#home" icon={icon("M4 11 12 4l8 7v9H4z")} label="Home" current />
        <RailNav.Item href="#studios" icon={icon("M4 5h16v11H4zM8 20h8")} label="Studios" />
        <RailNav.Item href="#chat" icon={icon("M4 5h16v11H9l-5 4z")} label="Chat" badge={2} badgeLabel="2 unread" />
        <RailNav.Item href="#jobs" icon={icon("M5 6h14M5 12h14M5 18h9")} label="Jobs" />
      </RailNav.Root>
      <RailNav.Body>
        <AppHeader
          name="Orazaka"
          mark={<ProductLogo id="orazaka" size={22} animated={false} />}
          href="#home"
          chips={<Badge tone="success" dot>Local · Sovereign</Badge>}
        />
        <main id="content" className="p-6 text-sm text-fg-secondary">The screen's content.</main>
      </RailNav.Body>
    </RailNav.Shell>
  );
}
