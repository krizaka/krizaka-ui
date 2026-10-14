import { KrizakaLogo } from "@krizaka/ui";
import { NavBar } from "@krizaka/ui/nav-bar";
import { familyLabels } from "@krizaka/ui/sites";

const links = [
  { href: "#start", label: "Get started" },
  { href: "#blocks", label: "Building blocks" },
  { href: "#guides", label: "Guides" },
];

// java.krizaka.com: Krizaka Java, the version of the building blocks, three sections, the repository.
export default function NavBarFamilyJava() {
  return (
    <NavBar.Root label="Main">
      <NavBar.Brand href="#home"><KrizakaLogo size={22} />Krizaka Java</NavBar.Brand>
      <NavBar.Family current="java" labels={familyLabels.en} />
      <NavBar.Badge version="0.1.0" />
      <NavBar.Items>
        {links.map((l) => (
          <NavBar.Link key={l.href} href={l.href} active={l.href === "#blocks"}>{l.label}</NavBar.Link>
        ))}
      </NavBar.Items>
      <NavBar.Actions>
        <NavBar.Repo href="https://github.com/krizaka/krizaka-build" label="Source on GitHub" />
        <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
          {links.map((l) => (
            <NavBar.MobileLink key={l.href} href={l.href}>{l.label}</NavBar.MobileLink>
          ))}
          <NavBar.Family current="java" labels={familyLabels.en} />
        </NavBar.Mobile>
      </NavBar.Actions>
    </NavBar.Root>
  );
}
