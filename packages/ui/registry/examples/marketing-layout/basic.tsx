import { MarketingLayout } from "@krizaka/ui/marketing-layout";
import { NavBar } from "@krizaka/ui/nav-bar";
import { Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";

// A site's page: the link that skips to the content, the floating bar, the hero and sections in one frame, the footer.
export default function MarketingLayoutBasic() {
  return (
    <MarketingLayout
      skipLabel="Skip to content"
      header={
        <NavBar.Root label="Main" compactAfter={false}>
          <NavBar.Brand href="#home">Krizaka</NavBar.Brand>
          <NavBar.Items>
            <NavBar.Link href="#products" active>Products</NavBar.Link>
            <NavBar.Link href="#docs">Docs</NavBar.Link>
          </NavBar.Items>
        </NavBar.Root>
      }
      footer={<footer className="border-t border-border-subtle px-6 py-8 text-sm text-fg-secondary">© Krizaka · Montréal</footer>}
    >
      <PageHero eyebrow="Products" title="Two products, one way of building" backdrop="plain" />
      <Section id="why" title="Why" spacing="sm">
        <p className="text-sm text-fg-secondary">Every page shares the same edges.</p>
      </Section>
    </MarketingLayout>
  );
}
