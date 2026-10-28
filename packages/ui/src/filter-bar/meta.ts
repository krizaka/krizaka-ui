import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Filter bar",
  summary: "The bar above a list: its saved views, the controls that narrow it, the filters in force as removable chips, “Clear filters”, and the count of results — the state kept by the app, in the address.",
  status: "beta",
  category: "forms",
  domain: "forms",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#277", reason: "No phone list screen filters yet; when one does, chips and a sheet." }, desktop: "web" },
  whenToUse: [
    "Above a table or a grid people narrow with several criteria at once: status, type, owner, period, a query.",
    "When a list has views to come back to (`system` the admin's, `workspace` shared, `mine`): `views` shows them with their counts, and one menu on a phone.",
    "When the filters must be visible and undoable one by one, and shared in a link.",
  ],
  whenNotToUse: [
    { when: "For one choice among a few views of a list: chips in a single group.", use: "chip" },
    { when: "For a search alone: a search field.", use: "search-field" },
  ],
  bestPractices: [
    "Keep the filters in the address: `readFilterParams` on load, `writeFilterParams` (which resets the page) on change. For views, `parseView` / `viewSearch` / `sameFilters` of `@krizaka/organize/contract` move the filters and tell when a view is « modified »; give each view an `href` and it is a link.",
    "Give each active chip the filter's name and value (“Status: Failed”), not the value alone.",
    "Count the results in `results` (“42 jobs”): it is announced when it changes.",
    "Use `FilterMenu` for a list of values (checkboxes, or radios with `multiple={false}`), a `DateRangePicker` for a period.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter / Space / Arrow Down", action: "Opens a filter's menu." },
      { keys: "Arrow keys", action: "Move between the options of an open menu; Space checks one, the menu stays open." },
      { keys: "Esc", action: "Closes the menu and returns to its button." },
    ],
    notes: [
      "The bar is a `group` named by `label`; each chip's remove button is named by `removeLabel` (“Remove Status: Failed”).",
      "The count of results is a polite live region: a change of filter is heard without moving the focus.",
      "Saved views: each group (standard, shared, mine) is a named group of chips with one selected (a radio group, arrows); with `href` they are links, the current one `aria-current`. On a phone the same views are one menu (« View: To decide »). Naming a view opens a field that takes the focus; Enter keeps it, Esc leaves.",
      "`FilterMenu` is a Radix menu of checkbox (or radio) items: their state is announced as they toggle.",
    ],
  },
  related: ["search-field", "chip", "dropdown-menu", "date-picker", "data-table"],
  web: {
    imports: ["FilterBar", "FilterMenu", "SavedViews", "readFilterParams", "writeFilterParams"],
    examples: [
      { name: "jobs", title: "Jobs", description: "A search, a status menu (several values), a model menu (one value), the chips and the count." },
      { name: "menu", title: "A filter's menu", description: "`FilterMenu` open: checkboxes with the count each value would give." },
      { name: "views", title: "Saved views", description: "`views`: the standard, shared and own views as chips with counts (one menu on a phone), a « modified » mark, « Save view », rename and delete." },
      { name: "address", title: "In the address", description: "The filters read from and written to `URLSearchParams`, the page reset on change." },
    ],
  },
} satisfies ComponentMeta;
