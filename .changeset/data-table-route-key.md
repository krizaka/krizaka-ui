---
"@krizaka/ui": minor
---

`DataTable` `routeKey`: the sort, the filters and the page live in the address (`?clients.sort=visits.descending&clients.q.client=lea&clients.page=2`), so back and forward, a reload and a shared link land on the same table. `useRouteSearch` (`@krizaka/ui/router`) writes several parameters in one navigation (krizaka-ui#515, « the URL is the state »).
