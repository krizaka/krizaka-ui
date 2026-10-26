import { OrazakaLogo } from "@krizaka/ui";
import { NavBar } from "@krizaka/ui/nav-bar";
import { familyLabels } from "@krizaka/ui/sites";

// admin.<product>: a console — the mark, the family and `DEV`, no sections, a full-width bar. The family still says
// where the console belongs; the mobile panel holds only the family.
export default function NavBarFamilyAdmin() {
  return (
    <NavBar.Root label="Console" floating={false} compactAfter={false}>
      <NavBar.Brand href="#home"><OrazakaLogo size={22} />Orazaka admin</NavBar.Brand>
      <NavBar.Family current="orazaka" labels={familyLabels.en} />
      <NavBar.Badge env="DEV" />
      <NavBar.Actions>
        <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
          <NavBar.Family current="orazaka" labels={familyLabels.en} />
        </NavBar.Mobile>
      </NavBar.Actions>
    </NavBar.Root>
  );
}
