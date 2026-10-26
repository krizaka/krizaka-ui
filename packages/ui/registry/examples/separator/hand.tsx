import { Separator } from "@krizaka/ui/separator";

// `variant="hand"`: drawn by hand, three shapes, 6 px tall, the page's hue at 60 % (or the ink). Decorative.
export default function SeparatorHand() {
  return (
    <div className="flex w-80 flex-col gap-5 text-sm text-fg">
      <p>Services</p>
      <Separator variant="hand" shape="stroke" />
      <p>The wall</p>
      <Separator variant="hand" shape="wave" />
      <p>Hours</p>
      <Separator variant="hand" shape="dash" tone="ink" />
      <p>Reviews</p>
    </div>
  );
}
