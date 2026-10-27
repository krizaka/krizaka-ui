import { parseShopPage, shopStarters } from "@krizaka/ui/shop";

// What a product stores: a document. `parseShopPage` validates it and says every issue with its path (a 422 for the route).
export default function ShopDocument() {
  const page = parseShopPage(shopStarters.salonCompact);
  const broken = parseShopPage({ ...shopStarters.salonCompact, sections: [{ key: "s", type: "hero", variant: "tv2", settings: {} }] });
  return (
    <div className="grid gap-4 p-4 font-mono text-sm text-fg">
      <ol className="m-0 list-decimal pl-6">{page.ok && page.page.sections.map((s) => <li key={s.key}>{s.type} · {s.variant}</li>)}</ol>
      <p className="m-0 text-fg-secondary">{!broken.ok && broken.issues[0]?.path}</p>
    </div>
  );
}
