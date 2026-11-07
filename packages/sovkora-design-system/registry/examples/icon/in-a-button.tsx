import { Icon } from "@krizaka/sovkora-design-system";
import { Button } from "@krizaka/ui/button";

// An icon beside a label: it takes the button's text role.
export default function InAButton() {
  return (
    <Button variant="secondary">
      <Icon name="upload" size={16} />
      Add documents
    </Button>
  );
}
