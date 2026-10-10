import { Button } from "@krizaka/ui/button";

export default function ButtonSizes() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="primary" size="sm">
        Continue
      </Button>
      <Button variant="primary" size="md">
        Continue
      </Button>
      <Button variant="primary" size="lg">
        Continue
      </Button>
    </div>
  );
}
