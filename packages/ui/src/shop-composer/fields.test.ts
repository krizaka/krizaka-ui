import { describe, expect, it } from "vitest";

import { SECTION_DEFINITIONS, sectionDefinition } from "../shop/catalogue";
import { describeSettings } from "./fields";

describe("the settings form is read from the schema", () => {
  it("draws services' settings: two choices and a number choice", () => {
    expect(describeSettings(sectionDefinition("services").settings)).toEqual([
      { name: "source", kind: "choice", options: ["all", "pick"], optional: false },
      { name: "groupBy", kind: "choice", options: ["category", "none"], optional: false },
      { name: "columns", kind: "choice", options: [1, 2], optional: false },
      { name: "aside", kind: "choice", options: ["hours", "none"], optional: false },
    ]);
  });

  it("reads a switch, an optional id, the owner's words in each language and a set of options", () => {
    expect(describeSettings(sectionDefinition("visit").settings)).toEqual([{ name: "showPhone", kind: "toggle", optional: false }]);
    expect(describeSettings(sectionDefinition("hero").settings)[0]).toEqual({ name: "media", kind: "text", optional: true });
    expect(describeSettings(sectionDefinition("story").settings)).toEqual([{ name: "body", kind: "localized", optional: false }]);
    expect(describeSettings(sectionDefinition("policies").settings)).toEqual([{ name: "show", kind: "multi", options: ["cancellation", "prices", "booking-window"], optional: false }]);
  });

  it("draws every setting of every type: none is left out", () => {
    for (const d of SECTION_DEFINITIONS) {
      const shape = (d.settings as unknown as { _zod: { def: { shape: object } } })._zod.def.shape;
      expect(describeSettings(d.settings).map((f) => f.name), d.type).toEqual(Object.keys(shape));
    }
  });
});
