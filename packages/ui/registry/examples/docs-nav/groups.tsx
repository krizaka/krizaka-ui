import { DocsNav } from "@krizaka/ui/docs-nav";

// Two audiences, two groups: the group of the current page is open, the other folds.
export default function DocsNavGroups() {
  return (
    <DocsNav
      label="Documentation"
      current="/docs/auctions"
      groups={[
        { id: "guide", title: "Guide", items: [{ href: "/docs/start", label: "Get started" }, { href: "/docs/auctions", label: "Auctions" }] },
        { id: "developers", title: "Developers", items: [{ href: "/docs/developers/architecture", label: "Architecture" }] },
      ]}
    />
  );
}
