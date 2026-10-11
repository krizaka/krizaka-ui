import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Filter bar",
  summary: "The bar above a list: the controls that narrow it, the filters in force as removable chips, “Clear filters”, and the count of results — the state kept by the app, in the address.",
  status: "beta",
  category: "forms",
  platforms: "web",
  whenToUse: [
    "Above a table or a grid people narrow with several criteria at once: status, type, owner, period, a query.",
    "When the filters must be visible and undoable one by one, and shared in a link.",
  ],
  whenNotToUse: [
    { when: "For one choice among a few views of a list: chips in a single group.", use: "chip" },
    { when: "For a search alone: a search field.", use: "search-field" },
  ],
  bestPractices: [
    "Keep the filters in the address: `readFilterParams` on load, `writeFilterParams` (which resets the page) on change.",
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
      "`FilterMenu` is a Radix menu of checkbox (or radio) items: their state is announced as they toggle.",
    ],
  },
  related: ["search-field", "chip", "dropdown-menu", "date-picker", "data-table"],
  web: {
    imports: ["FilterBar", "FilterMenu", "readFilterParams", "writeFilterParams"],
    examples: [
      { name: "jobs", title: "Jobs", description: "A search, a status menu (several values), a model menu (one value), the chips and the count." },
      { name: "menu", title: "A filter's menu", description: "`FilterMenu` open: checkboxes with the count each value would give." },
      { name: "address", title: "In the address", description: "The filters read from and written to `URLSearchParams`, the page reset on change." },
    ],
  },
} satisfies ComponentMeta;
