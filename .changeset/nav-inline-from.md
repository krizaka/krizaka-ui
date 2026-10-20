---
"@krizaka/ui": minor
---

`NavBar.Menu`: the inline links of a short section (3 or fewer) now stand in the bar from `lg` up (`inlineFrom`, `"md" | "lg" | "xl"`, default `lg`); between the phone panel and that breakpoint the section is the dropdown, so long French labels no longer overflow a 768 px bar. Products can drop their `inlineUpTo={0}` overrides.
