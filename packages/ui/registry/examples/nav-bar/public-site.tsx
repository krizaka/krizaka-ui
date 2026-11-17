import { SovkoraLogo } from "@krizaka/ui";
import { NavBar, ProductBarActions } from "@krizaka/ui/nav-bar";
import { ThemeProvider, ThemeToggle } from "@krizaka/ui/theme";

// A public site (a shared export, read without an account): no `signIn`, no `tryIt`, so ProductBarActions renders nothing —
// the bar shows no way in. Pass only `tryIt` and « Try » alone shows.
export default function NavBarPublicSite() {
  return (
    <ThemeProvider>
      <NavBar.Root label="Main" floating={false}>
        <NavBar.Brand href="#home"><SovkoraLogo size={22} />Sovkora</NavBar.Brand>
        <NavBar.Items>
          <NavBar.Link href="#report">Report</NavBar.Link>
          <NavBar.Link href="#docs">Docs</NavBar.Link>
        </NavBar.Items>
        <NavBar.Actions>
          <span className="hidden items-center gap-1 md:inline-flex"><ThemeToggle label="Change the theme" /></span>
          <ProductBarActions signupOpen={false} />
        </NavBar.Actions>
      </NavBar.Root>
    </ThemeProvider>
  );
}
