import { SiteFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";

// The footer inside a signed-in product (dev.orazaka.com/dashboard): one slim line — the publisher line, the version it
// runs and the legal links. Rendered once, in the layout; where the app shell has a sidebar that holds them, none.
export default function SiteFooterApp() {
  return (
    <SiteFooter
      variant="app"
      current="orazaka"
      labels={familyLabels.en}
      env="DEV"
      version="1.2.3"
      legal={
        <>
          <SiteFooter.Link href="#privacy">Privacy</SiteFooter.Link>
          <SiteFooter.Link href="#terms">Terms</SiteFooter.Link>
        </>
      }
    />
  );
}
