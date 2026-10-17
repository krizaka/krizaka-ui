import { OrazakaLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { NavBar } from "@krizaka/ui/nav-bar";

// The product-site standard: the mark alone, Product ▾ · Platforms ▾ · Docs, Sign in and one action; the phone panel
// repeats the groups. Each menu link: icon · title · one line.
const groups = [
  { id: "product", label: "Product", links: [["#how", "How it works", "Install to first answer in three commands."], ["#studios", "Studios", "Ready-made workflows, priced before you run."], ["#demo", "Demo", "Real runs: prompts, images, videos."]] },
  { id: "platforms", label: "Platforms", links: [["#web", "Web", "The workspace in your browser."], ["#mac", "Mac", "Orazaka Desktop for Apple Silicon."], ["#self-host", "Self-host", "Install it on your own servers."]] },
];
const icon = <svg data-kz-icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M12 3 19.8 7.5v9L12 21l-7.8-4.5v-9Z" /><circle data-node cx="12" cy="12" r="2.4" fill="currentColor" /></svg>;

export default function NavBarFamilyProduct() {
  return (
    <NavBar.Root label="Main" floating={false}>
      <NavBar.Brand href="#home"><OrazakaLogo size={22} />Orazaka</NavBar.Brand>
      <NavBar.Items>
        {groups.map((g) => (
          <NavBar.Menu key={g.id} value={g.id} label={g.label}>
            {g.links.map(([href, title, line]) => <NavBar.MenuLink key={href} href={href} title={title} description={line} icon={icon} />)}
          </NavBar.Menu>
        ))}
        <NavBar.Link href="#docs">Docs</NavBar.Link>
      </NavBar.Items>
      <NavBar.Actions>
        <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex"><a href="#sign-in">Sign in</a></Button>
        <Button asChild variant="primary" size="sm" shape="cut" className="hidden md:inline-flex"><a href="https://www.krizaka.com/contact?topic=orazaka">Talk to us</a></Button>
        <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
          {groups.map((g) => (
            <NavBar.MobileGroup key={g.id} label={g.label}>
              {g.links.map(([href, title]) => <NavBar.MobileLink key={href} href={href}>{title}</NavBar.MobileLink>)}
            </NavBar.MobileGroup>
          ))}
          <NavBar.MobileLink href="#docs">Docs</NavBar.MobileLink>
        </NavBar.Mobile>
      </NavBar.Actions>
    </NavBar.Root>
  );
}
