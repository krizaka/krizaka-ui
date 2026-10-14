"use client";

import { configureKrizakaFetch, defineKeys, keepPreviousData, krizakaFetch, KrizakaQueryProvider, useMutation, useQuery, useQueryClient } from "@krizaka/query";
import { ProductLogo } from "@krizaka/ui";
import { ActionBar } from "@krizaka/ui/action-bar";
import { AppShell } from "@krizaka/ui/app-shell";
import { Card } from "@krizaka/ui/card";
import { Command, CommandDialog } from "@krizaka/ui/command";
import { DataTable, type DataTableColumn, DataTableFilters, type DataTableQuery } from "@krizaka/ui/data-table";
import { createKrizakaForm } from "@krizaka/ui/form";
import { PageHeader } from "@krizaka/ui/page-header";
import { useState } from "react";
import { z } from "zod";

type Payout = { id: string; creator: string; status: string; amount: number };
const rows: Payout[] = Array.from({ length: 60 }, (_, i) => ({ id: `po-${1060 - i}`, creator: ["Elena Varga", "Noah Petit", "Maya Chen"][i % 3]!, status: ["paid", "pending", "failed"][i % 4 % 3]!, amount: ((i * 7919) % 90_000) / 100 }));
// The API, faked in the page: it lists (sorted, filtered, paged) and creates.
async function fakeApi(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.method === "POST") return Response.json(rows.unshift({ id: `po-${1061 + rows.length}`, ...JSON.parse(String(init.body)), status: "pending" }));
  const q = new URL(String(input), "https://api.example").searchParams;
  const [by, dir] = (q.get("sort") ?? "id:descending").split(":") as [keyof Payout, string];
  const found = rows.filter((p) => !q.get("status") || q.get("status")!.split(",").includes(p.status)).sort((a, b) => (a[by] > b[by] ? 1 : -1) * (dir === "descending" ? -1 : 1));
  const [page, size] = [Number(q.get("page")), Number(q.get("size"))];
  return Response.json({ rows: found.slice((page - 1) * size, page * size), total: found.length });
}
const keys = defineKeys("payouts", { list: (query: DataTableQuery) => [query] });
const columns: DataTableColumn<Payout>[] = [
  { id: "id", header: "Payout", sortable: true, card: "title" },
  { id: "creator", header: "Creator", sortable: true },
  { id: "status", header: "Status", filter: "facet", options: [{ value: "paid", label: "Paid" }, { value: "pending", label: "Pending" }, { value: "failed", label: "Failed" }] },
  { id: "amount", header: "Amount", sortable: true, align: "end", cell: (p) => `$${p.amount.toFixed(2)}` },
];
const newPayout = createKrizakaForm({ schema: z.object({ creator: z.string().min(2), amount: z.number().int().min(100) }), defaultValues: { creator: "", amount: 2500 }, i18n: { t: () => undefined } });
const icon = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>;
const NONE: Payout[] = [];

function Payouts() {
  const client = useQueryClient();
  const [query, setQuery] = useState<DataTableQuery>({ sort: null, filters: {}, page: 1, pageSize: 6 });
  const list = useQuery({
    queryKey: keys.list(query),
    queryFn: ({ signal }) => krizakaFetch("/api/payouts", { signal, query: { sort: query.sort && `${query.sort.column}:${query.sort.direction}`, status: query.filters.status as string[] | undefined, page: query.page, size: query.pageSize } }) as Promise<{ rows: Payout[]; total: number }>,
    placeholderData: keepPreviousData,
    meta: { list: true },
  });
  const create = useMutation({ mutationFn: (body: { creator: string; amount: number }) => krizakaFetch("/api/payouts", { method: "POST", json: { ...body, amount: body.amount / 100 } }), onSuccess: () => client.invalidateQueries({ queryKey: ["payouts"] }) });
  const form = newPayout.useForm({ onSubmit: (values) => create.mutateAsync(values) });
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
      <DataTable caption="Payouts" rows={list.data?.rows ?? NONE} columns={columns} getRowId={(p) => p.id} manual={{ sorting: true, filtering: true, pagination: true }} rowCount={list.data?.total} defaultPageSize={6} onStateChange={setQuery} loading={list.isPending} error={list.error?.message} toolbar={<DataTableFilters />} />
      <Card.Root className="h-fit">
        <Card.Body>
          <Card.Title>New payout</Card.Title>
          <form.Form aria-label="New payout" className="flex flex-col gap-4">
            <form.TextField name="creator" label="Creator" />
            <form.Money name="amount" label="Amount" currency="USD" />
            <form.Submit>Create the payout</form.Submit>
          </form.Form>
        </Card.Body>
      </Card.Root>
    </div>
  );
}

// TEMPLATE — a console: the shell with its sections (each with a `g` shortcut), a search that opens the palette (⌘K), a page
// header with its links, a server-side table (TanStack Table behind DataTable, filters and pages sent to the API through
// @krizaka/query) and a form that creates a row and refreshes the table. On a phone the sidebar is a drawer, the table cards.
export default function AppShellConsole() {
  useState(() => configureKrizakaFetch({ fetch: fakeApi as typeof fetch }));
  const [palette, setPalette] = useState(false);
  return (
    <KrizakaQueryProvider>
      <AppShell.Root>
        <AppShell.Sidebar label="Console" brand={<><ProductLogo id="krizaka" size={24} animated={false} /> Console</>} closeLabel="Close the menu" collapseLabels={["Collapse", "Expand"]}>
          <AppShell.Group>Money</AppShell.Group>
          <AppShell.Item href="#payouts" icon={icon("M3 7h18v10H3zM12 12h.01")} label="Payouts" shortcut="g p" current />
          <AppShell.Item href="#ledger" icon={icon("M5 4h14v16H5zM8 8h8M8 12h8M8 16h5")} label="Ledger" shortcut="g l" />
          <AppShell.Group>System</AppShell.Group>
          <AppShell.Item href="#backups" icon={icon("M4 7c0-2 16-2 16 0v10c0 2-16 2-16 0zM4 12c0 2 16 2 16 0")} label="Backups" shortcut="g b" />
        </AppShell.Sidebar>
        <AppShell.Body>
          <AppShell.Header title="Finance" menuLabel="Open the menu">
            <AppShell.Search label="Search" onOpen={() => setPalette(true)} />
          </AppShell.Header>
          <AppShell.Main>
            <PageHeader as="h2" title="Payouts" description="Every payout, newest first. Sorting, filters and pages are answered by the API." className="mb-6" actions={<ActionBar size="sm" label="Help" actions={[{ href: "#docs", label: "Docs" }, { href: "#report", label: "Report a problem" }]} />} />
            <Payouts />
          </AppShell.Main>
        </AppShell.Body>
      </AppShell.Root>
      <CommandDialog open={palette} onOpenChange={setPalette} label="Search the console">
        <Command.Input placeholder="Go to a section or find a payout" />
        <Command.List label="Results" emptyLabel="Nothing matches.">
          <Command.Group heading="Go to">
            <Command.Item onSelect={() => setPalette(false)}>Payouts</Command.Item>
            <Command.Item onSelect={() => setPalette(false)}>Ledger</Command.Item>
            <Command.Item onSelect={() => setPalette(false)}>Backups</Command.Item>
          </Command.Group>
        </Command.List>
      </CommandDialog>
    </KrizakaQueryProvider>
  );
}
