/** @krizaka/ui/slot — `Slot` (what `asChild` renders) and `VisuallyHidden` (a name for assistive technology only), from Radix. */
import { Slot as SlotPrimitive, VisuallyHidden as VisuallyHiddenPrimitive } from "radix-ui";

/** Merges its props, `className` and `ref` into its only child: the engine of every `asChild`. */
export const Slot = SlotPrimitive.Root;
/** Hidden on screen, read by assistive technology. */
export const VisuallyHidden = VisuallyHiddenPrimitive.Root;
