import { CardGrid } from "@krizaka/ui/card-grid";
import { CataloguePage } from "@krizaka/ui/catalogue-page";
import { ChipLink } from "@krizaka/ui/chip-link";
import { LinkCard } from "@krizaka/ui/link-card";
import { SearchField } from "@krizaka/ui/search-field";

const ITEMS = ["Button", "Card", "Dialog", "Tabs", "Toast", "Data table"];

// TEMPLATE — a catalogue (the components of Krizaka UI): the search in the hero, the filters in a sticky column beside
// the results — as links, the address keeps them — the count said politely, the results as compact link cards.
export default function CataloguePageComponents() {
  return (
    <CataloguePage
      eyebrow="Krizaka UI"
      title="Components"
      lead="Every component, web and mobile, documented from its code."
      search={<SearchField label="Search the components" placeholder="Button, dialog…" />}
      filtersLabel="Filters"
      filters={
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
          <p className="kz-label">Platform</p>
          <ChipLink href="#all" selected>All</ChipLink>
          <ChipLink href="#web">Web</ChipLink>
          <ChipLink href="#mobile">Mobile</ChipLink>
        </div>
      }
      count={`${ITEMS.length} components`}
    >
      <CardGrid as="ul" min={200} reveal={false}>
        {ITEMS.map((name) => (
          <LinkCard key={name} href={`#${name}`} title={name} titleAs="span" description="Web + Mobile" />
        ))}
      </CardGrid>
    </CataloguePage>
  );
}
