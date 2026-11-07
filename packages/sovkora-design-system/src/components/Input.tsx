import type * as React from "react";

/**
 * @file Input.tsx
 * @description The text field is the @krizaka/ui primitive (`@krizaka/ui/field`), re-exported with its siblings.
 * `invalid` sets aria-invalid; pair it with a `Field.Error`. React 19: `ref` is a prop.
 */
export { Field, Input, Select, Textarea } from "@krizaka/ui/field";

/** Props of `Input`: the native input attributes, plus `invalid`. */
export type InputProps = React.ComponentProps<"input"> & {
  /** Marks the control invalid (aria-invalid, data-invalid). */
  invalid?: boolean;
};
