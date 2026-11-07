import { Button as KzButton, type ButtonProps } from "@krizaka/ui/button";

/*
 * The button is the @krizaka/ui primitive. Same props as 1.x (`variant` primary · secondary · outline · ghost, `size`
 * sm · md · lg · icon), plus `danger`, `shape`, `loading` and `asChild`; `className` is merged last, so an override
 * always wins. React 19: `ref` is a prop. A product variant extends `buttonVariants` (`tv({ extend: buttonVariants })`),
 * it never copies it.
 */
export {
  type ButtonProps,
  type ButtonVariants,
  buttonVariants,
  IconButton,
  type IconButtonProps,
} from "@krizaka/ui/button";

/**
 * The @krizaka/ui `Button`, with the Orazaka 1.x default kept: without a `variant`, it is the primary (accent) button
 * — the primitive's own default is `secondary`. Everything else is the primitive's.
 *
 * @param props - {@link ButtonProps}
 * @returns A button (or its child, with `asChild`).
 */
export function Button({ variant = "primary", ...props }: ButtonProps) {
  return <KzButton variant={variant} {...props} />;
}
