import { Tabs } from "@krizaka/ui/tabs";

// Tabs as routes: the URL is the state. `current` comes from your router (`usePathname()` + the search); pass your router's
// `Link` with `asChild`. Each tab is a link, the active one is `aria-current="page"`; the page below is the panel.
const current = "/studio/videos";

export default function TabsRoutes() {
  return (
    <Tabs.Nav label="Studio sections" current={current}>
      <Tabs.NavLink href="/studio/videos">Videos</Tabs.NavLink>
      <Tabs.NavLink href="/studio/stories">Stories</Tabs.NavLink>
      <Tabs.NavLink href="/studio/earnings">Earnings</Tabs.NavLink>
    </Tabs.Nav>
  );
}
