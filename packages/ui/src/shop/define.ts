// `defineSection` (ADR-007 §1): one section type = its variants, the zod schema of its settings, the blocks it allows
// (each a zod schema) and the checks that need the whole section. It builds the zod schema of a section of this type, so
// the renderer, the validator and the composer's generated forms agree.
import * as z from "zod/mini";

import { SHOP_LIMITS } from "./limits";
import { localizedText } from "./text";

type Shape = z.ZodMiniObject;
type BlockShapes = Record<string, Shape>;

/** What a section of a type is, once parsed. */
export type ParsedSection<T extends string, V extends string, S extends Shape, B extends BlockShapes> = {
  key: string;
  type: T;
  variant: V;
  disabled?: boolean | undefined;
  settings: z.output<S>;
  text?: { title?: z.output<typeof localizedText> | undefined; lead?: z.output<typeof localizedText> | undefined } | undefined;
  blocks?: { [K in keyof B & string]: { key: string; type: K; settings: z.output<B[K]>; text?: Record<string, z.output<typeof localizedText>> | undefined } }[keyof B & string][] | undefined;
};

export type SectionSpec<T extends string, V extends readonly [string, ...string[]], S extends Shape, B extends BlockShapes> = {
  /** The type's name: the `type` of a section. */
  type: T;
  /** Its variants; the first is the default one. */
  variants: V;
  /** The zod schema of its settings. */
  settings: S;
  /** The settings a new section starts with. */
  settingsDefault: z.input<S>;
  /** The block types it allows, each with the zod schema of its settings. None: the section has no blocks. */
  blocks?: B;
  /** The checks that read the whole section (a count, a combination); `issue(path, message)` refuses it. */
  refine?: (section: ParsedSection<T, V[number], S, B>, issue: (path: (string | number)[], message: string) => void) => void;
};

export type SectionDefinitionOf<T extends string, V extends readonly [string, ...string[]], S extends Shape, B extends BlockShapes> = SectionSpec<T, V, S, B> & {
  readonly defaultVariant: V[number];
  readonly blockTypes: readonly (keyof B & string)[];
  /** The zod schema of a section of this type. */
  readonly schema: z.ZodMiniType<ParsedSection<T, V[number], S, B>>;
};

const key = z.string().check(z.minLength(1), z.maxLength(40), z.regex(/^[A-Za-z0-9_-]+$/, "a key (letters, digits, - and _)"));

/** Defines a section type. */
export function defineSection<const T extends string, const V extends readonly [string, ...string[]], S extends Shape, B extends BlockShapes = Record<never, never>>(
  spec: SectionSpec<T, V, S, B>,
): SectionDefinitionOf<T, V, S, B> {
  const blockUnion = spec.blocks && Object.keys(spec.blocks).length > 0
    ? z.discriminatedUnion(
        "type",
        Object.entries(spec.blocks).map(([type, settings]) =>
          z.object({ key, type: z.literal(type), settings, text: z.optional(z.record(z.string(), localizedText)) }),
        ) as unknown as [z.ZodMiniObject, ...z.ZodMiniObject[]],
      )
    : undefined;
  const blocks = blockUnion
    ? z.optional(z.array(blockUnion).check(z.maxLength(SHOP_LIMITS.blocks)))
    : z.optional(z.array(z.never()).check(z.maxLength(0)));
  const base = z.object({
    key,
    type: z.literal(spec.type),
    variant: z.enum(spec.variants),
    disabled: z.optional(z.boolean()),
    settings: spec.settings,
    text: z.optional(z.object({ title: z.optional(localizedText), lead: z.optional(localizedText) })),
    blocks,
  });
  const schema = base.check(
    z.superRefine((value, ctx) => {
      spec.refine?.(value as never, (path, message) => ctx.issues.push({ code: "custom", message, path, input: value }));
    }),
  );
  return Object.freeze({
    ...spec,
    defaultVariant: spec.variants[0],
    blockTypes: Object.keys(spec.blocks ?? {}) as (keyof B & string)[],
    schema: schema as unknown as z.ZodMiniType<ParsedSection<T, V[number], S, B>>,
  });
}
