import { KrizakaLogo } from "@krizaka/ui";
import { NavBar } from "@krizaka/ui/nav-bar";
import { familyLabels } from "@krizaka/ui/sites";

const links = [
  { href: "#start", label: "Get started" },
  { href: "#foundations", label: "Foundations" },
  { href: "#components", label: "Components" },
  { href: "#templates", label: "Templates" },
];

// ui.krizaka.com: Krizaka UI and its family switcher, the version of the packages, four sections, the repository.
export default function NavBarFamilyUi() {
  return (
    <NavBar.Root label="Main">
      <NavBar.Brand href="#home"><KrizakaLogo size={22} />Krizaka UI</NavBar.Brand>
      <NavBar.Family current="ui" labels={familyLabels.en} />
      <NavBar.Badge version="3.9.0" />
      <NavBar.Items>
        {links.map((l) => (
          <NavBar.Link key={l.href} href={l.href} active={l.href === "#components"}>{l.label}</NavBar.Link>
        ))}
      </NavBar.Items>
      <NavBar.Actions>
        <NavBar.Repo href="https://github.com/krizaka/krizaka-ui" label="Source on GitHub" />
        <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
          {links.map((l) => (
            <NavBar.MobileLink key={l.href} href={l.href}>{l.label}</NavBar.MobileLink>
          ))}
          <NavBar.Family current="ui" labels={familyLabels.en} />
        </NavBar.Mobile>
      </NavBar.Actions>
    </NavBar.Root>
  );
}
