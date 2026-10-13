---
"@krizaka/ui": minor
---

Dates and times, redesigned (DS5). `@krizaka/ui/date-picker` wears the Krizaka material — the chosen day a lit fill,
today the node of the marks, a period one continuous band — and gains: `Calendar` `variant="card"` and
`numberOfMonths={2}` (its title opens the months of the year), `DateRangePicker` on two months with lit presets,
`MonthPicker` (`YYYY-MM`), `DayStrip` (the days ahead, closed and marked days), `WheelPicker` + `Wheel` (spinbuttons,
the curve a scroll-driven animation), `TimePicker` (wheels on the locale's 12 or 24 hours, or `variant="slots"` by part
of the day), `DateField` (day · month · year typed) and `DateWheel` (bounded: an age gate is
`max={latestBirthDate(18)}`), with the helpers `timeSlots`, `ageOn`, `formatTime`, `monthNames`… shared with native.
`@krizaka/ui/native` gains `Calendar`, `MonthPicker`, `DayStrip`, `TimePicker`, `DateWheel`, `WheelPicker` + `Wheel`
(adjustable for VoiceOver / TalkBack) and haptics: `ThemeProvider haptics={(kind) => …}` (expo-haptics in the app),
`useTheme().haptic`. `cn` and the new `tv` know the material's utilities (`bg-sheen`, `bg-fill-shade`, `shadow-glow`,
`inset-shadow-edge`…), so a surface is no longer dropped under its sheen. The skill `skills/date-picker/SKILL.md`.
