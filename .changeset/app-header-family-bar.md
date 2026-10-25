---
"@krizaka/ui": minor
---

`AppHeader` becomes the family's top bar (#640), extracted from Orochia's: the slots `search`, `language`, `messages`, `notifications`, `primary` and `account` beside `actions`, drawn in a fixed order (search · language · actions · messages · notifications · primary · account), an empty slot hidden. `AppHeaderCount` (in `@krizaka/ui/app-header`) is an icon button or link with an unread count, said in its name (« Notifications, 3 new »), `max+` above `max`. `AppHeaderSearch` (new client entry `@krizaka/ui/app-header/search`) is the field-like trigger with ⌘K / Ctrl+K that opens the host's `CommandDialog`; an icon below `md`, named at every width. React Native: `AppHeader`, `AppHeaderCount` and `AppHeaderSearch` in `@krizaka/ui/native`. Existing `AppHeader` props are unchanged.
