import { ActionBar } from "@krizaka/ui/action-bar";
import { ErrorPage } from "@krizaka/ui/error-page";
import { Mascot } from "@krizaka/ui/mascots";
import { SearchField } from "@krizaka/ui/search-field";

// TEMPLATE — a page that is not there: the code drawn, the pigeon that lost its way, one sentence, a search, the ways
// back. Never a dead end.
export default function ErrorPageNotFound() {
  return (
    <ErrorPage
      code="404"
      mascot={<Mascot bird="pigeon" mood="empty" size={96} />}
      title="This page took another road"
      text="The address may have changed. Search for it, or start again from one of these."
      search={<SearchField label="Search the site" placeholder="Search…" />}
      actions={<ActionBar label="Ways back" primaryFirst actions={[{ href: "#home", label: "Home" }, { href: "#docs", label: "Documentation" }, { href: "#contact", label: "Contact" }]} />}
    />
  );
}
