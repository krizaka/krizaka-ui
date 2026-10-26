import { Page, Section } from "@krizaka/ui/page";

// `paper`: ruled (Seyès) · lines · dot-grid · kraft. Absent = plain. Text stays on the page's paper, never on a texture.
export default function PagePapers() {
  return (
    <div className="grid w-full gap-4">
      <Section id="dot-grid" paper="dot-grid" spacing="sm" title="Dot-grid" lead="A dot every 24 px: a page to plan on." />
      <Page paper="lines" className="py-6">
        <p className="m-0 text-fg">Lines only: a page to read.</p>
      </Page>
    </div>
  );
}
