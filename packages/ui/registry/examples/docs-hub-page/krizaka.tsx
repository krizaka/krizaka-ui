import { ProductLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { CodeBlock } from "@krizaka/ui/code-block";
import { DocsHubPage } from "@krizaka/ui/docs-hub-page";
import { Kbd } from "@krizaka/ui/kbd";

const COLLECTIONS = [
  { id: "ui", title: "Krizaka UI", href: "#ui", mark: <ProductLogo id="krizaka" size={26} animated={false} />, description: "Tokens, a Tailwind preset, the components — live, generated from their code.", links: [{ href: "#blocks", label: "Blocks" }, { href: "#layouts", label: "Layouts" }, { href: "#templates", label: "Templates" }] },
  { id: "java", title: "Krizaka Java", href: "#java", mark: <ProductLogo id="krizaka" size={26} animated={false} />, description: "Parent, BOM, starters, messaging, Problem Details.", links: [{ href: "#bom", label: "BOM" }, { href: "#messaging", label: "Messaging" }] },
  { id: "orazaka", brand: "orazaka", title: "Orazaka", href: "#orazaka", mark: <ProductLogo id="orazaka" size={26} animated={false} />, description: "The sovereign AI engine: install, packs, administration.", links: [{ href: "#cli", label: "CLI" }, { href: "#packs", label: "Packs" }, { href: "#admin", label: "Admin" }] },
  { id: "orochia", brand: "orochia", title: "Orochia", href: "#orochia", mark: <ProductLogo id="orochia" size={26} animated={false} />, description: "The creator platform: payments, auctions, the admin console.", links: [{ href: "#payouts", label: "Payouts" }, { href: "#console", label: "Console" }] },
];

// TEMPLATE — krizaka.com/docs: the search in the middle of the hero (⌘K), the collections each in its product's brand
// with their quick links, a quick start beside the most read pages, what is new, the owl's promise. On a phone: search,
// then one collection per row.
export default function DocsHubPageKrizaka() {
  return (
    <DocsHubPage
      eyebrow="Documentation"
      title="Build with Krizaka"
      lead="Every building block the products are made of, documented from its source."
      search={
        <Button variant="secondary" size="lg" className="w-full justify-between text-fg-secondary">
          Search the documentation <Kbd>⌘K</Kbd>
        </Button>
      }
      searchHints={<>Try: <a href="#cli">orazaka install</a> · <a href="#button">Button</a> · <a href="#bom">BOM</a></>}
      collectionsTitle="Collections"
      collections={COLLECTIONS}
      quickstarts={{ title: "Start in one line", children: <CodeBlock code="npx orazaka install" language="bash" file="Terminal" copyLabel="Copy" copiedLabel="Copied" /> }}
      popular={{ title: "Most read", items: [{ href: "#cli", title: "The CLI", meta: "Orazaka" }, { href: "#button", title: "Button", meta: "Krizaka UI" }, { href: "#bom", title: "The BOM", meta: "Java" }] }}
      whatsNew={{ title: "What's new", items: [{ href: "#ui-260", title: "Page blocks: frame, hero, cards, decisions", meta: "@krizaka/ui 2.6.0" }, { href: "#java-010", title: "The platform kit on Maven Central", meta: "0.1.0" }] }}
      promise={{ label: "The owl's promise", text: "Every page here is generated from the code it documents — when the code changes, the page does." }}
    />
  );
}
