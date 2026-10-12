"use client";

import { configureKrizakaFetch, defineKeys, keepPreviousData, krizakaFetch, KrizakaQueryProvider, useQuery } from "@krizaka/query";
import { DataTable, type DataTableColumn, DataTableFilters, type DataTableQuery } from "@krizaka/ui/data-table";
import { useState } from "react";

type Payout = { id: string; creator: string; status: string; amount: number };
const ALL: Payout[] = Array.from({ length: 240 }, (_, i) => ({ id: `po-${1000 + i}`, creator: ["Elena Varga", "Noah Petit", "Maya Chen"][i % 3]!, status: ["paid", "pending", "failed"][i % 4 % 3]!, amount: ((i * 7919) % 90_000) / 100 }));
// The API, faked in the page: it sorts, filters and pages — the table shows what it answers.
async function fakeApi(input: RequestInfo | URL) {
  const q = new URL(String(input), "https://api.example").searchParams;
  const [by, dir] = (q.get("sort") ?? "id:ascending").split(":") as [keyof Payout, string];
  const rows = ALL.filter((p) => !q.get("status") || q.get("status")!.split(",").includes(p.status)).sort((a, b) => (a[by] > b[by] ? 1 : -1) * (dir === "descending" ? -1 : 1));
  const [page, size] = [Number(q.get("page")), Number(q.get("size"))];
  return Response.json({ rows: rows.slice((page - 1) * size, page * size), total: rows.length });
}
const payoutKeys = defineKeys("payouts", { list: (query: DataTableQuery) => [query] });
const columns: DataTableColumn<Payout>[] = [
  { id: "id", header: "Payout", sortable: true, card: "title" },
  { id: "creator", header: "Creator", sortable: true },
  { id: "status", header: "Status", filter: "facet", options: [{ value: "paid", label: "Paid" }, { value: "pending", label: "Pending" }, { value: "failed", label: "Failed" }] },
  { id: "amount", header: "Amount", sortable: true, align: "end", cell: (p) => `$${p.amount.toFixed(2)}` },
];
const NONE: Payout[] = [];
function Payouts() {
  const [query, setQuery] = useState<DataTableQuery>({ sort: null, filters: {}, page: 1, pageSize: 10 });
  const { data, isPending, error } = useQuery({
    queryKey: payoutKeys.list(query),
    queryFn: ({ signal }) => krizakaFetch("/api/payouts", { signal, query: { sort: query.sort && `${query.sort.column}:${query.sort.direction}`, status: query.filters.status as string[] | undefined, page: query.page, size: query.pageSize } }) as Promise<{ rows: Payout[]; total: number }>,
    placeholderData: keepPreviousData,
    meta: { list: true },
  });
  return <DataTable caption="Payouts" rows={data?.rows ?? NONE} columns={columns} getRowId={(p) => p.id} manual={{ sorting: true, filtering: true, pagination: true }} rowCount={data?.total} defaultPageSize={10} onStateChange={setQuery} loading={isPending} error={error?.message} toolbar={<DataTableFilters />} />;
}

// Server mode: sort, filters and page go to the API (krizakaFetch, keys from defineKeys); the previous page stays while the next loads.
export default function DataTableServer() {
  useState(() => configureKrizakaFetch({ fetch: fakeApi as typeof fetch }));
  return <KrizakaQueryProvider><Payouts /></KrizakaQueryProvider>;
}
