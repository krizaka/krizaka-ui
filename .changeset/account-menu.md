---
"@krizaka/ui": minor
---

New `@krizaka/ui/account-menu` — `AccountMenu`, the menu under a signed-in person's avatar: identity first (picture from `defaultAvatar` or `src`, name, e-mail), profile and settings links, the language as a compact submenu showing the current one, extra rows, and Sign out as a quiet item. `DropdownMenu` gains `Sub`, `SubTrigger`, `SubContent`, `RadioGroup` and `RadioItem`, and its panel is `overflow-x-hidden` with `overscroll-contain`, so it never draws a stray scrollbar at its natural height (it scrolls only when the screen is shorter).
