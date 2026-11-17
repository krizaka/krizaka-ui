import { SovkoraLogo } from "@krizaka/ui";
import { NavBar, ProductBarActions } from "@krizaka/ui/nav-bar";

// A public site (a shared export, read without an account): no `signIn`, no `tryIt`, so ProductBarActions renders nothing —
// the bar shows no way in. Pass only `tryIt` and « Try » alone shows.
export default function NavBarPublicSite() {
  return (
    <NavBar.Root label="Public page" floating={false}>
      <NavBar.Brand href="#home"><SovkoraLogo size={22} />Sovkora</NavBar.Brand>
      <NavBar.Actions>
        <ProductBarActions signupOpen={false} />
      </NavBar.Actions>
    </NavBar.Root>
  );
}
