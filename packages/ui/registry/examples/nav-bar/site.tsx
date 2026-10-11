import { Button } from "@krizaka/ui/button";
import { NavBar } from "@krizaka/ui/nav-bar";

const products = [
  { href: "#orazaka", title: "Orazaka", description: "Sovereign AI, on your own servers." },
  { href: "#orochia", title: "Orochia", description: "Creators keep 90 % of every support." },
  { href: "#ui", title: "Krizaka UI", description: "The components behind both." },
];

// The site's bar: a floating pill that tightens on scroll, one light gliding between its items and resting on the
// current page, an accessible menu (Enter or ↓ opens, Escape closes), and a panel below `md`.
export default function NavBarSite() {
  return (
    <NavBar.Root label="Main">
      <NavBar.Brand href="#home">Krizaka</NavBar.Brand>
      <NavBar.Items>
        <NavBar.Menu label="Products">
          {products.map((p) => (
            <NavBar.MenuLink key={p.href} {...p} />
          ))}
        </NavBar.Menu>
        <NavBar.Link href="#docs">Docs</NavBar.Link>
        <NavBar.Link href="#story" active>Our story</NavBar.Link>
      </NavBar.Items>
      <NavBar.Actions>
        <Button variant="primary" size="sm" shape="pill" className="hidden sm:inline-flex">Contact</Button>
        <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
          {products.map((p) => (
            <NavBar.MobileLink key={p.href} href={p.href}>{p.title}</NavBar.MobileLink>
          ))}
          <NavBar.MobileLink href="#story" active>Our story</NavBar.MobileLink>
        </NavBar.Mobile>
      </NavBar.Actions>
    </NavBar.Root>
  );
}
