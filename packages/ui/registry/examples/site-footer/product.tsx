import { SiteFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// A product's footer (dev.orazaka.com): its own columns, the family, “A Krizaka product”, the version it runs.
export default function SiteFooterProduct() {
  return (
    <SiteFooter current="orazaka" labels={familyLabels.en} env="DEV" version="1.2.3">
      <SiteFooter.Column title="Orazaka">
        <SiteFooter.Link href="#how">How it works</SiteFooter.Link>
        <SiteFooter.Link href="#demo">Demo</SiteFooter.Link>
        <SiteFooter.Link href="#docs">Docs</SiteFooter.Link>
      </SiteFooter.Column>
      <SiteFooter.Column title="Talk to us">
        <SiteFooter.Link href="https://www.krizaka.com/contact?topic=orazaka">Contact</SiteFooter.Link>
        <SiteFooter.Link href="https://github.com/krizaka/orazaka">Source</SiteFooter.Link>
      </SiteFooter.Column>
    </SiteFooter>
  );
}
