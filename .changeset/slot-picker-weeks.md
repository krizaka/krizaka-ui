---
"@krizaka/ui": minor
---

`slot-picker` moves through weeks ([#672](https://github.com/krizaka/krizaka-ui/issues/672), ADR-006 §6 — Akinaza's public booking, akinaza#315), no new entry.

- **Weeks:** `week` (controlled, the ISO date of the first day) with `onWeekChange`, `minWeek`, `maxWeek`, `todayWeek`, `weekLabel` and `weekButtons` — ← Today →. The host loads the days of the week it is asked for; the picker never computes availability. `weekHref` makes the buttons links, so `?week=` holds the state (and `?slot=` through each time's `href`).
- **Parts of the day:** `PickerDay.groups` (`Morning`, `Afternoon`), the labels from the host's messages; `slots` stays for a flat day.
- **A full time** (`disabled`) is struck out and read with its `note`, never by colour alone.
- **`footer`:** the time zone and the duration, formatted by the host with `@krizaka/intl`.
- **Keyboard:** arrows between days and between times (a full time is skipped), Page Up / Page Down for the week, focus kept; the week label is a polite live region.
