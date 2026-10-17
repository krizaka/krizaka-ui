import { SiteFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// The footer of a documentation page: no site block, the columns in one row, the documentation's width, no family.
export default function SiteFooterDocs() {
  return (
    <SiteFooter
      variant="docs"
      current="ui"
      labels={familyLabels.en}
      version="1.2.3"
      legal={<SiteFooter.Link href="#privacy">Privacy</SiteFooter.Link>}
    >
      <SiteFooter.Column title="Guides">
        <SiteFooter.Link href="#start">Get started</SiteFooter.Link>
        <SiteFooter.Link href="#tokens">Tokens</SiteFooter.Link>
      </SiteFooter.Column>
      <SiteFooter.Column title="Project">
        <SiteFooter.Link href="#changelog">Changelog</SiteFooter.Link>
        <SiteFooter.Link href="#source">Source</SiteFooter.Link>
      </SiteFooter.Column>
    </SiteFooter>
  );
}
