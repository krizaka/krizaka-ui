import { KrizakaLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { NavBar } from "@krizaka/ui/nav-bar";
import { familyLabels } from "@krizaka/ui/sites";

const links = [
  { href: "#products", label: "Products" },
  { href: "#open-source", label: "Open source" },
  { href: "#story", label: "Our story" },
];

// www.krizaka.com: who I am (the mark and the family switcher) · this site (three sections) · tools (the repository,
// one action). The chevron opens the family; the mobile panel ends with it.
export default function NavBarFamilyWww({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <NavBar.Root label="Main" className={defaultOpen ? "mb-[30rem]" : undefined}>
      <NavBar.Brand href="#home"><KrizakaLogo size={22} />Krizaka</NavBar.Brand>
      <NavBar.Family current="krizaka" labels={familyLabels.en} defaultOpen={defaultOpen} />
      <NavBar.Items>
        {links.map((l) => (
          <NavBar.Link key={l.href} href={l.href} active={l.href === "#products"}>{l.label}</NavBar.Link>
        ))}
      </NavBar.Items>
      <NavBar.Actions>
        <NavBar.Repo href="https://github.com/krizaka/krizaka-com" label="Source on GitHub" />
        <Button variant="primary" size="sm" shape="pill" className="hidden sm:inline-flex">Contact</Button>
        <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
          {links.map((l) => (
            <NavBar.MobileLink key={l.href} href={l.href}>{l.label}</NavBar.MobileLink>
          ))}
          <NavBar.Family current="krizaka" labels={familyLabels.en} />
        </NavBar.Mobile>
      </NavBar.Actions>
    </NavBar.Root>
  );
}
