import { ProductLogo } from "@krizaka/ui";
import { AppHeader } from "@krizaka/ui/app-header";
import { RailNav } from "@krizaka/ui/rail-nav";

const dot = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="7" /></svg>;

// `expandable` adds a button that widens the rail to show the words (desktop). The state can be kept with `expanded`.
export default function RailNavExpandable() {
  return (
    <RailNav.Shell>
      <RailNav.Root
        label="Studio"
        accent="orochia"
        expandable
        expandLabels={["Show the words", "Hide the words"]}
        mark={<a href="#home" aria-label="Orochia, home"><ProductLogo id="orochia" size={26} animated={false} /></a>}
      >
        <RailNav.Item href="#home" icon={dot} label="Home" current />
        <RailNav.Item href="#videos" icon={dot} label="Videos" />
        <RailNav.Item href="#earnings" icon={dot} label="Earnings" />
      </RailNav.Root>
      <RailNav.Body>
        <AppHeader name="Orochia" mark={<ProductLogo id="orochia" size={22} animated={false} />} />
        <main id="content" className="p-6 text-sm text-fg-secondary">The screen's content.</main>
      </RailNav.Body>
    </RailNav.Shell>
  );
}
