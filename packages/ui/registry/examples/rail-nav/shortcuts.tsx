"use client";

import { ProductLogo } from "@krizaka/ui";
import { AccountMenu } from "@krizaka/ui/account-menu";
import { AppHeader, AppHeaderCount } from "@krizaka/ui/app-header";
import { AppHeaderSearch } from "@krizaka/ui/app-header/search";
import { RailNav } from "@krizaka/ui/rail-nav";

const dot = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="7" /></svg>;

// The family's frame: the rail with its « Shortcuts » (desktop), expanded from 1280 px; the top bar with the name from 1024 px.
export default function RailNavShortcuts() {
  return (
    <RailNav.Shell>
      <RailNav.Root
        label="Akinaza"
        accent="akinaza"
        expandable
        expandLabels={["Show the words", "Hide the words"]}
        mark={<a href="#home" aria-label="Akinaza, home"><ProductLogo id="akinaza" size={26} animated={false} /></a>}
        shortcutsLabel="Shortcuts"
        shortcuts={[<RailNav.Item key="r" href="#clients?view=regulars" icon={dot} label="Regular clients" />, <RailNav.Item key="n" href="#invoices/new" icon={dot} label="New invoice" />]}
      >
        <RailNav.Item href="#today" icon={dot} label="Today" current />
        <RailNav.Item href="#clients" icon={dot} label="Clients" />
        <RailNav.Item href="#invoices" icon={dot} label="Invoices" />
      </RailNav.Root>
      <RailNav.Body>
        <AppHeader
          name="Akinaza"
          mark={<ProductLogo id="akinaza" size={22} animated={false} />}
          search={<AppHeaderSearch label="Search clients and invoices" onOpen={() => {}} shortcut={false} />}
          notifications={<AppHeaderCount label="Notifications" icon={dot} count={2} countLabel="2 new" />}
          account={<AccountMenu label="Account" name="Eric Tremblay" showName="lg" avatar={{ defaultAvatar: { brand: "akinaza", seed: "eric" } }} signOut={{ label: "Sign out", onSelect: () => {} }} />}
        />
        <main className="p-6 text-sm text-fg-secondary">The screen's content.</main>
      </RailNav.Body>
    </RailNav.Shell>
  );
}
