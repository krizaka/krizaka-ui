import { SiteFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// A product's footer (www.yomizaka.com), three lines: its own links, the family grouped, then the signature, the version,
// the legal links and the host's controls. In a real site pass `org` from `@krizaka/org`: the names, the signature line
// and the legal links are then the org's, never typed here.
export default function SiteFooterProduct() {
  return (
    <SiteFooter
      current="yomizaka"
      labels={familyLabels.en}
      env="DEV"
      version="1.2.3"
      legal={
        <>
          <SiteFooter.Link href="#privacy">Privacy</SiteFooter.Link>
          <SiteFooter.Link href="#terms">Terms</SiteFooter.Link>
        </>
      }
      controls={
        <SiteFooter.Link href="#fr" lang="fr">
          Français
        </SiteFooter.Link>
      }
    >
      <SiteFooter.Column title="Yomizaka">
        <SiteFooter.Link href="#download">Download</SiteFooter.Link>
        <SiteFooter.Link href="#docs">Documentation</SiteFooter.Link>
        <SiteFooter.Link href="#pricing">Pricing</SiteFooter.Link>
        <SiteFooter.Link href="https://github.com/krizaka/yomizaka">Source code</SiteFooter.Link>
      </SiteFooter.Column>
    </SiteFooter>
  );
}
