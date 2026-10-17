import { OrazakaLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { languagesFor } from "@krizaka/ui/language-switch";
import { NavBar } from "@krizaka/ui/nav-bar";
import { ThemeProvider, ThemeToggle } from "@krizaka/ui/theme";

// The product standard: mark · Product ▾ · Platforms ▾ · Docs; theme, language, Sign in, one action; phone: groups, preferences.
const groups = [
  { id: "product", label: "Product", links: [["#how", "How it works", "Install to first answer in three commands."], ["#demo", "Demo", "Real runs: prompts, images, videos."]] },
  { id: "platforms", label: "Platforms", links: [["#web", "Web", "The workspace in your browser."], ["#mac", "Mac", "Orazaka Desktop for Apple Silicon."]] },
];
const icon = <svg data-kz-icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><circle data-node cx="12" cy="12" r="4" /></svg>;
const [theme, language] = [<ThemeToggle key="t" label="Change the theme" />, <NavBar.Language key="l" label="Language" current="en" languages={languagesFor("/en")} />];
export default function NavBarFamilyProduct() {
  return (
    <ThemeProvider>
      <NavBar.Root label="Main" floating={false}>
        <NavBar.Brand href="#home"><OrazakaLogo size={22} />Orazaka</NavBar.Brand>
        <NavBar.Items>
          {groups.map((g) => (
            <NavBar.Menu key={g.id} value={g.id} label={g.label}>
              {g.links.map(([href, title, line]) => <NavBar.MenuLink key={href} href={href} title={title} description={line} icon={icon} />)}
            </NavBar.Menu>
          ))}
          <NavBar.Link href="#docs">Docs</NavBar.Link></NavBar.Items>
        <NavBar.Actions>
          <span className="hidden items-center gap-1 md:inline-flex">{theme}{language}</span>
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex"><a href="#sign-in">Sign in</a></Button>
          <Button asChild variant="primary" size="sm" shape="cut" className="hidden md:inline-flex"><a href="#talk">Talk to us</a></Button>
          <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
            {groups.map((g) => (
              <NavBar.MobileGroup key={g.id} label={g.label}>{g.links.map(([href, title]) => <NavBar.MobileLink key={href} href={href}>{title}</NavBar.MobileLink>)}</NavBar.MobileGroup>
            ))}
            <NavBar.MobileLink href="#docs">Docs</NavBar.MobileLink><NavBar.MobilePreferences label="Preferences">{theme}{language}</NavBar.MobilePreferences>
          </NavBar.Mobile>
        </NavBar.Actions>
      </NavBar.Root>
    </ThemeProvider>
  );
}
