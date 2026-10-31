import { SiteFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// www.krizaka.com, a Cahier site: the family line already holds the company's pages (story, blog, contact), so www adds
// no link of its own; two lines — the family, then the signature and the legal links.
export default function SiteFooterCompany() {
  return (
    <SiteFooter
      current="krizaka"
      tone="cahier"
      labels={familyLabels.en}
      legal={
        <>
          <SiteFooter.Link href="#privacy">Privacy</SiteFooter.Link>
          <SiteFooter.Link href="#terms">Terms</SiteFooter.Link>
        </>
      }
    />
  );
}
