"use client";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { CataloguePage, PlanStrip } from "@krizaka/ui/catalogue-page";
import { Chip } from "@krizaka/ui/chip";
import { SelectionBar } from "@krizaka/ui/data-table";
import { SearchField } from "@krizaka/ui/search-field";
import * as React from "react";

const CLIENTS = [
  { id: "c1", name: "Gagnon & fils", status: "To follow up", tone: "warning" as const },
  { id: "c2", name: "Mme Roy", status: "Active", tone: "success" as const },
  { id: "c3", name: "Lavoie Plomberie", status: "Active", tone: "success" as const },
];

// TEMPLATE — a client list (Atelier Eric, fictitious): the plan strip (figures and a meter), the binder dividers, the search in the hero
// with the filters as chips and their counts, rows with a status and one action, and the selection bar when rows are ticked.
export default function CataloguePageClients() {
  const [picked, setPicked] = React.useState<string[]>([]);
  return (
    <div className="brand-akinaza">
      <CataloguePage
        eyebrow="Clients"
        title="Your clients"
        search={<SearchField label="Search the clients" placeholder="A name, a city…" />}
        filtersLabel="Filters"
        filters={
          <Chip.Group type="single" label="Status" defaultValue="all">
            <Chip value="all">All · 3</Chip>
            <Chip value="active">Active · 2</Chip>
            <Chip value="follow">To follow up · 1</Chip>
          </Chip.Group>
        }
        plan={<PlanStrip label="Your plan" figures={[{ id: "clients", label: "clients", value: "3" }, { id: "open", label: "invoices open", value: "2" }]} meter={{ label: "Clients on your plan", value: 3, max: 25, valueText: "3 of 25", showLabel: true }} />}
        dividers={
          <Chip.Group type="single" label="Shelf" defaultValue="all">
            <Chip value="all">Clients</Chip>
            <Chip value="archived">Archived</Chip>
          </Chip.Group>
        }
        count="3 clients"
        selection={
          <SelectionBar count={picked.length} onClear={() => setPicked([])}>
            <Button size="sm" variant="secondary">Archive</Button>
          </SelectionBar>
        }
      >
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {CLIENTS.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border-default bg-surface-1 p-3">
              <input type="checkbox" aria-label={`Select ${c.name}`} checked={picked.includes(c.id)} onChange={(e) => setPicked((p) => (e.target.checked ? [...p, c.id] : p.filter((x) => x !== c.id)))} />
              <span className="min-w-0 flex-1 font-semibold text-fg">{c.name}</span>
              <Badge tone={c.tone}>{c.status}</Badge>
              <Button size="sm" variant="secondary">New invoice</Button>
            </li>
          ))}
        </ul>
      </CataloguePage>
    </div>
  );
}
