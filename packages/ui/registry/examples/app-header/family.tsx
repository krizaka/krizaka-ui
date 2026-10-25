"use client";

import { ProductLogo } from "@krizaka/ui";
import { AccountMenu } from "@krizaka/ui/account-menu";
import { AppHeader, AppHeaderCount } from "@krizaka/ui/app-header";
import { AppHeaderSearch } from "@krizaka/ui/app-header/search";
import { Command, CommandDialog } from "@krizaka/ui/command";
import { languagesFor, LanguageSwitch } from "@krizaka/ui/language-switch";
import { useState } from "react";

const icon = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>;

// The family's bar: search (⌘K opens the palette), language, messages, notifications with their counts, the account.
export default function AppHeaderFamily() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AppHeader
        name="Yomizaka"
        mark={<ProductLogo id="yomizaka" size={22} animated={false} />}
        href="#home"
        search={<AppHeaderSearch label="Search files and checks" onOpen={() => setOpen(true)} />}
        language={<LanguageSwitch label="Language" current="en" languages={languagesFor("/en/files")} />}
        messages={<AppHeaderCount label="Messages" icon={icon("M4 5h16v11H8l-4 4z")} count={2} countLabel="2 unread" href="#messages" />}
        notifications={<AppHeaderCount label="Notifications" icon={icon("M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20h4")} count={3} countLabel="3 new" />}
        account={<AccountMenu label="Account" name="Eric Tremblay" email="eric@example.com" showName avatar={{ defaultAvatar: { brand: "yomizaka", seed: "eric" } }} signOut={{ label: "Sign out", onSelect: () => {} }} />}
      />
      <CommandDialog open={open} onOpenChange={setOpen} label="Search">
        <Command.Input placeholder="Search files and checks" />
        <Command.List label="Results" emptyLabel="Nothing matches.">
          <Command.Item onSelect={() => setOpen(false)}>Applicant files</Command.Item>
          <Command.Item onSelect={() => setOpen(false)}>Checks</Command.Item>
        </Command.List>
      </CommandDialog>
    </>
  );
}
