import { defineRecipe, nativeRecipe } from "@krizaka/ui/recipes";

// A recipe is data: the classes of the tokens, written once. `tv(recipe)` makes the web's classes from it; the phone
// reads the same classes into styles on the roles of its theme.
const recipe = defineRecipe({
  base: "inline-flex items-center rounded-full font-semibold",
  variants: {
    tone: { calm: "bg-surface-3 text-fg-secondary", loud: "bg-accent text-on-accent hover:bg-accent-hover" },
    size: { sm: "h-7 px-3 text-xs", md: "h-9 px-4 text-sm" },
  },
  defaultVariants: { tone: "calm", size: "md" },
});
const phone = nativeRecipe(recipe);
const theme = { accent: "accent-colour", onAccent: "on-accent-colour", surface3: "surface-colour", textSecondary: "text-colour" };

export default function RecipeToneChip() {
  return (
    <ul className="grid gap-2 text-sm text-fg">
      {(["calm", "loud"] as const).flatMap((tone) =>
        (["sm", "md"] as const).map((size) => {
          const { frame, text, ignored } = phone.resolve({ tone, size }, theme).base!;
          return (
            <li key={`${tone}-${size}`}>
              <b>{tone} · {size}</b>: {frame.height} pt high, {frame.paddingHorizontal} pt sides, {text.fontSize} pt type, {frame.backgroundColor} behind {text.color}
              <span className="text-fg-secondary"> — web only: {ignored.join(" ")}</span>
            </li>
          );
        }),
      )}
    </ul>
  );
}
