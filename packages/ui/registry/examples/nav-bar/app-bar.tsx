import { NavBar } from "@krizaka/ui/nav-bar";

// Inside an app: `floating={false}` — a full-width bar with a hairline, the same light between sections.
export default function NavBarAppBar() {
  return (
    <NavBar.Root label="Studio" floating={false} compactAfter={false}>
      <NavBar.Brand href="#studio">Studio</NavBar.Brand>
      <NavBar.Items>
        <NavBar.Link href="#videos" active>Videos</NavBar.Link>
        <NavBar.Link href="#earnings">Earnings</NavBar.Link>
        <NavBar.Link href="#auctions">Auctions</NavBar.Link>
      </NavBar.Items>
      <NavBar.Actions>
        <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
          <NavBar.MobileLink href="#videos" active>Videos</NavBar.MobileLink>
          <NavBar.MobileLink href="#earnings">Earnings</NavBar.MobileLink>
        </NavBar.Mobile>
      </NavBar.Actions>
    </NavBar.Root>
  );
}
