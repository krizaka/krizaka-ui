import { Button } from "@krizaka/ui/button";

// Disabled, `aria-busy` and `data-loading`: add your own spinner if you want one.
export default function ButtonLoading() {
  return (
    <Button variant="primary" loading>
      Saving…
    </Button>
  );
}
