---
"@krizaka/ui": minor
---

`Tabs` `variant="binder"` (#648): binder dividers (intercalaires) to organise collections, tags and statuses. Each tab is a divider with a coloured top edge (`hue`: accent · success · warning · danger · neutral, each 3:1 or more on both themes), its words and a `count` (part of its name). The active one joins the content under the list's line. Too many dividers scroll sideways with fading edges. `add` puts a « + » button after the list (outside the tablist). It works as routes too (`Tabs.Nav` / `Tabs.NavLink` take `variant`, `hue`, `count` and `add`). `Tabs.Trigger` and `Tabs.NavLink` gain `count` in every variant. React Native: `Tabs` `variant="binder"`, `hue` per item, `add`.
