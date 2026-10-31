import { SiteFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// ui.krizaka.com in French: « Un projet open source de Krizaka », the version of the packages, the words of the family
// from `familyLabels.fr`.
export default function SiteFooterOpenSourceFr() {
  return (
    <SiteFooter current="ui" tone="cahier" labels={familyLabels.fr} version="3.9.0">
      <SiteFooter.Column title="Documentation">
        <SiteFooter.Link href="#start">Démarrer</SiteFooter.Link>
        <SiteFooter.Link href="#foundations">Fondations</SiteFooter.Link>
        <SiteFooter.Link href="#components">Composants</SiteFooter.Link>
        <SiteFooter.Link href="#templates">Modèles</SiteFooter.Link>
      </SiteFooter.Column>
    </SiteFooter>
  );
}
