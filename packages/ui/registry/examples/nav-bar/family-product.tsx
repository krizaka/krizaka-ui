import { OrazakaLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { NavBar } from "@krizaka/ui/nav-bar";
import { familyLabels } from "@krizaka/ui/sites";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#demo", label: "Demo" },
  { href: "#docs", label: "Docs" },
];

// dev.orazaka.com: the product's mark and the family, `DEV · v1.2.3`, three sections, and “Talk to us” on
// krizaka.com while sign-up is closed.
export default function NavBarFamilyProduct() {
  return (
    <NavBar.Root label="Main">
      <NavBar.Brand href="#home"><OrazakaLogo size={22} />Orazaka</NavBar.Brand>
      <NavBar.Family current="orazaka" labels={familyLabels.en} />
      <NavBar.Badge env="DEV" version="1.2.3" />
      <NavBar.Items>
        {links.map((l) => (
          <NavBar.Link key={l.href} href={l.href} active={l.href === "#how"}>{l.label}</NavBar.Link>
        ))}
      </NavBar.Items>
      <NavBar.Actions>
        <NavBar.Repo href="https://github.com/krizaka/orazaka" label="Source on GitHub" />
        <Button asChild variant="primary" size="sm" shape="pill" className="hidden sm:inline-flex">
          <a href="https://www.krizaka.com/contact?topic=orazaka">Talk to us</a>
        </Button>
        <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
          {links.map((l) => (
            <NavBar.MobileLink key={l.href} href={l.href}>{l.label}</NavBar.MobileLink>
          ))}
          <NavBar.Family current="orazaka" labels={familyLabels.en} />
        </NavBar.Mobile>
      </NavBar.Actions>
    </NavBar.Root>
  );
}
