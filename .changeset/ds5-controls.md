---
"@krizaka/ui": minor
---

The controls, crafted (DS5). `RadioGroup` gains tactile keys that press in (`RadioGroup.Button`, `variant="buttons"`:
raised on their ledge, sunk while held and once chosen), a segmented control that is a form's value
(`RadioGroup.Segment`, `variant="segmented"`, one light gliding to the choice) and cards with a lit check. `Slider`
gains `ticks` and `marks`, `floatingValue`, `tone` (`gradient` · `solid`), `size="lg"` and `orientation="vertical"`.
`@krizaka/ui/native` gains `Switch` (drawn by the theme; `showLabel` makes the settings row), `RadioGroup` (list · cards
· buttons · segmented), `Slider` (range, steps, floating value, vertical, adjustable for VoiceOver / TalkBack), `Sheet`
(a bottom sheet), `Select` and `Combobox` (a field that opens a sheet; async search) — each with its haptic. The form
adapters wear them without a change to any form: web `DateField entry="wheel"` and the typed date of
`@krizaka/ui/date-picker`, `RadioGroup variant` `buttons` · `segmented`, `Slider ticks` / `marks` (the value floats);
native `DateField` on wheels by default (`entry="parts"` to type it), `Switch` / `RadioGroup` / `Select` on the new
controls, and new `form.Slider` and `form.Combobox`. Wheels show a quiet band until turned (`unset`). The skill
`skills/choice-controls/SKILL.md`.
