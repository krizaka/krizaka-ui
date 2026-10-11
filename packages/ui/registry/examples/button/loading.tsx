import { Button } from "@krizaka/ui/button";

// `loading`: disabled (never pressed twice), `aria-busy`, the loader glyph before the label — and its colour kept.
export default function ButtonLoading() {
  return (
    <Button variant="primary" loading>
      Saving…
    </Button>
  );
}
