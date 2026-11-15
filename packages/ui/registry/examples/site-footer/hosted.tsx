import { SiteFooter } from "@krizaka/ui/site-footer";

// `variant="hosted"`: a shop's page on a platform — the shop's legal links, then the platform's signature. One line.
export default function SiteFooterHosted() {
  return (
    <SiteFooter
      current="folioviv"
      variant="hosted"
      legal={
        <>
          <SiteFooter.Link href="#privacy">Confidentialité</SiteFooter.Link>
          <SiteFooter.Link href="#terms">Conditions</SiteFooter.Link>
        </>
      }
      madeWith={
        <>
          <span>Page faite avec Folioviv</span>
          <SiteFooter.Link href="#how">Comment cette page est faite</SiteFooter.Link>
        </>
      }
    />
  );
}
