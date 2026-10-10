import { Button } from "@krizaka/ui/button";

// `asChild`: the `<a>` is rendered, with the button's classes and props merged into it.
export default function ButtonAsChildLink() {
  return (
    <Button variant="outline" asChild>
      <a href="#docs">Read the docs</a>
    </Button>
  );
}
