// The settings form of a section is generated from the zod schema of its type (ADR-007 §5): one field per setting, of the kind
// the schema says — a choice (an enum, or a few numbers), a switch (a boolean), a text (an id or a line), the owner's words in each
// language, a set of options. The form is the one of `@krizaka/ui/form`; this reads the schema, never a copy of it.
import type * as z from "zod/mini";

export type FieldSpec =
  | { name: string; kind: "choice"; options: readonly (string | number)[]; optional: boolean }
  | { name: string; kind: "toggle"; optional: boolean }
  | { name: string; kind: "text"; optional: boolean }
  | { name: string; kind: "localized"; optional: boolean }
  | { name: string; kind: "multi"; options: readonly string[]; optional: boolean };

// The zod 4 definition shape, read structurally: `_zod.def` is what the schema is made of.
type Def = { type: string; shape?: Record<string, z.ZodMiniType>; entries?: Record<string, string>; options?: z.ZodMiniType[]; values?: unknown[]; innerType?: z.ZodMiniType; element?: z.ZodMiniType };
const defOf = (s: z.ZodMiniType) => (s as unknown as { _zod: { def: Def } })._zod.def;

function specOf(name: string, schema: z.ZodMiniType, optional = false): FieldSpec | undefined {
  const def = defOf(schema);
  switch (def.type) {
    case "optional":
      return specOf(name, def.innerType!, true);
    case "enum":
      return { name, kind: "choice", options: Object.values(def.entries!), optional };
    case "boolean":
      return { name, kind: "toggle", optional };
    case "string":
      return { name, kind: "text", optional };
    case "union": {
      const options = def.options!.flatMap((o) => (defOf(o).type === "literal" ? (defOf(o).values as (string | number)[]) : []));
      return options.length === def.options!.length ? { name, kind: "choice", options, optional } : undefined;
    }
    case "object": {
      const keys = Object.keys(def.shape!);
      return keys.every((k) => k === "fr" || k === "en") ? { name, kind: "localized", optional } : undefined;
    }
    case "array": {
      const inner = specOf(name, def.element!);
      return inner && "options" in inner ? { name, kind: "multi", options: inner.options.map(String), optional } : undefined;
    }
    default:
      return undefined;
  }
}

/** The fields of a settings schema, in the schema's order. A setting of a kind the form does not draw is left out. */
export function describeSettings(schema: z.ZodMiniObject): FieldSpec[] {
  const shape = defOf(schema).shape ?? {};
  return Object.entries(shape).flatMap(([name, s]) => {
    const spec = specOf(name, s);
    return spec ? [spec] : [];
  });
}
