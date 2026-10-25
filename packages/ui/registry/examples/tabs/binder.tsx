import { Tabs } from "@krizaka/ui/tabs";

// Binder dividers as routes: each collection is a divider with its colour and count; the address is the state.
// `current` comes from your router; « + Divider » opens the host's form.
const current = "/clients?view=regulars";

export default function TabsBinder() {
  return (
    <div className="max-w-xl">
      <Tabs.Nav label="Client collections" current={current} variant="binder" add={{ label: "Divider", onAdd: () => {} }}>
        <Tabs.NavLink href="/clients?view=all" count={48}>All</Tabs.NavLink>
        <Tabs.NavLink href="/clients?view=regulars" hue="success" count={21}>Regulars</Tabs.NavLink>
        <Tabs.NavLink href="/clients?view=new" hue="accent" count={9}>New</Tabs.NavLink>
        <Tabs.NavLink href="/clients?view=follow-up" hue="warning" count={5}>Follow up</Tabs.NavLink>
        <Tabs.NavLink href="/clients?view=archived" hue="neutral" count={13}>Archived</Tabs.NavLink>
      </Tabs.Nav>
      <div className="rounded-b-lg border border-t-0 border-border-default bg-surface-1 p-4 text-sm text-fg-secondary">21 regular clients.</div>
    </div>
  );
}
