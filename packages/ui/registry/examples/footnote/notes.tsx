import { Caption, FootnoteRef, Footnotes } from "@krizaka/ui/footnote";

// A figure with its caption, a sentence with its note, and the notes at the foot — each with its way back.
export default function FootnoteNotes() {
  return (
    <article className="max-w-prose text-fg">
      <figure className="m-0">
        <div className="border border-border-default bg-surface-1 p-6 text-fg-secondary">Line 5: « un dépôt de sécurité de 1 450 $ »</div>
        <Caption figure="fig. 2">The owl reads every line, and marks the ones to review.</Caption>
      </figure>
      <p className="mt-6">
        A landlord may ask only the first month's rent in advance
        <FootnoteRef n={1} />, and never require postdated cheques
        <FootnoteRef n={2} />.
      </p>
      <Footnotes notes={["Civil Code of Québec, art. 1904.", "Same article; the tenant may still offer them."]} />
    </article>
  );
}
