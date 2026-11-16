// @krizaka/ui/button/text-link — the discreet link, SERVER-SAFE, no React. A string, in its own entry so the button's does not grow.
/**
 * The look of a link in a sentence or an end line (“Read more”, “Back to the blog”), not of a button: the accent colour,
 * underlined on hover and focus, no box. Put it in the `className` of an `<a>` or a router link; use `buttonVariants`
 * when the action must read as a button.
 * @example
 * import { textLinkClass } from "@krizaka/ui/button/text-link";
 *
 * <a href="/blog" className={textLinkClass}>Back to the blog</a>
 */
export const textLinkClass = "text-fg-accent underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-ring";
