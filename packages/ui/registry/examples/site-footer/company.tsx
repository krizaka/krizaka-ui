import { SiteFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// www.krizaka.com: “A Krizaka company”, the company's own columns, the legal links at the end of the signature line.
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
    >
      <SiteFooter.Column title="Company">
        <SiteFooter.Link href="#story" active>Our story</SiteFooter.Link>
        <SiteFooter.Link href="#contact">Contact</SiteFooter.Link>
      </SiteFooter.Column>
    </SiteFooter>
  );
}
