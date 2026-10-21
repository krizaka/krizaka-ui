import { SiteFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// www.krizaka.com: “A Krizaka company” — the family's columns already hold the company's pages (story, blog, contact),
// so www adds no column of its own; the legal links end the signature line.
export default function SiteFooterCompany() {
  return (
    <SiteFooter
      current="krizaka"
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
